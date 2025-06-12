import React, { useState, useEffect } from "react";
import { Container, Card, Form, Row, Col, Button, Table, Spinner, Modal } from "react-bootstrap";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getContract } from "../../utils/doctorContract";
import Swal from "sweetalert2";

// Day mappings
const dayMapping = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
  7: "Minggu"
};

const reverseDayMapping = {
  "Senin": 1,
  "Selasa": 2,
  "Rabu": 3,
  "Kamis": 4,
  "Jumat": 5,
  "Sabtu": 6,
  "Minggu": 7
};

const DetailDokter = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management
  const [dokter, setDokter] = useState(null);
  const [jadwalPraktek, setJadwalPraktek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  
  // Form state
  const [newSchedule, setNewSchedule] = useState({
    hari: "",
    waktuMulai: "",
    waktuSelesai: "",
    ruangan: ""
  });

  const loadSchedules = async (doctorId) => {
    try {
      const contract = await getContract();
      const schedules = await contract.getDoctorSchedules(doctorId);
      
      setJadwalPraktek(schedules.map(schedule => ({
        id: schedule[0]?.toString() || '',
        hari: dayMapping[schedule[2]] || `Hari ${schedule[2]}`,
        dayNumber: schedule[2],
        waktuMulai: schedule[3] || '',
        waktuSelesai: schedule[4] || '',
        ruangan: schedule[5] || ''
      })));
    } catch (error) {
      console.error("Error loading schedules:", error);
      setJadwalPraktek([]);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const contract = await getContract();
        const doctorData = await contract.doctors(id);
        
        if (doctorData && doctorData[0] !== undefined) {
          setDokter({
            id: doctorData[0]?.toString() || id,
            namaDokter: doctorData[1] || '',
            nik: doctorData[2] || '',
            strNumber: doctorData[3] || '',
            spesialisasi: "-"
          });
          await loadSchedules(id);
        } else {
          setError("Data dokter tidak ditemukan atau tidak lengkap.");
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError(`Gagal memuat data: ${err.message || "Terjadi kesalahan."}`);
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.dokter) {
      setDokter(location.state.dokter);
      loadSchedules(location.state.dokter.id);
      setLoading(false);
    } else {
      loadInitialData();
    }
  }, [id, location]);

  const handleKembali = () => navigate("/DataDokter");

  const handleAddSchedule = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewSchedule({
      hari: "",
      waktuMulai: "",
      waktuSelesai: "",
      ruangan: ""
    });
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitSchedule = async () => {
    if (!newSchedule.hari || !newSchedule.waktuMulai || !newSchedule.waktuSelesai || !newSchedule.ruangan) {
      Swal.fire("Error", "Harap lengkapi semua field jadwal praktek", "error");
      return;
    }

    setProcessing(true);
    try {
      const contract = await getContract();
      const dayNumber = reverseDayMapping[newSchedule.hari];
      
      const tx = await contract.registerSchedule(
        id,
        dayNumber,
        newSchedule.waktuMulai,
        newSchedule.waktuSelesai,
        newSchedule.ruangan
      );
      
      // Show loading state without blocking
      const swalInstance = Swal.fire({
        title: "Transaksi Dikirim",
        html: `Menunggu konfirmasi...<br>TX Hash: ${tx.hash.slice(0, 10)}...`,
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      await tx.wait();
      await loadSchedules(id);
      
      // Close the loading alert first
      await swalInstance.close();
      
      // Then show success alert
      await Swal.fire({
        title: "Sukses",
        text: "Jadwal praktek berhasil ditambahkan",
        icon: "success",
        confirmButtonText: "OK"
      });
      
      handleCloseAddModal();
    } catch (error) {
      console.error("Error adding schedule:", error);
      
      let errorMsg = error.message;
      if (error.code === 'ACTION_REJECTED') {
        errorMsg = "Transaksi dibatalkan oleh pengguna";
      } else if (error.code === 'CALL_EXCEPTION') {
        errorMsg = "Anda tidak memiliki izin untuk menambahkan jadwal";
      } else if (error.reason) {
        errorMsg = error.reason;
      }
      
      Swal.fire("Error", `Gagal menambahkan jadwal: ${errorMsg}`, "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setProcessing(true);
    try {
      const contract = await getContract();
      const tx = await contract.deleteSchedule(selectedSchedule.id);
      
      const swalInstance = Swal.fire({
        title: "Transaksi Dikirim",
        html: `Menghapus jadwal...<br>TX Hash: ${tx.hash.slice(0, 10)}...`,
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      await tx.wait();
      await loadSchedules(id);
      
      // Close loading first
      await swalInstance.close();
      
      // Then show success
      await Swal.fire({
        title: "Sukses",
        text: "Jadwal praktek berhasil dihapus",
        icon: "success",
        confirmButtonText: "OK"
      });
    } catch (error) {
      console.error("Error deleting schedule:", error);
      
      let errorMsg = error.message;
      if (error.code === 'ACTION_REJECTED') {
        errorMsg = "Transaksi dibatalkan oleh pengguna";
      } else if (error.code === 'CALL_EXCEPTION') {
        errorMsg = "Anda tidak memiliki izin untuk menghapus jadwal";
      } else if (error.reason) {
        errorMsg = error.reason;
      }
      
      Swal.fire("Error", `Gagal menghapus jadwal: ${errorMsg}`, "error");
    } finally {
      setProcessing(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Memuat data dokter...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Card className="shadow">
          <Card.Body className="text-center">
            <p className="text-danger">{error}</p>
            <Button variant="primary" onClick={handleKembali}>
              Kembali ke Daftar Dokter
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!dokter) {
    return (
      <Container className="my-4">
        <Card className="shadow">
          <Card.Body className="text-center">
            <p>Data dokter tidak ditemukan</p>
            <Button variant="primary" onClick={handleKembali}>
              Kembali ke Daftar Dokter
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Button variant="outline-primary" onClick={handleKembali} className="mb-3">
        <FaArrowLeft className="me-2" /> Kembali
      </Button>

      <Card className="shadow mb-4">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Detail Dokter</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nama Dokter</Form.Label>
                <Form.Control type="text" value={dokter.namaDokter} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>NIK</Form.Label>
                <Form.Control type="text" value={dokter.nik} readOnly />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nomor STR</Form.Label>
                <Form.Control type="text" value={dokter.strNumber} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Spesialisasi</Form.Label>
                <Form.Control 
                  type="text" 
                  value={dokter.spesialisasi || '-'} 
                  readOnly 
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Jadwal Praktek</h5>
            <Button variant="success" size="sm" onClick={handleAddSchedule}>
              <FaPlus className="me-1" /> Tambah Jadwal
            </Button>
          </div>
          
          {jadwalPraktek.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Waktu Mulai</th>
                  <th>Waktu Selesai</th>
                  <th>Ruangan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jadwalPraktek.map((jadwal, index) => (
                  <tr key={index}>
                    <td>{jadwal.hari}</td>
                    <td>{jadwal.waktuMulai}</td>
                    <td>{jadwal.waktuSelesai}</td>
                    <td>{jadwal.ruangan}</td>
                    <td>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteSchedule(jadwal)}
                        disabled={processing}
                        aria-label={`Hapus jadwal ${jadwal.hari}`}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p>Belum ada jadwal praktek yang terdaftar</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add Schedule Modal */}
      <Modal 
        show={showAddModal} 
        onHide={handleCloseAddModal}
        aria-labelledby="add-schedule-modal"
        aria-modal="true"
      >
        <Modal.Header closeButton>
          <Modal.Title id="add-schedule-modal">Tambah Jadwal Praktek</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Hari</Form.Label>
              <Form.Select
                name="hari"
                value={newSchedule.hari}
                onChange={handleScheduleChange}
                required
                aria-label="Pilih hari"
              >
                <option value="">Pilih Hari</option>
                {Object.keys(reverseDayMapping).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Waktu Mulai</Form.Label>
              <Form.Control
                type="time"
                name="waktuMulai"
                value={newSchedule.waktuMulai}
                onChange={handleScheduleChange}
                required
                aria-label="Waktu mulai praktek"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Waktu Selesai</Form.Label>
              <Form.Control
                type="time"
                name="waktuSelesai"
                value={newSchedule.waktuSelesai}
                onChange={handleScheduleChange}
                required
                aria-label="Waktu selesai praktek"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Ruangan</Form.Label>
              <Form.Control
                type="text"
                name="ruangan"
                value={newSchedule.ruangan}
                onChange={handleScheduleChange}
                placeholder="Masukkan ruangan praktek"
                required
                aria-label="Ruangan praktek"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Batal
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmitSchedule}
            disabled={processing}
          >
            {processing ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" />
                <span className="ms-2">Menyimpan...</span>
              </>
            ) : 'Simpan'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        aria-labelledby="delete-schedule-modal"
        aria-modal="true"
      >
        <Modal.Header closeButton>
          <Modal.Title id="delete-schedule-modal">Konfirmasi Hapus Jadwal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus jadwal praktek ini?
          <ul className="mt-2">
            <li>Hari: {selectedSchedule?.hari}</li>
            <li>Waktu: {selectedSchedule?.waktuMulai} - {selectedSchedule?.waktuSelesai}</li>
            <li>Ruangan: {selectedSchedule?.ruangan}</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={processing}
          >
            Batal
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete}
            disabled={processing}
          >
            {processing ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" />
                <span className="ms-2">Menghapus...</span>
              </>
            ) : 'Ya, Hapus'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DetailDokter;
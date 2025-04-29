import React, { useState, useEffect } from "react";
import { Container, Card, Form, Row, Col, Button, Table, Spinner, Modal } from "react-bootstrap";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getContract} from "../../utils/doctorContract";

import Swal from "sweetalert2";

// Mapping hari ke angka dan sebaliknya
const dayMapping = {
  0: "Senin",
  1: "Selasa",
  2: "Rabu",
  3: "Kamis",
  4: "Jumat",
  5: "Sabtu",
  6: "Minggu"
};

const reverseDayMapping = {
  "Senin": 0,
  "Selasa": 1,
  "Rabu": 2,
  "Kamis": 3,
  "Jumat": 4,
  "Sabtu": 5,
  "Minggu": 6
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

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load doctor data
        const contract = await getContract();
        const doctorData = await contract.doctors(id);
        
        setDokter({
          id,
          namaDokter: doctorData.name,
          nik: doctorData.nik,
          strNumber: doctorData.strNumber,
          spesialisasi: doctorData.specialization
        });

        // Load schedules
        await loadSchedules(id);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.dokter) {
      setDokter(location.state.dokter);
      loadSchedules(location.state.dokter.id);
      setLoading(false);
    } else {
      loadData();
    }
  }, [id, location]);

  // Load schedules function
  const loadSchedules = async (doctorId) => {
    try {
      const contract = await getContract();
      const schedules = await contract.getDoctorSchedules(doctorId);
      
      setJadwalPraktek(schedules.map(schedule => ({
        id: schedule.id.toString(),
        hari: dayMapping[schedule.day] || `Hari ${schedule.day}`,
        dayNumber: schedule.day,
        waktuMulai: schedule.start,
        waktuSelesai: schedule.end,
        ruangan: schedule.room
      })));
    } catch (error) {
      console.error("Error loading schedules:", error);
      setJadwalPraktek([]);
    }
  };

  // Navigation handlers
  const handleKembali = () => navigate("/DataDokter");

  // Schedule form handlers
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

  // Add new schedule
  const handleSubmitSchedule = async () => {
    // Validation
    if (!newSchedule.hari || !newSchedule.waktuMulai || !newSchedule.waktuSelesai || !newSchedule.ruangan) {
      Swal.fire("Error", "Harap lengkapi semua field jadwal praktek", "error");
      return;
    }

    setProcessing(true);
    try {
      // Get contract with signer
      const contract = await getContract();
      const dayNumber = reverseDayMapping[newSchedule.hari];
      
      // Send transaction
      const tx = await contract.registerSchedule(
        id,
        dayNumber,
        newSchedule.waktuMulai,
        newSchedule.waktuSelesai,
        newSchedule.ruangan
      );
      
      // Show transaction hash
      await Swal.fire({
        title: "Transaksi Dikirim",
        html: `Menunggu konfirmasi...<br>TX Hash: ${tx.hash.slice(0, 10)}...`,
        icon: "info"
      });
      
      // Wait for confirmation
      await tx.wait();
      
      // Refresh data
      await loadSchedules(id);
      
      // Success notification
      Swal.fire("Sukses", "Jadwal praktek berhasil ditambahkan", "success");
      handleCloseAddModal();
    } catch (error) {
      console.error("Error adding schedule:", error);
      
      let errorMsg = error.message;
      if (error.code === 'ACTION_REJECTED') {
        errorMsg = "Transaksi dibatalkan oleh pengguna";
      } else if (error.code === 'CALL_EXCEPTION') {
        errorMsg = "Anda tidak memiliki izin untuk menambahkan jadwal";
      }
      
      Swal.fire("Error", `Gagal menambahkan jadwal: ${errorMsg}`, "error");
    } finally {
      setProcessing(false);
    }
  };

  // Delete schedule handlers
  const handleDeleteSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setProcessing(true);
    try {
      // Get contract with signer
      const contract = await getContract();
      
      // Send transaction
      const tx = await contract.deleteSchedule(selectedSchedule.id);
      
      // Show transaction hash
      await Swal.fire({
        title: "Transaksi Dikirim",
        html: `Menghapus jadwal...<br>TX Hash: ${tx.hash.slice(0, 10)}...`,
        icon: "info"
      });
      
      // Wait for confirmation
      await tx.wait();
      
      // Refresh data
      await loadSchedules(id);
      
      // Success notification
      Swal.fire("Sukses", "Jadwal praktek berhasil dihapus", "success");
    } catch (error) {
      console.error("Error deleting schedule:", error);
      
      let errorMsg = error.message;
      if (error.code === 'ACTION_REJECTED') {
        errorMsg = "Transaksi dibatalkan oleh pengguna";
      } else if (error.code === 'CALL_EXCEPTION') {
        errorMsg = "Anda tidak memiliki izin untuk menghapus jadwal";
      }
      
      Swal.fire("Error", `Gagal menghapus jadwal: ${errorMsg}`, "error");
    } finally {
      setProcessing(false);
      setShowDeleteModal(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Memuat data dokter...</p>
      </Container>
    );
  }

  // Error state
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

  // No doctor found
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

  // Main render
  return (
    <Container className="my-4">
      {/* Back button */}
      <Button variant="outline-primary" onClick={handleKembali} className="mb-3">
        <FaArrowLeft className="me-2" /> Kembali
      </Button>

      {/* Doctor info card */}
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

          {/* Schedule section */}
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
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Jadwal Praktek</Modal.Title>
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
            {processing ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus Jadwal</Modal.Title>
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
            {processing ? 'Menghapus...' : 'Ya, Hapus'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DetailDokter;
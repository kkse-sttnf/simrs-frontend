import React, { useState, useEffect } from "react";
import { Container, Card, Form, Row, Col, Button, Table, Spinner, Modal } from "react-bootstrap";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getContract} from "../../utils/doctorContract"; // Pastikan path ini benar

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
  const { id } = useParams(); // id dari URL, biasanya string
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management
  const [dokter, setDokter] = useState(null);
  const [jadwalPraktek, setJadwalPraktek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false); // Untuk indikator loading saat transaksi
  
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

  // Fungsi untuk memuat jadwal praktek
  const loadSchedules = async (doctorId) => {
    try {
      const contract = await getContract();
      // getDoctorSchedules mengembalikan array dari tuple: (uint256,uint256,uint8,string,string,string)
      // schedule[0] = scheduleId, schedule[1] = doctorId, schedule[2] = day, schedule[3] = start, schedule[4] = end, schedule[5] = room
      const schedules = await contract.getDoctorSchedules(doctorId);
      console.log("Data jadwal mentah dari getDoctorSchedules:", schedules); // Debugging

      setJadwalPraktek(schedules.map(schedule => ({
        id: schedule[0]?.toString() || '',   // schedule[0] adalah id jadwal
        hari: dayMapping[schedule[2]] || `Hari ${schedule[2]}`, // schedule[2] adalah day number
        dayNumber: schedule[2], // Simpan dayNumber jika diperlukan
        waktuMulai: schedule[3] || '',      // schedule[3] adalah waktu mulai
        waktuSelesai: schedule[4] || '',    // schedule[4] adalah waktu selesai
        ruangan: schedule[5] || ''          // schedule[5] adalah ruangan
      })));
    } catch (error) {
      console.error("Error loading schedules:", error);
      setJadwalPraktek([]); // Set ke array kosong jika ada error
      // Anda bisa menambahkan setError di sini jika ingin menampilkan pesan error jadwal
    }
  };

  // Load initial data (dokter dan jadwal)
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const contract = await getContract();
        // doctors(uint256) mengembalikan tuple: (uint256,string,string,string)
        // doctorData[0] = id, doctorData[1] = name, doctorData[2] = nik, doctorData[3] = strNumber
        const doctorData = await contract.doctors(id);
        console.log("Data dokter mentah dari contract.doctors(id):", doctorData); // Debugging
        
        // Pastikan doctorData valid sebelum mengakses properti
        if (doctorData && doctorData[0] !== undefined) {
          setDokter({
            id: doctorData[0]?.toString() || id, // Gunakan id dari URL jika doctorData[0] undefined
            namaDokter: doctorData[1] || '',
            nik: doctorData[2] || '',
            strNumber: doctorData[3] || '',
            spesialisasi: "-" // Properti ini tidak ada di ABI kontrak, jadi gunakan nilai default
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

    // Prioritaskan data dari location.state jika ada (dari navigasi sebelumnya)
    if (location.state?.dokter) {
      setDokter(location.state.dokter);
      loadSchedules(location.state.dokter.id);
      setLoading(false);
    } else {
      // Jika tidak ada data di location.state, ambil dari blockchain
      loadInitialData();
    }
  }, [id, location]); // Dependensi: id dari URL dan location (untuk location.state)

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
        id, // doctorId (dari useParams)
        dayNumber,
        newSchedule.waktuMulai,
        newSchedule.waktuSelesai,
        newSchedule.ruangan
      );
      
      // Show transaction hash
      await Swal.fire({
        title: "Transaksi Dikirim",
        html: `Menunggu konfirmasi...<br>TX Hash: ${tx.hash.slice(0, 10)}...`,
        icon: "info",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
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
      } else if (error.reason) { // Ethers.js specific error reason
        errorMsg = error.reason;
      }
      
      Swal.fire("Error", `Gagal menambahkan jadwal: ${errorMsg}`, "error");
    } finally {
      setProcessing(false);
      Swal.close(); // Tutup loading SweetAlert
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
        icon: "info",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
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
      } else if (error.reason) { // Ethers.js specific error reason
        errorMsg = error.reason;
      }
      
      Swal.fire("Error", `Gagal menghapus jadwal: ${errorMsg}`, "error");
    } finally {
      setProcessing(false);
      setShowDeleteModal(false);
      Swal.close(); // Tutup loading SweetAlert
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
            {processing ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Menyimpan...</span>
              </>
            ) : 'Simpan'}
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
            {processing ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
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

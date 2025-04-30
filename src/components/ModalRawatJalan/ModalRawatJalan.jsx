import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { getContract } from "../../utils/doctorContract";


const ModalRawatJalan = ({
  show,
  handleClose,
  selectedPatient,
  dokter = [],
  onSave,
  loadingDokter,
  errorDokter
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

   // Fungsi untuk mengambil jadwal dokter dari blockchain
   const fetchDoctorSchedules = async (doctorId) => {
    if (!doctorId) return;
    
    setLoadingSchedules(true);
    setScheduleError(null);
    setSelectedSchedule("");

    try {
      const contract = await getContract();
      const schedules = await contract.getDoctorSchedules(doctorId);
      
      // Konversi data jadwal dari blockchain ke format yang diharapkan
      const formattedSchedules = schedules.map(schedule => ({
        id: schedule.id.toString(),
        hariPraktek: convertDayNumber(schedule.day),
        waktuMulai: schedule.start,
        waktuSelesai: schedule.end,
        ruangPraktek: schedule.room
      }));

      setDoctorSchedules(formattedSchedules);
    } catch (error) {
      console.error("Gagal memuat jadwal:", error);
      setScheduleError("Gagal memuat jadwal dokter");
    } finally {
      setLoadingSchedules(false);
    }
  };

  // Konversi angka hari ke nama hari
  const convertDayNumber = (dayNum) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[dayNum] || `Hari-${dayNum}`;
  };

  // Load jadwal ketika dokter dipilih
  useEffect(() => {
    if (selectedDoctor?.id) {
      fetchDoctorSchedules(selectedDoctor.id);
    } else {
      setDoctorSchedules([]);
    }
  }, [selectedDoctor]);

  // Reset form saat modal ditutup
  useEffect(() => {
    if (!show) {
      setSelectedDoctor(null);
      setSelectedSchedule("");
      setDoctorSchedules([]);
    }
  }, [show]);

  const handleSave = async () => {
    if (!selectedDoctor || !selectedSchedule) {
      alert("Harap pilih dokter dan jadwal terlebih dahulu");
      return;
    }

    const selectedScheduleData = doctorSchedules.find(
      s => `${s.hariPraktek} ${s.waktuMulai} - ${s.waktuSelesai}` === selectedSchedule
    );

    const data = {
      namaPasien: selectedPatient.NamaLengkap,
      NIK: selectedPatient.NIK,
      namaDokter: selectedDoctor.namaDokter,
      spesialis: selectedDoctor.spesialis,
      nomorPraktek: selectedDoctor.nomorPraktek,
      jadwalDokter: selectedSchedule,
      ruangPraktek: selectedScheduleData?.ruangPraktek || selectedDoctor.ruangPraktek,
    };

    try {
      await onSave(data);
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    }
  };

  

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Pendaftaran Rawat Jalan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorDokter && <Alert variant="danger">{errorDokter}</Alert>}
        
        <Form>
          {/* Nama Pasien */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Nama Pasien</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedPatient?.NamaLengkap || "Pasien tidak ditemukan"}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          {/* NIK Pasien */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>NIK</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedPatient?.NIK || ""}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Pilih Dokter */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Pilih Dokter</Form.Label>
                {loadingDokter ? (
                  <div className="text-center">
                    <Spinner size="sm" animation="border" />
                    <span> Memuat data dokter...</span>
                  </div>
                ) : (
                  <Form.Select
                    value={selectedDoctor?.id || ""}
                    onChange={(e) => {
                      const doctorId = e.target.value;
                      const doctor = dokter.find((d) => d.id === doctorId);
                      setSelectedDoctor(doctor);
                      setSelectedSchedule("");
                    }}
                    disabled={loadingDokter || dokter.length === 0}
                  >
                    <option value="">Pilih Dokter</option>
                    {dokter.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.namaDokter}
                      </option>
                    ))}
                  </Form.Select>
                )}
                {dokter.length === 0 && !loadingDokter && (
                  <div className="text-danger mt-1">
                    Tidak ada data dokter tersedia
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Data Dokter (Autofill) */}
          {selectedDoctor && (
            <>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Spesialis</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedDoctor.spesialis}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
              </Row>
            </>
          )}

          {/* Pilih Jadwal Dokter */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Pilih Jadwal</Form.Label>
                <Form.Select
                  value={selectedSchedule}
                  onChange={(e) => setSelectedSchedule(e.target.value)}
                  disabled={!selectedDoctor}
                >
                  <option value="">Pilih Jadwal</option>
                  {selectedDoctor && doctorSchedules.length > 0 ? (
                    doctorSchedules.map((jadwal, index) => (
                      <option
                        key={index}
                        value={`${jadwal.hariPraktek} ${jadwal.waktuMulai} - ${jadwal.waktuSelesai}`}
                      >
                        {`${jadwal.hariPraktek} ${jadwal.waktuMulai} - ${jadwal.waktuSelesai}`}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {selectedDoctor ? "Tidak ada jadwal tersedia" : "Pilih dokter terlebih dahulu"}
                    </option>
                  )}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
          Batal
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={isSubmitting || !selectedDoctor || !selectedSchedule}
        >
          {isSubmitting ? (
            <>
              <Spinner as="span" size="sm" animation="border" role="status" />
              {' Menyimpan...'}
            </>
          ) : (
            'Simpan'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRawatJalan;
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ModalRawatJalan = ({
  show,
  handleClose,
  selectedPatient,
  dokter = [],
  onSave,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState("");

  useEffect(() => {
    if (!show) {
      setSelectedDoctor(null);
      setSelectedSchedule("");
    }
  }, [show]);

  console.log("Dokter di Modal:", dokter); // Debugging

  const handleSave = () => {
    if (!selectedDoctor || !selectedSchedule) {
      alert("Harap pilih dokter dan jadwal terlebih dahulu.");
      return;
    }

    const data = {
      patientId: selectedPatient.id,
      doctorId: selectedDoctor.id,
      schedule: selectedSchedule,
    };
    onSave(data);
    handleClose();
  };

  console.log("Dokter di Modal:", dokter);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Pendaftaran Rawat Jalan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Nama Pasien */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Nama Pasien</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    selectedPatient
                      ? selectedPatient.NamaLengkap
                      : "Pasien tidak ditemukan"
                  }
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Pilih Dokter */}
           {/* Pilih Dokter */}
           <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Pilih Dokter</Form.Label>
                <Form.Select
                  value={selectedDoctor ? selectedDoctor.id : ""}
                  onChange={(e) => {
                    const doctorId = parseInt(e.target.value);
                    const doctor = dokter.find((d) => d.id === doctorId);
                    console.log("Dokter yang dipilih:", doctor); // Debugging
                    setSelectedDoctor(doctor);
                    setSelectedSchedule("");
                  }}
                >
                  <option value="">Pilih Dokter</option>
                  {dokter.length > 0 ? (
                    dokter.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.namaDokter} - {doctor.spesialis}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Tidak ada data dokter
                    </option>
                  )}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Data Dokter (Autofill) */}
          {selectedDoctor && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Spesialis</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedDoctor.spesialis}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Nomor Praktek</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedDoctor.nomorPraktek}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Ruang Praktek</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedDoctor.ruangPraktek}
                      readOnly
                    />
                  </Form.Group>
                </Col>
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
                  disabled={!selectedDoctor} // Nonaktifkan jika dokter belum dipilih
                >
                  <option value="">Pilih Jadwal</option>
                  {selectedDoctor && selectedDoctor.jadwalPraktek.length > 0 ? (
                    selectedDoctor.jadwalPraktek.map((jadwal, index) => (
                      <option
                        key={index}
                        value={`${jadwal.hariPraktek} ${jadwal.waktuMulai} - ${jadwal.waktuSelesai}`}
                      >
                        {`${jadwal.hariPraktek} ${jadwal.waktuMulai} - ${jadwal.waktuSelesai}`}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Tidak ada jadwal tersedia
                    </option>
                  )}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRawatJalan;

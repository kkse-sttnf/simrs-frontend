import React, { useState } from "react";
import { Container, Card, Form, Row, Col, Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DetailDokter = ({ selectedDokter }) => {
  const [dokter, setDokter] = useState(selectedDokter || {});
  const navigate = useNavigate();

  // Update state ketika selectedDokter berubah
  React.useEffect(() => {
    setDokter(selectedDokter || {});
  }, [selectedDokter]);

  // Fungsi untuk navigasi ke halaman TambahDokter
  const handleTambahDokter = () => {
    navigate("/DataDokter/TambahDokter");
  };

  return (
    <Container className="my-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Detail Dokter</h4>
          {/* Tombol + untuk navigasi ke halaman TambahDokter */}
          <Button
            variant="light"
            className="text-primary fw-bold"
            onClick={handleTambahDokter}
          >
            <FaPlus />
          </Button>
        </Card.Header>
        <Card.Body>
          <Form>
            {/* Bagian Nama Dokter */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-primary">Nama Dokter</Form.Label>
                  <Form.Control
                    type="text"
                    value={dokter.namaDokter || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-primary">No Pegawai</Form.Label>
                  <Form.Control
                    type="text"
                    value={dokter.noPegawai || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Bagian Spesialis, Nomor Praktek, Ruang Praktek */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="text-primary">Spesialis</Form.Label>
                  <Form.Control
                    type="text"
                    value={dokter.spesialis || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="text-primary">
                    Nomor Praktek
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={dokter.nomorPraktek || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="text-primary">
                    Ruang Praktek
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={dokter.ruangPraktek || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Bagian Jadwal Praktek */}
            {dokter.jadwalPraktek?.map((jadwal, index) => (
              <Row className="mb-3" key={index}>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label className="text-primary">Hari Praktek</Form.Label>
                    <Form.Control
                      type="text"
                      value={jadwal.hariPraktek || ""}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label className="text-primary">Waktu Mulai</Form.Label>
                    <Form.Control
                      type="text"
                      value={jadwal.waktuMulai || ""}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label className="text-primary">Waktu Selesai</Form.Label>
                    <Form.Control
                      type="text"
                      value={jadwal.waktuSelesai || ""}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
            ))}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DetailDokter;
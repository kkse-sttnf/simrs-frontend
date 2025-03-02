import React, { useState } from "react";
import { Container, Card, Form, Row, Col, Button } from "react-bootstrap";

const DetailDokter = ({ selectedDokter }) => {
  const [dokter, setDokter] = useState(selectedDokter || {});

  // Update state ketika selectedDokter berubah
  React.useEffect(() => {
    setDokter(selectedDokter || {});
  }, [selectedDokter]);

  return (
    <Container className="my-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Detail Dokter</h4>
          <Button variant="light" className="text-primary fw-bold">
            +
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
                    placeholder="Masukkan Nama Dokter"
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
                    placeholder="Masukkan No Pegawai"
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
                    placeholder="Masukkan Spesialis"
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
                    placeholder="Masukkan Nomor Praktek"
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
                    placeholder="Masukkan Ruang Praktek"
                    value={dokter.ruangPraktek || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Bagian Jadwal Praktek */}
            <Row className="mb-3">
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="text-primary">Hari Praktek</Form.Label>
                  <Form.Control
                    type="text"
                    value={dokter.hariPraktek || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="text-primary">Waktu Mulai</Form.Label>
                  <Form.Control
                    type="text"
                    value={dokter.waktuMulai || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="text-primary">
                    Waktu Selesai
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={dokter.waktuSelesai || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DetailDokter;
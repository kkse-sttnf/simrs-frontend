import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const FormRawatJalan = () => {
  // Data dummy untuk dropdown Nama Dokter dan Jadwal Dokter
  const dokterList = [
    { id: 1, nama: "Dr. John Doe" },
    { id: 2, nama: "Dr. Jane Smith" },
    { id: 3, nama: "Dr. Michael Johnson" },
  ];

  const jadwalList = [
    { id: 1, waktu: "08:00 - 10:00" },
    { id: 2, waktu: "10:00 - 12:00" },
    { id: 3, waktu: "13:00 - 15:00" },
  ];

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Form Rawat Jalan</h4>
        </Card.Header>
        <Card.Body>
          <Form>
            {/* Bagian Nama Pasien */}
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Nama Pasien</Form.Label>
                  <Form.Control type="text" placeholder="Masukkan Nama Pasien" />
                </Form.Group>
              </Col>
            </Row>

            {/* Bagian Nama Dokter dan Spesialis */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nama Dokter</Form.Label>
                  <Form.Select>
                    <option value="">Pilih Nama Dokter</option>
                    {dokterList.map((dokter) => (
                      <option key={dokter.id} value={dokter.id}>
                        {dokter.nama}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Spesialis</Form.Label>
                  <Form.Control type="text" placeholder="Masukkan Spesialis" />
                </Form.Group>
              </Col>
            </Row>

            {/* Bagian Nomor Praktek dan Jadwal Dokter */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nomor Praktek</Form.Label>
                  <Form.Control type="text" placeholder="Masukkan Nomor Praktek" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Jadwal Dokter</Form.Label>
                  <Form.Select>
                    <option value="">Pilih Jadwal Dokter</option>
                    {jadwalList.map((jadwal) => (
                      <option key={jadwal.id} value={jadwal.id}>
                        {jadwal.waktu}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Bagian Ruang Praktek dan Jadwal Dokter */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Ruang Praktek</Form.Label>
                  <Form.Control type="text" placeholder="Masukkan Ruang Praktek" />
                </Form.Group>
              </Col>
            </Row>

            {/* Tombol Batal dan Simpan */}
            <Row className="mb-3">
              <Col className="d-flex justify-content-end gap-2">
                <Button variant="secondary">Batal</Button>
                <Button variant="primary">Simpan</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormRawatJalan;
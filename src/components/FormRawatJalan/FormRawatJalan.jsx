import React from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

const FormRawatJalan = ({ selectedPasien }) => {
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
                  <Form.Control
                    type="text"
                    value={selectedPasien?.namaPasien || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Bagian Nama Dokter dan Spesialis */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nama Dokter</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedPasien?.namaDokter || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Spesialis</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedPasien?.spesialis || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Bagian Nomor Praktek dan Jadwal Dokter */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nomor Praktek</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedPasien?.nomorPraktek || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Jadwal Dokter</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedPasien?.jadwalDokter || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Bagian Ruang Praktek */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Ruang Praktek</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedPasien?.ruangPraktek || ""}
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

export default FormRawatJalan;
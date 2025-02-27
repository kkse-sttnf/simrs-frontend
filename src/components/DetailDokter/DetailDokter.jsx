import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

const DetailDokter = () => {
  return (
    <Container className="my-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Tambah Dokter</h4>
        </Card.Header>
        <Card.Body>
          <Form>
            {/* Bagian Nama Dokter */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-primary">
                     Nama Dokter
                  </Form.Label>
                  <Form.Control type="text" placeholder="Masukkan Nama Dokter" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-primary">
                    No Pegawai
                  </Form.Label>
                  <Form.Control type="text" placeholder="Masukkan No Pegawai" />
                </Form.Group>
              </Col>
            </Row>

            {/* Bagian No Pegawai */}
            <Row className="mb-3">
            <Col md={3}>
                <Form.Group>
                  <Form.Label className="text-primary">
                    Spesialis
                  </Form.Label>
                  <Form.Control type="text" placeholder="Masukkan Spesialis" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="text-primary">
                    No Pegawai
                  </Form.Label>
                  <Form.Control type="text" placeholder="Masukkan No Pegawai" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="text-primary">
                     Nomor Praktek
                  </Form.Label>
                  <Form.Control type="text" placeholder="Masukkan Nomor Praktek" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="text-primary">
                    Ruang Praktek
                  </Form.Label>
                  <Form.Control type="text" placeholder="Masukkan Ruang Praktek" />
                </Form.Group>
              </Col>
            </Row>


            {/* Bagian Jadwal Dokter */}
            <Row className="mb-3">
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="text-primary">
                    Hari Praktek
                  </Form.Label>
                  <Form.Select>
                    <option>Pilih Hari</option>
                    <option>Senin</option>
                    <option>Selasa</option>
                    <option>Rabu</option>
                    <option>Kamis</option>
                    <option>Jumat</option>
                    <option>Sabtu</option>
                    <option>Minggu</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="text-primary">
                     Waktu Mulai
                  </Form.Label>
                  <Form.Control type="time" />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="text-primary">
                    Waktu Selesai
                  </Form.Label>
                  <Form.Control type="time" />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="success" className="rounded-circle">
                  <FaPlus />
                </Button>
              </Col>
            </Row>

            {/* Tombol Tambah */}
            <div className="d-flex justify-content-end">
              <Button variant="primary">
                <FaPlus className="me-2" /> Tambah Dokter
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DetailDokter;

import React, { useState } from "react";
import { Container, Card, Form, Row, Col, Button } from "react-bootstrap"; // Import Button dari react-bootstrap
import { FaSave } from "react-icons/fa";

const FormTambahDokter = () => {
  // State untuk menyimpan data dokter yang akan ditambahkan
  const [dokter, setDokter] = useState({
    namaDokter: "",
    noPegawai: "",
    spesialis: "",
    nomorPraktek: "",
    ruangPraktek: "",
    hariPraktek: "",
    waktuMulai: "",
    waktuSelesai: "",
  });

  // Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDokter({
      ...dokter,
      [name]: value,
    });
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data Dokter yang Ditambahkan:", dokter);
    // Di sini Anda bisa menambahkan logika untuk mengirim data ke server atau menyimpannya di state global.
  };

  return (
    <Container className="my-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Tambah Dokter</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Bagian Nama Dokter */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-primary">Nama Dokter</Form.Label>
                  <Form.Control
                    type="text"
                    name="namaDokter"
                    value={dokter.namaDokter}
                    onChange={handleChange}
                    placeholder="Masukkan Nama Dokter"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-primary">No Pegawai</Form.Label>
                  <Form.Control
                    type="text"
                    name="noPegawai"
                    value={dokter.noPegawai}
                    onChange={handleChange}
                    placeholder="Masukkan No Pegawai"
                    required
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
                    name="spesialis"
                    value={dokter.spesialis}
                    onChange={handleChange}
                    placeholder="Masukkan Spesialis"
                    required
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
                    name="nomorPraktek"
                    value={dokter.nomorPraktek}
                    onChange={handleChange}
                    placeholder="Masukkan Nomor Praktek"
                    required
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
                    name="ruangPraktek"
                    value={dokter.ruangPraktek}
                    onChange={handleChange}
                    placeholder="Masukkan Ruang Praktek"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Bagian Jadwal Praktek */}
            <Row className="mb-3">
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="text-primary">Hari Praktek</Form.Label>
                  <Form.Select
                    name="hariPraktek"
                    value={dokter.hariPraktek}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih Hari</option>
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                    <option value="Minggu">Minggu</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="text-primary">Waktu Mulai</Form.Label>
                  <Form.Control
                    type="time"
                    name="waktuMulai"
                    value={dokter.waktuMulai}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="text-primary">
                    Waktu Selesai
                  </Form.Label>
                  <Form.Control
                    type="time"
                    name="waktuSelesai"
                    value={dokter.waktuSelesai}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Tombol Batal & Simpan */}
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="success" type="submit">
                <FaSave /> Tambah Data
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormTambahDokter;
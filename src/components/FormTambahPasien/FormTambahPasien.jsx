import React from "react";
import { Container, Form, Row, Col, Button, Card } from "react-bootstrap";
import { FaTimes, FaSave } from "react-icons/fa";

const FormDataPasien = () => {
  return (
    <Container className="mt-4 my-4">
      <Card className="shadow p-3">
        {/* Header */}
        <div className="bg-primary text-white p-3 rounded d-flex justify-content-between align-items-center">
          <h4 className="mb-0 text-start">Form Tambah Pasien</h4>
        </div>
        {/* Form */}
        <Form className="mt-3">
        <h5 className="mt-1">Biodata</h5>
          <Row className="mb-3">
            {/* Nama Lengkap */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Nama Lengkap
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* No Telepon Rumah */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  No Telp Rumah
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Nomor Rekam Medis */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Nomor Rekam Medis
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* No Telepon Pasien */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  No Telp Pasien
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* NIK */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  NIK
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* Pendidikan */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Pendidikan
                </Form.Label>
                <Form.Select>
                  <option>Pilih Pendidikan</option>
                  <option>SD</option>
                  <option>SMP</option>
                  <option>SMA</option>
                  <option>D3</option>
                  <option>S1</option>
                  <option>S2</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Nomor Identitas Lain */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Nomor Identitas Lain (WNA)
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* Pekerjaan */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Pekerjaan
                </Form.Label>
                <Form.Select>
                  <option>Pilih Pekerjaan</option>
                  <option>Pegawai</option>
                  <option>Wiraswasta</option>
                  <option>Pelajar</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Nama Ibu Kandung */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Nama Ibu Kandung
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* Status Pernikahan */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Status Pernikahan
                </Form.Label>
                <Form.Select>
                  <option>Pilih Status Pernikahan</option>
                  <option>Belum Menikah</option>
                  <option>Menikah</option>
                  <option>Cerai Mati</option>
                  <option>Cerai Hidup</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Tempat Lahir */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Tempat Lahir
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* Tanggal, Bulan, Tahun Lahir */}
            <Col md={1}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Tanggal
                </Form.Label>
                <Form.Control type="number" />
              </Form.Group>
            </Col>
            <Col md={1}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Bulan
                </Form.Label>
                <Form.Control type="number" />
              </Form.Group>
            </Col>
            <Col md={1}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Tahun
                </Form.Label>
                <Form.Control type="number" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Bahasa Dikuasai
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Jenis Kelamin */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Jenis Kelamin
                </Form.Label>
                <Form.Select>
                  <option>Pilih Kelamin</option>
                  <option>Laki - Laki</option>
                  <option>Perempuan</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {/* Agama */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Agama
                </Form.Label>
                <Form.Select>
                  <option>Pilih Agama</option>
                  <option>Islam</option>
                  <option>Kristen</option>
                  <option>Katholik</option>
                  <option>Hindu</option>
                  <option>Buddha</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Alamat Lengkap */}
            <h5 className="mt-4">Alamat</h5>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Alamat Lengkap
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* RT */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  RT
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* RW */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  RW
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Kelurahan */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kelurahan
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* Kecamatan */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kecamatan
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* Kabupaten */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kabupaten
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* Kode Pos */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kode Pos
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Provinsi */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Provinsi
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* Negara */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Negara
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="mt-4">Alamat Domisili</h5>
          <Row className="mb-3">
            {/* Alamat Lengkap Domisili */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Alamat Lengkap Domisili
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* RT Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  RT Domisili
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* RW Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  RW Domisili
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Kelurahan Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kelurahan Domisili
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* Kecamatan Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kecamatan Domisili
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* Kabupaten Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kabupaten Domisili
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* Kode Pos Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kode Pos Domisili
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Provinsi Domisili */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Provinsi Domisili
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            {/* Negara Domisili */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Negara Domisili
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          {/* Tombol Batal & Simpan */}
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="danger">
              <FaTimes /> Batal
            </Button>
            <Button variant="primary">
              <FaSave /> Simpan
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default FormDataPasien;

import React, { useEffect, useState } from "react";
import { Container, Form, Row, Col, Button, Card } from "react-bootstrap";
import { FaSave } from "react-icons/fa";

const DetailDataPasien = ({ selectedPatient }) => {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nomorRekamMedis: "",
    nik: "",
    nomorIdentitasLain: "",
    namaIbuKandung: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    agama: "",
    suku: "",
    bahasaDikuasai: "",
    alamatLengkap: "",
    rt: "",
    rw: "",
    kelurahan: "",
    kecamatan: "",
    kabupaten: "",
    kodePos: "",
    provinsi: "",
    negara: "",
    nomorTeleponRumah: "",
    nomorTeleponSelular: "",
    pendidikan: "",
    pekerjaan: "",
    statusPernikahan: "",
    alamatDomisili: "",
    rtDomisili: "",
    rwDomisili: "",
    kelurahanDomisili: "",
    kecamatanDomisili: "",
    kabupatenDomisili: "",
    kodePosDomisili: "",
    provinsiDomisili: "",
    negaraDomisili: "",
  });


  useEffect(() => {
    if (selectedPatient) {
      setFormData({
        namaLengkap: selectedPatient.NamaLengkap || "",
        nomorRekamMedis: selectedPatient.NomorRekamMedis || "",
        nik: selectedPatient.NIK || "",
        nomorIdentitasLain: selectedPatient.NomorIdentitasLain || "",
        namaIbuKandung: selectedPatient.NamaIbuKandung || "",
        tempatLahir: selectedPatient.TempatLahir || "",
        tanggalLahir: selectedPatient.TanggalLahir || "",
        jenisKelamin: selectedPatient.JenisKelamin === 1 ? "Laki-laki" : "Perempuan",
        agama: selectedPatient.Agama || "",
        suku: selectedPatient.Suku || "",
        bahasaDikuasai: selectedPatient.BahasaDikuasai || "",
        alamatLengkap: selectedPatient.AlamatLengkap || "",
        rt: selectedPatient.RT || "",
        rw: selectedPatient.RW || "",
        kelurahan: selectedPatient.Kelurahan || "",
        kecamatan: selectedPatient.Kecamatan || "",
        kabupaten: selectedPatient.KotamadyaKabupaten || "",
        kodePos: selectedPatient.KodePos || "",
        provinsi: selectedPatient.Provinsi || "",
        negara: selectedPatient.Negara || "",
        nomorTeleponRumah: selectedPatient.NomorTeleponRumah || "",
        nomorTeleponSelular: selectedPatient.NomorTeleponSelular || "",
        pendidikan: selectedPatient.Pendidikan === 6 ? "S1" : "Lainnya",
        pekerjaan: selectedPatient.Pekerjaan === 4 ? "Wiraswasta" : "Lainnya",
        statusPernikahan: selectedPatient.StatusPernikahan === 1 ? "Menikah" : "Lainnya",
        alamatDomisili: selectedPatient.AlamatLengkapDomisili || "",
        rtDomisili: selectedPatient.RTDomisili || "",
        rwDomisili: selectedPatient.RWDomisili || "",
        kelurahanDomisili: selectedPatient.KelurahanDomisili || "",
        kecamatanDomisili: selectedPatient.KecamatanDomisili || "",
        kabupatenDomisili: selectedPatient.KotamadyaKabupatenDomisili || "",
        kodePosDomisili: selectedPatient.KodeposDomisili || "",
        provinsiDomisili: selectedPatient.ProvinsiDomisili || "",
        negaraDomisili: selectedPatient.NegaraDomisili || "",
      });
    }
  }, [selectedPatient]);

  return (
    <Container className="mt-4 my-4">
      <Card className="shadow p-3">
        {/* Header */}
        <div className="bg-primary text-white p-3 rounded d-flex justify-content-between align-items-center">
          <h4 className="mb-0 text-start">Detail Pasien</h4>
          <Button variant="light" className="text-primary fw-bold">
            +
          </Button>
        </div>
        {/* Form */}
        <Form className="mt-3">
          <Row className="mb-3">
            {/* Nama Lengkap */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Nama Lengkap
                </Form.Label>
                <Form.Control type="text" value={formData.namaLengkap} readOnly />
              </Form.Group>
            </Col>
            {/* No Telepon Rumah */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  No Telp Rumah
                </Form.Label>
                <Form.Control type="text" value={formData.nomorTeleponRumah} readOnly />
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
                <Form.Control type="text" value={formData.nomorRekamMedis} readOnly />
              </Form.Group>
            </Col>
            {/* No Telepon Pasien */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  No Telp Pasien
                </Form.Label>
                <Form.Control type="text" value={formData.nomorTeleponSelular} readOnly />
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
                <Form.Control type="text" value={formData.nik} readOnly />
              </Form.Group>
            </Col>
            {/* Pendidikan */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Pendidikan
                </Form.Label>
                <Form.Control type="text" value={formData.pendidikan} readOnly />
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
                <Form.Control type="text" value={formData.nomorIdentitasLain} readOnly />
              </Form.Group>
            </Col>
            {/* Pekerjaan */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Pekerjaan
                </Form.Label>
                <Form.Control type="text" value={formData.pekerjaan} readOnly />
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
                <Form.Control type="text" value={formData.namaIbuKandung} readOnly />
              </Form.Group>
            </Col>
            {/* Status Pernikahan */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Status Pernikahan
                </Form.Label>
                <Form.Control type="text" value={formData.statusPernikahan} readOnly />
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
                <Form.Control type="text" value={formData.tempatLahir} readOnly />
              </Form.Group>
            </Col>
            {/* Tanggal Lahir */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Tanggal Lahir
                </Form.Label>
                <Form.Control type="text" value={formData.tanggalLahir} readOnly />
              </Form.Group>
            </Col>
            {/* Suku */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Suku
                </Form.Label>
                <Form.Control type="text" value={formData.suku} readOnly />
              </Form.Group>
            </Col>
            {/* Bahasa Dikuasai */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Bahasa Dikuasai
                </Form.Label>
                <Form.Control type="text" value={formData.bahasaDikuasai} readOnly />
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
                <Form.Control type="text" value={formData.jenisKelamin} readOnly />
              </Form.Group>
            </Col>
            {/* Agama */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Agama
                </Form.Label>
                <Form.Control type="text" value={formData.agama} readOnly />
              </Form.Group>
            </Col>
          </Row>

          {/* Alamat Lengkap */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Alamat Lengkap
                </Form.Label>
                <Form.Control type="text" value={formData.alamatLengkap} readOnly />
              </Form.Group>
            </Col>
            {/* RT */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  RT
                </Form.Label>
                <Form.Control type="text" value={formData.rt} readOnly />
              </Form.Group>
            </Col>
            {/* RW */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  RW
                </Form.Label>
                <Form.Control type="text" value={formData.rw} readOnly />
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
                <Form.Control type="text" value={formData.kelurahan} readOnly />
              </Form.Group>
            </Col>
            {/* Kecamatan */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kecamatan
                </Form.Label>
                <Form.Control type="text" value={formData.kecamatan} readOnly />
              </Form.Group>
            </Col>
            {/* Kabupaten */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kabupaten
                </Form.Label>
                <Form.Control type="text" value={formData.kabupaten} readOnly />
              </Form.Group>
            </Col>
            {/* Kode Pos */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kode Pos
                </Form.Label>
                <Form.Control type="text" value={formData.kodePos} readOnly />
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
                <Form.Control type="text" value={formData.provinsi} readOnly />
              </Form.Group>
            </Col>
            {/* Negara */}
            <Col md={6}>
              <Form.Group>9927180875545085
                <Form.Label className="text-primary text-start w-100">
                  Negara
                </Form.Label>
                <Form.Control type="text" value={formData.negara} readOnly />
              </Form.Group>
            </Col>
          </Row>

          {/* Alamat Domisili */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Alamat Lengkap Domisili
                </Form.Label>
                <Form.Control type="text" value={formData.alamatDomisili} readOnly />
              </Form.Group>
            </Col>
            {/* RT Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  RT Domisili
                </Form.Label>
                <Form.Control type="text" value={formData.rtDomisili} readOnly />
              </Form.Group>
            </Col>
            {/* RW Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  RW Domisili
                </Form.Label>
                <Form.Control type="text" value={formData.rwDomisili} readOnly />
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
                <Form.Control type="text" value={formData.kelurahanDomisili} readOnly />
              </Form.Group>
            </Col>
            {/* Kecamatan Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kecamatan Domisili
                </Form.Label>
                <Form.Control type="text" value={formData.kecamatanDomisili} readOnly />
              </Form.Group>
            </Col>
            {/* Kabupaten Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kabupaten Domisili
                </Form.Label>
                <Form.Control type="text" value={formData.kabupatenDomisili} readOnly />
              </Form.Group>
            </Col>
            {/* Kode Pos Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kode Pos Domisili
                </Form.Label>
                <Form.Control type="text" value={formData.kodePosDomisili} readOnly />
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
                <Form.Control type="text" value={formData.provinsiDomisili} readOnly />
              </Form.Group>
            </Col>
            {/* Negara Domisili */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Negara Domisili
                </Form.Label>
                <Form.Control type="text" value={formData.negaraDomisili} readOnly />
              </Form.Group>
            </Col>
          </Row>

          {/* Tombol Batal & Simpan */}
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="success">
              <FaSave /> Daftar Rawat Jalan
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default DetailDataPasien;
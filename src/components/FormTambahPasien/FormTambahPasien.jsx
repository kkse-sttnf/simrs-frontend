import React, { useState } from "react";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getPinata } from "../../utils/pinataProvider";
import { getContract as getPatientContract } from "../../utils/patientContract";
import { uuidV4, randomBytes } from "ethers";

const FormTambahPasien = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaLengkap: "",
    noTelpRumah: "",
    nomorRekamMedis: "",
    noTelpPasien: "",
    nik: "",
    pendidikan: "",
    nomorIdentitasLain: "",
    pekerjaan: "",
    namaIbuKandung: "",
    statusPernikahan: "",
    tempatLahir: "",
    tanggalLahir: "",
    suku: "",
    bahasaDikuasai: "",
    jenisKelamin: "",
    agama: "",
    alamatLengkap: "",
    rt: "",
    rw: "",
    kelurahan: "",
    kecamatan: "",
    kabupaten: "",
    kodePos: "",
    provinsi: "",
    negara: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda sudah memasukkan data dengan benar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, benar!",
      cancelButtonText: "Cek lagi",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const jsonFormData = formData;
          const pinata = getPinata();
          const dataName = uuidV4(randomBytes(16)) + ".json";
          const upload = await pinata.upload.public.json(jsonFormData).name(dataName);
          const cid = upload.cid;
          const nik = formData.nik
          const patientContract = await getPatientContract();
          patientContract.savePatientData(nik, cid);
          patientContract.on("PatientRegistered", (evCid, evNik, evMrHash) => {
            console.log("success: ", evCid, evNik, evMrHash)
            navigate("/DetailPasien");
            setFormData({
              namaLengkap: "",
              noTelpRumah: "",
              nomorRekamMedis: "",
              noTelpPasien: "",
              nik: "",
              pendidikan: "",
              nomorIdentitasLain: "",
              pekerjaan: "",
              namaIbuKandung: "",
              statusPernikahan: "",
              tempatLahir: "",
              tanggalLahir: "",
              suku: "",
              bahasaDikuasai: "",
              jenisKelamin: "",
              agama: "",
              alamatLengkap: "",
              rt: "",
              rw: "",
              kelurahan: "",
              kecamatan: "",
              kabupaten: "",
              kodePos: "",
              provinsi: "",
              negara: "",
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
          })
        } catch (error) {
          console.error("Error:", error);
          Swal.fire("Error", "Terjadi kesalahan saat menyimpan data.", "error");
        }
      }
    });
  };

  return (
    <Container className="mt-4 my-4">
      <Card className="shadow p-3">
        {/* Header */}
        <div className="bg-primary text-white p-3 rounded d-flex justify-content-between align-items-center">
          <h4 className="mb-0 text-start">Form Tambah Pasien</h4>
        </div>
        {/* Form */}
        <Form onSubmit={handleSubmit} className="mt-3">
          <Row className="mb-3">
            {/* Nama Lengkap */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Nama Lengkap
                </Form.Label>
                <Form.Control
                  type="text"
                  name="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* No Telepon Rumah */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  No Telp Rumah
                </Form.Label>
                <Form.Control
                  type="text"
                  name="noTelpRumah"
                  value={formData.noTelpRumah}
                  onChange={handleChange}
                />
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
                <Form.Control
                  type="text"
                  name="nomorRekamMedis"
                  value={formData.nomorRekamMedis}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* No Telepon Pasien */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  No Telp Pasien
                </Form.Label>
                <Form.Control
                  type="text"
                  name="noTelpPasien"
                  value={formData.noTelpPasien}
                  onChange={handleChange}
                />
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
                <Form.Control
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Pendidikan */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Pendidikan
                </Form.Label>
                <Form.Control
                  as="select" // Menggunakan dropdown
                  name="pendidikan"
                  value={formData.pendidikan} // Nilai yang dipilih
                  onChange={handleChange} // Menangani perubahan
                >
                  <option value="">Pilih Pendidikan</option>
                  <option value={0}>Tidak sekolah</option>
                  <option value={1}>SD</option>
                  <option value={2}>SLTP sederajat</option>
                  <option value={3}>SLTA sederajat</option>
                  <option value={4}>D1-D3 sederajat</option>
                  <option value={5}>D4</option>
                  <option value={6}>S1</option>
                  <option value={7}>S2</option>
                  <option value={8}>S3</option>
                </Form.Control>
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
                <Form.Control
                  type="text"
                  name="nomorIdentitasLain"
                  value={formData.nomorIdentitasLain}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Pekerjaan */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Pekerjaan
                </Form.Label>
                <Form.Control
                  as="select" // Menggunakan dropdown
                  name="pekerjaan"
                  value={formData.pekerjaan} // Nilai yang dipilih
                  onChange={handleChange} // Menangani perubahan
                >
                  <option value="">Pilih Perkerjaan</option>
                  <option value={0}>Tidak bekerja</option>
                  <option value={1}>PNS</option>
                  <option value={2}>TNI/POLRI</option>
                  <option value={3}>BUMN</option>
                  <option value={4}>Pegawai Swasta/Wirausaha</option>
                </Form.Control>
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
                <Form.Control
                  type="text"
                  name="namaIbuKandung"
                  value={formData.namaIbuKandung}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Status Pernikahan */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Status Pernikahan
                </Form.Label>
                <Form.Control
                  as="select" // Menggunakan dropdown
                  name="statusPernikahan"
                  value={formData.statusPernikahan} // Nilai yang dipilih
                  onChange={handleChange} // Menangani perubahan
                >
                  <option value="">Pilih Status</option>
                  <option value={1}>Belum Kawin</option>
                  <option value={2}>Kawin</option>
                  <option value={3}>Cerai Hidup</option>
                  <option value={4}>Cerai Mati</option>
                </Form.Control>
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
                <Form.Control
                  type="text"
                  name="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Tanggal Lahir */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Tanggal Lahir
                </Form.Label>
                <Form.Control
                  type="date" // Ubah type menjadi "date" untuk input tanggal
                  name="tanggalLahir"
                  value={formData.tanggalLahir}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Suku */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Suku
                </Form.Label>
                <Form.Control
                  type="text"
                  name="suku"
                  value={formData.suku}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Bahasa Dikuasai */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Bahasa Dikuasai
                </Form.Label>
                <Form.Control
                  type="text"
                  name="bahasaDikuasai"
                  value={formData.bahasaDikuasai}
                  onChange={handleChange}
                />
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
                <Form.Control
                  as="select" // Ubah type menjadi "select" untuk dropdown
                  name="jenisKelamin"
                  value={formData.jenisKelamin}
                  onChange={handleChange}
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value={1}>Laki-laki</option>
                  <option value={2}>Perempuan</option>
                </Form.Control>
              </Form.Group>
            </Col>
            {/* Agama */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Agama
                </Form.Label>
                <Form.Control
                  as="select" // Ubah type menjadi "select" untuk dropdown
                  name="agama"
                  value={formData.agama}
                  onChange={handleChange}
                >
                  <option value="">Pilih Agama</option>
                  <option value={1}>Islam</option>
                  <option value={2}>Kristen</option>
                  <option value={3}>Katolik</option>
                  <option value={4}>Hindu</option>
                  <option value={5}>Buddha</option>
                  <option value={6}>Konghucu</option>
                  <option value={7}>Penghayat</option>
                </Form.Control>
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
                <Form.Control
                  type="text"
                  name="alamatLengkap"
                  value={formData.alamatLengkap}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* RT */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  RT
                </Form.Label>
                <Form.Control
                  type="text"
                  name="rt"
                  value={formData.rt}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* RW */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  RW
                </Form.Label>
                <Form.Control
                  type="text"
                  name="rw"
                  value={formData.rw}
                  onChange={handleChange}
                />
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
                <Form.Control
                  type="text"
                  name="kelurahan"
                  value={formData.kelurahan}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Kecamatan */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kecamatan
                </Form.Label>
                <Form.Control
                  type="text"
                  name="kecamatan"
                  value={formData.kecamatan}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Kabupaten */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kabupaten
                </Form.Label>
                <Form.Control
                  type="text"
                  name="kabupaten"
                  value={formData.kabupaten}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Kode Pos */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kode Pos
                </Form.Label>
                <Form.Control
                  type="text"
                  name="kodePos"
                  value={formData.kodePos}
                  onChange={handleChange}
                />
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
                <Form.Control
                  type="text"
                  name="provinsi"
                  value={formData.provinsi}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Negara */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Negara
                </Form.Label>
                <Form.Control
                  type="text"
                  name="negara"
                  value={formData.negara}
                  onChange={handleChange}
                />
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
                <Form.Control
                  type="text"
                  name="alamatDomisili"
                  value={formData.alamatDomisili}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* RT Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  RT Domisili
                </Form.Label>
                <Form.Control
                  type="text"
                  name="rtDomisili"
                  value={formData.rtDomisili}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* RW Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  RW Domisili
                </Form.Label>
                <Form.Control
                  type="text"
                  name="rwDomisili"
                  value={formData.rwDomisili}
                  onChange={handleChange}
                />
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
                <Form.Control
                  type="text"
                  name="kelurahanDomisili"
                  value={formData.kelurahanDomisili}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Kecamatan Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kecamatan Domisili
                </Form.Label>
                <Form.Control
                  type="text"
                  name="kecamatanDomisili"
                  value={formData.kecamatanDomisili}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Kabupaten Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kabupaten Domisili
                </Form.Label>
                <Form.Control
                  type="text"
                  name="kabupatenDomisili"
                  value={formData.kabupatenDomisili}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Kode Pos Domisili */}
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Kode Pos Domisili
                </Form.Label>
                <Form.Control
                  type="text"
                  name="kodePosDomisili"
                  value={formData.kodePosDomisili}
                  onChange={handleChange}
                />
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
                <Form.Control
                  type="text"
                  name="provinsiDomisili"
                  value={formData.provinsiDomisili}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Negara Domisili */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Negara Domisili
                </Form.Label>
                <Form.Control
                  type="text"
                  name="negaraDomisili"
                  value={formData.negaraDomisili}
                  onChange={handleChange}
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
      </Card>
    </Container>
  );
};

export default FormTambahPasien;

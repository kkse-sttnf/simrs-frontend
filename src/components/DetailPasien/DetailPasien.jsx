import React, { useEffect, useState } from "react";
import { Container, Form, Row, Col, Button, Card, Alert } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ethers } from "ethers";
import { getContract } from "../../utils/outpatientContract";

const DetailDataPasien = ({ 
  selectedPatient, 
  dokter, 
  loadingDokter, 
  errorDokter,
  onShowModal,
  searchStatus
}) => {
  const navigate = useNavigate();
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

  const getJenisKelaminText = (value) => {
    const val = parseInt(value);
    switch (val) {
      case 0: return "Tidak diketahui";
      case 1: return "Laki-laki";
      case 2: return "Perempuan";
      case 3: return "Tidak dapat ditentukan";
      default: return `Tidak valid (${value})`;
    }
  };
  
  // Contoh untuk agama
  const getAgama = (value) => {
    const val = parseInt(value);
    switch (val) {
      case 0: return "Tidak diketahui";
      case 1: return "Islam";
      case 2: return "Kristen (Protestan)";
      case 3: return "Katolik";
      case 4: return "Hindu";
      case 5: return "Budha";
      case 6: return "Konghucu";
      case 7: return "Penghayat";
      default: return `Tidak valid (${value})`;
    }
  };

  const getPendidikan = (value) => {
    const val = parseInt(value);
    switch (val) {
      case 0: return "Tidak sekolah";
      case 1: return "SD";
      case 2: return "SLTP sederajat";
      case 3: return "SLTA sederajat";
      case 4: return "D1-D3 sederajat";
      case 5: return "D4";
      case 6: return "S1";
      case 7: return "S2";
      case 8: return "S3";
      default: return "Tidak valid";
    }
  };

  const getPerkerjaan = (value) => {
    const val = parseInt(value);
    switch (val) {
      case 0: return "Tidak bekerja";
      case 1: return "PNS";
      case 2: return "TNI/POLRI";
      case 3: return "BUMN";
      case 4: return "Pegawai/Wirausaha";
      default: return "Tidak valid";
    }
  };

  const getPernikahan = (value) => {
    const val = parseInt(value);
    switch (val) {
      case 1: return "Belum Kawin";
      case 2: return "Kawin";
      case 3: return "Cerai Hidup";
      case 4: return "Cerai Mati";
      default: return "Tidak valid";
    }
  };

  useEffect(() => {
    if (selectedPatient) {
      setFormData({
        namaLengkap: selectedPatient.namaLengkap || "",
        nomorRekamMedis: selectedPatient.nomorRekamMedis || "",
        nik: selectedPatient.nik || "",
        nomorIdentitasLain: selectedPatient.nomorIdentitasLain || "",
        namaIbuKandung: selectedPatient.namaIbuKandung || "",
        tempatLahir: selectedPatient.tempatLahir || "",
        tanggalLahir: selectedPatient.tanggalLahir || "",
        jenisKelamin: getJenisKelaminText(selectedPatient.jenisKelamin),
        agama: getAgama(selectedPatient.agama),
        suku: selectedPatient.suku || "",
        bahasaDikuasai: selectedPatient.bahasaDikuasai || "",
        alamatLengkap: selectedPatient.alamatLengkap || "",
        rt: selectedPatient.rt || "",
        rw: selectedPatient.rw || "",
        kelurahan: selectedPatient.kelurahan || "",
        kecamatan: selectedPatient.kecamatan || "",
        kabupaten: selectedPatient.kabupaten || "",
        kodePos: selectedPatient.kodePos || "",
        provinsi: selectedPatient.provinsi || "",
        negara: selectedPatient.negara || "",
        nomorTeleponRumah: selectedPatient.noTelpRumah || "",
        nomorTeleponSelular: selectedPatient.noTelpPasien || "",
        pendidikan: getPendidikan(selectedPatient.pendidikan),
        pekerjaan: getPerkerjaan(selectedPatient.pekerjaan),
        statusPernikahan: getPernikahan(selectedPatient.statusPernikahan),
        alamatDomisili: selectedPatient.alamatDomisili || "",
        rtDomisili: selectedPatient.rtDomisili || "",
        rwDomisili: selectedPatient.rwDomisili || "",
        kelurahanDomisili: selectedPatient.kelurahanDomisili || "",
        kecamatanDomisili: selectedPatient.kecamatanDomisili || "",
        kabupatenDomisili: selectedPatient.kabupatenDomisili || "",
        kodePosDomisili: selectedPatient.kodePosDomisili || "",
        provinsiDomisili: selectedPatient.provinsiDomisili || "",
        negaraDomisili: selectedPatient.negaraDomisili || "",
      });
    } else {
      setFormData({
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
    }
  }, [selectedPatient]);

  const handleTambahPasien = () => {
    navigate("/DetailPasien/TambahPasien");
  };

  if (searchStatus.loading) {
    return null;
  }

  if (searchStatus.error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {searchStatus.error}
        </Alert>
      </Container>
    );
  }

  if (!selectedPatient) {
    return (
      <Container className="mt-4">
        <Card className="text-center p-4">
          <h4>Silakan cari pasien menggunakan NIK atau Nomor Rekam Medis</h4>
          <p className="text-muted">
            Data pasien akan ditampilkan di sini setelah ditemukan
          </p>
          <Button
            variant="primary"
            className="fw-bold"
            onClick={handleTambahPasien}
          >
            Tambah Pasien 
          </Button>
        </Card>
      </Container>
    );
  }

  // Tambahkan fungsi handleSaveRawatJalan di komponen utama
const handleSaveRawatJalan = async (dataRawatJalan) => {
  try {
    // 1. Siapkan data yang diperlukan
    const { NIK, jadwalDokter } = dataRawatJalan;
    
    // 2. Dapatkan contract instance
    const contract = await getContract();
    
    // 3. Buat hash MR (Medical Record) dari NIK
    const mrHash = ethers.keccak256(ethers.toUtf8Bytes(NIK));
    
    // 4. Parse scheduleId dari jadwalDokter (contoh: "Senin 08:00 - 12:00" -> 1)
    const scheduleId = convertJadwalToId(jadwalDokter);
    
    // 5. Panggil fungsi enqueue di smart contract
    const tx = await contract.enqueue(mrHash, scheduleId);
    
    // 6. Tunggu konfirmasi transaksi
    await tx.wait();
    
    // 7. Dapatkan nomor antrian
    const queueNumber = await contract.getQueueNumber(mrHash);
    
    // 8. Tampilkan notifikasi sukses
    Swal.fire({
      icon: 'success',
      title: 'Pendaftaran Berhasil',
      html: `Nomor Antrian Anda: <b>${queueNumber.toString()}</b>`,
    });
    
    return true;
  } catch (error) {
    console.error('Error menyimpan rawat jalan:', error);
    Swal.fire({
      icon: 'error',
      title: 'Gagal Mendaftar',
      text: error.message || 'Terjadi kesalahan saat mendaftar rawat jalan',
    });
    return false;
  }
};

// Fungsi helper untuk konversi jadwal ke ID
const convertJadwalToId = (jadwal) => {
  // Implementasi sesuai kebutuhan, contoh sederhana:
  if (jadwal.includes("Senin")) return 1;
  if (jadwal.includes("Selasa")) return 2;
  // ... dan seterusnya
  return 0;
};

  return (
    <Container className="mt-4 my-4">
      <Card className="shadow p-3">
        <div className="bg-primary text-white p-3 rounded d-flex justify-content-between align-items-center">
          <h4 className="mb-0 text-start">Detail Pasien</h4>
          <Button
            variant="light"
            className="text-primary fw-bold"
            onClick={handleTambahPasien}
          >
            Tambah Pasien +
          </Button>
        </div>
        
        <Form className="mt-3">
          {/* Form fields implementation */}
           <Row className="mb-3">
            {/* Nama Lengkap */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Nama Lengkap
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.namaLengkap}
                  readOnly
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
                  value={formData.nomorTeleponRumah}
                  readOnly
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
                  value={formData.nomorRekamMedis}
                  readOnly
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
                  value={formData.nomorTeleponSelular}
                  readOnly
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
                <Form.Control type="text" value={formData.nik} readOnly />
              </Form.Group>
            </Col>
            {/* Pendidikan */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary text-start w-100">
                  Pendidikan
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.pendidikan}
                  readOnly
                />
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
                  value={formData.nomorIdentitasLain}
                  readOnly
                />
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
                <Form.Control
                  type="text"
                  value={formData.namaIbuKandung}
                  readOnly
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
                  type="text"
                  value={formData.statusPernikahan}
                  readOnly
                />
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
                  value={formData.tempatLahir}
                  readOnly
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
                  type="text"
                  value={formData.tanggalLahir}
                  readOnly
                />
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
                <Form.Control
                  type="text"
                  value={formData.bahasaDikuasai}
                  readOnly
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
                  type="text"
                  value={formData.jenisKelamin}
                  readOnly
                />
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
                <Form.Control
                  type="text"
                  value={formData.alamatLengkap}
                  readOnly
                />
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
              <Form.Group>
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
                <Form.Control
                  type="text"
                  value={formData.alamatDomisili}
                  readOnly
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
                  value={formData.rtDomisili}
                  readOnly
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
                  value={formData.rwDomisili}
                  readOnly
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
                  value={formData.kelurahanDomisili}
                  readOnly
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
                  value={formData.kecamatanDomisili}
                  readOnly
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
                  value={formData.kabupatenDomisili}
                  readOnly
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
                  value={formData.kodePosDomisili}
                  readOnly
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
                  value={formData.provinsiDomisili}
                  readOnly
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
                  value={formData.negaraDomisili}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button 
              variant="success" 
              onClick={onShowModal}
              disabled={loadingDokter || errorDokter}
            >
              <FaSave /> Daftar Rawat Jalan
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default DetailDataPasien;
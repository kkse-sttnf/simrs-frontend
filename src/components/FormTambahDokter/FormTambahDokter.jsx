import React, { useState } from "react";
import { Container, Card, Form, Row, Col, Button } from "react-bootstrap";
import { FaSave, FaPlus, FaTimes } from "react-icons/fa"; // Tambahkan FaTimes
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const FormTambahDokter = () => {
  const navigate = useNavigate();

  const [dokter, setDokter] = useState({
    namaDokter: "",
    noPegawai: "",
    spesialis: "",
    nomorPraktek: "",
    ruangPraktek: "",
    jadwalPraktek: [
      {
        hariPraktek: "",
        waktuMulai: "",
        waktuSelesai: "",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDokter({
      ...dokter,
      [name]: value,
    });
  };

  const handleChangeJadwal = (index, e) => {
    const { name, value } = e.target;
    const updatedJadwalPraktek = [...dokter.jadwalPraktek];
    updatedJadwalPraktek[index][name] = value;

    setDokter((prevDokter) => ({
      ...prevDokter,
      jadwalPraktek: updatedJadwalPraktek,
    }));
  };

  const handleTambahJadwal = () => {
    setDokter((prevDokter) => ({
      ...prevDokter,
      jadwalPraktek: [
        ...prevDokter.jadwalPraktek,
        {
          hariPraktek: "",
          waktuMulai: "",
          waktuSelesai: "",
        },
      ],
    }));
  };

  const handleHapusJadwal = (index) => {
    if (dokter.jadwalPraktek.length > 1) { // Hanya hapus jika ada lebih dari satu jadwal
      const updatedJadwalPraktek = dokter.jadwalPraktek.filter((_, i) => i !== index);
      setDokter((prevDokter) => ({
        ...prevDokter,
        jadwalPraktek: updatedJadwalPraktek,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmResult = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Pastikan data yang Anda masukkan sudah benar.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await fetch("http://localhost:3001/dokter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dokter),
        });

        if (!response.ok) {
          throw new Error("Gagal menyimpan data dokter.");
        }

        await Swal.fire({
          title: "Sukses!",
          text: "Data dokter berhasil ditambahkan.",
          icon: "success",
          confirmButtonText: "OK",
        });

        navigate("/data-dokter");
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error!",
          text: "Terjadi kesalahan saat menyimpan data dokter.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
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
            {dokter.jadwalPraktek.map((jadwal, index) => (
              <Row className="mb-3" key={index}>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label className="text-primary">Hari Praktek</Form.Label>
                    <Form.Select
                      name="hariPraktek"
                      value={jadwal.hariPraktek}
                      onChange={(e) => handleChangeJadwal(index, e)}
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
                      value={jadwal.waktuMulai}
                      onChange={(e) => handleChangeJadwal(index, e)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label className="text-primary">Waktu Selesai</Form.Label>
                    <Form.Control
                      type="time"
                      name="waktuSelesai"
                      value={jadwal.waktuSelesai}
                      onChange={(e) => handleChangeJadwal(index, e)}
                      required
                    />
                  </Form.Group>
                </Col>
                {/* Tombol Silang Merah untuk Menghapus Jadwal */}
                {dokter.jadwalPraktek.length > 1 && ( // Hanya tampilkan tombol hapus jika ada lebih dari satu jadwal
                  <Col md={1} className="d-flex align-items-end">
                    <Button
                      variant="danger"
                      className="rounded-circle"
                      onClick={() => handleHapusJadwal(index)}
                    >
                      <FaTimes />
                    </Button>
                  </Col>
                )}
                <Col md={1} className="d-flex align-items-end">
                <Button
                  variant="success"
                  className="rounded-circle"
                  onClick={handleTambahJadwal}
                >
                  <FaPlus />
                </Button>
              </Col>
              </Row>
            ))}



            {/* Tombol Simpan */}
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
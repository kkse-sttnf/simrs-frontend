import React, { useState, useEffect } from "react";
import { Container, Card, Form, Row, Col, Button } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { initializeEthers } from "../../utils/ethersProvider";
import { getContract } from "../../utils/doctorContract";

const FormTambahDokter = () => {
  const navigate = useNavigate();
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [dokter, setDokter] = useState({
    namaDokter: "",
    nik: "",
    strNumber: "",
    spesialisasi: "" 
  });

  useEffect(() => {
    const init = async () => {
      try {
        await initializeEthers();
        setIsMetamaskConnected(true);
      } catch (error) {
        console.error("Error initializing Ethers:", error);
        Swal.fire({
          title: "Error!",
          text: "Metamask tidak terdeteksi. Silakan install Metamask terlebih dahulu.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };
    init();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDokter({
      ...dokter,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isMetamaskConnected) {
      Swal.fire({
        title: "Error!",
        text: "Silakan hubungkan Metamask terlebih dahulu.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Apakah Anda yakin?",
      html: `
        <div class="text-left">
          <p><strong>Nama:</strong> ${dokter.namaDokter}</p>
          <p><strong>NIK:</strong> ${dokter.nik}</p>
          <p><strong>Nomor STR:</strong> ${dokter.strNumber}</p>
          ${dokter.spesialisasi ? `<p><strong>Spesialisasi:</strong> ${dokter.spesialisasi}</p>` : ''}
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      setIsProcessing(true);
      try {
        const contract = await getContract();
        
        // Register dokter (tanpa spesialisasi sesuai ABI)
        const txDokter = await contract.registerDoctor(
          dokter.namaDokter,
          dokter.nik,
          dokter.strNumber
          // Spesialisasi dihilangkan karena tidak ada di ABI
        );
        
        await txDokter.wait();
        
        await Swal.fire({
          title: "Sukses!",
          html: `
            <div class="text-left">
              <p><strong>Dokter berhasil didaftarkan</strong></p>
              <p><strong>Nama:</strong> ${dokter.namaDokter}</p>
              ${dokter.spesialisasi ? `<p><strong>Catatan Spesialisasi:</strong> Data spesialisasi disimpan secara lokal saja (tidak tercatat di blockchain)</p>` : ''}
            </div>
          `,
          icon: "success",
          confirmButtonText: "OK",
        });
        
        navigate("/DataDokter");
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error!",
          text: `Terjadi kesalahan saat menyimpan data dokter: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setIsProcessing(false);
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
            {/* Bagian Data Dasar Dokter */}
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
                  <Form.Label className="text-primary">NIK</Form.Label>
                  <Form.Control
                    type="text"
                    name="nik"
                    value={dokter.nik}
                    onChange={handleChange}
                    placeholder="Masukkan NIK"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-primary">Nomor STR</Form.Label>
                  <Form.Control
                    type="text"
                    name="strNumber"
                    value={dokter.strNumber}
                    onChange={handleChange}
                    placeholder="Masukkan Nomor STR"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-primary">Spesialisasi (Opsional - Lokal)</Form.Label>
                  <Form.Control
                    type="text"
                    name="spesialisasi"
                    value={dokter.spesialisasi}
                    onChange={handleChange}
                    placeholder="Hanya disimpan secara lokal"
                  />
                  <Form.Text className="text-muted">
                    Data spesialisasi tidak akan disimpan di blockchain
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {/* Tombol Simpan */}
            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="primary" 
                type="submit"
                disabled={!isMetamaskConnected || isProcessing}
                className="px-4 py-2"
              >
                {isProcessing ? 'Menyimpan...' : (
                  <>
                    <FaSave className="me-2" /> Simpan Data Dokter
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormTambahDokter;
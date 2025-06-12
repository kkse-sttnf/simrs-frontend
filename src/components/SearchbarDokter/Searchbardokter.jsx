import { useState, useEffect } from "react";
import { Form, Col, Button, InputGroup, Row, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { initializeEthers } from "../../utils/ethersProvider";
import { getContract } from "../../utils/doctorContract";

const SearchbarDokter = ({ onSelectDokter }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);

  // Inisialisasi Ethers.js
  useEffect(() => {
    const init = async () => {
      try {
        await initializeEthers();
        setIsMetamaskConnected(true);
      } catch (error) {
        console.error("Error initializing Ethers:", error);
      }
    };
    init();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Input Kosong",
        text: "Silakan masukkan Nama Dokter atau NIK.",
      });
      return;
    }

    if (!isMetamaskConnected) {
      Swal.fire({
        icon: "error",
        title: "Metamask Tidak Terhubung",
        text: "Silakan hubungkan Metamask terlebih dahulu.",
      });
      return;
    }

    setLoading(true);

    try {
      const contract = await getContract();
      const doctorCount = await contract.doctorCount();
      const doctors = [];

      // Cari dokter berdasarkan nama atau NIK
      for (let i = 0; i < doctorCount; i++) {
        const doctor = await contract.doctors(i);
        doctors.push({
          id: doctor.id.toString(),
          namaDokter: doctor.name,
          nik: doctor.nik,
          strNumber: doctor.strNumber,
          spesialisasi: doctor.specialization
        });
      }

      const found = doctors.find(
        (doctor) =>
          doctor.namaDokter.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.nik === searchQuery
      );

      if (found) {
        if (onSelectDokter) {
          onSelectDokter(found);
        } else {
          console.warn("onSelectDokter callback tidak tersedia");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Ditemukan",
          text: "Dokter dengan nama/NIK tersebut tidak ditemukan di blockchain.",
        });
      }
    } catch (error) {
      console.error("Error searching doctor:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message.includes("user rejected") 
          ? "Transaksi ditolak oleh pengguna" 
          : "Gagal mencari data dokter di blockchain",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={12} className="mb-3">
          <Form.Group>
            <InputGroup>
              <Form.Control
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Cari berdasarkan Nama Dokter atau NIK"
                disabled={loading || !isMetamaskConnected}
                className="form-control-lg"
              />
              <Button 
                variant="primary" 
                onClick={handleSearch} 
                disabled={loading || !isMetamaskConnected}
                className="btn-lg"
              >
                {loading ? "Mencari..." : "Cari"}
              </Button>
            </InputGroup>
            {!isMetamaskConnected && (
              <small className="text-danger">
                * Harap hubungkan Metamask terlebih dahulu
              </small>
            )}
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchbarDokter;
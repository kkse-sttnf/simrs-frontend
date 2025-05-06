import { useState } from "react";
import { Form, Col, Button, InputGroup, Row, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { getContract } from "../../utils/outpatientContract";
import axios from "axios";

const SearchBar = ({ onSelectPatient, onSearchStatus }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWallet = async () => {
    try {
      await getContract();
      setIsWalletConnected(true);
      Swal.fire({
        icon: "success",
        title: "Wallet Terhubung",
        text: "Anda sekarang dapat melakukan pencarian pasien",
      });
    } catch (error) {
      console.error("Wallet connection error:", error);
      Swal.fire({
        icon: "error",
        title: "Koneksi Gagal",
        text: error.message || "Gagal menghubungkan wallet",
      });
    }
  };

  const fetchPatientData = async (cid) => {
    try {
      const response = await axios.get(`https://ipfs.io/ipfs/${cid}`, {
        timeout: 10000
      });
      
      if (!response.data) {
        throw new Error("Data pasien tidak valid dari IPFS");
      }

      const patientData = response.data;

      if (!patientData.NIK && !patientData.NomorRekamMedis) {
        throw new Error("Data pasien tidak lengkap");
      }

      return patientData;
    } catch (error) {
      console.error("Error fetching from IPFS:", error);
      throw error;
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Input Kosong",
        text: "Silakan masukkan NIK atau Nomor Rekam Medis.",
      });
      return;
    }

    setLoading(true);
    onSearchStatus({
      loading: true,
      error: null,
      success: false
    });

    try {
      const contract = await getContract();
      
      let cid = await contract.getQueueNumber(searchQuery);
      
      if (!cid || cid === "") {
        cid = await contract.getQueueNumber(searchQuery);
      }

      if (!cid || cid === "") {
        throw new Error("Data pasien tidak ditemukan di blockchain");
      }

      const patientData = await fetchPatientData(cid);
      
      if (typeof onSelectPatient === "function") {
        onSelectPatient(patientData);
      }

    } catch (error) {
      console.error("Search error:", error);
      
      let errorMessage = "Terjadi kesalahan dalam pencarian";
      if (error.message.includes("tidak ditemukan")) {
        errorMessage = "Data tidak ditemukan untuk NIK/NRM tersebut";
      } else if (error.message.includes("MetaMask")) {
        errorMessage = "Silakan hubungkan wallet terlebih dahulu";
        setIsWalletConnected(false);
      }

      onSearchStatus({
        loading: false,
        success: false
      });

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
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
          {!isWalletConnected ? (
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                onClick={connectWallet}
                size="lg"
              >
                Connect Wallet untuk Mencari
              </Button>
            </div>
          ) : (
            <Form.Group>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Masukkan NIK atau Nomor Rekam Medis"
                  disabled={loading}
                  className="form-control-lg"
                />
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  disabled={loading}
                  className="btn-lg"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Mencari...
                    </>
                  ) : (
                    "Search"
                  )}
                </Button>
              </InputGroup>
            </Form.Group>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchBar;
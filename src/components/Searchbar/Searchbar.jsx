import { useState } from "react";
import { Form, Col, Button, InputGroup, Row, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { getContract } from "../../utils/patientContract.js";
import axios from "axios";

const SearchBar = ({ onSelectPatient, onSearchStatus }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [lastSearchedQuery, setLastSearchedQuery] = useState("");

  const showAlert = (icon, title, text) => {
    return Swal.fire({
      icon,
      title,
      text,
      background: 'white',
      backdrop: false,
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
    });
  };

  const showErrorAlert = (error) => {
    let title = "Error";
    let message = "Terjadi kesalahan";

    if (error.message.includes("tidak ditemukan") || error.message.includes("invalid CID")) {
      title = "Data Tidak Ditemukan";
      message = "Data pasien tidak ditemukan. Pastikan NIK/NRM benar.";
    } else if (error.message.includes("MetaMask")) {
      title = "Wallet Error";
      message = "Silakan hubungkan wallet terlebih dahulu";
    } else if (error.message.includes("IPFS")) {
      title = "Data Error";
      message = "Gagal memuat data pasien dari penyimpanan";
    } else if (error.message.includes("input")) {
      title = "Input Invalid";
      message = error.message;
    }

    return showAlert("error", title, message);
  };

  const connectWallet = async () => {
    try {
      await getContract();
      setIsWalletConnected(true);
      await showAlert("success", "Wallet Terhubung", "Anda sekarang dapat melakukan pencarian pasien");
    } catch (error) {
      console.error("Wallet connection error:", error);
      await showErrorAlert(error);
    }
  };

  const fetchPatientData = async (cid) => {
    try {
      const response = await axios.get(`https://sapphire-capitalist-impala-251.mypinata.cloud/ipfs/${cid}`, {
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching from IPFS:", error);
      throw new Error("IPFS Error: Gagal memuat data dari IPFS");
    }
  };

  const validateInput = (input) => {
    const nikRegex = /^\d{16}$/;
    const nrmRegex = /^\d{10}$/;
    
    if (!input.trim()) {
      throw new Error("Silakan masukkan NIK atau Nomor Rekam Medis");
    }
    
    if (!nikRegex.test(input) && !nrmRegex.test(input)) {
      throw new Error("NIK harus 16 digit atau NRM 10 digit angka");
    }
  };

  const handleSearch = async () => {
    if (lastSearchedQuery === searchQuery) return;

    try {
      validateInput(searchQuery);
      
      setLoading(true);
      setLastSearchedQuery(searchQuery);
      onSearchStatus({
        loading: true,
        error: null,
        success: false
      });

      const contract = await getContract();
      // Perubahan disini - sesuaikan dengan return struct dari kontrak
      const patientRecord = await contract.lookup(searchQuery);
      
      if (!isValidCID(patientRecord.cid)) {
        throw new Error("invalid CID: Data tidak ditemukan");
      }

      const patientData = await fetchPatientData(patientRecord.cid);
      
      onSelectPatient(patientData);
      onSearchStatus({
        loading: false,
        error: null,
        success: true
      });
      
      await showAlert("success", "Berhasil", "Data pasien berhasil ditemukan");

    } catch (error) {
      console.error("Search error:", error);
      
      onSearchStatus({
        loading: false,
        error: error.message,
        success: false
      });

      await showErrorAlert(error);
    } finally {
      setLoading(false);
    }
  };
  
  const isValidCID = (cid) => {
    return cid && typeof cid === 'string' && (cid.startsWith("Qm") || cid.startsWith("baf")) && cid.length >= 46;
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
                  placeholder="Masukkan NIK (16 digit) atau Nomor Rekam Medis (10 digit)"
                  disabled={loading}
                  className="form-control-lg"
                />
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  disabled={loading || searchQuery === lastSearchedQuery}
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
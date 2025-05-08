import { useState } from "react";
import { Form, Col, Button, InputGroup, Row, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { getContract } from "../../utils/patientContract.js";
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
      const response = await axios.get(`https://sapphire-capitalist-impala-251.mypinata.cloud/ipfs/${cid}`, {
        timeout: 10000
      });
      
      // if (!response.data) {
      //   throw new Error("Data pasien tidak valid dari IPFS");
      // }

      const patientData = response.data;

      // if (!patientData.NIK && !patientData.NomorRekamMedis) {
      //   throw new Error("Data pasien tidak lengkap");
      // }

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
      
      // Validasi format input
      if (!isValidInput(searchQuery)) {
        throw new Error("Format tidak valid. NIK harus 16 digit atau NRM 10 digit");
      }
  
      // Pencarian di blockchain
      const cid = await contract.lookup(searchQuery);
      console.log("CID dari blockchain:", cid);
  
      // Validasi CID
      if (!cid || cid === "" || !isValidCID(cid)) {
        throw new Error("Data pasien tidak ditemukan (CID tidak valid)");
      }
  
      // Ambil data dari IPFS
      const patientData = await fetchPatientData(cid);
      console.log("Data dari IPFS:", patientData);
  
      // // Validasi data
      // if (!patientData || !patientData.NIK) {
      //   throw new Error("Data pasien tidak lengkap");
      // }
  
      // Kirim data ke parent component
      onSelectPatient(patientData);
      onSearchStatus({
        loading: false,
        error: null,
        success: true
      });
  
    } catch (error) {
      console.error("Search error:", error);
      
      // Handle error messages
      let errorMessage = "Terjadi kesalahan dalam pencarian";
      if (error.message.includes("tidak ditemukan")) {
        errorMessage = "Data pasien tidak ditemukan. Pastikan NIK/NRM yang dimasukkan benar.";
      } else if (error.message.includes("Format CID")) {
        errorMessage = "Format data tidak valid";
      } else if (error.message.includes("MetaMask")) {
        errorMessage = "Silakan hubungkan wallet terlebih dahulu";
        setIsWalletConnected(false);
      } else if (error.message.includes("Gagal memuat")) {
        errorMessage = "Data ditemukan tetapi gagal dimuat";
      }
  
      onSearchStatus({
        loading: false,
        error: errorMessage,
        success: false
      });
  
      Swal.fire({
        icon: "error",
        title: "Pencarian Gagal",
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Validasi format input (NIK 16 digit atau NRM 10 digit)
  const isValidInput = (input) => {
    const nikRegex = /^\d{16}$/;
    const nrmRegex = /^\d{10}$/;
    return nikRegex.test(input) || nrmRegex.test(input);
  };

  // Validasi format CID IPFS
  const isValidCID = (cid) => {
    return cid && (cid.startsWith("Qm") || cid.startsWith("baf")) && cid.length >= 46;
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
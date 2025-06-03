import { useState } from "react";
import { Form, Col, Button, InputGroup, Row, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { getContract } from "../../utils/patientContract.js";
import axios from "axios";

const SearchBar = ({ onSelectPatient, onSearchStatus }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const showPopup = (icon, title, text) => {
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

  const connectWallet = async () => {
    try {
      await getContract();
      setIsWalletConnected(true);
      await showPopup("success", "Wallet Terhubung", "Anda sekarang dapat melakukan pencarian pasien");
    } catch (error) {
      console.error("Wallet connection error:", error);
      await showPopup("error", "Koneksi Gagal", error.message || "Gagal menghubungkan wallet");
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
      throw new Error("Gagal memuat data dari IPFS");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await showPopup("warning", "Input Kosong", "Silakan masukkan NIK atau Nomor Rekam Medis");
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
      
      if (!isValidInput(searchQuery)) {
        await showPopup("error", "Format Invalid", "NIK harus 16 digit atau NRM 10 digit angka");
        return;
      }
  
      // The contract returns a tuple (nik, cid, mrHash)
      const [nik, cid, mrHash] = await contract.lookup(searchQuery);
      console.log("CID dari blockchain:", cid);
  
      if (!cid || cid === "" || !isValidCID(cid)) {
        await showPopup("error", "Data Tidak Ditemukan", "Data pasien tidak ditemukan (CID tidak valid)");
        return;
      }
  
      const patientData = await fetchPatientData(cid);
      console.log("Data dari IPFS:", patientData);
  
      onSelectPatient(patientData);
      onSearchStatus({
        loading: false,
        error: null,
        success: true
      });
  
    } catch (error) {
      console.error("Search error:", error);
      
      let errorMessage = "Terjadi kesalahan dalam pencarian";
      if (error.message.includes("tidak ditemukan")) {
        errorMessage = "Data pasien tidak ditemukan. Pastikan NIK/NRM benar.";
      } else if (error.message.includes("MetaMask")) {
        errorMessage = "Silakan hubungkan wallet terlebih dahulu";
        setIsWalletConnected(false);
      }

      onSearchStatus({
        loading: false,
        error: errorMessage,
        success: false
      });
  
      await showPopup("error", "Pencarian Gagal", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const isValidInput = (input) => {
    const nikRegex = /^\d{16}$/;
    const nrmRegex = /^\d{10}$/;
    return nikRegex.test(input) || nrmRegex.test(input);
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
import React, { useState } from "react";
import { Form, Button, InputGroup, Container, Alert, Spinner, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { getContract as getOutpatientContract } from "../../utils/outpatientContract";
import { getContract as getPatientContract } from "../../utils/patientContract";
import { ethers } from "ethers";

const SearchRawatJalan = ({ onSelectPasien }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Input Kosong",
        text: "Silakan masukkan NIK Pasien yang valid.",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Dapatkan data pasien dari patientContract
      const patientContract = await getPatientContract();
      const patientData = await patientContract.lookup(searchQuery);
      
      // 2. Generate mrHash dari NIK
      const mrHash = ethers.keccak256(ethers.toUtf8Bytes(searchQuery));
      
      // 3. Dapatkan info antrian dari outpatientContract
      const outpatientContract = await getOutpatientContract();
      const queueInfo = await outpatientContract.getQueueInfo(mrHash);
      
      // Validasi apakah pasien memiliki antrian aktif
      if (queueInfo.queueNumber.toString() === "0") {
        throw new Error("Pasien tidak memiliki antrian aktif");
      }

      // Format data pasien untuk ditampilkan
      const formattedPatient = {
        NIK: searchQuery,
        mrHash: mrHash,
        queueNumber: queueInfo.queueNumber.toString(),
        scheduleId: queueInfo.scheduleId.toString(),
        namaPasien: patientData.namaLengkap || `Pasien ${searchQuery}`
      };

      onSelectPasien(formattedPatient);

    } catch (err) {
      console.error("Error pencarian:", err);
      let errorMsg = "Terjadi kesalahan saat mencari data pasien";
      
      if (err.reason) {
        errorMsg = err.reason.replace('execution reverted: ', '');
      } else if (err.message.includes("Pasien tidak memiliki")) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: errorMsg,
      });
      onSelectPasien(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Container className="mb-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h4 className="text-center mb-3">Pencarian Pasien Rawat Jalan</h4>
          
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

          <InputGroup>
            <Form.Control
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Masukkan NIK pasien"
              disabled={loading}
            />
            <Button 
              variant="primary" 
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Mencari...
                </>
              ) : "Cari"}
            </Button>
          </InputGroup>
          <Form.Text className="text-muted">
            Cari berdasarkan NIK untuk melihat antrian aktif
          </Form.Text>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchRawatJalan;
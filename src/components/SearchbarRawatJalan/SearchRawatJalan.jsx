import React, { useState } from "react";
import { Form, Button, InputGroup, Container, Alert, Spinner, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { getContract } from "../../utils/outpatientContract";

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
      const contract = await getContract();
      const [mrHash, queueNumber, scheduleId] = await contract.getQueueInfo(searchQuery);
      
      // Validate queue exists
      if (queueNumber.toString() === "0") {
        throw new Error("Pasien tidak memiliki antrian aktif");
      }

      // Format patient data
      const patientData = {
        NIK: searchQuery,
        mrHash,
        queueNumber: queueNumber.toString(),
        scheduleId: scheduleId.toString(),
        namaPasien: `Pasien ${searchQuery}` // In production, get from contract
      };

      onSelectPasien(patientData);

    } catch (err) {
      console.error("Blockchain error:", err);
      const errorMsg = err.reason?.includes("not in queue") 
        ? "Pasien tidak memiliki antrian aktif" 
        : err.message;
      
      setError(errorMsg);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: errorMsg,
      });
      onSelectPasien(null); // Clear form
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
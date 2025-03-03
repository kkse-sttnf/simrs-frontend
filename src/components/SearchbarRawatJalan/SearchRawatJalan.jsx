import React, { useState } from "react";
import { Form, Col, Button, InputGroup, Row, Container } from "react-bootstrap";
import Swal from "sweetalert2";

const SearchRawatJalan = ({ onSelectPasien }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Input Kosong",
        text: "Silakan masukkan NIK Pasien.",
      });
      return;
    }

    setLoading(true);

    try {
      // Fetch data dari endpoint rawatJalan
      const response = await fetch("http://localhost:3001/rawatJalan");
      if (!response.ok) {
        throw new Error("Gagal mengambil data dari server");
      }

      const data = await response.json();
      const found = data.find((item) => item.NIK === searchQuery);

      if (found) {
        if (onSelectPasien && typeof onSelectPasien === "function") {
          onSelectPasien(found); // Kirim data ke FormRawatJalan
        } else {
          console.error("onSelectPasien is not a function");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Ditemukan",
          text: "Data pasien dengan NIK tersebut tidak ditemukan.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Gagal mengambil data dari server.",
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
                placeholder="Masukkan NIK Pasien"
                disabled={loading}
              />
              <Button variant="primary" onClick={handleSearch} disabled={loading}>
                {loading ? "Mencari..." : "Search"}
              </Button>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchRawatJalan;
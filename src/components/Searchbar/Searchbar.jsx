import { useState } from "react";
import { Form, Col, Button, InputGroup, Row, Container } from "react-bootstrap";
import Swal from "sweetalert2"; // Import SweetAlert2

const SearchBar = ({ onSelectPatient }) => {
  const [nikNrm, setNikNrm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!nikNrm.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Input Kosong",
        text: "Silakan masukkan NIK atau Nomor Rekam Medis.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/pasien");
      if (!response.ok) {
        throw new Error("Gagal mengambil data dari server");
      }

      const data = await response.json();
      const found = data.find(
        (item) => item.NIK === nikNrm || item.NomorRekamMedis === nikNrm
      );

      if (found) {
        if (onSelectPatient && typeof onSelectPatient === "function") {
          onSelectPatient(found);
        } else {
          console.error("onSelectPatient is not a function");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Ditemukan",
          text: "Data pasien dengan NIK/Nomor Rekam Medis tersebut tidak ditemukan.",
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
                value={nikNrm}
                onChange={(e) => setNikNrm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Masukkan NIK atau Nomor Rekam Medis"
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

export default SearchBar;

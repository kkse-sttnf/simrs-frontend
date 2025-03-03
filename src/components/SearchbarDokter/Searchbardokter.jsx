import { useState } from "react";
import { Form, Col, Button, InputGroup, Row, Container } from "react-bootstrap";
import Swal from "sweetalert2";

const SearchbarDokter = ({ onSelectDokter }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Input Kosong",
        text: "Silakan masukkan Nama Dokter atau No Pegawai.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/dokter");
      if (!response.ok) {
        throw new Error("Gagal mengambil data dari server");
      }

      const data = await response.json();
      const found = data.find(
        (item) =>
          item.namaDokter.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.noPegawai === searchQuery
      );

      if (found) {
        if (onSelectDokter && typeof onSelectDokter === "function") {
          onSelectDokter(found);
        } else {
          console.error("onSelectDokter is not a function");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Ditemukan",
          text: "Data dokter dengan Nama Dokter/No Pegawai tersebut tidak ditemukan.",
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
                placeholder="Masukkan Nama Dokter atau No Pegawai"
                disabled={loading}
                className="form-control-lg"
              />
              <Button variant="primary" onClick={handleSearch} disabled={loading} className="btn-lg" >
                {loading ? "Mencari..." : "Search"}
              </Button>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchbarDokter;
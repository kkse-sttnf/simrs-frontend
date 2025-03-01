import { useState } from "react";
import { Form, Col, Button, InputGroup, Row, Container } from "react-bootstrap";
import Swal from "sweetalert2"; // Import SweetAlert2
import data from "../../datapasien.json";

const SearchBar = ({ onSelectPatient }) => {
  const [nikNrm, setNikNrm] = useState("");

  const handleSearch = () => {
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
      // Tampilkan alert jika data tidak ditemukan
      Swal.fire({
        icon: "error",
        title: "Data Tidak Ditemukan",
        text: "Data pasien dengan NIK/Nomor Rekam Medis tersebut tidak ditemukan.",
        confirmButtonText: "OK",
      });
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
              />
              <Button variant="primary" onClick={handleSearch}>
                Search
              </Button>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchBar;
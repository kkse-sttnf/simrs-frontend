import React from "react";
import { Container, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ placeholder, onChange }) => {
  return (
    <Container className="px-4 my-4"> {/* Menyesuaikan dengan FormDataPasien */}
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder={placeholder || "NIK/Nomer Rekam Medis"}
          onChange={onChange}
        />
      </InputGroup>
    </Container>
  );
};

export default SearchBar;

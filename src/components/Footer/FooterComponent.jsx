import React from "react";
import { Container } from "react-bootstrap";

const FooterComponent = () => {
  return (
    <footer className="bg-primary text-white text-center py-3">
      <Container>
        <p className="mb-0">© 2024 SIM RS - Sistem Informasi Manajemen Rumah Sakit</p>
      </Container>
    </footer>
  );
};

export default FooterComponent;

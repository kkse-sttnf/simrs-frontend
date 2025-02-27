import React from "react";
import { Container } from "react-bootstrap";

const FooterComponent = () => {
  return (
    <>
      <footer className="bg-primary text-white text-center py-3 fixed-bottom shadow-lg">
        <Container>
          <p className="mb-0">© 2024 SIM RS - Sistem Informasi Manajemen Rumah Sakit</p>
        </Container>
      </footer>

      {/* Tambahkan div kosong untuk memberi jarak dengan konten */}
      <div style={{ paddingBottom: "50px" }}></div>
    </>
  );
};

export default FooterComponent;

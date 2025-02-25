import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { BsHospital } from "react-icons/bs";

const NavbarComponent = () => {
  return (
    <Navbar expand="lg" className="bg-primary px-3" variant="dark">
      <Container>
        {/* Logo Kiri */}
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          <BsHospital size={28} className="me-2 text-white" />
          <span className="text-white">SIM RS</span>
        </Navbar.Brand>

        {/* Tombol Toggle (Hamburger) */}
        <Navbar.Toggle aria-controls="navbar-content" />

        {/* Isi Navbar */}
        <Navbar.Collapse id="navbar-content">
          {/* Menu Tengah */}
          <Nav className="mx-auto text-center">
            <Nav.Link href="#data-pasien" className="mx-3 text-white">Data Pasien</Nav.Link>
            <Nav.Link href="#data-dokter" className="mx-3 text-white">Data Dokter</Nav.Link>
            <Nav.Link href="#rawat-jalan" className="mx-3 text-white">Rawat Jalan</Nav.Link>
          </Nav>

          {/* Menu Kanan */}
          <Nav className="d-flex align-items-center text-center">
            <span className="d-flex align-items-center text-white mx-2">
              <FaUserCircle size={28} className="me-2" />
              <span>Username</span>
            </span>

            {/* Tombol Logout */}
            <Nav.Link href="#logout" className="d-flex align-items-center ms-3">
              <FaSignOutAlt size={28} className="text-white" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

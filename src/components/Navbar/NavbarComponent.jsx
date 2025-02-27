import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { BsHospital } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username"); 

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="bg-primary px-3" variant="dark">
      <Container>
        {/* Logo Kiri */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <BsHospital size={28} className="me-2 text-white" />
          <span className="text-white">SIM RS</span>
        </Navbar.Brand>

        {/* Tombol Toggle (Hamburger) */}
        <Navbar.Toggle aria-controls="navbar-content" />

        {/* Isi Navbar */}
        <Navbar.Collapse id="navbar-content">
          {/* Menu Tengah */}
          <Nav className="mx-auto text-center">
            <Nav.Link as={Link} to="/DataPasien" className="mx-3 text-white">
              Data Pasien
            </Nav.Link>
            <Nav.Link as={Link} to="/DataDokter" className="mx-3 text-white">
              Data Dokter
            </Nav.Link>
            <Nav.Link as={Link} to="/RawatJalan" className="mx-3 text-white">
              Rawat Jalan
            </Nav.Link>
          </Nav>

          {/* Menu Kanan */}
          <Nav className="d-flex align-items-center text-center">
            <span className="d-flex align-items-center text-white mx-2">
              <FaUserCircle size={28} className="me-2" />
              {username && ( // Tampilkan username jika ada
              <Nav.Item className="text-white me-3 d-flex align-items-center">
                <span>{username}</span>
              </Nav.Item>
            )}
            </span>

            {/* Tombol Logout */}
            <Nav.Link
              onClick={handleLogout}
              className="d-flex align-items-center ms-3"
              style={{ cursor: "pointer" }}
            >
              <FaSignOutAlt size={28} className="text-white" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

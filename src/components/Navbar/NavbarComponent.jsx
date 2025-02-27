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
    <>
      {/* Navbar Fixed */}
      <Navbar expand="lg" fixed="top" className="bg-primary shadow-lg px-3 py-2" variant="dark">
        <Container>
          {/* Logo Kiri */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <BsHospital size={28} className="me-2 text-white" />
            <span className="text-white fw-bold">SIM RS</span>
          </Navbar.Brand>

          {/* Tombol Toggle (Hamburger) */}
          <Navbar.Toggle aria-controls="navbar-content" />

          {/* Isi Navbar */}
          <Navbar.Collapse id="navbar-content">
            {/* Menu Tengah */}
            <Nav className="mx-auto text-center">
              <Nav.Link as={Link} to="/DataPasien" className="mx-3 text-white fw-semibold">
                Data Pasien
              </Nav.Link>
              <Nav.Link as={Link} to="/DataDokter" className="mx-3 text-white fw-semibold">
                Data Dokter
              </Nav.Link>
              <Nav.Link as={Link} to="/RawatJalan" className="mx-3 text-white fw-semibold">
                Rawat Jalan
              </Nav.Link>
            </Nav>

            {/* Menu Kanan */}
            <Nav className="d-flex align-items-center text-center">
              {username && (
                <Nav.Item className="text-white me-3 d-flex align-items-center">
                  <FaUserCircle size={28} className="me-2" />
                  <span className="fw-semibold">{username}</span>
                </Nav.Item>
              )}

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

      {/* Tambahkan div kosong untuk memberi jarak dengan konten */}
      <div style={{ paddingTop: "70px" }}></div>
    </>
  );
};

export default NavbarComponent;

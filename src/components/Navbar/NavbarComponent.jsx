import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { BsHospital } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const walletAddress = sessionStorage.getItem("walletAddress");
  const username = sessionStorage.getItem("username");

  const handleLogout = async () => {
    try {
      // Disconnect MetaMask if available
      if (window.ethereum && window.ethereum.disconnect) {
        await window.ethereum.disconnect();
      }
      
      // Clear session storage
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("walletAddress");
      
      // Show success message
      await Swal.fire({
        title: "Berhasil Logout",
        text: "Anda telah keluar dari sistem dan wallet terputus",
        icon: "success",
        confirmButtonText: "OK",
      });
      
      // Navigate to login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      Swal.fire({
        title: "Error!",
        text: "Gagal memutuskan koneksi wallet",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const confirmLogout = () => {
    Swal.fire({
      title: "Konfirmasi Logout",
      text: "Anda yakin ingin logout dan memutuskan koneksi wallet?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };

  return (
    <>
      {/* Navbar Fixed */}
      <Navbar expand="lg" fixed="top" className="bg-primary px-3 py-2" variant="dark">
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
              {walletAddress && (
                <Nav.Item className="text-white me-3 d-flex align-items-center">
                  <FaUserCircle size={28} className="me-2" />
                  <div className="text-start">
                    {username && <div>{username}</div>}
                    <small className="text-muted">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </small>
                  </div>
                </Nav.Item>
              )}

              {/* Tombol Logout */}
              <Button 
                variant="outline-light" 
                onClick={confirmLogout}
                className="d-flex align-items-center ms-3"
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </Button>
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
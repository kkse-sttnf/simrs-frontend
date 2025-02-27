import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaLock } from "react-icons/fa";
import SecureImage from "../../assets/images/Secure-login.png";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Gunakan useNavigate untuk pindah halaman

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("/users.json");
      
      if (!response.ok) throw new Error("Gagal mengambil data pengguna!");
  
      const users = await response.json();
  
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
  
      if (user) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", user.username);
        alert("Login Berhasil!");
        navigate("/DetailPasien");
      } else {
        alert("Username atau Password salah!");
      }
    } catch (error) {
      console.error("Kesalahan:", error);
      alert("Terjadi kesalahan saat login. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/DetailPasien"); // Redirect ke halaman utama jika sudah login
    }
  }, []);

  return (
    <div className="container-fluid vh-100 vw-100 d-flex p-0">
      {/* Bagian Kiri - Gambar & Text */}
      <div className="col-md-6 bg-primary text-white d-flex flex-column align-items-center justify-content-center text-center p-5">
        <h1 className="fw-bold mb-4">
          Akses informasi dan layanan kesehatan dengan lebih mudah!
        </h1>
        <img src={SecureImage} alt="Secure Login" className="img-fluid" style={{ maxWidth: "60%" }} />
      </div>

      {/* Bagian Kanan - Form Login */}
      <div className="col-md-6 d-flex flex-column align-items-center justify-content-center p-5">
        <form onSubmit={handleLogin} className="w-100" style={{ maxWidth: "400px" }}>
          <h1 className="text-center fw-bold mb-4">Login</h1>

          <div className="mb-3 position-relative">
            <label htmlFor="Username" className="form-label fw-bold">Username</label>
            <div className="input-group">
              <input
                type="text"
                id="Username"
                className="form-control rounded-pill"
                placeholder="Masukan Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span className="input-group-text bg-transparent border-0 position-absolute end-0 me-3">
                <FaUser />
              </span>
            </div>
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="Password" className="form-label fw-bold">Password</label>
            <div className="input-group">
              <input
                type="password"
                id="Password"
                className="form-control rounded-pill"
                placeholder="Masukan Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="input-group-text bg-transparent border-0 position-absolute end-0 me-3">
                <FaLock />
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

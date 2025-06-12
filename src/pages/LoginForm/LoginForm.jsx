import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";
import SecureImage from "../../assets/images/Secure-login.png";
import Swal from "sweetalert2";

const LoginForm = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error(
          "MetaMask tidak terdeteksi. Silakan install ekstensi MetaMask terlebih dahulu."
        );
      }

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (!accounts || accounts.length === 0) {
        throw new Error(
          "Tidak bisa mengakses akun. Pastikan Anda telah login ke MetaMask."
        );
      }

      // Store authentication data
      sessionStorage.setItem("walletAddress", accounts[0]);
      sessionStorage.setItem("isLoggedIn", "true");

      await Swal.fire({
        title: "Berhasil Login!",
        text: `Anda terhubung dengan alamat: ${accounts[0].slice(
          0,
          6
        )}...${accounts[0].slice(-4)}`,
        icon: "success",
        confirmButtonText: "Lanjutkan",
      });

      // Redirect to originally requested page or default
      const redirectPath =
        sessionStorage.getItem("redirectPath") || "/DetailPasien";
      console.log("Redirecting to:", redirectPath); // Debugging
      navigate(redirectPath);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);

      await Swal.fire({
        title: "Gagal Login",
        text: err.message,
        icon: "error",
        confirmButtonText: "Mengerti",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (
      sessionStorage.getItem("isLoggedIn") &&
      sessionStorage.getItem("walletAddress")
    ) {
      const redirectPath =
        sessionStorage.getItem("redirectPath") || "/DetailPasien";
      navigate(redirectPath);
    }
  }, [navigate]);

  return (
    <div className="container-fluid vh-100 vw-100 d-flex p-0">
      {/* Left Side - Image & Text */}
      <div className="col-md-6 bg-primary text-white d-flex flex-column align-items-center justify-content-center text-center p-5">
        <h1 className="fw-bold mb-4">
          Akses informasi dan layanan kesehatan dengan lebih mudah!
        </h1>
        <img
          src={SecureImage}
          alt="Secure Login"
          className="img-fluid"
          style={{ maxWidth: "60%" }}
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="col-md-6 d-flex flex-column align-items-center justify-content-center p-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-3">Login dengan MetaMask</h2>
          <p className="text-muted">
            Sambungkan wallet Anda untuk mengakses sistem
          </p>
        </div>

        <button
          className="btn btn-primary btn-lg px-5 py-3"
          onClick={handleLogin}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Menghubungkan...
            </>
          ) : (
            <>
              <i className="fab fa-ethereum me-2"></i>
              Connect MetaMask
            </>
          )}
        </button>

        {error && (
          <div
            className="alert alert-danger mt-4"
            style={{ maxWidth: "400px" }}
          >
            {error}
          </div>
        )}

        <div className="mt-5 text-center text-muted">
          <small>
            Belum punya MetaMask?{" "}
            <a
              href="https://metamask.io/download.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              Download di sini
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import SecureImage from "../../assets/images/Secure-login.png";
import { initializeEthers } from "../../utils/ethersProvider";

const LoginForm = () => {
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    await initializeEthers();
    navigate("/DetailPasien");
  };

  return (
    <div className="container-fluid vh-100 vw-100 d-flex p-0">
      {/* Bagian Kiri - Gambar & Text */}
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

      {/* Bagian Kanan - Form Login */}
      <div className="col-md-6 d-flex flex-column align-items-center justify-content-center p-5">
        <button
          className="btn btn-outline-primary mb-4"
          onClick={handleLogin}
        >Connect Metamask</button>
      </div>
    </div>
  );
};

export default LoginForm;
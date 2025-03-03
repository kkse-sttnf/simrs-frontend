import React, { useState,useEffect } from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import SearchBar from "../components/Searchbar/Searchbar";
import DetailDataPasien from "../components/DetailPasien/DetailPasienForm";
import Breadcrumbs from "../components/Breadcumbs/Breadcumbs";
import ModalRawatJalan from "../components/ModalRawatJalan/ModalRawatJalan";
import { Button } from "react-bootstrap";

const DetailPasien = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dokter, setDokter] = useState([]);

  // Ambil data dokter dari db.json
  useEffect(() => {
    fetch("http://localhost:3001/dokter")
      .then((response) => response.json())
      .then((data) => setDokter(data))
      .catch((error) => console.error("Error fetching dokter:", error));
  }, []);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleSaveRawatJalan = (data) => {
    console.log("Data rawat jalan disimpan:", data);
    // Lakukan sesuatu dengan data yang disimpan, misalnya refresh daftar rawat jalan
  };

  return (
    <div>
      <NavbarComponent />
      <Breadcrumbs />
      <SearchBar onSelectPatient={handleSelectPatient} />
      <DetailDataPasien selectedPatient={selectedPatient} />
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Daftar Rawat Jalan
      </Button>
      <ModalRawatJalan
        show={showModal}
        handleClose={() => setShowModal(false)}
        selectedPatient={selectedPatient}
        dokter={dokter}
        onSave={handleSaveRawatJalan}
      />
      <FooterComponent />
    </div>
  );
};

export default DetailPasien;
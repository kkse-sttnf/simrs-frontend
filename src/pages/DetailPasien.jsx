import React, { useState, useEffect } from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import SearchBar from "../components/Searchbar/Searchbar";
import DetailDataPasien from "../components/DetailPasien/DetailPasienForm";
import Breadcrumbs from "../components/Breadcumbs/Breadcumbs";
import ModalRawatJalan from "../components/ModalRawatJalan/ModalRawatJalan";


const DetailPasien = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dokter, setDokter] = useState([]);

  // Ambil data dokter dari db.json
  useEffect(() => {
    const fetchDokter = async () => {
      try {
        const response = await fetch("http://localhost:3001/dokter");
        if (!response.ok) {
          throw new Error("Gagal mengambil data dokter.");
        }
        const data = await response.json();
        setDokter(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchDokter();
  }, []);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleSaveRawatJalan = (data) => {
    console.log("Data Rawat Jalan Disimpan:", data);
    // Lakukan sesuatu dengan data yang disimpan, misalnya memperbarui state atau mengirim ke API
  };

  return (
    <div>
      <NavbarComponent />
      <Breadcrumbs />
      <SearchBar onSelectPatient={handleSelectPatient} />
      <DetailDataPasien selectedPatient={selectedPatient} />
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
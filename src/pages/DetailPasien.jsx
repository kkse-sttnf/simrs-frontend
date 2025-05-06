import React, { useState, useEffect } from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import SearchBar from "../components/Searchbar/Searchbar";
import DetailDataPasien from "../components/DetailPasien/DetailPasien";
import Breadcrumbs from "../components/Breadcumbs/Breadcumbs";
import ModalRawatJalan from "../components/ModalRawatJalan/ModalRawatJalan";
import { getContract } from "../utils/doctorContract";

const DetailPasien = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dokter, setDokter] = useState([]);
  const [loadingDokter, setLoadingDokter] = useState(false);
  const [errorDokter, setErrorDokter] = useState(null);
  const [searchStatus, setSearchStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  const fetchDoctorsFromBlockchain = async () => {
    setLoadingDokter(true);
    setErrorDokter(null);
    
    try {
      const contract = await getContract();
      
      try {
        const doctorList = await contract.listOfDoctors();
        
        const formattedDoctors = doctorList.map(doctor => ({
          id: doctor.id.toString(),
          namaDokter: doctor.name,
          nik: doctor.nik,
          nomorPraktek: doctor.strNumber,
          spesialis: doctor.specialty || "Umum",
          ruangPraktek: doctor.room || "Ruang Praktek 1"
        }));
        
        setDokter(formattedDoctors);
      } catch (listError) {
        console.log("Menggunakan fallback doctorCount:", listError);
        
        const doctorCount = await contract.doctorCount();
        const doctors = [];
        
        for (let i = 0; i < doctorCount; i++) {
          const doctor = await contract.doctors(i);
          doctors.push({
            id: doctor.id.toString(),
            namaDokter: doctor.name,
            nik: doctor.nik,
            nomorPraktek: doctor.strNumber,
            spesialis: "Umum",
            ruangPraktek: "Ruang Praktek 1"
          });
        }
        
        setDokter(doctors);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setErrorDokter("Gagal mengambil data dokter dari blockchain. Pastikan wallet terhubung.");
    } finally {
      setLoadingDokter(false);
    }
  };

  useEffect(() => {
    fetchDoctorsFromBlockchain();
  }, []);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchStatus({
      loading: false,
      error: null,
      success: true
    });
  };

  const handleSearchStatus = (status) => {
    setSearchStatus(status);
  };

  const handleSaveRawatJalan = (data) => {
    console.log("Data Rawat Jalan Disimpan:", data);
    setShowModal(false);
  };

  return (
    <div>
      <NavbarComponent />
      <Breadcrumbs />
      <SearchBar 
        onSelectPatient={handleSelectPatient} 
        onSearchStatus={handleSearchStatus}
      />
      
      {searchStatus.loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Mencari data pasien...</p>
        </div>
      )}
      
      {searchStatus.error && (
        <div className="alert alert-danger mx-3">
          {searchStatus.error}
        </div>
      )}

      {loadingDokter && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Memuat data dokter...</p>
        </div>
      )}
      
      {errorDokter && (
        <div className="alert alert-danger mx-3">
          {errorDokter}
          <button 
            className="btn btn-sm btn-warning ms-3"
            onClick={fetchDoctorsFromBlockchain}
          >
            Coba Lagi
          </button>
        </div>
      )}

      <DetailDataPasien 
        selectedPatient={selectedPatient} 
        dokter={dokter}
        loadingDokter={loadingDokter}
        errorDokter={errorDokter}
        onShowModal={() => setShowModal(true)}
        searchStatus={searchStatus}
      />
      
      <ModalRawatJalan
        show={showModal}
        handleClose={() => setShowModal(false)}
        selectedPatient={selectedPatient}
        dokter={dokter}
        loadingDokter={loadingDokter}
        errorDokter={errorDokter}
        onSave={handleSaveRawatJalan}
      />
      
      <FooterComponent />
    </div>
  );
};

export default DetailPasien;
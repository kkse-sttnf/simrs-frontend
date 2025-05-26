import React, { useState, useEffect } from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import SearchBar from "../components/Searchbar/Searchbar";
import DetailDataPasien from "../components/DetailPasien/DetailPasien";
import Breadcrumbs from "../components/Breadcumbs/Breadcumbs";
import ModalRawatJalan from "../components/ModalRawatJalan/ModalRawatJalan";
import { getContract as getDoctorContract } from "../utils/doctorContract";
import { enqueuePatient, getQueueNumber } from "../utils/outpatientContract";
import Swal from "sweetalert2";
import { ethers } from 'ethers';

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
      const contract = await getDoctorContract();
      
      try {
        const doctorList = await contract.listOfDoctors();
        console.log("Raw doctorList from contract.listOfDoctors():", doctorList); // Debugging
        
        const formattedDoctors = doctorList.map(doctor => {
          // Akses properti menggunakan indeks karena kontrak mengembalikan tuple (array-like object)
          // doctor[0] = id (uint256)
          // doctor[1] = name (string)
          // doctor[2] = nik (string)
          // doctor[3] = strNumber (string)
          return {
            id: doctor[0]?.toString() || '', // Pastikan id diubah ke string
            namaDokter: doctor[1] || '',
            nik: doctor[2] || '',
            nomorPraktek: doctor[3] || '',
            spesialis: "Umum", // Properti ini tidak ada di ABI kontrak, jadi gunakan nilai default
            ruangPraktek: "Ruang Praktek 1" // Properti ini tidak ada di ABI kontrak, jadi gunakan nilai default
          };
        });
        
        setDokter(formattedDoctors);
      } catch (listError) {
        console.warn("Error using listOfDoctors, trying fallback with doctorCount:", listError); // Debugging
        
        const doctorCount = await contract.doctorCount();
        const doctors = [];
        
        for (let i = 0; i < doctorCount; i++) {
          const doctor = await contract.doctors(i);
          console.log(`Raw doctor data for index ${i} from contract.doctors(${i}):`, doctor); // Debugging
          
          // Akses properti menggunakan indeks karena kontrak mengembalikan tuple (array-like object)
          // doctor[0] = id (uint256)
          // doctor[1] = name (string)
          // doctor[2] = nik (string)
          // doctor[3] = strNumber (string)
          if (doctor) { // Pastikan objek doctor tidak undefined
            doctors.push({
              id: doctor[0]?.toString() || '', // Pastikan id diubah ke string
              namaDokter: doctor[1] || '',
              nik: doctor[2] || '',
              nomorPraktek: doctor[3] || '',
              spesialis: "Umum", // Properti ini tidak ada di ABI kontrak, jadi gunakan nilai default
              ruangPraktek: "Ruang Praktek 1" // Properti ini tidak ada di ABI kontrak, jadi gunakan nilai default
            });
          } else {
            console.warn(`Doctor data for index ${i} was undefined.`);
          }
        }
        
        setDokter(doctors);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setErrorDokter("Failed to fetch doctors. Please ensure your wallet is connected.");
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

  const handleSaveRawatJalan = async (data) => {
    try {
      Swal.fire({
        title: 'Processing Registration',
        html: 'Saving data to blockchain...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      // Create medical record hash from NIK
      const mrHash = ethers.keccak256(ethers.toUtf8Bytes(data.NIK));
      
      // Convert schedule text to ID (e.g., "Senin" -> 1)
      const scheduleId = convertJadwalToId(data.jadwalDokter);
      
      // Save to blockchain
      await enqueuePatient(mrHash, scheduleId);
      
      // Get queue number
      const queueNumber = await getQueueNumber(mrHash);

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        html: `
          <div>
            <p>Your outpatient registration has been saved to the blockchain</p>
            <p><strong>Queue Number:</strong> ${queueNumber.toString()}</p>
            <p><strong>Schedule:</strong> ${data.jadwalDokter}</p>
            <p><strong>Doctor:</strong> ${data.namaDokter}</p>
          </div>
        `,
        confirmButtonText: 'Close'
      });

      setShowModal(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        html: `
          <div>
            <p>Error during registration:</p>
            <p><code>${error.message || 'Unknown error'}</code></p>
          </div>
        `
      });
      return false;
    }
  };

  // Helper function to convert schedule text to ID
  const convertJadwalToId = (jadwalText) => {
    const dayMap = {
      'senin': 1,
      'selasa': 2,
      'rabu': 3,
      'kamis': 4,
      'jumat': 5,
      'sabtu': 6,
      'minggu': 7
    };

    const lowerJadwal = jadwalText.toLowerCase();
    for (const [day, id] of Object.entries(dayMap)) {
      if (lowerJadwal.includes(day)) {
        return id;
      }
    }
    return 0;
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
          <p>Searching patient data...</p>
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
          <p>Loading doctor data...</p>
        </div>
      )}
      
      {errorDokter && (
        <div className="alert alert-danger mx-3">
          {errorDokter}
          <button 
            className="btn btn-sm btn-warning ms-3"
            onClick={fetchDoctorsFromBlockchain}
          >
            Try Again
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

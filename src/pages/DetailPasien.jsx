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

  // Fungsi untuk mengambil data dokter dari blockchain
 const fetchDoctorsFromBlockchain = async () => {
    setLoadingDokter(true);
    setErrorDokter(null);
    
    try {
      const contract = await getDoctorContract();
      
      try {
        const doctorList = await contract.listOfDoctors();
        console.log("Raw doctorList from contract.listOfDoctors():", doctorList); 
        
        const formattedDoctors = doctorList.map(doctor => {
          return {
            id: doctor[0]?.toString() || '', 
            namaDokter: doctor[1] || '',
            nik: doctor[2] || '',
            nomorPraktek: doctor[3] || '',
            spesialis: "Umum", 
            ruangPraktek: "Ruang Praktek 1" 
          };
        });
        
        setDokter(formattedDoctors);
      } catch (listError) {
        console.warn("Error using listOfDoctors, trying fallback with doctorCount:", listError); 
        
        const doctorCount = await contract.doctorCount();
        const doctors = [];
        
        for (let i = 0; i < doctorCount; i++) {
          const doctor = await contract.doctors(i);
          console.log(`Raw doctor data for index ${i} from contract.doctors(${i}):`, doctor); 
          
          if (doctor) { 
            doctors.push({
              id: doctor[0]?.toString() || '',
              namaDokter: doctor[1] || '',
              nik: doctor[2] || '',
              nomorPraktek: doctor[3] || '',
              spesialis: "Umum", 
              ruangPraktek: "Ruang Praktek 1" 
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

  // Fungsi untuk menyimpan data rawat jalan
  const handleSaveRawatJalan = async (registrationData) => {
    try {
      const { patient, doctor, schedule } = registrationData;
      
      Swal.fire({
        title: 'Memproses Pendaftaran',
        html: 'Menyimpan data ke blockchain...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      // Generate hash dari NIK pasien
      const mrHash = ethers.keccak256(ethers.toUtf8Bytes(patient.nik));
      const scheduleId = convertJadwalToId(schedule);
      
      // Kirim transaksi ke blockchain
      const tx = await enqueuePatient(mrHash, scheduleId);
      await tx.wait(); // Tunggu konfirmasi transaksi
      
      // Dapatkan nomor antrian
      const queueNumber = await getQueueNumber(mrHash);

      Swal.fire({
        icon: 'success',
        title: 'Pendaftaran Berhasil!',
        html: `
          <div>
            <p>Pendaftaran rawat jalan telah disimpan di blockchain</p>
            <p><strong>Nomor Antrian:</strong> ${queueNumber.toString()}</p>
            <p><strong>Pasien:</strong> ${patient.namaLengkap}</p>
            <p><strong>Jadwal:</strong> ${schedule}</p>
            <p><strong>Dokter:</strong> ${doctor.namaDokter}</p>
            <small>Transaksi: ${tx.hash.slice(0, 10)}...</small>
          </div>
        `,
        confirmButtonText: 'Tutup'
      });

      setShowModal(false);
      return true;
    } catch (error) {
      console.error('Error pendaftaran:', error);
      
      let errorMessage = 'Terjadi kesalahan saat mendaftarkan pasien';
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaksi dibatalkan oleh pengguna';
      } else if (error.reason) {
        errorMessage = error.reason.replace('execution reverted: ', '');
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Pendaftaran Gagal',
        html: `
          <div>
            <p>${errorMessage}</p>
            ${error.data?.message ? `<p><small>${error.data.message}</small></p>` : ''}
          </div>
        `
      });
      return false;
    }
  };

  // Konversi teks jadwal ke ID
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
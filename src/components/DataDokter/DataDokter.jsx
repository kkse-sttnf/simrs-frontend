import React, { useState, useEffect, useCallback } from "react";
import { Container, Card, Form, Button, Table, Modal, Alert, Spinner } from "react-bootstrap";
import { FaPlus, FaTrash, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { getContract } from "../../utils/doctorContract";

const ListDokter = () => {
  // State Management
  const [state, setState] = useState({
    listDokter: [],
    loading: false,
    searchQuery: "",
    showDeleteModal: false,
    dokterToDelete: null,
    deleting: false,
    error: null,
    success: null,
    walletAddress: "",
    isWalletConnecting: false
  });

  const navigate = useNavigate();

  // Helper functions
  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetModalState = () => {
    updateState({ 
      showDeleteModal: false,
      dokterToDelete: null,
      error: null,
      success: null 
    });
  };

  // Error parser for wallet operations
  const parseWalletError = (error) => {
    if (error.code === 'UNSUPPORTED_OPERATION' || error.message.includes('UNSUPPORTED_OPERATION')) {
      return 'Operasi tidak didukung. Pastikan: 1) Wallet terhubung, 2) Network benar, 3) Kontrak tersedia';
    }
    return error.message;
  };

  // Error parser for contract operations
  const parseContractError = (error) => {
    if (!error) return "Terjadi kesalahan yang tidak diketahui";
    
    if (error.message.includes('getSigner')) {
      return "Wallet belum terhubung. Silakan hubungkan wallet terlebih dahulu.";
    }
    
    if (error.code === 'UNSUPPORTED_OPERATION' || error.message.includes('UNSUPPORTED_OPERATION')) {
      return 'Operasi kontrak tidak didukung. Pastikan: 1) Fungsi tersedia di kontrak, 2) Anda memiliki izin, 3) Parameter benar';
    }
    
    const errorMap = {
      'ACTION_REJECTED': 'Transaksi dibatalkan pengguna',
      'CALL_EXCEPTION': 'Anda tidak memiliki izin untuk operasi ini',
      'INSUFFICIENT_FUNDS': 'Saldo tidak cukup untuk biaya gas',
      'NETWORK_ERROR': 'Masalah jaringan. Silakan coba lagi.'
    };

    if (error.reason) return error.reason;
    if (error.data?.message) return error.data.message;

    return errorMap[error.code] || error.message || "Terjadi kesalahan saat memproses permintaan";
  };

  // Doctor data functions
  const fetchDoctors = useCallback(async () => {
    if (!state.walletAddress) {
      updateState({ error: "Wallet belum terhubung" });
      return;
    }
    
    updateState({ loading: true, error: null });
    
    try {
      const contract = await getContract();
      if (!contract) {
        throw new Error("Kontrak tidak dapat diinisialisasi");
      }

      let doctors = [];
      try {
        // Try using listOfDoctors first
        const doctorList = await contract.listOfDoctors();
        doctors = doctorList.map(doctor => ({
          id: doctor.id.toString(),
          namaDokter: doctor.name,
          nik: doctor.nik,
          strNumber: doctor.strNumber,
          spesialisasi: "-" // Not available in ABI
        }));
      } catch (error) {
        console.log("Falling back to doctorCount method:", error);
        // Fallback to doctorCount if listOfDoctors fails
        const doctorCount = await contract.doctorCount();
        for (let i = 0; i < doctorCount; i++) {
          const doctor = await contract.doctors(i);
          doctors.push({
            id: doctor.id.toString(),
            namaDokter: doctor.name,
            nik: doctor.nik,
            strNumber: doctor.strNumber,
            spesialisasi: "-" // Not available in ABI
          });
        }
      }

      updateState({ listDokter: doctors });
    } catch (err) {
      console.error("Error loading doctors:", err);
      updateState({ 
        error: parseContractError(err)
      });
    } finally {
      updateState({ loading: false });
    }
  }, [state.walletAddress]);

  // Wallet connection with proper error handling
  const connectWallet = async () => {
    updateState({ isWalletConnecting: true, error: null });
    
    try {
      if (!window.ethereum) {
        throw new Error("UNSUPPORTED_OPERATION: Silakan install MetaMask terlebih dahulu");
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (!accounts || accounts.length === 0) {
        throw new Error("Tidak bisa mengakses akun wallet");
      }
      
      updateState({ 
        walletAddress: accounts[0],
        success: "Wallet berhasil terhubung",
        isWalletConnecting: false
      });
      
      await fetchDoctors();
    } catch (err) {
      console.error("Error connecting wallet:", err);
      updateState({ 
        error: parseWalletError(err),
        isWalletConnecting: false 
      });
    }
  };

  // Delete doctor function with proper state update
  const handleDeleteDokter = async () => {
    if (!state.dokterToDelete) {
      updateState({ error: "Data dokter tidak valid" });
      return;
    }
    
    if (!state.walletAddress) {
      updateState({ error: "Silakan hubungkan wallet terlebih dahulu" });
      return;
    }

    updateState({ 
      deleting: true,
      error: null,
      success: null 
    });

    try {
      const contract = await getContract();
      if (!contract) {
        throw new Error("Kontrak tidak dapat diinisialisasi");
      }
      
      if (!contract.deleteDoctor) {
        throw new Error("Fungsi deleteDoctor tidak tersedia di kontrak");
      }
      
      // Kirim transaksi penghapusan
      const tx = await contract.deleteDoctor(state.dokterToDelete.id);
      
      updateState({
        success: `Transaksi dikirim. Menunggu konfirmasi... (Hash: ${tx.hash.slice(0, 8)}...)`
      });

      // Tunggu konfirmasi transaksi
      const receipt = await tx.wait(1);
      
      if (receipt.status === 1) {
        // Transaksi berhasil, update state
        updateState(prev => ({
          success: `Dokter ${state.dokterToDelete.namaDokter} berhasil dihapus!`,
          listDokter: prev.listDokter.filter(d => d.id !== state.dokterToDelete.id)
        }));
        
        resetModalState();
      } else {
        throw new Error("Transaksi gagal diproses di blockchain");
      }
    } catch (err) {
      console.error("Error in handleDeleteDokter:", err);
      updateState({ 
        error: parseContractError(err) 
      });
    } finally {
      updateState({ deleting: false });
    }
  };

  // Search and filter
  const filteredDokter = state.listDokter.filter(dokter => 
    dokter.namaDokter.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    dokter.nik.includes(state.searchQuery) ||
    dokter.strNumber.includes(state.searchQuery) ||
    dokter.spesialisasi.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  // Effects
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.walletAddress) {
        fetchDoctors();
      }
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [state.walletAddress, fetchDoctors]);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_accounts", []);
          if (accounts.length > 0) {
            updateState({ walletAddress: accounts[0] });
            await fetchDoctors();
          }
        } catch (err) {
          console.error("Error checking wallet connection:", err);
        }
      }
    };
    
    checkWalletConnection();
    
    const handleAccountsChanged = (accounts) => {
      updateState({ 
        walletAddress: accounts[0] || "",
        success: accounts[0] ? "Wallet terhubung" : null
      });
      if (accounts[0]) fetchDoctors();
    };
    
    window.ethereum?.on('accountsChanged', handleAccountsChanged);
    
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [fetchDoctors]);

  // Event listener for DoctorDeleted event
  useEffect(() => {
    if (!state.walletAddress) return;

    let contract;
    const setupEventListeners = async () => {
      try {
        contract = await getContract();
        const filter = contract.filters.DoctorDeleted();
        
        contract.on(filter, (id) => {
          console.log(`Dokter dengan ID ${id} dihapus`);
          // Update state jika ada perubahan dari blockchain
          updateState(prev => ({
            listDokter: prev.listDokter.filter(d => d.id !== id)
          }));
        });
      } catch (err) {
        console.error("Error setting up event listeners:", err);
      }
    };

    setupEventListeners();

    return () => {
      if (contract) {
        contract.removeAllListeners();
      }
    };
  }, [state.walletAddress]);

  // Render functions
  const renderDeleteModal = () => (
    <Modal show={state.showDeleteModal} onHide={resetModalState}>
      <Modal.Header closeButton>
        <Modal.Title>Konfirmasi Penghapusan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Anda akan menghapus dokter berikut:</p>
        <ul>
          <li>Nama: <strong>{state.dokterToDelete?.namaDokter}</strong></li>
          <li>NIK: <strong>{state.dokterToDelete?.nik}</strong></li>
          <li>STR: <strong>{state.dokterToDelete?.strNumber}</strong></li>
        </ul>
        <p className="text-danger">Aksi ini tidak dapat dibatalkan!</p>
        
        {state.error && (
          <Alert variant="danger" className="mt-3">
            {state.error}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={resetModalState} disabled={state.deleting}>
          Batal
        </Button>
        <Button variant="danger" onClick={handleDeleteDokter} disabled={state.deleting}>
          {state.deleting ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span className="ms-2">Menghapus...</span>
            </>
          ) : "Ya, Hapus"}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderWalletButton = () => {
    if (state.isWalletConnecting) {
      return (
        <Button variant="warning" disabled>
          <Spinner as="span" animation="border" size="sm" className="me-2" />
          Menghubungkan...
        </Button>
      );
    }
    
    return !state.walletAddress ? (
      <Button variant="warning" onClick={connectWallet}>
        <FaInfoCircle className="me-1" /> Connect Wallet
      </Button>
    ) : (
      <>
        <Form.Control
          type="text"
          placeholder="Cari dokter..."
          className="me-2"
          style={{ width: "200px" }}
          value={state.searchQuery}
          onChange={(e) => updateState({ searchQuery: e.target.value })}
        />
        <Button
          variant="light"
          className="text-primary fw-bold"
          onClick={() => navigate("/DataDokter/TambahDokter")}
        >
          <FaPlus className="me-1" /> Tambah Dokter
        </Button>
      </>
    );
  };

  const renderStatusAlerts = () => (
    <>
      {state.error && (
        <Alert variant="danger" onClose={() => updateState({ error: null })} dismissible>
          {state.error}
        </Alert>
      )}
      
      {state.success && (
        <Alert variant="success" onClose={() => updateState({ success: null })} dismissible>
          {state.success}
        </Alert>
      )}
    </>
  );

  const renderDoctorsTable = () => (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nama Dokter</th>
          <th>NIK</th>
          <th>Nomor STR</th>
          <th>Spesialisasi</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {filteredDokter.length > 0 ? (
          filteredDokter.map((dokter) => (
            <tr key={dokter.id}>
              <td>{dokter.namaDokter}</td>
              <td>{dokter.nik}</td>
              <td>{dokter.strNumber}</td>
              <td>{dokter.spesialisasi}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/DataDokter/DetailDokter/${dokter.id}`, { 
                      state: { dokter } 
                    })}
                  >
                    Detail
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => updateState({ 
                      dokterToDelete: dokter,
                      showDeleteModal: true 
                    })}
                    disabled={!state.walletAddress}
                    title={!state.walletAddress ? "Hubungkan wallet untuk menghapus" : ""}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-4">
              {state.searchQuery
                ? "Tidak ditemukan dokter yang sesuai"
                : state.walletAddress 
                  ? "Tidak ada data dokter" 
                  : "Hubungkan wallet untuk melihat data dokter"}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );

  return (
    <Container className="my-4">
      {renderDeleteModal()}

      <Card className="shadow">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Daftar Dokter</h4>
          <div className="d-flex align-items-center gap-2">
            {renderWalletButton()}
          </div>
        </Card.Header>
        
        <Card.Body>
          {renderStatusAlerts()}

          {state.loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Memuat data dokter...</p>
            </div>
          ) : renderDoctorsTable()}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ListDokter;
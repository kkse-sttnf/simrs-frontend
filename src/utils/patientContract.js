import { ethers } from 'ethers';

const contractAddress = process.env.REACT_APP_PATIENT_CONTRACT_ADDRESS;
const contractAbi = 
[
  'event PatientRegistered(string cid, string nik, string mrHash)',
  'function lookup(string query) view returns ((string nik, string cid, string mrHash))',
  'function savePatientData(string nik, string cid)'
]

let contractInstance = null;

const provider = new ethers.BrowserProvider(window.ethereum);
provider.on("debug", (data) => console.log("Provider Debug:", data));

export const getContract = async () => {
    if (!window.ethereum) {
        throw new Error('Aplikasi memerlukan MetaMask. Pastikan Anda sudah login.');
    }

    if (contractInstance) {
        return contractInstance;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        return contractInstance;
    } catch (error) {
        console.error('Gagal menginisialisasi kontrak:', error);
        throw new Error('Gagal terhubung dengan kontrak. Pastikan Anda sudah login dengan MetaMask.');
    }
};

// Fungsi untuk reset kontrak (misal saat logout)
export const resetContract = () => {
    contractInstance = null;
};
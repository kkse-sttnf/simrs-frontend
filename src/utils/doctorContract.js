import { ethers } from 'ethers';

const contractAddress = process.env.REACT_APP_DOCTOR_CONTRACT_ADDRESS;
const contractAbi = [
  'event DoctorDeleted(uint256)',
  'event DoctorRegistered(uint256,string,string,string)',
  'event ScheduleDeleted(uint256)',
  'event ScheduleRegistered(uint256,uint256,uint8,string,string,string)',
  'function deleteDoctor(uint256)',
  'function deleteSchedule(uint256)',
  'function doctorCount() view returns (uint256)',
  'function doctors(uint256) view returns (uint256,string,string,string)',
  'function getDoctorSchedules(uint256) view returns ((uint256,uint256,uint8,string,string,string)[])',
  'function listOfDoctors() view returns ((uint256,string,string,string)[])',
  'function listOfSchedules() view returns ((uint256,uint256,uint8,string,string,string)[])',
  'function registerDoctor(string,string,string)',
  'function registerSchedule(uint256,uint8,string,string,string)',
  'function scheduleCount() view returns (uint256)',
  'function schedules(uint256) view returns (uint256,uint256,uint8,string,string,string)'
]

let contractInstance = null;

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
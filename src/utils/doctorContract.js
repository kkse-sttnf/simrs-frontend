import { ethers } from 'ethers';

const contractAddress = '0x12bfa29c82453f4ba290f090d1af8350b44f5cd0';
const contractAbi = [
    'event DoctorDeleted(string id)',
    'event DoctorRegistered(uint256 id, string name, string nik, string strNumber)',
    'event ScheduleDeleted(uint256 id)',
    'event ScheduleRegistered(uint256 id, uint256 doctorId, uint8 day, string start, string end, string room)',
    'function deleteDoctor(string id)',
    'function deleteSchedule(uint256 id)',
    'function doctorCount() view returns (uint256)',
    'function doctors(uint256) view returns (uint256 id, string name, string nik, string strNumber)',
    'function getDoctorSchedules(uint256 doctorId) view returns ((uint256 id, uint256 doctorId, uint8 day, string start, string end, string room)[])',
    'function listOfDoctors() view returns ((uint256 id, string name, string nik, string strNumber)[])',
    'function listOfSchedules() view returns ((uint256 id, uint256 doctorId, uint8 day, string start, string end, string room)[])',
    'function registerDoctor(string name, string nik, string strNumber)',
    'function registerSchedule(uint256 doctorId, uint8 day, string start, string end, string room)',
    'function scheduleCount() view returns (uint256)',
    'function schedules(uint256) view returns (uint256 id, uint256 doctorId, uint8 day, string start, string end, string room)'
];

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
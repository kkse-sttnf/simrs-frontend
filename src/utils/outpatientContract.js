import { ethers } from 'ethers';


const contractAddress = '0xAb21c2cE155D7090b3DB8eca6e629309b852b4C7';
const contractAbi = [
    'event PatientEnqueued(string mrHash, uint256 scheduleId, uint256 queueNumber)',
    'function enqueue(string mrHash, uint256 scheduleId)',
    'function getQueueNumber(string mrHash) view returns (uint256)',
    'function mrHashToQueueNumber(string) view returns (uint256)',
    'function mrHashToScheduleId(string) view returns (uint256)',
    'function scheduleIdToCounter(uint256) view returns (uint256)'
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
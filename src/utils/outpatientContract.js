import { ethers } from 'ethers';

const contractAddress = '0xD621CDd49B5E21b235e0E87bef92703adf901b4c';
const contractAbi = [
  'event PatientDequeued(string mrHash)',
  'event PatientEnqueued(string mrHash, uint256 scheduleId, uint256 queueNumber)',
  'function dequeue(string mrHash)',
  'function enqueue(string mrHash, uint256 scheduleId)',
  'function getQueueInfo(string mrHash) view returns ((string mrHash, uint256 scheduleId, uint256 queueNumber))',
  'function mrHashToQueueNumber(string) view returns (uint256)',
  'function mrHashToScheduleId(string) view returns (uint256)',
  'function scheduleIdToCounter(uint256) view returns (uint256)'
];

let contractInstance = null;

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
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
    console.error('Contract initialization error:', error);
    throw new Error('Failed to connect to contract. Please ensure you are connected to the correct network.');
  }
};

export const resetContract = () => {
  contractInstance = null;
};

// Fungsi untuk mendaftarkan pasien
export const enqueuePatient = async (mrHash, scheduleId) => {
  try {
    const contract = await getContract();
    const tx = await contract.enqueue(mrHash, scheduleId);
    return tx;
  } catch (error) {
    console.error('Error enqueueing patient:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan nomor antrian
export const getQueueNumber = async (mrHash) => {
  try {
    const contract = await getContract();
    const queueNumber = await contract.mrHashToQueueNumber(mrHash);
    return queueNumber;
  } catch (error) {
    console.error('Error getting queue number:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan info antrian
export const getQueueInfo = async (mrHash) => {
  try {
    const contract = await getContract();
    const queueInfo = await contract.getQueueInfo(mrHash);
    return {
      mrHash: queueInfo.mrHash,
      scheduleId: queueInfo.scheduleId,
      queueNumber: queueInfo.queueNumber
    };
  } catch (error) {
    console.error('Error getting queue info:', error);
    throw error;
  }
};

export { contractAbi };
import { ethers } from 'ethers';

const contractAddress = '0xD621CDd49B5E21b235e0E87bef92703adf901b4c';
const contractAbi = [
  'event PatientDequeued(string)',
  'event PatientEnqueued(string,uint256,uint256)',
  'function dequeue(string)',
  'function enqueue(string,uint256)',
  'function getQueueInfo(string) view returns ((string,uint256,uint256))',
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

export const enqueuePatient = async (mrHash, scheduleId) => {
  const contract = await getContract();
  const tx = await contract.enqueue(mrHash, scheduleId);
  return tx;
};

// Fungsi yang diperbaiki - menggunakan mrHashToQueueNumber sesuai ABI
export const getQueueNumber = async (mrHash) => {
  const contract = await getContract();
  try {
    const queueNum = await contract.mrHashToQueueNumber(mrHash);
    return Number(queueNum.toString());
  } catch (error) {
    console.error("Error getting queue number:", error);
    return 0;
  }
};

// Fungsi tambahan untuk mendapatkan info lengkap antrian
export const getQueueInfo = async (mrHash) => {
  const contract = await getContract();
  try {
    const [exists, queueNum, scheduleId] = await contract.getQueueInfo(mrHash);
    return {
      isRegistered: exists,
      queueNumber: Number(queueNum.toString()),
      scheduleId: Number(scheduleId.toString())
    };
  } catch (error) {
    console.error("Error getting queue info:", error);
    return {
      isRegistered: false,
      queueNumber: 0,
      scheduleId: 0
    };
  }
};

export { contractAbi };
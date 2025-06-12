  import { ethers } from 'ethers';

  const CONTRACT_ADDRESS = '0xD621CDd49B5E21b235e0E87bef92703adf901b4c';
  const CONTRACT_ABI = [
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
  const activeListeners = new Map();

  export const getContract = async () => {
    if (!window.ethereum) throw new Error('MetaMask not installed');
    
    if (!contractInstance) {
      // PERBAIKAN: Inisialisasi provider dengan benar
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Set polling interval setelah provider dibuat
      provider.pollingInterval = 1000000;
      
      const signer = await provider.getSigner();
      contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }
    
    return contractInstance;
  };

  export const setupEventListener = async (callback) => {
    try {
      const contract = await getContract();
      const listenerId = Symbol('listener');
      
      const handler = (...args) => callback(...args);
      contract.on("PatientEnqueued", handler);
      
      activeListeners.set(listenerId, {
        contract,
        handler,
        event: "PatientEnqueued"
      });
      
      return () => {
        if (activeListeners.has(listenerId)) {
          const { contract, handler, event } = activeListeners.get(listenerId);
          contract.off(event, handler);
          activeListeners.delete(listenerId);
        }
      };
    } catch (error) {
      console.error('Error setting up listener:', error);
      throw error;
    }
  };

  export const cleanupAllListeners = async () => {
    for (const [{ contract, handler, event }] of activeListeners) {
      contract.off(event, handler);
    }
    activeListeners.clear();
  };

  export const enqueuePatient = async (mrHash, scheduleId) => {
    const contract = await getContract();
    return await contract.enqueue(mrHash, scheduleId);
  };

  export const getQueueNumber = async (mrHash) => {
    const contract = await getContract();
    const queueNumber = await contract.mrHashToQueueNumber(mrHash);
    return Number(queueNumber);
  };

  export const getQueueInfo = async (mrHash) => {
    const contract = await getContract();
    const info = await contract.getQueueInfo(mrHash);
    return {
      mrHash: info.mrHash,
      scheduleId: Number(info.scheduleId),
      queueNumber: Number(info.queueNumber)
    };
  };

  export { CONTRACT_ABI };
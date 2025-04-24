import { getProvider } from './ethersProvider';
import { Contract } from 'ethers';

const contractAddress = '0xAb21c2cE155D7090b3DB8eca6e629309b852b4C7';
const contractAbi = [
    'event PatientEnqueued(string mrHash, uint256 scheduleId, uint256 queueNumber)',
    'function enqueue(string mrHash, uint256 scheduleId)',
    'function getQueueNumber(string mrHash) view returns (uint256)',
    'function mrHashToQueueNumber(string) view returns (uint256)',
    'function mrHashToScheduleId(string) view returns (uint256)',
    'function scheduleIdToCounter(uint256) view returns (uint256)'
]

let contract = null;

export const getContract = async () => {
    if (!contract) {
        const provider = getProvider();
        const signer = await provider.getSigner();
        contract = new Contract(contractAddress, contractAbi, signer);
    }

    return contract;
}
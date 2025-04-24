import { getProvider } from './ethersProvider';
import { Contract } from 'ethers';

const contractAddress = '0x134D41f5C53340f8705A5a5e430b5a867704f502';
const contractAbi = [
    'event PatientRegistered(string cid, string nik, string mrHash)',
    'function lookup(string query) view returns (string)',
    'function savePatientData(string nik, string cid)'
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
import { getProvider } from './ethersProvider';
import { Contract } from 'ethers';

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
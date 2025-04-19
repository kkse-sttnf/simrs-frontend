import {ethers} from 'ethers'

let provider = null;
let signer = null;

export const initializeEthers = async() => {
    if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
    } else {
        throw new Error("Metamask is not installed");
    }
}

export const getProvider = () => {
    return provider;
}

export const getSigner = () => {
    return signer;
}
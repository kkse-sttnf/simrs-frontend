import {ethers} from 'ethers'

let provider = null;

export const initializeEthers = async() => {
    if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
    } else {
        throw new Error("Metamask is not installed");
    }
}

export const getProvider = () => {
    return provider;
}
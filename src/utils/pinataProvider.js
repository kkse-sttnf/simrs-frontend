import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
    pinataJwt: process.env.REACT_APP_PINATA_JWT,
    pinataGateway: process.env.REACT_APP_PINATA_GATEWAY
})

export const getPinata = () => {
    return pinata;
}
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
    pinataJwt: process.env.REACT_APP_PINATA_JWT,
    pinataGateway: process.env.REACT_APP_PINATA_GATEWAY
})

export const getPinata = () => {
    console.log(process.env.REACT_APP_PINATA_GATEWAY)
    console.log(process.env.REACT_APP_PINATA_JWT)
    return pinata;
}

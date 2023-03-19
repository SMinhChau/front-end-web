import AES from "crypto-js/aes";
import CryptoJS from 'crypto-js'
import Config from "./config";

const Crypto = {
    /* Encrypting the data using AES encryption. */
    encrypt: (data: string) => {
        return AES.encrypt(JSON.stringify(data), Config.COLUMN_KEY).toString();
    },
    /* Decrypting the data using AES encryption. */
    decrypt: (encrypted: string) => {
        try {
            const bytes = AES.decrypt(encrypted, Config.COLUMN_KEY);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (error) {
            return false;            
        }
    },
};
export default Crypto;

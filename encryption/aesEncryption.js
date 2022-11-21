const crypto = require('crypto');

const CIPHER_ALGORITHM = 'aes-256-ctr';
const IV_LENGTH        = 16;
const ENCODING         = 'hex';

function aesEncrypt(plainText, password) {
    const iv = crypto.randomBytes(IV_LENGTH);
    let hashed_password = crypto.createHash('sha256').update(password).digest();

    let cipher = crypto.createCipheriv(
        CIPHER_ALGORITHM, hashed_password, iv);

    let encrypted = cipher.update(plainText);

    encrypted = Buffer.concat([iv, encrypted, cipher.final()]);

    return encrypted.toString(ENCODING);
}

function aesDecrypt(encrypted, password){
    encrypted = Buffer.from(encrypted, ENCODING);
    const iv = encrypted.slice(0, IV_LENGTH);
    const cipherText = encrypted.slice(16);

    let hashed_password = crypto.createHash('sha256').update(password).digest();

    let decipher = crypto.createDecipheriv(
        CIPHER_ALGORITHM, hashed_password, iv);
     
    let decrypted = decipher.update(cipherText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}


module.exports = {
    aesEncrypt,
    aesDecrypt,
};
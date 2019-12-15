const CryptoJS = require('crypto-js');
const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF");
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');

export function encrypt(text) {
    let srcs = CryptoJS.enc.Utf8.parse(text);
    let encrypted = CryptoJS.AES.encrypt(srcs,
        key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return encrypted.ciphertext.toString().toUpperCase();
}
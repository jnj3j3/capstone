"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessToken = createAccessToken;
exports.createRefreshToken = createRefreshToken;
exports.accessTokenDecrypt = accessTokenDecrypt;
exports.refreshTokenDecrypt = refreshTokenDecrypt;
exports.authMiddleware = authMiddleware;
const crypto_1 = __importDefault(require("crypto"));
const accesAlgorithm = process.env.AC_ALGORITHM;
const refreshAlgorithm = process.env.RE_ALGORITHM;
const reKey = process.env.RE_ENC_KEY;
const reIv = process.env.RE_ENC_IV;
const key = process.env.ENC_KEY; // 32바이트 키
const iv = process.env.ENC_IV;
//accessToken 생성
function createAccessToken(user) {
    try {
        const payload = {
            id: user.id,
            name: user.name,
            exp: Date.now() + 1000 * 60 * 30, // 30분 후 만료
        };
        const cipher = crypto_1.default.createCipheriv(accesAlgorithm, key, iv);
        let encrypted = cipher.update(JSON.stringify(payload), "utf-8", "hex");
        encrypted += cipher.final("hex");
        return encrypted;
    }
    catch (err) {
        return err + " this error occured while createAccessToken";
    }
}
function createRefreshToken(user) {
    try {
        const payload = {
            id: user.id,
            name: user.name,
            exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7일 후 만료
        };
        const cipher = crypto_1.default.createCipheriv(refreshAlgorithm, reKey, reIv);
        let encrypted = cipher.update(JSON.stringify(payload), "utf-8", "hex");
        encrypted += cipher.final("hex");
        return encrypted;
    }
    catch (err) {
        return err + " this error occured while createAccessToken";
    }
}
function accessTokenDecrypt(encryptedData) {
    try {
        const decipher = crypto_1.default.createDecipheriv(accesAlgorithm, key, iv);
        let decrypted = decipher.update(encryptedData, "hex", "utf-8");
        decrypted += decipher.final("utf-8");
        return JSON.parse(decrypted);
    }
    catch (err) {
        console.error("Decryption error:", err);
        return null;
    }
}
function refreshTokenDecrypt(encryptedData) {
    try {
        const decipher = crypto_1.default.createDecipheriv(refreshAlgorithm, reKey, reIv);
        let decrypted = decipher.update(encryptedData, "hex", "utf-8");
        decrypted += decipher.final("utf-8");
        return JSON.parse(decrypted);
    }
    catch (err) {
        console.error("Decryption error:", err);
        return null;
    }
}
function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (!token)
        return res.status(401).json({ error: "Unauthorized" });
    const data = accessTokenDecrypt(token);
    if (!data || data.exp < Date.now()) {
        return res.status(401).json({ error: "Token expired" });
    }
    req.user = { id: data.id, name: data.name };
    next();
}
//# sourceMappingURL=authToken.js.map
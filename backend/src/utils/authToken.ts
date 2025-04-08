import crypto from "crypto";
import { Request } from "express";
import dotenv from "dotenv";
dotenv.config();
const accesAlgorithm = process.env.AC_ALGORITHM;
const refreshAlgorithm = process.env.RE_ALGORITHM;
const reKey = process.env.RE_ENC_KEY;
const reIv = process.env.RE_ENC_IV;
const key = process.env.ENC_KEY; // 32바이트 키
const iv = process.env.ENC_IV;
interface TokenPayload {
  id: number;
  name: string;
  exp: number;
}
//accessToken 생성
//redis를 이 function을 만든 후 적용하여서 redis를 사용하지 않고 front쪽에 권환을 많이주는 형태로 만들게 됨
//나중에 리팩토링을 하게되면 redis를 사용하여서 accessToken을 관리하는 형태로 바꿔야함 (refreshToken도 마찬가지지)
export function createAccessToken(user: any): string {
  try {
    const payload: TokenPayload = {
      id: user.id,
      name: user.name,
      exp: Date.now() + 1000 * 60 * 30, // 30분 후 만료
    };
    const cipher = crypto.createCipheriv(accesAlgorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(payload), "utf-8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (err) {
    return err + " this error occured while createAccessToken";
  }
}
export function createRefreshToken(user: any): string {
  try {
    const payload: TokenPayload = {
      id: user.id,
      name: user.name,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7일 후 만료
    };
    const cipher = crypto.createCipheriv(refreshAlgorithm, reKey, reIv);
    let encrypted = cipher.update(JSON.stringify(payload), "utf-8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (err) {
    return err + " this error occured while createAccessToken";
  }
}
export function accessTokenDecrypt(encryptedData: string): TokenPayload | null {
  try {
    const decipher = crypto.createDecipheriv(accesAlgorithm, key, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return JSON.parse(decrypted);
  } catch (err) {
    console.error("Decryption error:", err);
    return null;
  }
}
export function refreshTokenDecrypt(
  encryptedData: string
): TokenPayload | null {
  try {
    const decipher = crypto.createDecipheriv(refreshAlgorithm, reKey, reIv);
    let decrypted = decipher.update(encryptedData, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return JSON.parse(decrypted);
  } catch (err) {
    console.error("Decryption error:", err);
    return null;
  }
}

export function authMiddleware(req: Request, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const data = accessTokenDecrypt(token);
  if (!data || data.exp < Date.now()) {
    return res.status(401).json({ error: "Token expired" });
  }
  (req as any).user = { id: data.id, name: data.name };
  next();
}

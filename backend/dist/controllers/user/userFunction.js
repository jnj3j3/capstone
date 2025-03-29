"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryption = encryption;
exports.checkList = checkList;
const crypto_1 = __importDefault(require("crypto"));
const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENC_KEY, "utf-8"); // 32바이트 키
const iv = Buffer.from(process.env.ENC_IV, "utf-8");
function encryption(password) {
    return crypto_1.default
        .createHash("sha512")
        .update(password + process.env.SALT)
        .digest("base64");
}
function checkList(db, list) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        var existsName = null;
        var errMessage;
        for (var element of list) {
            const name = element.name;
            const value = element.value;
            const obj = {
                [name]: value,
                state: 1,
            };
            const data = yield db.findOne({ where: obj }).catch((err) => {
                errMessage = err;
            });
            if (data !== null) {
                existsName = name;
                console.log(existsName, name, data);
                break;
            }
        }
        if (existsName)
            return resolve(existsName + " is already exists");
        else if (errMessage)
            return reject(errMessage);
        else
            return resolve(true);
    }));
}
//# sourceMappingURL=userFunction.js.map
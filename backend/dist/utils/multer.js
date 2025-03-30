"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
// 메모리 저장소 사용 후 바로 db로로
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
exports.uploadMiddleware = upload.single("image");
//# sourceMappingURL=multer.js.map
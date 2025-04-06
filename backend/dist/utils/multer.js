"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
// 메모리 저장소 사용 후 바로 db로로
const storage = multer_1.default.memoryStorage();
//확장자 필터터
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true); // 허용
    }
    else {
        cb(new Error("Only image files are allowed!"), false); // 차단
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}); // 최대 5MB
exports.uploadMiddleware = upload.single("image");
//# sourceMappingURL=multer.js.map
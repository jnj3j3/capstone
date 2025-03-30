import multer from "multer";

// 메모리 저장소 사용 후 바로 db로로
const storage = multer.memoryStorage();

const upload = multer({ storage });

export const uploadMiddleware = upload.single("image");

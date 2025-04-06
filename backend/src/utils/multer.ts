import multer from "multer";

// 메모리 저장소 사용 후 바로 db로로
const storage = multer.memoryStorage();
//확장자 필터터
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // 허용
  } else {
    cb(new Error("Only image files are allowed!"), false); // 차단
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}); // 최대 5MB

export const uploadMiddleware = upload.single("image");

import path from "path";
import multer from "multer";

// 저장 경로 및 파일명 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage }).single("file");

// 실제 이미지 업로드 처리
export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: false,
      statusCode: 400,
      message: "파일이 업로드되지 않았습니다.",
    });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  return res.status(201).json({
    status: true,
    statusCode: 201,
    message: "이미지 업로드 성공.",
    data: {
      imageUrl,
    },
  });
};

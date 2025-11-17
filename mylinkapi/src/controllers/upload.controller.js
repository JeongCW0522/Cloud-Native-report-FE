import path from "path";
import fs from "fs";
import sharp from "sharp";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "파일이 없습니다",
        statusCode: 400,
        data: null,
      });
    }

    // 파일명 생성 (무조건 .png)
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1e9);
    const filename = `${timestamp}-${random}.png`;
    const filepath = path.join(uploadDir, filename);

    // sharp로 PNG 변환 후 저장
    await sharp(req.file.buffer).png().toFile(filepath);

    // 현재 서버 기준 URL 생성 (포트 8002면 8002로 나옴)
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;

    return res.status(201).json({
      status: true,
      message: "이미지 업로드 성공",
      statusCode: 201,
      data: { imageUrl },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "이미지 업로드 실패",
      statusCode: 500,
      data: null,
    });
  }
};

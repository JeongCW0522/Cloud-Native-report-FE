import bcrypt from "bcrypt";
import db from "../config/db.js"; // MySQL 연결 모듈

export const postSignup = async (req, res) => {
  const { name, email, password } = req.body;

  // 1) 필드 체크
  if (!name || !email || !password) {
    return res.status(400).json({
      status: false,
      statusCode: 400,
      message: "모든 필드를 입력해주세요.",
    });
  }

  try {
    // 2) 이메일 중복 체크
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({
        status: false,
        statusCode: 409,
        message: "이미 존재하는 이메일입니다.",
      });
    }

    // 3) 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4) 사용자 등록
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    // 5) 등록된 사용자 조회
    const [userRows] = await db.query(
      "SELECT id, name, email, createdAt, updatedAt FROM users WHERE id = ?",
      [result.insertId]
    );

    const user = userRows[0];

    // 6) 응답
    return res.status(201).json({
      status: true,
      statusCode: 201,
      message: "요청이 성공했습니다.",
      data: user,
    });
  } catch (err) {
    console.error("회원가입 에러:", err);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

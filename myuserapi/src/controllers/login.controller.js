import bcrypt from "bcrypt";
import pool from "../config/db.js";

export const postLogin = async (req, res) => {
  const { email, password } = req.body;

  // 1) 필드 체크
  if (!email || !password) {
    return res.status(400).json({
      status: false,
      statusCode: 400,
      message: "이메일과 비밀번호를 입력해주세요.",
    });
  }

  try {
    // 2) 사용자 조회
    const [rows] = await pool.query(
      "SELECT id, name, email, password FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "존재하지 않는 이메일입니다.",
      });
    }

    const user = rows[0];

    // 3) 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "비밀번호가 올바르지 않습니다.",
      });
    }

    // 4) 응답
    return res.status(201).json({
      status: true,
      statusCode: 201,
      message: "요청이 성공했습니다.",
      data: {
        id: user.id,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("로그인 에러:", err);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

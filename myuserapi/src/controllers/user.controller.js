import pool from "../config/db.js";

export const getUserInfo = async (req, res) => {
  const { email } = req.query;
  // 세션을 쓰기 전이므로 임시로 email을 query로 받는 방식

  if (!email) {
    return res.status(400).json({
      status: false,
      statusCode: 400,
      message: "email이 필요합니다.",
    });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, password, createdAt, updatedAt FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "해당 이메일의 사용자가 존재하지 않습니다.",
      });
    }

    return res.status(201).json({
      status: true,
      statusCode: 201,
      message: "요청이 성공했습니다.",
      data: rows[0],
    });
  } catch (err) {
    console.error("내 정보 조회 에러:", err);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

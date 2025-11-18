import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const patchUserInfo = async (req, res) => {
  const { email } = req.query;
  // 세션 적용 전까지는 임시로 email 기반 처리

  if (!email) {
    return res.status(400).json({
      status: false,
      statusCode: 400,
      message: "email이 필요합니다.",
    });
  }

  const { name, newEmail, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "해당 사용자가 존재하지 않습니다.",
      });
    }

    const userId = rows[0].id;

    // 업데이트 필드 구성하기
    let updateQuery = "UPDATE users SET ";
    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }

    if (newEmail) {
      updateFields.push("email = ?");
      updateValues.push(newEmail);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push("password = ?");
      updateValues.push(hashedPassword);
    }

    updateQuery += updateFields.join(", ");
    updateQuery += " WHERE id = ?";
    updateValues.push(userId);

    await pool.query(updateQuery, updateValues);

    // 수정된 데이터 다시 조회
    const [updatedRows] = await pool.query(
      "SELECT id, name, email, password, createdAt, updatedAt FROM users WHERE id = ?",
      [userId]
    );

    return res.status(201).json({
      status: true,
      statusCode: 201,
      message: "요청이 성공했습니다.",
      data: updatedRows[0],
    });
  } catch (err) {
    console.error("내 정보 수정 에러:", err);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

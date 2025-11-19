import bcrypt from "bcrypt";
import db from "../config/db.js";

export const updateUserInfo = async (req, res, next) => {
  try {
    // 로그인 여부 확인
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "로그인이 필요합니다.",
        data: null,
      });
    }

    const userId = req.session.user.id;
    const { name, email, password } = req.body;

    if (!name && !email && !password) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "수정할 항목이 없습니다.",
        data: null,
      });
    }

    // 현재 유저 정보 조회
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "유저를 찾을 수 없습니다.",
        data: null,
      });
    }

    const user = rows[0];

    // 이메일 중복 체크
    if (email && email !== user.email) {
      const [emailRows] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if (emailRows.length > 0) {
        return res.status(409).json({
          status: false,
          statusCode: 409,
          message: "이미 사용 중인 이메일입니다.",
          data: null,
        });
      }
    }

    // 비밀번호 변경 시 해싱
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // 변경할 필드 적용
    const newName = name ?? user.name;
    const newEmail = email ?? user.email;

    // DB 업데이트
    await db.query(
      `UPDATE users
       SET name = ?, email = ?, password = ?, updatedAt = NOW()
       WHERE id = ?`,
      [newName, newEmail, hashedPassword, userId]
    );

    // 다시 조회해서 최신 데이터 가져오기
    const [updatedRows] = await db.query(
      "SELECT id, name, email, createdAt, updatedAt FROM users WHERE id = ?",
      [userId]
    );

    const updatedUser = updatedRows[0];

    // 세션 정보도 최신화
    req.session.user = updatedUser;

    return res.status(201).json({
      status: true,
      statusCode: 201,
      message: "요청이 성공했습니다.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("유저 정보 수정 에러:", error);
    next(error);
  }
};

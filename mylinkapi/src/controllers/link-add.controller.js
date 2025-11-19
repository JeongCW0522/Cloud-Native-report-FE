import db from "../config/db.js";

// 링크 추가
export const createLink = async (req, res, next) => {
  try {
    // 🔒 1) 세션 확인 (로그인 여부)
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "로그인이 필요합니다.",
        data: null,
      });
    }

    // 🔑 2) 세션에서 userId 가져오기
    const userId = req.session.user.id;

    const { url, title, content, thumbnail, favorite } = req.body;

    // 필수 필드 검증
    if (!url || !title) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "url과 title은 필수 입력 항목입니다.",
      });
    }

    // 🔐 3) userId 포함해서 INSERT
    const [result] = await db.query(
      `INSERT INTO links (userId, url, title, content, thumbnail, favorite) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        url,
        title,
        content || null,
        thumbnail || null,
        favorite || false,
      ]
    );

    // 생성된 링크 조회
    const [rows] = await db.query("SELECT * FROM links WHERE id = ?", [
      result.insertId,
    ]);

    const createdLink = rows[0];

    res.status(201).json({
      status: true,
      statusCode: 201,
      message: "요청이 성공했습니다.",
      data: {
        id: createdLink.id,
        url: createdLink.url,
        title: createdLink.title,
        content: createdLink.content,
        thumbnail: createdLink.thumbnail,
        favorite: Boolean(createdLink.favorite),
        createdAt: createdLink.createdAt,
        updatedAt: createdLink.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

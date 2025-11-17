import db from "../config/db.js";

// 링크 추가
export const createLink = async (req, res, next) => {
  try {
    const { url, title, content, thumbnail, favorite } = req.body;

    // 필수 필드 검증
    if (!url || !title) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "url과 title은 필수 입력 항목입니다.",
      });
    }

    // 데이터베이스에 삽입
    const [result] = await db.query(
      `INSERT INTO links (url, title, content, thumbnail, favorite) 
       VALUES (?, ?, ?, ?, ?)`,
      [url, title, content || null, thumbnail || null, favorite || false]
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

import db from "../config/db.js";

// 링크 전체 조회
export const getAllLinks = async (req, res, next) => {
  try {
    const { search } = req.query;

    let query = `SELECT id, url, title, content, thumbnail, favorite, createdAt, updatedAt FROM links`;
    let params = [];

    // 🔍 검색어가 있을 경우 WHERE 조건 추가
    if (search && search.trim() !== "") {
      const likeValue = `%${search}%`;
      query += ` WHERE (title LIKE ? OR content LIKE ?) `;
      params = [likeValue, likeValue, likeValue];
    }

    // ⭐ 최신순 정렬 (createdAt DESC)
    query += ` ORDER BY createdAt DESC`;

    const [rows] = await db.query(query, params);

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "요청이 성공했습니다.",
      data: rows.map((item) => ({
        id: item.id,
        url: item.url,
        title: item.title,
        content: item.content,
        thumbnail: item.thumbnail,
        favorite: Boolean(item.favorite),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

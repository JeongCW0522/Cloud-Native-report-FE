import db from "../config/db.js";

// 링크 수정
export const updateLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { url, title, content, thumbnail } = req.body;

    console.log("받은 ID:", id); // 디버깅용
    console.log("받은 데이터:", { url, title, content, thumbnail }); // 디버깅용

    // id 검증
    if (!id || isNaN(id)) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "유효한 id를 전달해주세요.",
      });
    }

    // 필수 값 검증
    if (!url || !title) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "url과 title은 필수입니다.",
      });
    }

    // 먼저 해당 ID가 존재하는지 확인
    const [existing] = await db.query("SELECT * FROM links WHERE id = ?", [id]);
    console.log("기존 데이터:", existing); // 디버깅용

    if (existing.length === 0) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "해당 링크를 찾을 수 없습니다.",
      });
    }

    // UPDATE
    const [result] = await db.query(
      "UPDATE links SET url = ?, title = ?, content = ?, thumbnail = ?, updatedAt = NOW() WHERE id = ?",
      [url, title, content || null, thumbnail || null, id]
    );

    console.log("UPDATE 결과:", result); // 디버깅용

    // 수정 후 SELECT
    const [rows] = await db.query("SELECT * FROM links WHERE id = ?", [id]);
    const link = rows[0];

    res.status(200).json({
      // 201이 아닌 200이 더 적절합니다
      status: true,
      statusCode: 200,
      message: "요청이 성공했습니다.",
      data: {
        id: link.id,
        url: link.url,
        title: link.title,
        content: link.content,
        thumbnail: link.thumbnail,
        favorite: Boolean(link.favorite),
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
      },
    });
  } catch (error) {
    console.error("에러 발생:", error); // 디버깅용
    next(error);
  }
};

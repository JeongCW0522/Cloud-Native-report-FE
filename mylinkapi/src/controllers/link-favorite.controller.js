import db from "../config/db.js";

// 즐겨찾기 수정
export const toggleFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body; // boolean (true/false 저장)

    if (!id || isNaN(id)) {
      return res.status(400).json({
        status: false,
        message: "올바른 id를 전달해주세요",
      });
    }

    const [result] = await db.query(
      "UPDATE links SET favorite = ? WHERE id = ?",
      [favorite ? 1 : 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "링크를 찾을 수 없습니다.",
      });
    }

    res.status(200).json({
      status: true,
      message: "즐겨찾기 상태가 변경되었습니다.",
      data: {
        id,
        favorite,
      },
    });
  } catch (err) {
    next(err);
  }
};

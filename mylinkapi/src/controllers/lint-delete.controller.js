import db from "../config/db.js";

// 링크 삭제
export const deleteLink = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "유효한 id를 전달해주세요.",
      });
    }

    const [result] = await db.query("DELETE FROM links WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "해당 링크를 찾을 수 없습니다.",
      });
    }

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "링크가 삭제되었습니다.",
    });
  } catch (error) {
    next(error);
  }
};

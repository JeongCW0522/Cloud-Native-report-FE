export const postLogout = async (req, res) => {
  try {
    // 세션이 없는 경우
    if (!req.session) {
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "이미 로그아웃 상태입니다.",
        data: null,
      });
    }

    // 세션 삭제
    req.session.destroy((err) => {
      if (err) {
        console.error("세션 삭제 오류:", err);
        return res.status(500).json({
          status: false,
          statusCode: 500,
          message: "로그아웃 중 오류가 발생했습니다.",
        });
      }

      // 클라이언트에 쿠키 제거
      res.clearCookie("sid", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });

      return res.status(201).json({
        status: true,
        statusCode: 201,
        message: "로그아웃 되었습니다.",
        data: null,
      });
    });
  } catch (err) {
    console.error("로그아웃 에러:", err);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: false,
    statusCode: statusCode,
    message: err.message || "서버 오류가 발생했습니다.",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;

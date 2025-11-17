// server.js
import express from "express";

const app = express();
const PORT = 8001;

// JSON 형식의 요청을 처리할 수 있도록 설정
app.use(express.json());

// 기본 라우트
app.get("/", (req, res) => {
  res.send("User");
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

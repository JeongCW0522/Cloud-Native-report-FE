import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import router from "./routes/link.route.js";

const app = express();
const PORT = 8002;

// JSON 형식의 요청을 처리할 수 있도록 설정
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", router);

app.use(errorHandler);

// 테스트
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Link API is running" });
});

// 서버 실행
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Link API running on port ${PORT}`);
});

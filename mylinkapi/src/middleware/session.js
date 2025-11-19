import session from "express-session";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: "myredis", // docker-compose service name
    port: 6379,
  },
});
redisClient.connect().catch((err) => {
  console.error("🔴 Redis 연결 실패:", err);
});

const store = new RedisStore({
  client: redisClient,
  prefix: "sess:", // Redis 키 prefix
});

export const sessionMiddleware = session({
  store,
  name: "sid", // 쿠키 이름
  secret: process.env.SESSION_SECRET || "super-secret-session-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1일
    secure: false,
    sameSite: "lax",
  },
});

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "mysql",
  user: process.env.DB_USER || "mysql_db",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "mysql_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

// 데이터베이스 연결 테스트
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL 데이터베이스 연결 성공!");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL 연결 실패:", err.message);
    // 재시도 로직
    setTimeout(testConnection, 5000);
  }
};

testConnection();

export default pool;

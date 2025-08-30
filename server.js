const express = require("express");
const path = require("path");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = process.env.PORT || 3000;

// 1️⃣ Bật CORS cho tất cả request (release build có thể fetch API mà không bị block)
app.use(cors());

// 2️⃣ Logging request (tùy chọn, giúp debug)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 3️⃣ Serve Flutter Web release
app.use(express.static(path.join(__dirname, "build/web")));

// 4️⃣ Proxy API request từ Flutter Web tới API thật
//    Thay 'https://ngaymoidohon.onrender.com' bằng URL API của bạn
app.use(
  "/partners", // route Flutter Web gọi: /partners
  createProxyMiddleware({
    target: "https://ngaymoidohon.onrender.com",
    changeOrigin: true,
    secure: true,
  })
);

// 5️⃣ Fallback mọi route SPA về index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/web/index.html"));
});

// 6️⃣ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

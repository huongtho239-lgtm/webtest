const express = require("express");
const path = require("path");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = process.env.PORT || 3000;

// 1️⃣ Bật CORS cho local test và release build
app.use(cors());

// 2️⃣ Logging request (tùy chọn)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 3️⃣ Serve Flutter Web release
app.use(express.static(path.join(__dirname, "build/web")));

// 4️⃣ Proxy API request từ Flutter Web qua server trung gian
app.use(
  "/partners", // Flutter Web fetch "/partners"
  createProxyMiddleware({
    target: "https://ngaymoidohon.onrender.com",
    changeOrigin: true,
    secure: true,
  })
);

// 5️⃣ Proxy CDN request nếu bạn fetch blob/json
app.use(
  "/cdn-proxy", // Flutter Web fetch "/cdn-proxy/unsafe/..."
  createProxyMiddleware({
    target: "https://cdn2.fptshop.com.vn",
    changeOrigin: true,
    secure: true,
    pathRewrite: { "^/cdn-proxy": "" }, // bỏ prefix khi forward
  })
);

// 6️⃣ Fallback SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/web/index.html"));
});

// 7️⃣ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

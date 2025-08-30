const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Serve static files từ build/web
app.use(express.static(path.join(__dirname, "build/web")));

// Mọi route khác -> index.html (cho SPA Flutter web)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/web/index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

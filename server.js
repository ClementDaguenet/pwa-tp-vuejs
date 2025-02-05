const express = require("express");
const path = require("path");
const compression = require("compression");

const app = express();
const port = 5000;

app.use(compression());
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
    console.log(`PWA running on http://localhost:${port}`);
});

const express = require("express");
const multer = require("multer");

const app = express();

const uploadEx6 = multer();

app.post("php/upload-ex6.php", uploadEx6.any(), (req, res) => {
    console.log(req.files);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end("Done.");
});

app.listen(3000, () => {
    console.log("Server running!");
});
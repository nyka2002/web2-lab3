const http = require("http");
const fs = require("fs");
const path = require("path");

// konfiguracija i stvaranje servera
const PORT = 8080;
const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);

    let extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".json": "application/json",
        ".ico": "image/x-icon",
    };

    let contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === "ENOENT") {
                fs.readFile(path.join(__dirname, "404.html"), (err404, content404) => {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.end(content404 || "404: File Not Found", "utf-8");
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
        }
    });
});

// pokretanje servera
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
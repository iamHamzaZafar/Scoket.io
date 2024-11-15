const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const port = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
 res.send("<h2>Hello World</h2>")
});

server.listen(port, () => {
  console.log(`Example app listening at port ${port}`);
});

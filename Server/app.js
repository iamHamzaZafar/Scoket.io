const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const port = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server , {cors: {
  origin: "http://localhost:5173", // Allow React frontend
  methods: ["GET", "POST"],
},});

app.get("/", (req, res) => {
  res.send("<h2>Hello World</h2>");
});

// Handles Socket.IO connections
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`); // Correctly logs the connected user's socket ID

  // Handles specific client disconnection
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`); // Correctly logs the disconnected user's socket ID
  });
});

server.listen(port, () => {
  console.log(`Example app listening at port ${port}`);
});

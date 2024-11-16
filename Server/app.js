const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server , {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Broadcast a message to everyone
  socket.on("send_message", (data) => {
    console.log(`Broadcast message: ${data.text}`);
    io.emit("receive_message", { from: socket.id, ...data });
  });
    // Send a private message to a specific socket ID
    socket.on("send_message_to_id", ({ toSocketId, message }) => {
      console.log(`Private message from ${socket.id} to ${toSocketId}: ${message}`);
      io.to(toSocketId).emit("receive_message", {
        from: socket.id,
        text: message,
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  

    
})


server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

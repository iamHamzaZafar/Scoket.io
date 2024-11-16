import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";

// Connect to the backend
const socket = io.connect("http://localhost:3000");

function App() {
  const [message, setMessage] = useState(""); // Message to send
  const [recipientId, setRecipientId] = useState(""); // Recipient's socket ID
  const [messages, setMessages] = useState([]); // List of all messages

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("Incoming message:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // Handle sending a broadcast message
  const handleBroadcastMessage = () => {
    if (message.trim()) {
      const messageData = {
        text: message,
        timestamp: new Date().toLocaleTimeString(),
      };

      socket.emit("send_message", messageData); // Emit to everyone
      setMessages((prevMessages) => [...prevMessages, { from: "You", ...messageData }]);
      setMessage(""); // Clear input
    }
  };

  // Handle sending a private message
  const handleSendMessageToId = () => {
    if (recipientId.trim() && message.trim()) {
      const messageData = {
        text: message,
        to: recipientId,
        timestamp: new Date().toLocaleTimeString(),
      };

      socket.emit("send_message_to_id", { toSocketId: recipientId, message }); // Emit to specific user
      setMessages((prevMessages) => [...prevMessages, { from: "You (Private)", ...messageData }]);
      setMessage(""); // Clear input
    }
  };

  return (
    <div className="container">
      <h2>Chat Application with Private Messaging</h2>

      {/* Input for recipient's socket ID */}
      <div>
        <label>Recipient Socket ID (for private message):</label>
        <input
          type="text"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          placeholder="Enter recipient's socket ID"
        />
      </div>

      {/* Input for the message */}
      <div>
        <label>Message:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
        />
      </div>

      {/* Send Buttons */}
      <button onClick={handleBroadcastMessage}>Send to All</button>
      <button onClick={handleSendMessageToId}>Send to Specific ID</button>

      {/* Display Messages */}
      <div className="chat-box">
        <h3>Chat History:</h3>
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.from}:</strong> {msg.text} <span>({msg.timestamp})</span>
          </div>
        ))}
      </div>

      <p>Your Socket ID: {socket.id}</p>
    </div>
  );
}

export default App;

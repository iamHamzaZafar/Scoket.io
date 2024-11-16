import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";

// Connect to the backend
const socket = io.connect("http://localhost:3000");

function App() {
  const [message, setMessage] = useState(""); // Input message
  const [messages, setMessages] = useState([]); // List of messages
  const [recipientId, setRecipientId] = useState(""); // Private message recipient ID

  // Listen for incoming messages from the server
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("Received message:", data);
      setMessages((prevMessages) => [...prevMessages, data]); // Add message to list
    });

    return () => {
      socket.off("receive_message"); // Cleanup listener
    };
  }, []);

  // Handle sending broadcast message
  const sendBroadcastMessage = () => {
    if (message.trim()) {
      const messageData = { text: message, timestamp: new Date().toLocaleTimeString() };
      socket.emit("send_message", messageData); // Send message to all clients
      setMessages((prevMessages) => [...prevMessages, { from: "You", ...messageData }]); // Optionally update UI before confirmation
      setMessage(""); // Clear input field
    }
  };

  // Handle sending private message
  const sendPrivateMessage = () => {
    if (recipientId.trim() && message.trim()) {
      const messageData = { toSocketId: recipientId, message };
      socket.emit("send_message_to_id", messageData); // Send private message
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: "You", text: message, timestamp: new Date().toLocaleTimeString() },
      ]); // Optionally update UI before confirmation
      setMessage(""); // Clear input field
    }
  };

  return (
    <div className="App">
      <h2>Chat Application</h2>

      {/* Broadcast Message Section */}
      <div>
        <h3>Send a Broadcast Message</h3>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
        <button onClick={sendBroadcastMessage}>Send to Everyone</button>
      </div>

      {/* Private Message Section */}
      <div>
        <h3>Send a Private Message</h3>
        <input
          type="text"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          placeholder="Recipient Socket ID"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter private message"
        />
        <button onClick={sendPrivateMessage}>Send Private</button>
      </div>

      {/* Chat Messages Display */}
      <div className="chat-box">
        <h3>Messages:</h3>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.from}</strong>: {msg.text} <em>({msg.timestamp})</em>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

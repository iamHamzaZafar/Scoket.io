import "./App.css";
import { useState } from "react";
import io from "socket.io-client";


const socket = io.connect("http://localhost:3000"); // Connect to the backend

function App() {
  
// const socket = io.connect("http://localhost:3000"); // Connect to the backend
  function handleSubmit() {
    console.log("Submitted ", message);
  }

  const [message, setMessage] = useState("");
  return (
    <div className="container">
      <h2>Simple chat application</h2>
      <div>
        <label>Message</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
      </div>
      <button type="submit" onClick={handleSubmit}>
        Send Message
      </button>
    </div>
  );
}

export default App;

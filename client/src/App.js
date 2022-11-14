import { useEffect, useState } from "react";
import "./App.css";

import socketIO from "socket.io-client";
const socket = socketIO.connect("http://localhost:4040");

function App() {
  const [messages, setMessages] = useState([]);

  console.log(messages);

  const [user, setUser] = useState(null);

  const handleLogin = (e) => {
    const { user } = e.target;
    sessionStorage.setItem("user:chat_app", user.value);
    setUser(user.value);
    e.preventDefault();
  };

  const sendMessage = (e) => {
    const { message } = e.target;

    socket.emit("message", {
      text: message.value,
      socketID: socket.id,
      sender: user,
    });
    e.preventDefault();
  };

  useEffect(() => {
    socket.on("response", (data) => {
      setMessages([...messages, data]);
    });
  }, [messages]);

  useEffect(() => {
    setUser(sessionStorage.getItem("user:chat_app"));
  }, []);

  return (
    <div className="container">
      <center>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvDQhI96KOJP4eaCohSsODK8xtaWhIUbLHFw&usqp=CAU"
          alt="logo"
          className="logo"
        />
      </center>
      <hr />
      {!user ? (
        <form action="" className="loginForm" onSubmit={handleLogin}>
          <input autoComplete="off" name="user" placeholder="Enter your name" />
          <button type="submit">Login</button>
        </form>
      ) : (
        <>
          <div className="messages">
            <ul id="messages">
              {messages.map((message, key) => (
                <div
                  as="li"
                  key={key}
                  className={user === message.sender ? "sent_message" : "received"}
                >
                  {message.text}
                  <br />
                  <small>{user === message.sender ? "You" : message.sender}</small>
                </div>
              ))}
            </ul>
          </div>
          <form id="form" action="" onSubmit={sendMessage}>
            <input id="input" autoComplete="off" name="message" />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
}

export default App;

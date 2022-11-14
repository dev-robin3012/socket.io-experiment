const express = require("express");
const app = express();
const PORT = 4040;
const http = require("http").Server(app);
const cors = require("cors");

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

//Add this before the app.get() block
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("message", (message) => {
    console.log({ message });
    socketIO.emit("response", message);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const app = express();

//Changes started.

const { Server } = require("socket.io");
const { createServer } = require("http");
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors({
  origin: 'https://realtime-chatapp-mern-frontend.onrender.com',  // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
  credentials: true,  // Allow credentials (cookies, HTTP authentication)
}));
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoutes);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "VkChatApp",
  })
  .then(() => {
    console.log("Database Connected Successfully !!!");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://realtime-chatapp-mern-frontend.onrender.com',
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("A User Connected", socket.id);
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("message", ({ message, to, from }) => {
    const roomId = [from, to].sort().join("_");
    console.log(`Message from ${from} to ${to} in room ${roomId} : ${message}`);
    socket.to(roomId).emit("receive-msg", { message, from });
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

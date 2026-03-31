
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, { cors:{origin:"*"} });

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("DB connected"));

let players = {};

io.on("connection", (socket)=>{
  players[socket.id] = {x:0,y:0,z:0};

  socket.on("move",(data)=>{
    players[socket.id] = data;
    socket.broadcast.emit("playerMoved",{id:socket.id, position:data});
  });

  socket.on("disconnect",()=>{
    delete players[socket.id];
  });
});

server.listen(3000, ()=>console.log("Server running"));

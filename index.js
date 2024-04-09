const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3001;

const users = [{}]
app.use(cors())
const server = http.createServer(app);
const io = socketIo(server,{
  cors:{
    origin:'*'
  }
});

app.get('/',(req,res)=>{
  res.send("its working")
})


io.on("connection",(socket)=>{
  console.log("new connection");

  socket.on('joined',({user})=>{
    users[socket.id]=user
    console.log(`${user} has joined`);
    socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`})
    socket.emit('welcome',{user:"Admin",message:`Welcome to chat ${users[socket.id]}`})

  })

  socket.on("message",({message,id})=>{
    io.emit('sendMessage',{user:users[id],message,id})
  })

  socket.on("disconnect",() => {
    socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has disconnected`})
    console.log('Client disconnected');
  });

})


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
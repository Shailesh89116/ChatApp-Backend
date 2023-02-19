const express=require('express');
const cors=require('cors');
const bodyparser=require('body-parser');
const connection=require('./connection/DatabaseConnection')
const { chats } = require('./data');
const routes=require('./routes/mainRoute');
const { urlencoded } = require('body-parser');
const { notFound } = require('./middleware/NotFound');
const { errorHandler } = require('./middleware/ErrorHandler');

const app=express();
app.use(cors());
app.use(bodyparser.json());
app.use(express.json());
app.use(urlencoded());
app.use('/',routes);

const PORT=5000;

const server=app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});

const io=require('socket.io')(server,{
    pingTimeout: 6000,
    cors:{
        origin: 'http://127.0.0.1:5173',
        methods: ["GET", "POST"]
    },
});

io.on("connection",(socket)=>{
    console.log("connected to socket io");

    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected")
    });

    socket.on("join chat",(room)=>{
        socket.join(room);
    });

    socket.on('typing',(room)=>{
        socket.in(room).emit("typing")
    });

    socket.on('stop typing',(room)=>{
        socket.in(room).emit("stop typing")
    });

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
    
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
       
    });


});


// importing express
const express=require('express');

//calling express
const app=express();

//importing http 
const http=require('http');

// const path=require('path');

//imporing socket.io
const {Server} =  require('socket.io');
const ACTIONS = require('./src/Actions');
//
const server=http.createServer(app);
//creating instance to Server class(socket.io) and passing parameter as http server
const io=new Server(server);

app.use(express.static('build'));
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'build','index.html'));
});


const userSocketMap={};
function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            userName: userSocketMap[socketId],
        };
    });
}

io.on('connection',(socket)=>{
    console.log('socket connected',socket.id)

    //if and new client join then ACTION.JOIN trigger from frontend ,then we get the userid and socketid of the 
    //client then we store mapping of all client and make the client join the room
    //then we run a for loop to notify all the clients present that the new client as joined
    socket.on(ACTIONS.JOIN,({roomId,userName})=>{
        userSocketMap[socket.id]=userName;
        socket.join(roomId);
        const clients=getAllConnectedClients(roomId);
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                userName,
                socketId: socket.id,
            });
        });
    });


    socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code});
    })

    socket.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE,{code});
    })


    socket.on('disconnecting',()=>{
        const rooms=[...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId: socket.id,
                userName: userSocketMap[socket.id],
            });

        })
       delete userSocketMap[socket.id];
       socket.leave();
    });

});

const PORT=process.env.PORT || 5000;
server.listen(PORT,()=> console.log(`Listening on port ${PORT}`));






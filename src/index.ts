//This is like is a simple chat application 

//Imp fact : WebSocket dont communicate using JSON objects, they use strings or binary.

import { parse } from "node:path";
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User{
    socket: WebSocket,
    room: string
}

let allSockets: User[] = []; // All the users that are connected are present here. It is a array of User object.

wss.on("connection", (socket) => {
    
    // the message here in the parameter is a string.
    socket.on("message", (message) => {
        //@ts-ignore
        const parsedMessage = JSON.parse(message as string);//string => object, as for TS
        // message is something like this: 
        /*
        {
        "type":"join",
        "payload":{
        "roomId":"1"
        }
        }
        */ 
        if (parsedMessage.type === "join") {
            console.log("user joined room" + parsedMessage.payload.roomId);
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }
        if (parsedMessage.type === "chat") {
            console.log("User wants to chat");
          //  const currentUserRoom = allSockets.find((x) => x.socket == socket); this line does the same thing
            let currentUserRoom = null;
            for (let i = 0; i < allSockets.length; i++){
                if (allSockets[i]?.socket == socket) {
                    currentUserRoom = allSockets[i]?.room;
                }
            }
            for (let i = 0; i < allSockets.length; i++){
                if (allSockets[i]?.room == currentUserRoom) {
                    allSockets[i]?.socket.send(parsedMessage.payload.message);
                }
            }
        }
    })

})


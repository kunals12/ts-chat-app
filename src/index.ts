import { WebSocketServer, WebSocket } from "ws"; // Import WebSocket server and WebSocket types from the "ws" package

// Create a WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

interface IParsedMessage {
  type: string;
  payload: {
    roomId?: string;
    message?: string;
  };
}

let userCount = 0; // Counter to track the number of connected users
let rooms: Map<string, WebSocket[]> = new Map(); // Array to store all active WebSocket connections

// Event listener for new connections
wss.on("connection", (socket: WebSocket) => {
  // Handle any errors that occur on this socket connection
  socket.on("error", console.error);

  // Event listener for receiving messages from the client
  socket.on("message", (message) => {
    // {
    //     type: "join",
    //     payload: {
    //         roomId: "abcde"
    //     }
    // }

    // {
    //     type: "chat",
    //     payload: {
    //         message: "hi there"
    //     }
    // }

    const parsedMessage: IParsedMessage = JSON.parse(
      message as unknown as string
    );
    console.log(parsedMessage);


    if (parsedMessage.type === "join") {
    const roomId = parsedMessage.payload.roomId;

    if(!roomId) {
        throw Error("Room Id Not Found");
    }

      // Check if the room already exists in the map
      if (rooms.has(roomId)) {
        // If the room exists, push the new socket to the existing array
        rooms.get(roomId)?.push(socket);
        console.log("user pushed");
        
      } else {
        // If the room does not exist, create a new array with the socket
        rooms.set(roomId, [socket]);
        console.log("user joind");
      }
    }

    if (parsedMessage.type === "chat") {
        const message = parsedMessage.payload.message;
        const roomId = parsedMessage.payload.roomId;

        if(!roomId || !message) {
            throw Error("Room Id Not Found");
        } 

        const roomMembers = rooms.get(roomId);

        if (roomMembers) {
            // Iterate over each socket in the room and send the message
            roomMembers.forEach((user: WebSocket) => {
              if (user !== socket) {
                user.send(message.toString());
            }
            });
        } else {
            console.log(`Room ${roomId} does not exist or has no members.`);
        }
    }
  });

  // socket.on("disconnect", () => {
  //     allSockets = allSockets.filter(x => x != socket);
  // })
});

import { WebSocketServer, WebSocket } from "ws"; // Import WebSocket server and WebSocket types from the "ws" package

// Create a WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

let userCount = 0; // Counter to track the number of connected users
let allSockets: WebSocket[] = []; // Array to store all active WebSocket connections

// Event listener for new connections
wss.on("connection", (socket: WebSocket) => {
    // Add the new socket to the list of active connections
    allSockets.push(socket);

    // Increment the user count and log the current number of connected users
    userCount += 1;
    console.log("user connected", userCount);

    // Handle any errors that occur on this socket connection
    socket.on("error", console.error);

    // Event listener for receiving messages from the client
    socket.on("message", (message) => {
        // Log the received message
        console.log("message received", message.toString());

        // Broadcast the received message to all connected clients
        allSockets.forEach((socket) => {
            socket.send(message.toString() + ":sent from server"); // Send the message along with a custom suffix
        });
    });
});

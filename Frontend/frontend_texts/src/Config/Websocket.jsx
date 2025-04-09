import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function createStompClient(username, onMessageReceived) {
  const socket = new SockJS('http://localhost:8080/ws-endpoint', null, {
    transports: ['websocket'], // Force WebSocket transport
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}` // Add auth header
    }
  });

  const client = new Client({
    webSocketFactory: () => socket,
    connectHeaders: { 
      Authorization: `Bearer ${localStorage.getItem("token")}` 
    },
    debug: (str) => console.log(`STOMP: ${str}`),
    reconnectDelay: 0, // Disable automatic reconnection
    onConnect: () => {
      console.log("✅ STOMP Connected");
      client.subscribe(`/topic/${username}.queue/messages`, (message) => {
        console.log("📨 Message received:", message);
        const parsed = JSON.parse(message.body);
        onMessageReceived(message);
      });
    },
    onWebSocketError: (err) => console.error("WebSocket Error:", err)
  });

  // Handle activation carefully
  if (!client.active) {
    client.activate();
  }
  
  return client;
};

export default createStompClient;

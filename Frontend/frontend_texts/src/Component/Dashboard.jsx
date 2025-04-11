import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import toast, { Toaster } from "react-hot-toast";
import ApiMapping from "../Config/ApiMapping";
import FriendsList from "./FriendsList";
import ChatArea from "./ChatArea";
import ConnectionStatus from "./ConnectionStatus"

function Dashboard() {
    const location = useLocation();
    const { username } = location.state || {};

    const [friends, setFriends] = useState([]); // list of friends retrived from backend
    const [currentFriend, setCurrentFriend] = useState(null); // the friend i am texting
    const [messages, setMessages] = useState({}); // Messages organized by conversation
    const [senderText, setSenderText] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    
    const stompClientRef = useRef(null); // Use a ref to keep track of the STOMP client
    const chatDisplayRef = useRef(null); // dynamically rendering the chat

    // Fetch friends list
    const friendListRetrieval = async () => {
        try {
            const friendresponse = await ApiMapping.post(
                "/api/dashboard/friends",
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            setFriends(friendresponse.data);
        } catch (error) {
            console.error("Error:", error?.response?.data || error.message);
            toast.error("Failed to load friends list");
        }
    };

    // Fetch conversation history when a friend is selected
    useEffect(() => {
        if (currentFriend && username) {
            fetchConversationHistory(username, currentFriend);
        }
    }, [currentFriend, username]);

    // Fetch conversation history between two users
    const fetchConversationHistory = async (user1, user2) => {
        try {
            const response = await ApiMapping.get(
                `/api/messages/conversation?user1=${user1}&user2=${user2}`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            
            // Format and set messages
            const formattedMessages = response.data.map(msg => ({
                type: "text",
                content: msg.content,
                sender: msg.sender,
                receiver: msg.receiver,
                time: new Date(msg.timestamp).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
            }));
            
            // Update messages for this conversation
            setMessages(prev => ({
                ...prev,
                [`${user1}_${user2}`]: formattedMessages
            }));
            
            // Update the current display
            setSenderText(formattedMessages);
        } catch (error) {
            console.error("Error fetching conversation:", error);
            toast.error("Failed to load conversation history");
        }
    };

    // Setup WebSocket connection
    useEffect(() => {
        friendListRetrieval();
        
        if (!username) {
            toast.error("Username not found. Please login again.");
            return;
        }

        // Create and configure STOMP client
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws-endpoint"),
            connectHeaders: {
                login: username,
            },
            debug: function(str) {
                console.log("STOMP: " + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        });

        // Connection successful handler
        client.onConnect = function() {
            setConnectionStatus("connected");
            toast.success("Connected to chat server!");
            
            // Subscribe to personal topic to receive messages
            client.subscribe(`/user/${username}/queue/messages`, handleIncomingMessage);
            
            // Subscribe to broadcast messages
            client.subscribe('/topic/public', handleBroadcastMessage);
        };

        // Connection error handler
        client.onStompError = function(frame) {
            setConnectionStatus("error");
            console.error('STOMP error:', frame);
            toast.error("Connection error: " + frame.headers.message);
        };

        // Store client in ref and activate
        stompClientRef.current = client;
        client.activate();

        // Cleanup on component unmount
        return () => {
            if (client && client.active) {
                client.deactivate();
            }
        };
        
    }, [username]);

    // Handle incoming personal messages
    const handleIncomingMessage = (message) => {
        try {
            const messageData = JSON.parse(message.body);
            console.log("Received message:", messageData);
            
            // Format the message
            const formattedMessage = {
                type: "text",
                content: messageData.content,
                sender: messageData.sender,
                receiver: messageData.receiver,
                time: new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
            };
            
            // Update messages with the new message
            setMessages(prev => {
                // Create conversation key (works regardless of who's sender or receiver)
                const conversationKey = [messageData.sender, messageData.receiver].sort().join("_");
                
                const conversationMessages = prev[conversationKey] || [];
                return {
                    ...prev,
                    [conversationKey]: [...conversationMessages, formattedMessage]
                };
            });
            
            // If message is from current conversation partner, add to display
            if (messageData.sender === currentFriend || 
               (messageData.receiver === currentFriend && messageData.sender === username)) {
                setSenderText(prev => [...prev, formattedMessage]);
            }
            
            // Notification for messages from others when not in that conversation
            if (messageData.sender !== username && messageData.sender !== currentFriend) {
                toast(`New message from ${messageData.sender}`, {
                    icon: '📝'
                });
            }
        } catch (error) {
            console.error("Error handling message:", error);
        }
    };

    // Handle broadcast messages
    const handleBroadcastMessage = (message) => {
        const messageData = JSON.parse(message.body);
        console.log("Broadcast message:", messageData);
        
        // Handle broadcasts (user online status, etc.)
        if (messageData.type === 'STATUS') {
            toast(`${messageData.user} is ${messageData.status}`, {
                icon: messageData.status === 'ONLINE' ? '🟢' : '⚪'
            });
        }
    };

    // Send a message
    const handleMessageSent = (messageContent) => {
        if (!messageContent || !currentFriend || !stompClientRef.current?.active) {
            if (!stompClientRef.current?.active) {
                toast.error("Not connected to chat server");
            }
            return;
        }
        
        // Create message object
        const messageObject = {
            sender: username,
            receiver: currentFriend,
            content: messageContent,
            timestamp: new Date().toISOString()
        };
        
        // Add message to local display immediately (optimistic UI)
        const formattedMessage = {
            type: "text",
            content: messageContent,
            sender: username,
            receiver: currentFriend,
            time: new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
        };
        
        setSenderText(prev => [...prev, formattedMessage]);
        
        // Update messages state
        setMessages(prev => {
            const conversationKey = [username, currentFriend].sort().join("_");
            const conversationMessages = prev[conversationKey] || [];
            return {
                ...prev,
                [conversationKey]: [...conversationMessages, formattedMessage]
            };
        });
        
        // Send via WebSocket
        stompClientRef.current.publish({
            destination: "/app/chat.private",
            body: JSON.stringify(messageObject)
        });
    };

    // Scroll to bottom of chat when messages change
    useEffect(() => {
        if (chatDisplayRef.current) {
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        }
    }, [senderText]);

    // Handle GIF selection
    const handleGifSelect = (gif) => {
        const timestamp = new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
        const gifMessage = {
            type: "gif",
            content: gif.url,
            sender: username,
            receiver: currentFriend,
            time: timestamp
        };
        
        // Add to local display
        setSenderText(prev => [...prev, gifMessage]);
        
        // Send via WebSocket if connected
        if (stompClientRef.current?.active) {
            stompClientRef.current.publish({
                destination: "/app/chat.private",
                body: JSON.stringify({
                    sender: username,
                    receiver: currentFriend,
                    content: gif.url,
                    type: "gif",
                    timestamp: new Date().toISOString()
                })
            });
        }
    };

    return (
        <div className="parent-dashboard">  
            <Toaster />
            <ConnectionStatus status={connectionStatus} />
            
            <FriendsList 
                friends={friends} 
                currentFriend={currentFriend}
                setCurrentFriend={setCurrentFriend}
            />
            
            <ChatArea 
                username={username}
                currentFriend={currentFriend}
                messages={senderText}
                connectionStatus={connectionStatus}
                onMessageSend={handleMessageSent}
                onGifSelect={handleGifSelect}
                chatDisplayRef={chatDisplayRef}
            />
        </div>
    );
}

export default Dashboard;
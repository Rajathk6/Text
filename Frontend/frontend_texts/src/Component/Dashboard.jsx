import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import toast, { Toaster } from "react-hot-toast";
import ApiMapping from "../Config/ApiMapping";
import FriendsList from "./FriendsList";
import ChatArea from "./ChatArea";

// Helper function to format timestamps safely
const formatTimestamp = (timestamp) => {
    if (!timestamp) return "No time"; 
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) { 
        console.warn("Invalid timestamp received:", timestamp);
        return "Invalid time";
    }
    try {
        // Format: DD/MM/YYYY, HH:MM:SS (24-hour)
        return date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });
    } catch (error) {
        console.error("Error formatting timestamp:", timestamp, error);
        return "Time error";
    }
};


function Dashboard() {
    const location = useLocation();
    const { username } = location.state || {};

    const [friends, setFriends] = useState([]);
    const [currentFriend, setCurrentFriend] = useState(null);
    const [messages, setMessages] = useState({}); // Central state for all messages
    const [smallScreen, setSmallScreen] = useState(false);
    console.log(smallScreen);
    const stompClientRef = useRef(null);
    const chatDisplayRef = useRef(null);

    const getConversationKey = (user1, user2) => {
        if (!user1 || !user2) return null; 
        return [user1.trim().toLowerCase(), user2.trim().toLowerCase()].sort().join("_");
    }

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
            if (Array.isArray(friendresponse.data)) {
                setFriends(friendresponse.data);
            } else {
                console.error("API did not return an array for friends list:", friendresponse.data);
                setFriends([]);
            }
        } catch (error) {
            setFriends([])
            console.error("Error fetching friends list:", error?.response?.data || error.message);
            toast.error("Failed to load friends list");
        }
    };

    // Fetch conversation history when a friend is selected
    useEffect(() => {
        if (currentFriend && username) {
            fetchConversationHistory(username, currentFriend);
            console.log("sender: "+username)
            console.log("receiver: " + currentFriend)
        }
    }, [currentFriend, username]);

    // Fetch conversation history between two users
    const fetchConversationHistory = async (user1, user2) => {
        const conversationKey = getConversationKey(user1, user2);
        if (!conversationKey) return; // Don't fetch if key is invalid

        try {
            const response = await ApiMapping.get(
                `/api/messages/conversation?user1=${encodeURIComponent(user1)}&user2=${encodeURIComponent(user2)}`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            // Format and set messages
            const formattedMessages = response.data.map(msg => ({
                type: msg.type || "text", // Default to text if type is missing
                content: msg.content,
                sender: msg.sender,
                receiver: msg.receiver,
                timestamp: msg.timestamp, // Store raw timestamp
                // Format time for display using the helper
                time: formatTimestamp(msg.timestamp)
            }));

            // Update messages state for this specific conversation
            setMessages(prev => ({
                ...prev,
                [conversationKey]: formattedMessages
            }));
            console.log("conversation history fetched for key:", conversationKey);

        } catch (error) {
            console.error("Error fetching conversation:", error);
            toast.error("Failed to load conversation history");
            // Clear messages for this conversation on error
             setMessages(prev => ({
                ...prev,
                [conversationKey]: []
            }));
        }
    };

    // Setup WebSocket connection
    useEffect(() => {
        friendListRetrieval();

        if (!username) {
            toast.error("Username not found. Please login again.");
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws-endpoint"),
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                login: username,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        });

        client.onConnect = function() {
            setConnectionStatus("connected");
            toast.success("Connected to chat server!");
            const userQueue = `/user/${username}/messages`; 
            console.log(`Subscribing to: ${userQueue}`);
            client.subscribe(userQueue, handleIncomingMessage);
            client.subscribe('/topic/public', handleBroadcastMessage);
        };

        client.onStompError = function(frame) {
            setConnectionStatus("error");
            console.error('STOMP error:', frame.headers?.message || 'Unknown STOMP error', frame);
            toast.error("Connection error: " + (frame.headers?.message || "Unknown STOMP error"));
        };

        client.onWebSocketClose = (event) => {
             console.log("WebSocket closed", event);
             toast.error("Disconnected from chat server");
        };

        client.onWebSocketError = (error) => {
            setConnectionStatus("error");
            console.error("WebSocket error:", error);
            toast.error("WebSocket connection error");
        };

        stompClientRef.current = client;
        client.activate();

        return () => {
            if (stompClientRef.current?.active) {
                stompClientRef.current.deactivate();
                console.log("STOMP client deactivated");
            }
        };

    }, [username]); // Only re-run when username changes

    // Handle incoming personal messages
    const handleIncomingMessage = useCallback((message) => {
        console.log("Incoming STOMP Message:", message);
        try {
            const messageData = JSON.parse(message.body);
            console.log("Received message object:", messageData);

            // Basic validation
            if (!messageData.sender || !messageData.receiver || !messageData.content || !messageData.timestamp) {
                 console.error("Received incomplete message:", messageData);
                 return;
            }

            const formattedMessage = {
                type: messageData.type || "text",
                content: messageData.content,
                sender: messageData.sender,
                receiver: messageData.receiver,
                timestamp: messageData.timestamp, // Store raw timestamp
                // Format time for display using the helper
                time: formatTimestamp(messageData.timestamp)
            };
            console.log("Received formatted message time: " + formattedMessage.time);

            // Update the central messages state
            setMessages(prev => {
                const conversationKey = getConversationKey(messageData.sender, messageData.receiver);
                if (!conversationKey) {
                    console.error("Could not determine conversation key for incoming message.");
                    return prev; // Don't update if key is invalid
                }
                const currentConversation = prev[conversationKey] || [];

                // Optional: Add a check to prevent adding exact duplicates based on timestamp/sender/content
                if (currentConversation.some(msg => msg.timestamp === formattedMessage.timestamp && msg.sender === formattedMessage.sender && msg.content === formattedMessage.content)) {
                    console.log("Duplicate message detected based on timestamp, sender, and content. Skipping.");
                    return prev;
                }

                return {
                    ...prev,
                    [conversationKey]: [...currentConversation, formattedMessage]
                };
            });

            // Notification for messages from others when not in that conversation
            if (messageData.sender !== username && messageData.sender !== currentFriend) {
                toast(`New message from ${messageData.sender}`, {
                    icon: '📝'
                });
            }
        } catch (error) {
            console.error("Error handling incoming message:", error);
            console.error("Failed message body:", message?.body); // Log raw body on error
        }
    }, [username, currentFriend]); // Dependencies for notification logic

    // Handle broadcast messages
    const handleBroadcastMessage = (message) => {
        try {
            const messageData = JSON.parse(message.body);
            console.log("Broadcast message:", messageData);

            // Handle broadcasts (user online status, etc.)
            if (messageData.type === 'STATUS') {
                toast(`${messageData.user} is ${messageData.status}`, {
                    icon: messageData.status === 'ONLINE' ? '🟢' : '⚪'
                });
            }
        } catch (error) {
            console.error("Error handling broadcast message:", error);
        }
    };

    // Send a message
    const handleMessageSent = (messageContent) => {
        if (!messageContent || !currentFriend || !stompClientRef.current?.active) {
            if (!stompClientRef.current?.active) {
                toast.error("Not connected to chat server");
            } else if (!currentFriend) {
                toast.error("Please select a friend to chat with.");
            }
            return;
        }

        const clientTimestamp = new Date(); // Get current date object
        const isoTimestamp = clientTimestamp.toISOString(); // Use ISO format for backend

        const messageObject = {
            sender: username,
            receiver: currentFriend,
            content: messageContent,
            type: "text",
            timestamp: isoTimestamp // Send ISO string
        };
        console.log("Sending message object:", messageObject);

        // Optimistically update UI
        const formattedTextMessage = {
            type: "text",
            content: messageContent,
            sender: username,
            receiver: currentFriend,
            timestamp: isoTimestamp, // Store raw timestamp (client-generated for optimistic)
            // Format time for display using the helper
            time: formatTimestamp(clientTimestamp) // Format the Date object directly
        };
        console.log("Optimistic update formatted time: " + formattedTextMessage.time);

        // Update central messages state
        setMessages(prev => {
            const conversationKey = getConversationKey(username, currentFriend);
            if (!conversationKey) return prev;
            const conversationMessages = prev[conversationKey] || [];
            return {
                ...prev,
                [conversationKey]: [...conversationMessages, formattedTextMessage]
            };
        });

        // Send via WebSocket
        stompClientRef.current.publish({
            destination: "/app/chat.private",
            body: JSON.stringify(messageObject)
        });
    };

     // Handle GIF selection
    const handleGifSelect = (gif) => {
        if (!currentFriend || !stompClientRef.current?.active) {
             toast.error("Select a friend and ensure you are connected.");
             return;
        }
        if (!gif || !gif.url) {
            console.error("Invalid GIF object selected:", gif);
            toast.error("Invalid GIF selected.");
            return;
        }

        const clientTimestamp = new Date();
        const isoTimestamp = clientTimestamp.toISOString();

        const gifMessage = {
            type: "gif",
            content: gif.url,
            sender: username,
            receiver: currentFriend,
            timestamp: isoTimestamp, // Store raw timestamp (client-generated)
            // Format time for display using the helper
            time: formatTimestamp(clientTimestamp)
        };
        console.log("Optimistic GIF update formatted time: " + gifMessage.time);

        const gifObject = {
            sender: username,
            receiver: currentFriend,
            content: gif.url,
            timestamp: isoTimestamp, 
            type: "gif"
        }

        // Optimistically update UI
        setMessages(prev => {
            const conversationKey = getConversationKey(username, currentFriend);
             if (!conversationKey) return prev;
            const conversationMessages = prev[conversationKey] || [];
            return {
                ...prev,
                [conversationKey]: [...conversationMessages, gifMessage]
            };
        });

        // Send via WebSocket
        stompClientRef.current.publish({
            destination: "/app/chat.private",
            body: JSON.stringify(gifObject)
        });
    };


    // Derive displayed messages from the central state
    const currentConversationKey = useMemo(() => {
        return getConversationKey(username, currentFriend);
    }, [username, currentFriend]);

    const displayedMessages = currentConversationKey ? (messages[currentConversationKey] || []) : [];

    // Scroll to bottom of chat when displayed messages change
    useEffect(() => {
        if (chatDisplayRef.current) {
            // Use setTimeout to allow the DOM to update before scrolling
            setTimeout(() => {
                 chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
            }, 50); // Small delay might be needed
        }
    }, [displayedMessages]); // Depend on the derived displayedMessages

    return (
        <div className="parent-dashboard">
            <Toaster position="top-right" />
            {/* <ConnectionStatus status={connectionStatus} /> */}

            <FriendsList
                friends={friends}
                currentFriend={currentFriend}
                setCurrentFriend={setCurrentFriend}
                username={username}
                setSmallScreen={setSmallScreen}
                smallScreen={smallScreen}
                messages={displayedMessages}
            />

            <ChatArea
                username={username}
                currentFriend={currentFriend}
                messages={displayedMessages} 
                smallScreen={smallScreen}
                // connectionStatus={connectionStatus}
                onMessageSend={handleMessageSent}
                onGifSelect={handleGifSelect}
                chatDisplayRef={chatDisplayRef}
            />
        </div>
    );
}

export default Dashboard;
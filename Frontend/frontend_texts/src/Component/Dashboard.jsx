import { BsSendFill, BsThreeDots } from "react-icons/bs";
import { MdPermMedia, MdOutlineGif, MdEmojiEmotions } from "react-icons/md";
import { FaCameraRetro } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { FiSearch } from "react-icons/fi";
import { useLocation } from "react-router";
import ApiMapping from "../Config/ApiMapping";
import { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import GifPicker from "gif-picker-react";
import EmojiPicker from 'emoji-picker-react';
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

function Dashboard() {
    const location = useLocation();
    const { username } = location.state || {};

    const [friends, setFriends] = useState([]); // list of all friends i can text
    const [currentFriend, setCurrentFriend] = useState(null) // the current user i am texting
    const [senderText, setSenderText] = useState([]) //. contains the messages sent 
    const [isGif, setIsGif] = useState(false); // validates if gif is sent or not
    const [isEmoji, setIsEmoji] = useState(false) // validates if emoji is sent or 
    const [stompClient, setStompClient] = useState(null);

    let stompClientRef = useRef(null);

    const apiKey = import.meta.env.VITE_TENOR_API_KEY
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
              
            console.log(friendresponse.data)

            setFriends(friendresponse.data); 
        } catch (error) {
            console.error("Error:", error.friendresponse?.data || error.message);
        }
    };
    
    // Fetch friends list when the component mounts

    useEffect(() => {
        friendListRetrieval()
        console.log("🟢 useEffect running");
        console.log("🟡 Username in useEffect:", username);
    
        console.log(username)
        const stompClient = Stomp.over(() => new SockJS("http://localhost:8080/ws-endpoint"));
        console.log(stompClient)
        stompClient.connect({}, () => {
            console.log("✅ Connected to WebSocket");

            stompClient.subscribe("/topic/message", (msg) => {
                console.log("📩 Received message:", msg.body);
                setMessage(msg.body);
            });

            stompClient.send("/app/chat", {}, "Hello from frontend");
        });

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect(() => {
                    console.log("❌ WebSocket Disconnected");
                });
            }
        };
    }, [username]); 

    function handleMessageSent() {
        document.getElementById("getGif").style.display = "none";
        document.getElementById("getEmoji").style.display = "none";
    
        const sendMessage = document.getElementById("placeholderText").value.trim();
        document.getElementById("placeholderText").value = "";
        if (stompClientRef.current?.connected) {
            console.log("websocket active")
        } else {
            console.log("websocket deactive")
        }
        if (sendMessage !== "" && currentFriend) {
            const messageObject = {
                sender: username,
                receiver: currentFriend,
                content: sendMessage
            };
    
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.publish({
                    destination: "/app/chat",
                    body: JSON.stringify(messageObject)
                });
            } else {
                console.warn("WebSocket connection is not active. Reconnecting...");
                toast.error("WebSocket disconnected. Refresh the page.");
            }
        }
    }

    function handleGifSelect(gif) {
        const timestamp = new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", second: "2-digit"})
        setSenderText(prevMessage => [...prevMessage, {type: "gif", content: gif.url, time: timestamp}])
        document.getElementById("getGif").style.display = "none";
    }

    function handleEmojiSelect(emoji) {
            const inputField = document.getElementById("placeholderText");
            inputField.value += emoji.emoji;
            inputField.focus();
    }

    function showGifBox() {
        setIsGif(prevState => !prevState)
        const giffy = document.getElementById("getGif")
        giffy.style.display = "block"
    }

    function showEmojiBox() {
        setIsEmoji(prevState => !prevState);
        document.getElementById("getEmoji").style.display = isEmoji ? "none" : "block";
    }
    

    return (
        <div className="parent-dashboard">  
            <Toaster />
            {/* Available friends */}
            <div className="dashboard-nav">
                {/* Friends Search Option */}
                <div className="search-friends">
                    <button><FiSearch /></button>
                    <input type="text" placeholder="Search for users..." />
                </div>

                {/* List of friends available to chat */}
                <div className="available-friends">
                    <ul>
                        {friends.length > 0 ? (
                            friends.map((friend, index) => (
                                <li key={index} onClick={() => {
                                    setCurrentFriend(friend)
                                }}>
                                    <p className="friend-avatar"><RxAvatar /></p>{friend}</li>
                            ))
                        ) : (
                            <p>No friends available</p>
                        )}
                    </ul>
                </div>
            </div>

            {/* Individual chatting area */}
            <div className="user-chat">
                {/* User info */}
                <div className="user-info">
                    <button className="avatar">
                        <RxAvatar />
                    </button>
                    <div className="user-status">
                        <h3>{currentFriend}</h3>
                        <p>Online</p>
                    </div>
                    <button className="search-text">
                        <FiSearch />
                    </button>
                    <button className="add-options">
                        <BsThreeDots />
                    </button>
                </div>


                {/* Chat display area */}
                <div className="chat-display">
                            {/* GIF RENDERING*/}
                    <div className="gif-display" id="getGif" style={{ 
                        display: isGif ? "block" : "none",
                        position: "fixed", 
                        left: "250px",
                        top : "10px",
                        bottom: "80px",
                        }}
                    >
                    <GifPicker tenorApiKey={apiKey} contentFilter="off" onGifClick={(gif) => handleGifSelect(gif)} height="100%" width="50em"/>
                    </div>

                            {/* EMOJI RENDERING */}
                    <div id="getEmoji" style={{
                        display: isEmoji ? "block" : "none",
                        position: "fixed", 
                        left: "350px",
                        top : "10px",
                        bottom: "80px",
                    }}>
                        <EmojiPicker onEmojiClick={(emoji) => handleEmojiSelect(emoji)} height="100%" width="30em"/>
                    </div>


                            {/* SEND MESSAGE OR GIF */}
                    <div className="sender">
                        <ul className="sender-header">
                            {senderText.map((message, index) => (
                            <li className="sender-message" key={index}>
                                {message.type === "text" ? message.content 
                                    : message.type === "gif" ? <img src={message.content} alt="GIF" style={{width: "200px"}}/>
                                    : <span style={{ fontSize: "1.5rem" }}>{message.content}</span>}
                                    <p style={{fontSize: "0.75rem", fontFamily: "Open Sans, sans-serif"}}>{message.time}</p>
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>


                {/* Texting area */}
                <div className="text-area">
                    <button className="text-area-icons"><MdPermMedia /></button>
                    <button className="text-area-icons"  disabled={!currentFriend} onClick={showEmojiBox}><MdEmojiEmotions /></button>
                    
                    <input type="text" id="placeholderText" autoComplete="off" placeholder="Enter your message..." onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleMessageSent()
                        }
                    }}/>
                    <button onClick={handleMessageSent}  disabled={!currentFriend} className="text-area-icons"><BsSendFill /></button>
                    <button className="text-area-icons gif"  disabled={!currentFriend} onClick={showGifBox}><MdOutlineGif /></button>
                    
                    <button className="text-area-icons camera"><FaCameraRetro /></button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

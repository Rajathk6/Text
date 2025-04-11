import { useState } from "react";
import { BsSendFill, BsThreeDots } from "react-icons/bs";
import { MdPermMedia, MdOutlineGif, MdEmojiEmotions } from "react-icons/md";
import { FaCameraRetro } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { FiSearch } from "react-icons/fi";
import GifPicker from "gif-picker-react";
import EmojiPicker from 'emoji-picker-react';
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";

function ChatArea({ 
    username, 
    currentFriend, 
    messages, 
    connectionStatus, 
    onMessageSend, 
    onGifSelect,
    chatDisplayRef
}) {
    const [isGif, setIsGif] = useState(false);
    const [isEmoji, setIsEmoji] = useState(false);
    const apiKey = import.meta.env.VITE_TENOR_API_KEY;

    // Handle emoji selection
    function handleEmojiSelect(emoji) {
        const inputField = document.getElementById("placeholderText");
        inputField.value += emoji.emoji;
        inputField.focus();
    }

    // Show/hide GIF picker
    function showGifBox() {
        setIsGif(prevState => !prevState);
        document.getElementById("getGif").style.display = isGif ? "none" : "block";
    }

    // Show/hide emoji picker
    function showEmojiBox() {
        setIsEmoji(prevState => !prevState);
        document.getElementById("getEmoji").style.display = isEmoji ? "none" : "block";
    }

    // Handle message sending
    function handleMessageSent() {
        document.getElementById("getGif").style.display = "none";
        document.getElementById("getEmoji").style.display = "none";
        
        const messageInput = document.getElementById("placeholderText");
        const messageContent = messageInput.value.trim();
        messageInput.value = "";
        
        if (messageContent) {
            onMessageSend(messageContent);
        }
    }

    return (
        <div className="user-chat">
            <ChatHeader 
                currentFriend={currentFriend}
                connectionStatus={connectionStatus}
            />

            <div className="chat-display" ref={chatDisplayRef}>
                {/* GIF picker */}
                <div className="gif-display" id="getGif" style={{ 
                    display: "none",
                    position: "fixed", 
                    left: "250px",
                    top: "10px",
                    bottom: "80px",
                    zIndex: 10
                }}>
                    <GifPicker 
                        tenorApiKey={apiKey} 
                        contentFilter="off" 
                        onGifClick={onGifSelect} 
                        height="100%" 
                        width="50em"
                    />
                </div>

                {/* Emoji picker */}
                <div id="getEmoji" style={{
                    display: "none",
                    position: "fixed", 
                    left: "350px",
                    top: "10px",
                    bottom: "80px",
                    zIndex: 10
                }}>
                    <EmojiPicker 
                        onEmojiClick={handleEmojiSelect} 
                        height="100%" 
                        width="30em"
                    />
                </div>

                <MessageList 
                    messages={messages}
                    username={username}
                />
            </div>

            {/* Message input area */}
            <div className="text-area">
                <button className="text-area-icons"><MdPermMedia /></button>
                <button 
                    className="text-area-icons" 
                    disabled={!currentFriend || connectionStatus !== 'connected'} 
                    onClick={showEmojiBox}
                >
                    <MdEmojiEmotions />
                </button>
                
                <input 
                    type="text" 
                    id="placeholderText" 
                    autoComplete="off" 
                    placeholder={!currentFriend ? "Select a friend to start chatting" : 
                                connectionStatus !== 'connected' ? "Connecting..." : 
                                "Type your message here..."}
                    disabled={!currentFriend || connectionStatus !== 'connected'}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleMessageSent();
                        }
                    }}
                />
                
                <button 
                    onClick={handleMessageSent} 
                    disabled={!currentFriend || connectionStatus !== 'connected'} 
                    className="text-area-icons"
                >
                    <BsSendFill />
                </button>
                
                <button 
                    className="text-area-icons gif" 
                    disabled={!currentFriend || connectionStatus !== 'connected'} 
                    onClick={showGifBox}
                >
                    <MdOutlineGif />
                </button>
                
                <button className="text-area-icons camera">
                    <FaCameraRetro />
                </button>
            </div>
        </div>
    );
}

export default ChatArea;
import { useState, useEffect, useRef } from "react";
import { BsSendFill } from "react-icons/bs";
import { MdPermMedia, MdOutlineGif, MdEmojiEmotions } from "react-icons/md";
import { FaCameraRetro } from "react-icons/fa";
import GifPicker from "gif-picker-react";
import EmojiPicker from "emoji-picker-react";
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

    const inputRef = useRef(null);
    const emojiRef = useRef(null);
    const gifRef = useRef(null);

    // Close pickers if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                emojiRef.current && !emojiRef.current.contains(event.target) &&
                gifRef.current && !gifRef.current.contains(event.target)
            ) {
                setIsGif(false);
                setIsEmoji(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle emoji selection
    function handleEmojiSelect(emoji) {
        if (inputRef.current) {
            inputRef.current.value += emoji.emoji;
        }
    }

    // Show/hide GIF picker
    function showGifBox(e) {
        e.stopPropagation();
        setIsGif(prev => {
            if (!prev) setIsEmoji(false);
            return !prev;
        });
    }

    // Show/hide Emoji picker
    function showEmojiBox(e) {
        e.stopPropagation();
        setIsEmoji(prev => {
            if (!prev) setIsGif(false);
            return !prev;
        });
    }

    // Send message
    function handleMessageSent() {
        const messageContent = inputRef.current.value.trim();
        inputRef.current.value = "";

        setIsGif(false);
        setIsEmoji(false);

        if (messageContent) {
            onMessageSend(messageContent);
        }
    }

    return (
        <div className="user-chat">
            <ChatHeader 
                username={username}
                currentFriend={currentFriend}
                connectionStatus={connectionStatus}
            />

            <div className="chat-display" ref={chatDisplayRef}>
                {/* GIF picker */}
                <div 
                    ref={gifRef}
                    style={{ 
                        display: isGif ? "block" : "none",
                        position: "fixed", 
                        left: "350px",
                        top: "10px",
                        width: "50%",
                        height: "30em",
                        overflowY: "auto",
                        zIndex: 10,
                        borderRadius: "10px",
                        padding: "10px"
                    }}
                >
                    <GifPicker 
                        tenorApiKey={apiKey} 
                        contentFilter="off" 
                        onGifClick={onGifSelect} 
                        theme="light"
                        height="100%"
                    />
                </div>

                {/* Emoji picker */}
                <div 
                    ref={emojiRef}
                    style={{
                        display: isEmoji ? "block" : "none",
                        position: "fixed", 
                        left: "350px",
                        top: "10px",
                        bottom: "80px",
                        zIndex: 10,
                        borderRadius: "10px",
                        padding: "10px"
                    }}
                >
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
                    ref={inputRef}
                    autoComplete="off" 
                    placeholder={
                        !currentFriend ? "Select a friend to start chatting" :
                        connectionStatus !== 'connected' ? "Connecting..." : 
                        "Type your message here..."
                    }
                    disabled={!currentFriend || connectionStatus !== 'connected'}
                    onClick={() => {
                        setIsGif(false);
                        setIsEmoji(false);
                    }}
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

import { useState, useEffect, useRef } from "react";
import { BsSendFill } from "react-icons/bs";
import { MdOutlineGif, MdEmojiEmotions } from "react-icons/md";
import GifPicker from "gif-picker-react";
import EmojiPicker from "emoji-picker-react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";

function ChatArea({ 
    username, 
    currentFriend, 
    messages,  
    onMessageSend, 
    onGifSelect,
    chatDisplayRef,
    smallScreenFirst,
    setSmallScreenFirst
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
        console.log("inside chatArea:", smallScreenFirst);
    }

    return (
        <div className="user-chat" 
            style={{display: window.innerWidth > 480 ? "flex" : smallScreenFirst ? "none" : "flex"}}
        >
            <ChatHeader 
                username={username}
                currentFriend={currentFriend}
                setSmallScreenFirst={setSmallScreenFirst}
                smallScreenFirst={smallScreenFirst}
            />

            <div className="chat-display" ref={chatDisplayRef}>
                {/* GIF picker */}
                <div className="handlegifbox"
                    ref={gifRef}
                    style={{
                        display: isGif ? "grid" : "none",
                    }}
                >
                    <GifPicker 
                        tenorApiKey={apiKey} 
                        contentFilter="off" 
                        onGifClick={onGifSelect} 
                        theme="light"
                        className="custom-gif-picker"                        
                    />
                </div>

                {/* Emoji picker */}
                <div className="HandleEmojibox"
                    ref={emojiRef}
                    style={{
                        display: isEmoji ? "block" : "none",
                        
                    }}
                >
                    <EmojiPicker 
                        onEmojiClick={handleEmojiSelect} 
                        className="custom-emoji-picker"
                    />
                </div>

                <MessageList 
                    messages={messages}
                    username={username}
                />
            </div>

            {/* Message input area */}
            <div className="text-area">
                {/* <button className="text-area-icons"><MdPermMedia /></button> */}

                <button 
                    className="text-area-icons" 
                    disabled={!currentFriend } 
                    onClick={showEmojiBox}
                >
                    <MdEmojiEmotions />
                </button>

                <input 
                    type="text" 
                    ref={inputRef}
                    autoComplete="off" 
                    placeholder={
                        !currentFriend ? "Select a friend to start chatting" : "Enter a message"
                    }
                    disabled={!currentFriend}
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
                    disabled={!currentFriend} 
                    className="text-area-icons"
                >
                    <BsSendFill />
                </button>

                <button 
                    className="text-area-icons gif" 
                    disabled={!currentFriend } 
                    onClick={showGifBox}
                >
                    <MdOutlineGif />
                </button>

                
            </div>
        </div>
    );
}

export default ChatArea;

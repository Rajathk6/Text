import { BsSendFill, BsThreeDots } from "react-icons/bs";
import { MdOutlineGif, MdPermMedia, MdEmojiEmotions } from "react-icons/md";
import { FaCameraRetro } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { FiSearch } from "react-icons/fi";
import { useLocation } from "react-router";
import ApiMapping from "../Config/ApiMapping";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

function Dashboard() {
    const location = useLocation();
    const { username } = location.state || {};

    const [friends, setFriends] = useState([]); 
    const [friendChat, setFriendChat] = useState(username)
    const [senderText, setSenderText] = useState([])

    console.log(senderText)
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
    let isMounted = true;
    useEffect(() => {
        toast.promise(friendListRetrieval(),{
            loading: "loading friends list",
            success: () => isMounted ?"successfully loaded" : "",
            error: "error loading friends list"
        })
        return () => {
            isMounted = false
        }
    }, []); 

    function handleMessageSent() {
        const sendMessage = document.getElementById("placeholderText").value
        document.getElementById("placeholderText").value = ""
        if(sendMessage!=="") {
            setSenderText(prevMessage => [...prevMessage, sendMessage])
        }
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
                                <li key={index} onClick={() => setFriendChat(friend)}>
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
                        <h3>{friendChat}</h3>
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
                    <div className="sender">
                        <ul className="sender-header">
                            {senderText.map((message, index) => (
                            <li className="sender-message" key={index}>{message}</li>
                            ))}
                        </ul>
                    </div>
                </div>


                {/* Texting area */}
                <div className="text-area">
                    <button className="text-area-icons"><MdPermMedia /></button>
                    <button className="text-area-icons"><MdEmojiEmotions /></button>
                    
                    <input type="text" id="placeholderText" placeholder="Enter your message..." onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleMessageSent()
                        }
                    }}/>
                    <button onClick={handleMessageSent} className="text-area-icons"><BsSendFill /></button>
                    
                    <button className="text-area-icons gif"><MdOutlineGif /></button>
                    <button className="text-area-icons camera"><FaCameraRetro /></button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

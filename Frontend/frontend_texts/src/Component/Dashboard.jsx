import { BsSendFill, BsThreeDots } from "react-icons/bs";
import { MdOutlineGif, MdPermMedia, MdEmojiEmotions } from "react-icons/md";
import { FaCameraRetro } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { FiSearch } from "react-icons/fi";

function Dashboard() {
    return (
        <div className="parent-dashboard">  

                            {/* Available friends */}

            <div className="dashboard-nav">
                            {/* Friends Search Option */}
                <div className="search-friends">
                    <button><FiSearch /></button>
                    <input type="text" placeholder="Search for users on text " />
                </div>

                            {/* list of friends available to chat */}
                
                <div className="available-friends">

                </div>
            </div>



                            {/* indiviual chatting area */}

            <div className="user-chat">

                            {/* user info */}
                <div className="user-info">
                    <button className="avatar">
                        <RxAvatar />
                    </button>
                    <div className="user-status">
                        <h3>User 1</h3>
                        <p>online</p>
                    </div>
                    
                    <button className="search-text">
                        <FiSearch />
                    </button>
                    <button className="add-options">
                    <BsThreeDots />
                    </button>
                </div>

                            {/* chat display area */}
                <div className="chat-display">

                </div>

                            {/* texting area */}
                <div className="text-area">
                    <button className="text-area-icons">
                        <MdPermMedia  />
                    </button>
                    <button className="text-area-icons"><MdEmojiEmotions /></button>
                    
                    <input type="text" placeholder="Enter your message..." />
                    <button className="text-area-icons"> <BsSendFill /> </button>
                    
                    <button className="text-area-icons gif">
                    <MdOutlineGif />
                    </button>
                    <button className="text-area-icons camera"> <FaCameraRetro/></button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
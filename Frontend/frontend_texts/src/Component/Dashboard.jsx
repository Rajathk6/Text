import { BsSendFill } from "react-icons/bs";
import { MdOutlineGif, MdPermMedia, MdEmojiEmotions } from "react-icons/md";
import { FaCameraRetro } from "react-icons/fa";

function Dashboard() {
    return (
        <div className="parent-dashboard">   

                            {/* list of friends available to chat */}

            <div className="dashboard-nav">

            </div>

                            {/* indiviual chatting area */}

            <div className="user-chat">

                            {/* user info */}
                <div className="user-info">

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
import { RxAvatar } from "react-icons/rx";
import { FiSearch } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";

function ChatHeader({ currentFriend, connectionStatus }) {
    return (
        <div className="user-info">
            <button className="avatar">
                <RxAvatar />
            </button>
            <div className="user-status">
                <h3>{currentFriend || "Select a conversation"}</h3>
                <p>{connectionStatus === 'connected' ? 'Online' : 'Offline'}</p>
            </div>
            <button className="search-text">
                <FiSearch />
            </button>
            <button className="add-options">
                <BsThreeDots />
            </button>
        </div>
    );
}

export default ChatHeader;
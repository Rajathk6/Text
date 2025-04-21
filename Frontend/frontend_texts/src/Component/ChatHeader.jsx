import { RxAvatar } from "react-icons/rx";

function ChatHeader({ currentFriend, username}) {
    return (
        <div className="user-info">
            <button className="avatar">
                <RxAvatar />
            </button>
            <div className="user-status">
                <h3>{currentFriend || `${username}(You)`}</h3>
                {/* <p>{connectionStatus === 'connected' ? 'Online' : 'Offline'}</p> */}
            </div>
        </div>
    );
}

export default ChatHeader;
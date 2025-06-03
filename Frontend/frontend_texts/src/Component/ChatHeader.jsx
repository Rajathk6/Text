import { RxAvatar } from "react-icons/rx";
import { MdArrowBackIosNew } from "react-icons/md";

function ChatHeader({ currentFriend, username, smallScreenFirst, setSmallScreenFirst}) {
    function returnToFirst() {
        setSmallScreenFirst(true) //switches to page 1
    }

    return (
        <div className="user-info">
            <button onClick={returnToFirst} style={{display: window.innerWidth<480 ? "flex": "none"}}>
                <MdArrowBackIosNew size={30}/>
            </button>
            
            <button className="avatar">
                <RxAvatar />
            </button>
            <div className="user-status">
                <h3>{currentFriend || `${username}(You)`}</h3>
            </div>
        </div>
    );
}

export default ChatHeader;
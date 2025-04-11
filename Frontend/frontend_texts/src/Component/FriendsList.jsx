import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";

function FriendsList({ friends, currentFriend, setCurrentFriend }) {
    const [searchTerm, setSearchTerm] = useState("");
    
    // Filter friends based on search term
    const filteredFriends = friends.filter(friend => 
        friend.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div className="dashboard-nav">
            <div className="search-friends">
                <button><FiSearch /></button>
                <input 
                    type="text" 
                    placeholder="Search for users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="available-friends">
                <ul>
                    {filteredFriends.length > 0 ? (
                        filteredFriends.map((friend, index) => (
                            <li key={index} 
                                onClick={() => setCurrentFriend(friend)}
                                style={{
                                    backgroundColor: currentFriend === friend ? '#c2e7ff' : ''
                                }}
                            >
                                <p className="friend-avatar"><RxAvatar /></p>{friend}
                            </li>
                        ))
                    ) : (
                        <p>No friends available</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default FriendsList;
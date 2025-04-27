import { useState, useEffect, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import apiUrl from "../Config/ApiMapping";

const truncateText = (text, maxLength = 30) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

function FriendsList({ friends, currentFriend, setCurrentFriend, setSmallScreen, smallScreen }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [globalResults, setGlobalResults] = useState([]);

  // Memoize the filtered list so that it doesn't re-calculate on every render unless dependencies change
  const filteredFriends = useMemo(() => {
    return friends.filter(friend =>
      friend.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [friends, searchTerm]);

  useEffect(() => {
    if (searchTerm.trim() !== "" && filteredFriends.length === 0) {
      const fetchGlobalResults = async () => {
        try {
          const globalResponse = await apiUrl.get(
            `/api/dashboard/users/search?q=${encodeURIComponent(searchTerm)}`,
            {
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
          setGlobalResults(globalResponse.data);
        } catch (error) {
          console.log("global search error:", error);
          setGlobalResults([]);
        }
      };
      fetchGlobalResults();
    } else {
      setGlobalResults([]);
    }
  }, [searchTerm, filteredFriends.length]);

  return (
    <div className="dashboard-nav"
    style={{display: window.innerWidth > 480 ? "flex" : smallScreen ? "none" : "flex"}}
    >
      <p className="navigation-header">Messages...</p>
      
      <div className="available-friends">
        <ul>
          {filteredFriends.length > 0 ? (
            // If local friends match, render those.
            filteredFriends.map((friend , index) => (
              <li 
                key={index} 
                onClick={() => {
                  setCurrentFriend(friend)
                  window.innerWidth < 480 ? setSmallScreen(true) : setSmallScreen(false)
                }}
                style={{
                  backgroundColor: currentFriend === friend ? "#c2e7ff" : "",
                  cursor: "pointer"
                }}
              >
                <p className="friend-avatar"><RxAvatar /></p>{friend}
              </li>
            ))
          ) : searchTerm.trim() !== "" && globalResults.length > 0 ? (
            // If no local matches are found, but global search returns results, render those.
            globalResults.map((user) => (
              <li 
                key={user.id}
                onClick={() => {
                  setCurrentFriend(user.username)
                  window.innerWidth < 480 ? setSmallScreen(true) : setSmallScreen(false)
                }}
                style={{
                  backgroundColor: currentFriend === user.username ? "#c2e7ff" : "",
                  cursor: "pointer"
                }}
              >
                <p className="friend-avatar"><RxAvatar /></p>{user.username}
              </li>
            ))
          ) : (
            <p>No User Found</p>
          )}
        </ul>
      </div>
        <div className="search-friends">
          <button><FiSearch /></button>
          <input 
            type="text" 
            placeholder="Search for users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
  );
}

export default FriendsList;

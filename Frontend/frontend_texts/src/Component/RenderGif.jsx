import axios from "axios";
import { useState } from "react";
import { MdOutlineGif} from "react-icons/md";

function RenderGif({onGifSelect}) {

    const [showGifBox, setShowGifBox] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showGif, setShowGif] = useState([]);

    const apiKey = process.env.REACT_APP_TENOR_API_KEY
    
    const fetchAPI = async (term) => {
        try {
            const response = await axios.get(
                `https://tenor.googleapis.com/v2/search?q=${term}&key=${apiKey}&limit=10&media_filter=gif`
            )
            setShowGif(response.data.results)
        } catch (error) {
            console.log("Error fetching GIFS:" + error)
        }
    }

    function handleChange(e) {
        setSearchTerm(e.target.value)
        showGif(fetchAPI)
    }

    function handleGifClick(gifUrl) {
        onGifSelect(gifUrl);
        setShowGifBox(false)
    }

    return (
        <div style={{position: "relative"}}>
            <button className="text-area-icons gif" onClick={() => setShowGifBox(!showGifBox)}>
                <MdOutlineGif /></button>

            {
                showGifBox && (
                    <div style={{
                        position: "absolute",
                        bottom: "40px",
                        backgroundColor: "#fff",
                        padding: "10px",
                        borderRadius: "10px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                        width: "250px",
                        zIndex: 999,
                        }}
                        >
                        <input type="text" placeholder="Search for Gifs" onChange={handleChange} value={searchTerm}
                        style={{
                            width: "100%",
                            padding: "5px" 
                        }}/>
                        <div style={{display: "flex", flexWrap: "wrap", marginTop: "10px"}}>
                            {gifs.map((gif) => (
                                <img key={gif.id} src={gif.media_format.gif.url} alt="gif" 
                                style={{
                                     width: "70px", margin: "5px", cursor: "pointer"
                                }} onClick={() => handleGifClick(gif.media_format.gif.url)}/>
                            ))}
                        </div>
                    </div>
                )
            }
        </div>  
    )
}

export default RenderGif
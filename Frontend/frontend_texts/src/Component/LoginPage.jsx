import { useState } from "react";
import { TbBubbleText } from "react-icons/tb";
import ApiMapping from "../Config/ApiMapping";
import toast, { Toaster } from 'react-hot-toast';

function LoginPage() {
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    function handleButtonClick() {
        async (e) => {
            e.preventDefault()
            try {
                await ApiMapping.post("/user/login", {username, password})
                alert("User Registration successfull")
                console.log("registered")
                toast.success("logged in")
            } catch (error) {
                console.error("Registration Error:", error);
                toast.error("failed to log in")
            }   
        }
    }

    return (
        <div className="main-auth-container">
            
            <div className="app-logo">
                <Toaster/>
                <a href="/" >
                <button className="main-text-logo">
                    <TbBubbleText />
                </button>  </a>
                <p>Text</p>
                
            </div>
            <div className="auth-form-container" >
                <h2>Login or create your account with <br />Text</h2>
                <form onSubmit={handleButtonClick}>
                <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Enter UserName "/> <br />
                <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter Password "/> <br />
                <button type="submit" className="loginbutton">Log in </button>
                </form>
                
            </div>
        </div>
    )
}

export default LoginPage
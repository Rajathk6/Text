import { useState } from "react";
import { TbBubbleText } from "react-icons/tb";
import ApiMapping from "../Config/ApiMapping";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); 

    

    const handleButtonClick = async (e) => {
        e.preventDefault();

        const response = ApiMapping.post("/api/auth/login", { username, password }); 
        toast.promise(
            response,
            {
                loading: 'Logging in...', 
                success: 'Logged in successfully!',
                error: 'Could not sign in. Please check your credentials.'
            }
        )   
        
        try {
            const loginpromise = await response
            console.log("Login Successful:", loginpromise.data);
            navigate("/dashboard");

        } catch (error) {
            console.log(username)
            console.log(password)
            console.error("Login Error:", error.loginpromise?.data || error.message);
        }
        
    };

    return (
        <div className="main-auth-container">
            <div className="app-logo">
                <Toaster />
                <a href="/">
                    <button className="main-text-logo">
                        <TbBubbleText />
                    </button>
                </a>
                <p>Text</p>
            </div>

            <div className="auth-form-container">
                <h2>Login or create your account with <br />Text</h2>

                <form className="form-attributes" onSubmit={handleButtonClick}>
                    <input onChange={(e) => setUsername(e.target.value)} type="text" name="username" placeholder="Enter UserName " required /><br />
                    <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="Enter Password " required /><br />
                    <button type="submit" className="loginbutton">Log in</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;

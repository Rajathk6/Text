import { useState } from "react";
import { TbBubbleText } from "react-icons/tb";
import ApiMapping from "../Config/ApiMapping";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom"; // Import useNavigate

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); 

    const handleButtonClick = async (e) => {
        e.preventDefault();
        
        try {
            const response = await ApiMapping.post("/api/auth/login", { username, password });

            console.log("Login Successful:", response.data);
            toast.success("Logged in successfully!");
            
            // Navigate to dashboard after successful login
            navigate("/dashboard");

        } catch (error) {
            console.log(username)
            console.log(password)
            console.error("Login Error:", error.response?.data || error.message);
            toast.error("Failed to log in");
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

                <form onSubmit={handleButtonClick}>
                    <input onChange={(e) => setUsername(e.target.value)} type="text" name="username" placeholder="Enter UserName " required /><br />
                    <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="Enter Password " required /><br />
                    <button type="submit" className="loginbutton">Log in</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;

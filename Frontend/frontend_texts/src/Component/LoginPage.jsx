import { useState } from "react";
import ApiMapping from "../Config/ApiMapping";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';
import apiUrl from "../Config/ApiMapping";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    // Toggle Login/Register Mode
    const handleLogin = () => {
        setIsLogin(true);
        setUsername("");
        setPassword("");
    };
    const handleRegister = () => {
        setIsLogin(false);
        setUsername("");
        setPassword("");
    };

    const handleButtonClick = async (e) => {
        e.preventDefault();
    
        if (!username || !password) {
            toast.error("Username and password are required!");
            return;
        }
    
        const apiEndpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
        const action = isLogin ? "Logging in..." : "Registering...";
        const successMessage = isLogin ? "Logged in successfully!" : "Registration successful!";
        const errorMessage = isLogin ? "Invalid credentials. Please try again." : "Username already exists!";
    
        try {
            const responsePromise = apiUrl.post(apiEndpoint, { username, password }, {
                headers: { "Content-Type": "application/json" }
            });
            
            await toast.promise(responsePromise, {
                loading: action,
                success: successMessage,
                error: errorMessage
            });
    
            const response = await responsePromise;
            console.log("API Response:", response.data);
            
            // Validate token before saving
            if (response.data.token && /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/.test(response.data.token)) {
                localStorage.setItem("token", response.data.token);
            } else {
                console.error("Invalid token format:", response.data.token);
            }
    
            localStorage.setItem("expiresAt", response.data.expiresIn);
    
            if (isLogin) navigate("/dashboard", { state: { username } });
            
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="main-main-container">
            <Toaster />
            <div className="main-auth-container">
                
            <div className="app-logo">
                <img src="/TextLogo.png" alt="Text Logo" />
            </div>

            <div className="auth-form-container">
                <h2>{isLogin ? "Welcome back" : "Register with Text"} </h2>

                <form className="form-attributes">
                    <input
                        type="text"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit" className="loginbutton" onClick={handleButtonClick}>
                        {isLogin ? "Log in" : "Register"}
                    </button>
                </form>

                <p onClick={isLogin ? handleRegister : handleLogin} style={{ cursor: "pointer", color: "black" }}>
                    {isLogin ? "New user? Register here" : "Already have an account? Login here"}
                </p>
            </div>
        </div>
        </div>
               
    );
}

export default LoginPage;

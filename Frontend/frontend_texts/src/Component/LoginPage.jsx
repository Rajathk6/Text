import { useState } from "react";
import { TbBubbleText } from "react-icons/tb";
import ApiMapping from "../Config/ApiMapping";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    // Toggle Login/Register Mode
    const handleLogin = () => {
        setIsLogin(true);
        setUsername("")
        setPassword("")
    }
    const handleRegister = () => {
        setIsLogin(false);
        setUsername("")
        setPassword("")
    }

    const handleButtonClick = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error("Username and password are required!");
            return;
        }

        const apiEndpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
        const action = isLogin ? "Logging in..." : "Registering...";
        const successMessage = isLogin ? "Logged in successfully!" : "Registration successful!";
        const errorMessage = isLogin
            ? "Could not sign in. Please check your credentials."
            : "Username already exists! Try a different one.";

        try {
            const responsePromise = ApiMapping.post(apiEndpoint, { username, password });

            await toast.promise(
                responsePromise,
                {
                    loading: action,
                    success: successMessage,
                    error: errorMessage
                }
            );

            const response = await responsePromise;
            console.log(`${isLogin ? "Login" : "Registration"} Successful:`, response.data);

            if (isLogin) navigate("/dashboard"); // Redirect to dashboard after login

        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
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
                <h2>{isLogin ? "Login" : "Register"} with Text</h2>

                <form className="form-attributes" onSubmit={handleButtonClick}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <br />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit" className="loginbutton">
                        {isLogin ? "Log in" : "Register"}
                    </button>
                </form>

                <p onClick={isLogin ? handleRegister : handleLogin} style={{ cursor: "pointer", color: "blue" }}>
                    {isLogin ? "New user? Register here" : "Already have an account? Login here"}
                </p>
            </div>
        </div>
    );
}

export default LoginPage;

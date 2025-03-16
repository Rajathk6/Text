import { useState } from "react";
import { TbBubbleText } from "react-icons/tb";

function LoginPage() {
    const [username, setUserName] = useState()
    const [password, setPassword] = useState()

    return (
        <div className="main-auth-container">
            <div className="app-logo">
                <a href="/" >
                <button className="main-text-logo">
                    <TbBubbleText />
                </button>  </a>
                <p>Text</p>
                
            </div>
            <div className="auth-form-container" >
                <h2>Login or create your account with <br />Text</h2>
                <form action="">
                <input type="text" placeholder="Enter UserName "/> <br />
                <input type="text" placeholder="Enter Password "/> <br />
                <button className="loginbutton">Log in </button>
                </form>
                
            </div>
        </div>
    )
}

export default LoginPage
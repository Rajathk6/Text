
function LoginPage() {
    return (
        <div className="main-auth-container">
            <div className="app-logo">
                <a href="/" ><img src="./src/assets/react.svg" alt="" />  </a>
                <p>Text</p>
                
            </div>
            <div className="auth-form-container" >
                <h2>Login or create your account with <br />Text</h2>
                <input type="text" placeholder="Enter UserName "/> <br />
                <input type="text" placeholder="Enter Password "/> <br />
                <a href="/home"><button className="loginbutton">Log in </button></a>
            </div>
        </div>
    )
}

export default LoginPage
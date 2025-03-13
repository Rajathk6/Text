
function LoginPage() {
    return (
        <div>
            <div className="app-details">
                <a href="/" ><img src="./src/assets/react.svg" alt="" /></a> 
                <h1>Text</h1>
            </div>
            <div className="auth-form-container" >
                <h2>Login or create your account with Text</h2>
                <input type="text" placeholder="Enter UserName: "/>
                <input type="text" placeholder="Enter Password:"/> <br />
                <button>Log in </button>
            </div>
        </div>
    )

}

export default LoginPage
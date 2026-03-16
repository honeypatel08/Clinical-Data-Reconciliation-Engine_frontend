import '../css/Login.css'
import { useNavigate } from 'react-router-dom';
import { useState } from "react";


export default function Login (){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!username || !password) return alert("Enter both fields");

        // debugging 
        console.log(username); 
        console.log(password); 

        
    };

    return(
        <div className="backgroundPage">
            <div className="login-box">
                <h2>Welcome to Clinical Data Reconcilliation Engine</h2>
                <h2>Login</h2>
                <input
                    className='usernameInput'
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className='passwordInput'
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                <h3>
                    Don't have an account? <a href="/register">Register</a>
                </h3>
            </div>
        </div>
    );
}
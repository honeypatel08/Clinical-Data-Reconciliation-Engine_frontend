import '../css/Login.css'
import { useNavigate } from 'react-router-dom';
import { useState } from "react";


export default function Login (){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) return alert("Enter both fields");

        // debugging 
        console.log(email); 
        console.log(password); 

    };

    return(
        <div className="backgroundPage">
            <div className="login-box">
                <h2>Welcome to Clinical Data Reconcilliation Engine</h2>
                <h2>Login</h2>
                <input
                    className='emailInput'
                    type="text"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className='passwordInput'
                    type="password"
                    placeholder="Enter Password"
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
import '../css/Login.css'
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { API_URL } from '../config';

export default function Login (){
    const navigate = useNavigate(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const submittedEmail = String(formData.get("email") || "").trim();
        const submittedPassword = String(formData.get("password") || "");

        if (!submittedEmail || !submittedPassword) return alert("Enter both fields");

        if(!isValidEmail(submittedEmail)) return alert("Please enter a valid email address");

        // debugging 
        try {
            const res = await fetch(`${API_URL}/api/auth/log-in`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: submittedEmail, password: submittedPassword })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Login failed");

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            setEmail("");
            setPassword("");
            navigate('/home');
        
        } catch (err) {
            alert(err.message);
        }
    };

    return(
        <div className="backgroundPage">
            <form className="login-box" onSubmit={handleLogin}>
                <h2>Welcome to Clinical Data Reconcilliation Engine</h2>
                <h2>Login</h2>
                <input
                    className='emailInput'
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className='passwordInput'
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
                <h3>
                    Don't have an account? <a href="https://honeypatel08.github.io/Clinical-Data-Reconciliation-Engine_frontend/#/register">Register</a>
                </h3>
            </form>
        </div>
    );
}

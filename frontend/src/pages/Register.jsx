import { useState } from "react";
import '../css/Register.css'; 
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';


export default function Register() {
    const navigate = useNavigate(); 

    const [providername, setProviderName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState(''); 

    const handleRegister = async (event) =>{
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const submittedProviderName = String(formData.get("providerName") || "").trim();
        const submittedEmail = String(formData.get("email") || "").trim();
        const submittedPassword = String(formData.get("password") || "");
        const submittedConfirmPassword = String(formData.get("confirmPassword") || "");

        if (!submittedEmail || !submittedPassword || !submittedProviderName || !submittedConfirmPassword) {
            return alert("All fields are required");
        }
        if (submittedPassword !== submittedConfirmPassword) {
            return alert("Passwords do not match");
        }

        // Backend connect 
        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                providerName: submittedProviderName,
                email: submittedEmail,
                password: submittedPassword
            })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Registration failed");
            alert(data.message);
            
            setProviderName("");
            setEmail("");
            setPassword("");
            setconfirmPassword("");
        } catch (err) {
            alert(err.message);
            return;
        }
        navigate('/login')
    }

    return(
        <div className="backgroundPage">
            <form className="register-box" onSubmit={handleRegister}>
                <h2>Healthcare Provider? Create An Account</h2>
                <input
                    className='providername'
                    name="providerName"
                    type="text"
                    placeholder="Provider Name"
                    autoComplete="name"
                    required
                    value={providername}
                    onChange={(e) => setProviderName(e.target.value)}
                />
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
                    placeholder="Create Password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    className='ConfirmPassword'
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                />

                <button type="submit">Register</button>

                <h4>After registering, wait for the admin approval email before signing in. If you need help, contact clinicalsystemadmin@gmail.com.
                </h4>
            </form>
        </div>
    )
}

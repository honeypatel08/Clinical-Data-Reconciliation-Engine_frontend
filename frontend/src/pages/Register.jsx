import { useState } from "react";
import '../css/Register.css'; 

export default function Register() {
    const [providerName, setProviderName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState(''); 

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRegister = async () =>{   
        if (!email || !password || !providerName || !confirmPassword) return alert("All fields are require");

        if(!isValidEmail(email)){
            return alert("Please enter a valid email address")
        }
        
        if(password !== confirmPassword) return alert("Passwords does not match")
    
        //backend call here   
        console.log(providerName);
        console.log(email);
        console.log(password);
        console.log(confirmPassword); 

        // Backend connect 
        try {
            const res = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ providerName, email, password })
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
        }
    }

    return(
        <div className="backgroundPage">
            <div className="register-box">
                <h2>Healthcare Provider? Create An Account</h2>
                <input
                    className='providerName'
                    type="text"
                    placeholder="Provider Name"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                />
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
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    className='ConfirmPassword'
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                />

                <button onClick={handleRegister}> Register </button>

                <h4>Note: After registering, please allow 3–4 business days for the admin to review and approve your request. Once you receive the confirmation email, you may log in and start using our services. If you do not receive the email within this timeframe, please contact the admin at [email here]. Thank you for your time and patience!
                </h4>
            </div>
        </div>
    )
}
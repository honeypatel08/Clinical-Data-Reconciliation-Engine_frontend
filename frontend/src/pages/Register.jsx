import { useState } from "react";
import '../css/Register.css'; 
import { useNavigate } from 'react-router-dom';


export default function Register() {
    const navigate = useNavigate(); 

    const [providername, setProviderName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState(''); 
    const [code, setCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);

    const handleSendCode = async () => {
        try {
            const res = await fetch("https://clinical-data-reconciliation-engine-eymc.onrender.com/verify/emailverify/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setCodeSent(true);
            alert("Verification code sent, Please check your email");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleVerifyCode = async () => {
        try {
            const res = await fetch("https://clinical-data-reconciliation-engine-eymc.onrender.com/verify/emailverify/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setEmailVerified(true);
            alert("Email verified!");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRegister = async () =>{   
        if (!email || !password || !providername || !confirmPassword) return alert("All fields are require");
        if(password !== confirmPassword) return alert("Passwords does not match")
        if (!emailVerified) { return alert("Please verify your email first");}

        // Backend connect 
        try {
            const res = await fetch("https://clinical-data-reconciliation-engine-eymc.onrender.com/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ providername, email, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Registration failed");
            alert(data.message);
            
            setProviderName("");
            setEmail("");
            setPassword("");
            setconfirmPassword("");
            setCodeSent(false);
            setEmailVerified(false);
            setCode("");
        } catch (err) {
            alert(err.message);
            setProviderName("");
            setEmail("");
            setPassword("");
            setconfirmPassword("");
            setCodeSent(false);
            setEmailVerified(false);
            setCode("");
        }
        navigate('./login')
    }

    return(
        <div className="backgroundPage">
            <div className="register-box">
                <h2>Healthcare Provider? Create An Account</h2>
                <input
                    className='providername'
                    type="text"
                    placeholder="Provider Name"
                    value={providername}
                    onChange={(e) => setProviderName(e.target.value)}
                />
                 <input
                    className='emailInput'
                    type="text"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {!codeSent && (
                    <button onClick={handleSendCode}>Send Code</button>
                )}

                {codeSent && !emailVerified && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button onClick={handleVerifyCode}>Verify Code</button>
                    </>
                )}

                {emailVerified && <h3>Email verified! Procced with password creation </h3>}
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
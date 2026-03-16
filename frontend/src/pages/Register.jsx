import { use, useState } from "react";
import '../css/Register.css'; 

export default function Register() {
    const [providerName, setProviderName] = useState(); 
    const [username, setUsername] = useState(); 
    const [password, setPassword] = useState(); 
    const [confirmPassword, setconfirmPassword] = useState(); 

    const handleRegister = () =>{   
        if (!username || !password || !providerName || !confirmPassword) return alert("All fields are require");

        if(password !== confirmPassword) return alert("Passwords does not match")

        //backend call here 
        
        console.log(providerName);
        console.log(username);
        console.log(password);
        console.log(confirmPassword); 
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
                    className='userName'
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
                <input
                    className='ConfirmPassword'
                    type="password"
                    placeholder="Password"
                    value={confirmPassword}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                />

                <button onClick={handleRegister}> Register </button>
            </div>
        </div>
    )
}
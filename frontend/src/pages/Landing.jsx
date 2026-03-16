import '../css/Landing.css';
import { useNavigate } from 'react-router-dom';

function Landing (){

    const navigate = useNavigate(); 

    const handleLogin = () => {
        navigate('/login'); 
    }

    const handleRegister = () => {
        navigate('/register');
    }

    const handleAdmin = () => {
        navigate('/admin');
    }


    return (
        <div className='backgroundPage'>
            <div className='border'>
                <h1 className="header">Welcome to Clinical Data Reconcilliation Engine</h1>
            <div className="button-contianer">
                <button onClick={handleAdmin} className='adminButton'> Admin </button>

                <button onClick={handleLogin} className='loginButton'> Login </button>

                <button onClick={handleRegister} className='registerButton'> Register </button>
            </div>
            </div>
        </div>
    )
}

export default Landing;
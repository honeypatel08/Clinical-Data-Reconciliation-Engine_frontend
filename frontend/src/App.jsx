import {Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Register from './pages/Register'

function App() {
  return (

      <Routes>
    
        <Route path="*" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
  );
}

export default App;
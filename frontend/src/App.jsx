import {Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Register from './pages/Register'; 
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (

      <Routes>
    
        <Route path="*" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={ <ProtectedRoute> <Home /> </ProtectedRoute> }
      />
      </Routes>
  );
}

export default App;
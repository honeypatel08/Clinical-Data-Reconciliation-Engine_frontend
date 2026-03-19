import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'; 
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import VerifyEmail from './components/VerifyEmail';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Messages from './pages/Messages';
import AddProduct from './pages/AddProduct';


function App() {
  return (
    <div className="container mx-auto mt-10">
      <Router>
            <Navbar />
            <Routes>
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/home" exact element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="/Messages" element={<Messages />} />
                <Route path="/add-product" element={<AddProduct />} />

                {/* Add other routes as needed */}
            </Routes>
        </Router>
    </div>
  );
}

export default App;
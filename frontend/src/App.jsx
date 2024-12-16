import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Logout from './components/Logout';
import VerifyEmail from './components/VerifyEmail';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Messages from './pages/Messages';
import AddProduct from './pages/AddProduct';


function App() {
  const [isLogedIn, setisLogedIn] = useState(() => {
    return !!localStorage.getItem('authToken');
  });
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setisLogedIn(!!token);
  }, []);
  return (
    <div className="container mx-auto mt-10">
      <Router>
            <Navbar isLogedIn = {isLogedIn}/>
            <Routes>
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/home" exact element={<Home />} />
                <Route path="/logout" element={<Logout setisLogedIn = {setisLogedIn}/>} />) 
                <Route path="/login" element={<Login isLogedIn = {isLogedIn} setisLogedIn = {setisLogedIn}/>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-product" element={<AddProduct />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
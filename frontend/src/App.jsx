import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Logout from './components/Logout';
import VerifyEmail from './components/VerifyEmail';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Messages from './pages/Messages';

function App() {
  const [isLogedIn, setisLogedIn] = useState(false);
  return (
    <div className="container mx-auto mt-10">
      <Router>
            <Navbar isLogedIn = {isLogedIn}/>
            <Routes>
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/home" exact element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/logout" element={<Logout setisLogedIn = {setisLogedIn}/>} />) 
                (<Route path="/login" element={<Login isLogedIn = {isLogedIn} setisLogedIn = {setisLogedIn}/>} />
                <Route path="/Signup" element={<Signup />} />)
                <Route path="/Messages" element={<Messages />} />
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    </div>
  );
}

export default App;   
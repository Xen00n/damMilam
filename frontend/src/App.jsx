import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Logout from './components/Logout';
import VerifyEmail from './components/VerifyEmail';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Groups from './pages/Groups';
import AddProduct from './pages/AddProduct';
import EditProfile from './pages/EditProfile';
import VerifyEmailChange from './components/VerifyEmailChange';
import MessagePage from './pages/MessagePage';
import ConfirmOrder from './pages/ConfirmOrder';

function App() {
  const [isLogedIn, setisLogedIn] = useState(() => {
    return !!localStorage.getItem('authToken');
  });
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = tokenPayload.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem("authToken");
        setisLogedIn(false);
      } else {
        setisLogedIn(true);  // Make sure the user is logged in if token is not expired
      }
    } else {
      setisLogedIn(false); // If there's no token in localStorage, set the user as not logged in
    }
    
  }, []);
  return (
    <div className="container mx-auto mt-10">
      <Router>
            <Navbar isLogedIn = {isLogedIn}/>
            <Routes>
                <Route path="/" element={<Home isLoggedIn = {isLogedIn}/>} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/verify-email-change" element={<VerifyEmailChange />} />
                <Route path="/logout" element={<Logout setisLogedIn = {setisLogedIn}/>} />) 
                <Route path="/login" element={<Login isLogedIn = {isLogedIn} setisLogedIn = {setisLogedIn}/>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/profile" element={<Profile setisLogedIn = {setisLogedIn}/>} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/groups/:groupId/messages" element={<MessagePage />} />
                <Route path="/confirmorder/:productId" element={<ConfirmOrder />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
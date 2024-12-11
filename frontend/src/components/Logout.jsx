import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout({ setisLogedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('authToken'); 
    setisLogedIn(false); 
    navigate('/login'); 
  }, [setisLogedIn, navigate]);

  return (
    <div>
      <h1>Logging Out...</h1>
    </div>
  );
}

export default Logout;

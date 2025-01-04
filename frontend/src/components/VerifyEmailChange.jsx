import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyEmailChange = () => {
  const [message, setMessage] = useState('');
  const location = useLocation();  // To access the URL query parameters
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search); // Get query parameters
    const token = query.get('token'); // Extract the token
  
    if (token) {
      // Make API request to verify the email change
      axios.get(`http://localhost:6969/api/verify-email-change?token=${token}`)
        .then((response) => {
          setMessage(response.data.message);  // Show success message
          setTimeout(() => {
            navigate('/login');  // Redirect to login after successful verification
          }, 3000);  // Wait for 3 seconds before redirecting (optional)
        })
        .catch((error) => {
          setMessage(error.response?.data?.message || 'Something went wrong');
        });
    } else {
      setMessage('No token provided in the URL.');
    }
  }, [location.search, navigate]);
  

  return (
    <div className="verify-email-change">
      <h2>Email Change Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmailChange;

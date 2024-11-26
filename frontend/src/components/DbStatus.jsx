import React, { useEffect, useState } from 'react';

const DbStatus = () => {
  const [dbStatus, setDbStatus] = useState('Loading...');

  useEffect(() => {
    const fetchDbStatus = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/db-status');
        const data = await response.json();
        setDbStatus(data.status);
      } catch (error) {
        setDbStatus('Error fetching status');
        console.error('Error fetching DB status:', error);
      }
    };

    fetchDbStatus();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold">Database Status:</h2>
      <p className={`text-lg ${dbStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
        {dbStatus}
      </p>
    </div>
  );
};

export default DbStatus;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('buyer'); // Default role
  const [userName, setUserName] = useState(''); // Logged-in user's name
  const [userId, setUserId] = useState(null); // Logged-in user's ID
  const [showRolePrompt, setShowRolePrompt] = useState(false); // Role selection modal control
  const [selectedGroupId, setSelectedGroupId] = useState(null); // Group ID for join request
  const [showRequests, setShowRequests] = useState(null); // Track request dropdown visibility
  const navigate = useNavigate();

  // Fetch user and groups data on component mount
  useEffect(() => {
    const fetchUserAndGroups = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          // Fetch user info
          const userResponse = await axios.get('http://localhost:6969/api/user/profile', config);
          const loggedInUser = userResponse.data;
          setUserId(loggedInUser._id);
          setUserName(loggedInUser.name || loggedInUser.username);

          // Fetch groups data
          const groupResponse = await axios.get('http://localhost:6969/api/bargaining-group/', config);
          setGroups(groupResponse.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user info and groups', err);
        setLoading(false);
      }
    };

    fetchUserAndGroups();
  }, []);

  // Check if the logged-in user has access to the group
  const hasAccess = (group) => {
    return group.access.some((entry) =>
      typeof entry === 'string' ? entry === userId : entry.userId === userId
    );
  };
  const isGroupExpired = (createdAt) => {
    const createdDate = new Date(createdAt);
    const expirationDate = new Date(createdDate);
    expirationDate.setDate(expirationDate.getDate() +7);
    return new Date() > expirationDate; // Returns true if expired
  };
  
  // Handle join request for a group
  const handleRequestJoin = (groupId) => {
    setSelectedGroupId(groupId);
    setShowRolePrompt(true);
  };

  // Handle role selection for join request
  const handleRoleSelection = async () => {
    try {
      if (!role || !['buyer', 'seller'].includes(role)) {
        alert('Please select a valid role (buyer or seller)');
        return;
      }

      if (!userName || typeof userName !== 'string') {
        alert('Please provide a valid user name');
        return;
      }

      const response = await axios.post(
        `http://localhost:6969/api/bargaining-group/request/${selectedGroupId}`,
        { role, name: userName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      alert('Join request sent successfully');
      setShowRolePrompt(false);
    } catch (err) {
      console.error('Error sending join request:', err);
      alert('Error sending join request');
    }
  };

  // Navigate to the group's message page
  const handleEnterMessages = (groupId) => {
    navigate(`/groups/${groupId}/messages`);
  };

  // Handle accept/reject actions for group requests
  const handleAcceptRejectRequest = async (groupId, requestId, status) => {
    try {
      await axios.post(
        `http://localhost:6969/api/bargaining-group/accept-reject/${groupId}/${requestId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      alert(`Request ${status} successfully`);

      // Update the groups state
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group._id === groupId
            ? {
                ...group,
                requests: group.requests.filter((request) => request._id !== requestId),
              }
            : group
        )
      );
    } catch (err) {
      console.error('Error processing request:', err);
      alert('Error processing request');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-light dark:bg-gray-900 min-h-screen p-8">
      <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-8">
        Bargaining Groups
      </h1>

      <div className="space-y-8">
        {groups.map((group) => (
          <div
            key={group._id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{group.groupName}</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">{group.description}</p>
                <p className="text-lg text-gray-700 dark:text-gray-300 mt-2 font-bold">
                  Price: <span className="text-green-500">${group.price}</span>
                </p>
              </div>

              {group.userId &&
                userId &&
                group.userId.toString() === userId.toString() &&
                group.requests &&
                group.requests.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowRequests(group._id === showRequests ? null : group._id)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
                    >
                      Requests ({group.requests.length})
                    </button>
                    {showRequests === group._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
                        {group.requests.map((request) => (
                          <div key={request._id} className="p-2 border-b">
                            <p className="text-sm text-gray-700 dark:text-gray-300">Request from: {request.name}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Role: {request.role}</p>
                            <div className="flex justify-between mt-2">
                              <button
                                onClick={() => handleAcceptRejectRequest(group._id, request._id, 'accepted')}
                                className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded-lg"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleAcceptRejectRequest(group._id, request._id, 'rejected')}
                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-lg"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
            </div>

            {isGroupExpired(group.createdAt) ? (
  <button className="bg-gray-500 text-white py-3 px-6 rounded-lg w-full mt-4 cursor-not-allowed" disabled>
    Closed
  </button>
) : hasAccess(group) ? (
  <button
    onClick={() => handleEnterMessages(group._id)}
    className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg w-full mt-4"
  >
    Message
  </button>
) : (
  <button
    onClick={() => handleRequestJoin(group._id)}
    className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg w-full mt-4"
  >
    Request to Join
  </button>
)}

          </div>
        ))}
      </div>

      {showRolePrompt && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Select Your Role</h2>
            <div className="flex justify-around mb-4">
              <button
                onClick={() => setRole('buyer')}
                className={`px-4 py-2 rounded-lg ${role === 'buyer' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
              >
                Buyer
              </button>
              <button
                onClick={() => setRole('seller')}
                className={`px-4 py-2 rounded-lg ${role === 'seller' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
              >
                Seller
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleRoleSelection}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowRolePrompt(false)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg ml-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role] = useState('buyer'); // Default role
  const [userName, setUserName] = useState(''); // Logged-in user's name
  const [userId, setUserId] = useState(null); // Logged-in user's ID
  const [showRequests, setShowRequests] = useState(null); // Track request dropdown visibility
  const navigate = useNavigate();

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

  const hasAccess = (group) => {
    return group.access.some((entry) =>
      typeof entry === 'string' ? entry === userId : entry.userId === userId
    );
  };
  const handleRoleSelection = async (groupId) => {
    try {

      if (!userName || typeof userName !== 'string') {
        alert('Please provide a valid user name');
        return;
      }

      const response = await axios.post(
        `http://localhost:6969/api/bargaining-group/request/${groupId}`,
        { role, name: userName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      alert('Join request sent successfully');
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
                  Price: <span className="text-green-500">Rs. {group.price}</span>
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

             {hasAccess(group) ? (
  <button
    onClick={() => handleEnterMessages(group._id)}
    className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg w-full mt-4"
  >
    Message
  </button>
) : (
  <button
    onClick={() => handleRoleSelection(group._id)}
    className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg w-full mt-4"
  >
    Request to Join
  </button>
)}

          </div>
        ))}
      </div>

      
    </div>
  );
};

export default Groups;

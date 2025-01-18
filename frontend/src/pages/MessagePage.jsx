import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:6969'); // Replace with your backend URL

const MessagePage = () => {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [userName, setUserName] = useState('');
  const [userAliases, setUserAliases] = useState({});
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch group data, messages, and generate aliases
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get('http://localhost:6969/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        setUserName(response.data.name);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`http://localhost:6969/api/groups/${groupId}`);
        
        // Set the group name
        setGroupName(response.data.groupName);
        
        const aliases = response.data.access.reduce((acc, entry) => {
          // Maintain counters for role types
          if (!acc.counters) {
            acc.counters = { B: 0, S: 0 }; // Initialize counters with capital B and S
          }
        
          // Increment the respective role counter
          const roleAbbreviation = entry.role === "buyer" ? "Buyer" : "Seller"; // Assign B for Buyer and S for Seller
          acc.counters[roleAbbreviation] = (acc.counters[roleAbbreviation] || 0) + 1;
        
          // Assign the role with the counter to the user
          acc[entry.userName] = {
            name: entry.userName,
            role: `${roleAbbreviation} ${acc.counters[roleAbbreviation]}`,
          };
        
          return acc;
        }, {});
        
        // Remove the counters after the reduce operation
        delete aliases.counters;
        
        // Update the userAliases state
        setUserAliases(aliases);
        console.log(aliases);
        
      } catch (err) {
        console.error('Error fetching group data:', err);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:6969/api/messages/${groupId}`);
        setMessages(response.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchUserName();
    fetchGroupData();
    fetchMessages();

    socket.emit('joinGroup', groupId);

    // Listen for new messages via socket
    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit('leaveGroup', groupId);
      socket.off();
    };
  }, [groupId]);

  // Scroll to the bottom whenever messages are updated
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send the message function
  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = { groupId, message: newMessage, senderName: userName }; // Use username for backend
      socket.emit('sendMessage', messageData, (err) => {
        if (err) console.error(err);
        else setNewMessage(''); // Clear the input after sending
      });
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Check for Enter key and not Shift+Enter (to allow multiline input if needed)
      e.preventDefault(); // Prevent new line if Shift is not pressed
      sendMessage(); // Call the sendMessage function
    }
  };

  return (
    <div className="bg-light dark:bg-gray-900 min-h-screen p-4 sm:p-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Messages for {groupName || 'Loading...'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Chat with group members</p>
        </div>

        <div
          className="messages-container w-full h-[80vh] overflow-y-scroll bg-gray-100 dark:bg-gray-700 p-6 rounded-lg flex flex-col mb-4 shadow-md"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message mb-3 p-3 rounded-lg ${
                msg.senderName === userName
                  ? 'bg-blue-500 text-white self-end'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white self-start'
              }`}
              style={{ maxWidth: '75%' }}
            >
              <p className="font-semibold text-sm text-gray-900 dark:text-white">
                {userAliases[msg.senderName]?.role || 'Unknown'}
              </p>
              <p className="text-base">{msg.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="message-input flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress} // Add the onKeyDown handler
            placeholder="Type your message..."
            className="flex-grow text-black dark:text-white p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 sm:mt-0"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;

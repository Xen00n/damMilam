import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:6969'); // Replace with your backend URL

const MessagePage = () => {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('User_' + Math.floor(Math.random() * 1000)); // Generate anonymous username
  const [groupName, setGroupName] = useState('');
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch group data and messages
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`http://localhost:6969/api/groups/${groupId}`);
        setGroupName(response.data.groupName);
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

  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = { groupId, message: newMessage, senderName: userName }; // Use anonymous name
      socket.emit('sendMessage', messageData, (err) => {
        if (err) console.error(err);
        else setNewMessage(''); // Clear the input after sending
      });
    }
  };

  return (
    <div className="bg-light dark:bg-gray-900 min-h-screen p-8 transition-colors duration-300">
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
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-800 self-start'
              }`}
              style={{ maxWidth: '75%' }}
            >
              <p className="font-semibold text-sm text-gray-900 dark:text-white">
                {/* Display the sender name if available, otherwise show 'Anonymous User' */}
                {msg.senderName || 'Anonymous User'}
              </p>
              <p className="text-base">{msg.text}</p>
            </div>
          ))}
          {/* Invisible div to act as the scroll target */}
          <div ref={messagesEndRef} />
        </div>

        <div className="message-input flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow text-white p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="ml-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;

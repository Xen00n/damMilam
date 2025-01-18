import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { FaTag, FaPaperclip } from "react-icons/fa"; // For icons

const socket = io("http://localhost:6969"); // Replace with your backend URL

const MessagePage = () => {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [priceOffer, setPriceOffer] = useState("");
  const [groupName, setGroupName] = useState("");
  const [userName, setUserName] = useState("");
  const [userAliases, setUserAliases] = useState({});
  const [isPriceVisible, setIsPriceVisible] = useState(false); // Toggle price input visibility
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch group data, messages, and generate aliases
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6969/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setUserName(response.data.name);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    const fetchGroupData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6969/api/groups/${groupId}`
        );
        setGroupName(response.data.groupName);

        // Generate user aliases (e.g., Seller 1, Buyer 1)
        const aliases = response.data.access.reduce((acc, entry) => {
          if (!acc.counters) {
            acc.counters = { buyer: 0, seller: 0 }; // Initialize counters
          }

          // Increment the respective role counter
          const role = entry.role.toLowerCase();
          acc.counters[role] = (acc.counters[role] || 0) + 1;
          acc[entry.userName] = {
            name: entry.userName,
            role: `${role.charAt(0).toUpperCase() + role.slice(1)} ${
              acc.counters[role]
            }`,
          };

          return acc;
        }, {});

        delete aliases.counters; // Remove counters from the final state
        setUserAliases(aliases);
      } catch (err) {
        console.error("Error fetching group data:", err);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6969/api/messages/${groupId}`
        );
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchUserName();
    fetchGroupData();
    fetchMessages();

    socket.emit("joinGroup", groupId);

    // Listen for new messages via socket
    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for offer status updates and update the message state
    socket.on("updateOfferStatus", (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });

    return () => {
      socket.emit("leaveGroup", groupId);
      socket.off("newMessage"); // Remove 'newMessage' listener
      socket.off("updateOfferStatus"); // Remove 'updateOfferStatus' listener
    };
  }, [groupId]);

  // Scroll to the bottom whenever messages are updated
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send a normal message or a price offer
  const sendMessage = (type = "text", offerPrice = null) => {
    if (type === "text" && newMessage.trim()) {
      const messageData = {
        groupId,
        message: newMessage,
        senderName: userName,
      };
      socket.emit("sendMessage", messageData, (err) => {
        if (err) console.error(err);
        else setNewMessage(""); // Clear input after sending
      });
    } else if (type === "offer" && offerPrice) {
      const messageData = {
        groupId,
        senderName: userName,
        priceOffer: offerPrice,
        negotiationStatus: "pending",
      };
      socket.emit("sendOffer", messageData, (err) => {
        if (err) console.error(err);
        else setPriceOffer(""); // Clear price input after sending
      });
    }
  };

  // Respond to an offer as a seller
  const handleOfferResponse = (messageId, action) => {
    if (!["accepted", "rejected", "counter"].includes(action)) {
      console.error("Invalid action:", action);
      return;
    }

    socket.emit(
      "respondToOffer",
      { groupId, messageId, status: action },
      (err) => {
        if (err) console.error("Error responding to offer:", err);
      }
    );
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage("text");
    }
  };

  return (
    <div className="bg-light dark:bg-gray-900 min-h-screen p-4 sm:p-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Messages for {groupName || "Loading..."}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Chat with group members
          </p>
        </div>

        <div className="messages-container w-full h-[80vh] overflow-y-scroll bg-gray-100 dark:bg-gray-700 p-6 rounded-lg flex flex-col mb-4 shadow-md">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message mb-3 p-3 rounded-lg ${
                msg.senderName === userName
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white self-start"
              }`}
              style={{ maxWidth: "75%" }}
            >
              <p className="font-semibold text-sm text-gray-900 dark:text-white">
                {userAliases[msg.senderName]?.role || "Unknown"}
              </p>
              {msg.priceOffer ? (
  <>
    <p className="text-base">
      <strong>Offer:</strong> ${msg.priceOffer}
    </p>
    <p
      className={`text-sm ${
        msg.negotiationStatus === "accepted"
          ? "text-green-500"
          : msg.negotiationStatus === "rejected"
          ? "text-red-500"
          : "text-yellow-500"
      }`}
    >
      Status:{" "}
      {msg.negotiationStatus
        ? msg.negotiationStatus.charAt(0).toUpperCase() +
          msg.negotiationStatus.slice(1)
        : "Pending"}
    </p>

    {/* Purchase Button (Only for Buyers if Offer is Accepted) */}
    {msg.negotiationStatus === "accepted" &&
  userAliases[userName]?.role?.startsWith("Buyer") && (
    <button
      onClick={() => handlePurchase(msg._id)}
      className="mt-2 w-full sm:w-auto bg-blue-600 dark:bg-blue-200 text-white dark:text-gray-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 hover:bg-yellow-600 dark:hover:bg-yellow-500 hover:shadow-lg hover:scale-105"
    >
      🛒  Purchase
    </button>
  )}



    {/* Offer Response Buttons (Only for Sellers when Pending) */}
    {userAliases[userName]?.role?.startsWith("Seller") &&
      msg.negotiationStatus === "pending" && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => handleOfferResponse(msg._id, "accepted")}
            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={() => handleOfferResponse(msg._id, "rejected")}
            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      )}
  </>
) : (
  <p className="text-base">{msg.text}</p>
)}

            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="message-input flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full">
          {/* Hide text input when price input is visible */}
          {!isPriceVisible && (
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-grow text-black dark:text-white p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          {!isPriceVisible && (
            <button
              onClick={() => sendMessage("text")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          )}
          {/* Attachment Icon to show price offer input */}
          {userAliases[userName]?.role?.startsWith("Buyer") && (
            <button
              onClick={() => setIsPriceVisible(!isPriceVisible)}
              className="bg-gray-300 dark:bg-gray-600 p-3 rounded-lg"
            >
              <FaTag className="text-xl text-gray-600 dark:text-white" />
            </button>
          )}

          {/* Price input and submit for Buyers */}
          {isPriceVisible &&
            userAliases[userName]?.role?.startsWith("Buyer") && (
              <div className="flex gap-2 w-full">
                {" "}
                {/* Ensure full width container */}
                <input
                  type="number"
                  value={priceOffer}
                  onChange={(e) => setPriceOffer(e.target.value)}
                  placeholder="Offer Price"
                  className="flex-grow p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={() => sendMessage("offer", priceOffer)}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 flex-shrink-0"
                >
                  Propose Price
                </button>
                {/* Prevent shrinking */}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MessagePage;

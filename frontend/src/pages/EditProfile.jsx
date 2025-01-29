import React, { useState, useEffect } from "react";
import axios from "axios";
import { resolvePath, useNavigate } from "react-router-dom";

const EditProfile = ({ userId }) => {
  const [user, setUser] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [tempData, setTempData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        setLoading(true);
        const response = await axios.get(`http://localhost:6969/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setTempData(response.data.user);
      } catch (err) {
        console.error("Error fetching user data: ", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `http://localhost:6969/api/change-name-number`,
        { name: tempData.name,
          phoneNumber : tempData.phoneNumber
        }, // Send only the name field
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setUser((prev) => ({ ...prev, name: response.data.user.name, phoneNumber : response.data.user.phoneNumber })); // Update only the name
      setEditingField(null);
      setMessage("Updated successfully.");
    } catch (err) {
      console.error("Error updating : ", err);
      setError("Failed to update .");
    }
  };
  
  const handleEmailChange = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:6969/api/request-email-change",
        { newEmail: tempData.email },  // Assuming you're updating this in the tempData state
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Verification email has been sent! Please verify your new email.");
    } catch (err) {
      console.error("Error changing email:", err);
      setError("Failed to change email.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New Password and Confirm Password do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `http://localhost:6969/api/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(response.data.message);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Error changing password: ", err);
      setError(err.response?.data?.message || "Failed to change password.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-light dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">
          Edit Profile
        </h2>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

        {/* Profile Info Section */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Name */}
          <div className="flex items-center justify-between">
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Name:
            </label>
            {editingField === "name" ? (
              <input
                type="text"
                value={tempData.name}
                onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                className="p-2 border rounded w-full sm:w-2/3"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-200">{user.name}</p>
            )}
            <button
              onClick={() =>
                editingField === "name" ? setEditingField(null) : handleEdit("name")
              }
              className="ml-4 text-blue-500"
            >
              {editingField === "name" ? "Cancel" : "Edit"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Phone Number:
            </label>
            {editingField === "phoneNumber" ? (
              <input
                type="text"
                value={tempData.phoneNumber||""}
                onChange={(e) => setTempData({ ...tempData, phoneNumber: e.target.value })}
                className="p-2 border rounded w-full sm:w-2/3"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-200">{user.phoneNumber}</p>
            )}
            <button
              onClick={() =>
                editingField === "phoneNumber" ? setEditingField(null) : handleEdit("phoneNumber")
              }
              className="ml-4 text-blue-500"
            >
              {editingField === "phoneNumber" ? "Cancel" : "Edit"}
            </button>
          </div>
          {/* Email */}
          <div className="flex items-center justify-between">
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Email:
            </label>
            {editingField === "email" ? (
              <input
                type="email"
                value={tempData.email}
                onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
                className="p-2 border rounded w-full sm:w-2/3"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-200">{user.email}</p>
            )}
            <button
              onClick={() =>
                editingField === "email"
                  ? setEditingField(null)
                  : handleEdit("email")
              }
              className="ml-4 text-blue-500"
            >
              {editingField === "email" ? "Cancel" : "Edit"}
            </button>
          </div>

          {/* Member Since */}
          <div className="flex items-center justify-between">
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Member Since:
            </label>
            <p className="text-gray-900 dark:text-gray-200">
              {new Date(user.memberSince).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Save Changes Button */}
        {editingField && editingField === "email" ? (
          <button
            onClick={handleEmailChange}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Email
          </button>
        ) : (
          editingField && (
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          )
        )}

        {/* Change Password Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
            Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Re-enter New Password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

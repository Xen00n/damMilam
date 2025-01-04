import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = (props) => {
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.log("No token found, redirecting to login");
          props.setisLogedIn(false);
          navigate("/login");
          return;
        }

        setLoading(true);
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = tokenPayload.exp * 1000 < Date.now();
      if (isExpired) {
        setSessionExpired(true);
        props.setisLogedIn(false);
        return;
      }
        const userResponse = await axios.get(
          `http://localhost:6969/api/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(userResponse.data.user);

        const productResponse = await axios.get(
          "http://localhost:6969/api/products-user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(productResponse.data.products);
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return (
          <div className="flex flex-col gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-700 flex flex-col w-full transition-all duration-300 ease-in-out transform hover:shadow-xl hover:bg-gray-150 dark:hover:bg-gray-600 overflow-hidden"
                >
                  <img
                    src={product.photo || "https://via.placeholder.com/150"}
                    alt={product.title}
                    className="w-full h-64 object-contain rounded mb-4"
                  />
                  <div className="flex flex-col items-center w-full">
                    <h3 className="font-bold text-3xl text-black dark:text-white">
                      {product.title}
                    </h3>
                    <p className="text-black dark:text-gray-300">
                      {product.description}
                    </p>
                    <p className="font-semibold text-black dark:text-gray-300">
                      Price:{" "}
                      <span className="text-gray-700">{product.price}</span>
                    </p>
                    <p className="text-black dark:text-gray-300">
                      Status: {product.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                No products added yet.
              </p>
            )}
          </div>
        );
      case "cart":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="border rounded p-4 bg-gray-100 dark:bg-gray-700"
                >
                  <h3 className="font-bold text-black dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400">
                    Rs. {item.price}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                Your cart is empty.
              </p>
            )}
          </div>
        );
      case "history":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {history.length > 0 ? (
              history.map((record) => (
                <div
                  key={record.id}
                  className="border rounded p-4 bg-gray-100 dark:bg-gray-700"
                >
                  <h3 className="font-bold text-black dark:text-white">
                    {record.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400">
                    {record.date}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {record.status}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                No history available.
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center">Loading profile...</div>;
  }

  return (
    <div className="p-6 bg-light dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded shadow-md p-6">
        <div className="flex items-center mb-6">
          <img
            src={user.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-gray-300"
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold dark:text-white">
              {user.name || "User Name"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Member since: {user.memberSince || "N/A"}
            </p>
            <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            <button
              onClick={() => navigate("/edit-profile")}
              className="mt-2 px-2 py-0 bg-green-600 hover:bg-green-900 text-white rounded"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-start space-x-4 mb-6">
  <button
    onClick={() => setActiveTab("products")}
    className={`font-bold ${
      activeTab === "products"
        ? "text-green-700 dark:text-green-600"
        : "text-gray-900 dark:text-white hover:text-green-700 dark:hover:text-green-600"
    } py-2 px-3 w-full sm:w-auto text-center`}
  >
    My Products
  </button>
  <button
    onClick={() => navigate("/add-product")}
    className="font-bold text-gray-900 dark:text-white hover:text-green-700 dark:hover:text-green-600 py-2 px-3 w-full sm:w-auto text-center"
  >
    Add Product
  </button>
  <button
    onClick={() => setActiveTab("cart")}
    className={`font-bold ${
      activeTab === "cart"
        ? "text-green-700 dark:text-green-600"
        : "text-gray-900 dark:text-white hover:text-green-700 dark:hover:text-green-600"
    } py-2 px-3 w-full sm:w-auto text-center`}
  >
    Cart
  </button>
  <button
    onClick={() => setActiveTab("history")}
    className={`font-bold ${
      activeTab === "history"
        ? "text-green-700 dark:text-green-600"
        : "text-gray-900 dark:text-white hover:text-green-700 dark:hover:text-green-600"
    } py-2 px-3 w-full sm:w-auto text-center`}
  >
    History
  </button>
</div>
{sessionExpired && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white rounded p-6 text-center shadow">
      <h2 className="text-lg font-bold text-red-600">Session Expired</h2>
      <p className="text-gray-700 mt-2">
        Your session has expired. Please log in again to continue.
      </p>
      <button
        onClick={() => {
          localStorage.removeItem("authToken");
          navigate("/login");
        }}
        className="bg-red-600 text-white px-4 py-2 rounded mt-4"
      >
        Log In
      </button>
    </div>
  </div>
)}
        {renderContent()}

        {error && <div className="mt-6 text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default Profile;

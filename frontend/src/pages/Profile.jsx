import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("products"); // State to manage active tab
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate("/login");
          return;
        }

        const userResponse = await axios.get(`http://localhost:5000/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data.user);

        // // Fetch data for all tabs initially
        // const [productResponse, cartResponse, historyResponse] = await Promise.all([
        //   axios.get("http://localhost:5000/api/products", {
        //     headers: { Authorization: `Bearer ${token}` },
        //   }),
        //   axios.get("http://localhost:5000/api/cart", {
        //     headers: { Authorization: `Bearer ${token}` },
        //   }),
        //   axios.get("http://localhost:5000/api/history", {
        //     headers: { Authorization: `Bearer ${token}` },
        //   }),
        // ]);

        // setProducts(productResponse.data);
        // setCart(cartResponse.data);
        // setHistory(historyResponse.data);
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError("Failed to load profile data.");
      }
    };

    fetchData();
  }, [navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded p-4 bg-gray-100 dark:bg-gray-700"
                >
                  <h3 className="font-bold dark:text-white">{product.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {product.description}
                  </p>
                  <p className="text-green-500 dark:text-green-400">
                    Rs. {product.price}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {product.status}
                  </p>
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
                  <h3 className="font-bold dark:text-white">{item.title}</h3>
                  <p className="text-green-500 dark:text-green-400">
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
                  <h3 className="font-bold dark:text-white">{record.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{record.date}</p>
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

        <div className="flex items-center space-x-4 mb-6">
          <button
               onClick={() => setActiveTab("products")}
               className={`font-bold ${
                 activeTab === "products"
                   ? "text-green-700 dark:text-green-600 block py-2 px-3 bg-gray-200 md:bg-transparent"
                   : "text-gray-900 dark:text-white hover:text-green-700 dark:hover:dark:text-green-600 block py-2 px-3"
               }`}
          >
            My Products
          </button>
          <button
                onClick={() => navigate("/add-product")}
                className="`font-bold text-gray-900 dark:text-white hover:text-green-700 dark:hover:dark:text-green-600 block py-2 px-3"
                
           >
             Add Product
          </button>
          <button
                onClick={() => setActiveTab("cart")}
                className={`font-bold ${
                  activeTab === "cart"
                    ? "text-green-700 dark:text-green-600 block py-2 px-3 bg-gray-200 md:bg-transparent"
                    : "text-gray-900 dark:text-white hover:text-green-700 dark:hover:dark:text-green-600 block py-2 px-3"
                }`}
          >
            Cart
          </button>
          <button
                 onClick={() => setActiveTab("history")}
                 className={`font-bold ${
                   activeTab === "history"
                     ? "text-green-700 dark:text-green-600 block py-2 px-3 bg-gray-200 md:bg-transparent"
                     : "text-gray-900 dark:text-white hover:text-green-700 dark:hover:dark:text-green-600 block py-2 px-3"
                 }`}
          >
            History
          </button>
        </div>

        {renderContent()}

        {error && <div className="mt-6 text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default Profile;
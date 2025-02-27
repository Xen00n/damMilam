import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ConfirmOrder = () => {
  const { groupId } = useParams();
  const [productId,setProductId] = useState(''); 
  const [product, setProduct] = useState({
    title: "",
    photo: "",
    price: 0,
    description: "",
    user: {
      name: "",
      email: "",
    },
  });
  const [loading, setLoading] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProductId = async () => {
      try {
        if (!groupId) return; // Ensure groupId is available
        const response = await axios.get(`http://localhost:6969/api/bargaining-group/returnProductId/${groupId}`);
        setProductId(response.data.productId);
      } catch (error) {
        console.error("Error fetching productId:", error);
        alert("Failed to fetch productId.");
      }
    };

    fetchProductId();
  }, [groupId]);
  useEffect(() => { // Run only when groupId changes
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(`http://localhost:6969/api/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
        alert("Failed to fetch product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);
  const handlePayment = async () => {
    try {
      console.log("Initiating Khalti Payment...");
    const tokena = localStorage.getItem("authToken");
    if (!tokena) {
      alert("User is not authenticated.");
      return;
    }


    const userResponse = await axios.get("http://localhost:6969/api/profile", {
      headers: { Authorization: `Bearer ${tokena}` },
    });

    const user = userResponse.data.user; 


    if (!user.name || !user.email || !user.phoneNumber) {
      alert("Missing user information. Please update your profile.");
      return;
    }

      const response = await axios.post(`http://localhost:6969/api/khalti/initiate-payment/${groupId}`, {
        amount: product.price * 100, // Khalti requires the amount in paisa
        productId: productId,
        productName: product.title,
        customer_info: {
          name: user.name,
          email: user.email,
          phone: user.phoneNumber,
        },
        websiteUrl: window.location.href
      });
  
  
      const { paymentUrl } = response.data;
  

      window.open(paymentUrl, "_blank");
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      alert("Failed to start payment. Please try again.");
    }
  };
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-light dark:bg-gray-900 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row items-center">
          {/* Product Image */}
          <div className="sm:w-1/2 mb-6 sm:mb-0">
            <img
              src={product.photo || "https://via.placeholder.com/300"}
              alt={product.title || "Product Image"}
              className="w-full h-72 rounded-lg object-contain"
            />
          </div>

          {/* Product Details */}
          <div className="sm:w-1/2 sm:pl-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {product.title || "Product Title"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Description: {product.description || "No description available."}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2 font-semibold">
              Price: <span className="text-green-500">Rs. {product.price || 0}</span>
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              Seller: {product.user?.name || "Unknown"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Email: {product.user?.email || "Not provided"}
            </p>
          </div>
        </div>

        {/* Proceed to Pay Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handlePayment}
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
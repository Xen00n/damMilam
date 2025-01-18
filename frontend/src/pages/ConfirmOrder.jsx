import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Logoo from "../assets/logoo.png";
const ConfirmOrder = () => {
  const { productId } = useParams(); // Product ID from URL
  const [product, setProduct] = useState({
    title: "product title",
    photo: "https://via.placeholder.com/300",
    price: "",
    description:"",
    user: {
      name: "Seller",
      email: "placeholder@example.com",
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:6969/api/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const handlePayment = () => {
    // Implement your payment logic here
    //navigate
    console.log("Proceeding to payment for product:", product.title);
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
              src={product.photo}
              // alt={product.title}
              className="w-full h-72 rounded-lg object-contain"
            />
          </div>

          {/* Product Details */}
          <div className="sm:w-1/2 sm:pl-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {product.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Description: {product.description}</p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2 font-semibold">
              Price: <span className="text-green-500">${product.price}</span>
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
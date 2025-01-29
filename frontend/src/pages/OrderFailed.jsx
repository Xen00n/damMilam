import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const OrderFailed = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({
    title: "",
    photo: "",
    price: 0,
    description: "",
  });
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:6969/api/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };
    
    if (productId) fetchProduct();
  }, [productId]);
  
  return (
    <div className="bg-light dark:bg-gray-900 min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/753/753345.png" // Failed icon
          alt="Failed"
          className="w-24 h-24 mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Order Failed!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your payment could not be processed. Please try again later or contact support.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          If money has been deducted, it will be refunded automatically.
        </p>
        
        {/* Product Details */}
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
          <img
            src={product.photo || "https://via.placeholder.com/150"}
            alt={product.title}
            className="w-full h-40 object-contain mb-2 rounded"
          />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {product.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
          <p className="text-red-500 font-bold">Rs. {product.price}</p>
        </div>
        
        <Link
          to="/"
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderFailed;

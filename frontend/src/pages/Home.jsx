import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = ({ isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:6969/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products', err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const handleCreateGroup = (productName, productId, price) => {
    if (!isLoggedIn) {
      alert('You need to log in first to create a bargaining group');
      return;
    }
  
    const token = localStorage.getItem('authToken');
  
    const createGroup = async () => {
      try {
        const groupData = {
          productName,  // Send productName
          productId,    // Send productId
          price,         // Send price
          groupName: productName, // Send groupName (same as productName)
        };
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        const response = await axios.post('http://localhost:6969/api/bargaining-group/create', groupData, config);
  
        if (response.data.success) {
          console.log('Bargaining group created successfully:', response.data.group);
          alert('Bargaining group created successfully!');
        } else {
          alert('Failed to create bargaining group');
        }
      } catch (error) {
        console.error('Error creating group:', error);
        alert('Error creating bargaining group. Please try again.');
      }
    };
  
    createGroup();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-light dark:bg-gray-900 min-h-screen p-8">
      <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-8">
        Available Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="relative overflow-hidden rounded-lg mb-6 h-60">
              <img
                src={product.photo}
                alt={product.title}
                className="w-full h-full object-contain rounded-lg transition-all duration-300 transform hover:scale-105"
              />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{product.title}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">{product.description}</p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-2 font-bold">
              Price: <span className="text-green-500">${product.price}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Seller: {product.user.name}</p>

            <div className="mt-4">
              <button
                onClick={() => handleCreateGroup(product.title, product._id, product.price)} // Pass product name, id, and price
                className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg w-full transition-all duration-300 transform hover:scale-105"
              >
                Create Bargaining Group
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

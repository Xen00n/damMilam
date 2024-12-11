import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Unauthorized. Please log in.");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      if (photo) {
        formData.append("photo", photo);
      }

      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/profile"); // Redirect back to profile after adding
    } catch (err) {
      setError("Failed to add product. Please try again.");
    }
  };

  return (
    <div className=" bg-light dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <form
        className="max-w-6xl flex flex-col bg-white dark:bg-gray-800 rounded shadow-md p-6"
        onSubmit={handleAddProduct}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Add New Product
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium">
            Title
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium">
            Description
          </label>
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium">
            Price
          </label>
          <input
            type="number"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-medium">
            Product Photo
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="ml-8 px-4 py-2 bg-green-600 hover:bg-green-900 text-white rounded"
          >
            Add Product
          </button>

          <button
            type="button"
            className=" abosulute mr-8 px-4 py-2 bg-green-600 hover:bg-green-900 text-white rounded"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

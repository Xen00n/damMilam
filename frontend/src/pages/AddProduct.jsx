import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const navigate = useNavigate();

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("status", "Available");
    formData.append("photo", photo);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:6969/api/add-product",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Product added:", response.data);
      setSuccessMessage("Product added successfully!"); // Show success message
      setTimeout(() => {
        setSuccessMessage(""); // Hide success message after 3 seconds
        navigate("/profile"); // Redirect to profile after success
      }, 3000);
    } catch (error) {
      console.error("Error adding product:", error);
      setError("An error occurred while adding the product.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setImagePreview(null);
  };

  return (
    <div className="bg-light dark:bg-gray-900 min-h-screen flex justify-center items-center">
      <form
        className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
        onSubmit={handleAddProduct}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Add New Product
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {successMessage && (
          <div className="bg-green-500 text-white p-4 rounded-2xl mb-4 text-center">
            {successMessage}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-green-400 transition-all duration-300 shadow-md hover:shadow-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            Description
          </label>
          <textarea
            className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-green-400 transition-all duration-300 shadow-md hover:shadow-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            Price (Rs.)
          </label>
          <input
            type="number"
            className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-green-400 transition-all duration-300 shadow-md hover:shadow-lg"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="mb-8 flex flex-col items-center">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            Product Photo
          </label>

          {/* Show Choose File Button if no photo is selected */}
          {!photo && (
            <div className="relative group w-full flex justify-center">
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileInput"
                className="w-full px-6 py-3 bg-green-600 text-white rounded-2xl text-center cursor-pointer hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Choose Photo
              </label>
            </div>
          )}

          {/* Show Image Preview and Remove Photo Button if photo is selected */}
          {photo && (
            <div className="mt-4 flex flex-col items-center">
              <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-600">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-center cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
              >
                Remove Photo
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-between items-center mt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl w-full sm:w-auto shadow-lg hover:shadow-2xl transition-all duration-300 mb-4 sm:mb-0"
          >
            Add Product
          </button>

          <button
            type="button"
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-2xl w-full sm:w-auto mt-4 sm:mt-0 shadow-md hover:shadow-lg transition-all duration-300"
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

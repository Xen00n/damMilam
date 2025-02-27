import { Router } from 'express';
import Product from '../models/Product.js';
import User from '../models/Product.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for file upload
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed.'));
      }
      cb(null, true);
    }
  });
  

// Initialize router
const router = Router();

router.get('/products-user', verifyToken, async (req, res) => {
    try {
      // Fetch products belonging to the authenticated user
      const products = await Product.find({ user: req.user.id });
  
      // Return the list of products
      res.status(200).json({ products });
    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ message: 'Error fetching products.' });
    }
  });

// POST route to add a product
router.post('/add-product', verifyToken, upload.single('photo'), async (req, res) => {
  console.log("Received data:", req.body);
  console.log("Received file:", req.file);

  const { title, description, price, status } = req.body;

  if (!title || !description || !price || !status || !req.file) {
    return res.status(400).json({ message: "All fields and a photo are required." });
  }

  try {
    // Upload the image buffer to Cloudinary using upload_stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image', // Ensure it's an image upload
        public_id: `product_images/${title}_${Date.now()}`, // Optional: Custom public ID
        folder: 'product_images', // Optional: Upload to a specific folder
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({
            message: 'Error uploading image to Cloudinary',
            error: error, // Return the Cloudinary error in the response
          });
        }

        console.log("Cloudinary upload result:", result);

        // Create new product with Cloudinary image URL
        const newProduct = new Product({
          title,
          description,
          price,
          status,
          photo: result?.secure_url || "", // Ensure the URL is correctly assigned
          user: req.user.id, // Assuming user ID is attached to the token
        });

        try {
          // Save the product in DB
          await newProduct.save();
          console.log("Product saved to database:", newProduct);
          res.status(201).json({ message: 'Product added successfully', product: newProduct });
        } catch (err) {
          console.error("Error saving product:", err);
          res.status(500).json({ message: 'Server error. Could not add product.', error: err });
        }
      }
    );

    // Pipe the file buffer into Cloudinary's upload stream
    uploadStream.end(req.file.buffer); // End the stream by writing the file buffer

  } catch (err) {
    console.error("Error in product route:", err);
    res.status(500).json({ message: 'Server error. Could not add product.', error: err });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ status: { $ne: 'Sold' } }).populate('user', 'name email'); // Populate the user field to get user details
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
});
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('user', 'name email'); // Populate the user field to get user details
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
});
router.get('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate("user");
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({
      title: product.title,
      photo: product.photo,
      price: product.price,
      description: product.description,
      user: { name: product.user.name, email: product.user.email }

    });
  } catch (err) {
    console.error('Error fetching product data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;

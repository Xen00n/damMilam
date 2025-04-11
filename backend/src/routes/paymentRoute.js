import express from 'express';
import axios from 'axios';
const router = express.Router();
import Transaction from '../models/Transaction.js';
import Product from '../models/Product.js';
import nodemailer from 'nodemailer';
import Group from '../models/Group.js';


router.post("/khalti/initiate-payment/:groupId", async (req, res) => {
  try {
    const {groupId} = req.params;
    const { amount, productId, productName,customer_info, websiteUrl} = req.body;

    if (!amount || amount <= 0 || !productId || !productName) {
      return res.status(400).json({ error: "Invalid payment data" });
    }
    const response = await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/", {
      return_url: `http://localhost:6969/api/khalti/payment-response/${groupId}`, 
      website_url: websiteUrl, 
      amount:100, 
      purchase_order_id: productId, 
      purchase_order_name: productName, 
      customer_info: customer_info,
    }, {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, 
        "Content-Type": "application/json",
      },
    });

    res.json({ token: response.data.token, paymentUrl: response.data.payment_url });

  } catch (error) {
    console.error("Khalti Payment Initiation Failed!");
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
      return res.status(error.response.status).json(error.response.data);
    } else {
      console.error("Error Message:", error.message);
      return res.status(500).json({ error: "Payment initiation failed." });
    }
  }
});
router.get("/khalti/payment-response/:groupId", async (req, res) => {
  try {
    const {groupId} = req.params;
    const { pidx, status, transaction_id, amount, mobile, purchase_order_id, purchase_order_name } = req.query;
    await Transaction.create({
      pidx,
      status,
      transaction_id,
      amount,
      mobile,
      purchase_order_id,
      purchase_order_name,
    });
    console.log(groupId);
    await Group.findByIdAndDelete(groupId);
    if(status == "Completed"){
      const product = await Product.findById(purchase_order_id).populate("user");
      if (!product) {
        return res.status(404).send("Product not found.");
      }
      

      const seller = product.user;
      if (!seller ) {
        return res.status(404).send("Seller not found.");
      }

      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: process.env.EMAIL_USER, // Your Gmail address
              pass: process.env.EMAIL_PASS, // App password (if using Gmail)
          },
      });

      const mailOptionsSeller = {
        from: process.env.EMAIL_USER,
        to: seller.email,
        subject: "Your Product Has Been Sold",
        text: `Dear ${seller.name},\n\nYour product '${product.title}' has been sold successfully!\nAmount Received: Rs. ${amount}\n\nCongratulations on your sale!`,
      };

      await transporter.sendMail(mailOptionsSeller);
      product.status = "Sold";
      await product.save();
      return res.redirect(`http://localhost:5173/ordersuccess/${purchase_order_id}`);
    }
    else
      return res.redirect(`http://localhost:5173/orderfailed/${purchase_order_id}`);
  } catch (error) {
    console.error("Error processing Khalti response:", error);
    res.status(500).send("Error processing payment.");
  }
});


export default router;

import express from 'express';
import axios from 'axios';
const router = express.Router();
import Transaction from '../models/Transaction.js';

router.post("/khalti/initiate-payment", async (req, res) => {
  try {
    const { amount, productId, productName,customer_info, websiteUrl} = req.body;

    if (!amount || amount <= 0 || !productId || !productName) {
      return res.status(400).json({ error: "Invalid payment data" });
    }

    console.log("Initiating Khalti Payment...");

    const response = await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/", {
      return_url: "http://localhost:6969/api/khalti/payment-response", 
      website_url: websiteUrl, 
      amount:100, 
      purchase_order_id: productId, 
      purchase_order_name: productName, 
      customer_info: customer_info,
    }, {
      headers: {
        Authorization: "Key dfd845c0d75747d68295dcf0e90afd0e", 
        "Content-Type": "application/json",
      },
    });

    console.log("Khalti Initiation Response:", response.data);
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
router.get("/khalti/payment-response", async (req, res) => {
  try {
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
    if(status == "Completed")
      return res.redirect(`http://localhost:5173/ordersuccess/${purchase_order_id}`);
    else
      return res.redirect(`http://localhost:5173/orderfailed/${purchase_order_id}`);
  } catch (error) {
    console.error("Error processing Khalti response:", error);
    res.status(500).send("Error processing payment.");
  }
});


export default router;

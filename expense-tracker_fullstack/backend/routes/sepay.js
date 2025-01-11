

const express = require("express");
const axios = require("axios");
const router = express.Router();

// Lấy API Token từ file .env
const API_TOKEN = process.env.API_TOKEN;

// URL API mới
const API_URL = "https://my.sepay.vn/userapi/transactions/list";

// Route để lấy danh sách giao dịch gần nhất
router.get("/transactions", async (req, res) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    res.json(response.data); // Trả về dữ liệu từ API SePay
  } catch (error) {
    console.error("Lỗi khi gọi API SePay:", error.message);
    res.status(500).json({ error: "Không thể gọi API SePay" });
  }
});

module.exports = router;


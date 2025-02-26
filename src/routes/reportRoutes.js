const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// 📌 ดึงข้อมูลทั้งหมด
router.get("/", reportController.getAllReports);

// 📌 ค้นหาข้อมูลแจ้งซ่อม
router.get("/search", reportController.searchReports);

// 📌 อัปเดตข้อมูล
router.put("/:id", reportController.updateReport);

// 📌 ลบข้อมูล
router.delete("/:id", reportController.deleteReport);

module.exports = router;

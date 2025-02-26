const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// ✅ API ค้นหาข้อมูลจาก query (name, parcelnumber, office)
router.get("/search", async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.json([]);
  }

  try {
    const results = await Report.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { parcelnumber: { $regex: query, $options: "i" } },
        { office: { $regex: query, $options: "i" } },
      ],
    });

    res.json(results);
  } catch (err) {
    console.error("Error searching reports:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการค้นหา" });
  }
});

// ✅ API อัปเดตข้อมูล (status, details)
router.put("/:id", async (req, res) => {
  const { status, details } = req.body;

  if (!status || !details) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      { status, details },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "ไม่พบข้อมูลที่ต้องการแก้ไข" });
    }

    res.json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดต" });
  }
});

module.exports = router;

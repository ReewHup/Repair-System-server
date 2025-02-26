// โหลดค่าจาก .env
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// สร้าง Schema
const ReportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parcelnumber: { type: String },
  office: { type: String },
  phone: { type: String },
  issue: { type: String, required: true },
  details: { type: String },
  status: { type: String, required: true, default: "รอซ่อม" },
});

const Report = mongoose.model("report", ReportSchema);

// API Routes
app.get("/api/reports", async (req, res) => {
  const reports = await Report.find();
  res.json(reports);
});

app.post("/api/reports", async (req, res) => {
  console.log("📌 ข้อมูลที่ได้รับจาก Frontend:", req.body); // ✅ Debug
  const newReport = new Report({
    name: req.body.name,
    parcelnumber: req.body.parcelNumber,  // ❌ ของเดิมใช้ "parcelNumber"
    office: req.body.office,
    phone: req.body.phone,
    issue: req.body.issue,
    details: req.body.details,
    status: req.body.status || "รอซ่อม",
  });

  try {
    await newReport.save();
    res.json(newReport);
  } catch (error) {
    console.error("❌ Error saving report:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
  }
});

app.get("/api/reports/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "กรุณาใส่คำค้นหา" });

  try {
    const reports = await Report.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { parcelnumber: { $regex: query, $options: "i" } },
        { office: { $regex: query, $options: "i" } }
      ]
    });

    res.json(reports);
  } catch (error) {
    console.error("❌ Error searching reports:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการค้นหา" });
  }
});


app.put("/api/reports/:id", async (req, res) => {
  const { status, details } = req.body;
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      { status, details },
      { new: true }
    );
    res.json(updatedReport);
  } catch (error) {
    console.error("❌ Error updating report:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดต" });
  }
});

app.delete("/api/reports/:id", async (req, res) => {
  await Report.findByIdAndDelete(req.params.id);
  res.json({ message: "ลบสำเร็จ" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


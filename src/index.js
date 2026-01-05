// โหลดค่าจาก .env
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require('./routes/auth'); // เรียกใช้ระบบล็อกอิน

const app = express();
app.use(express.json());
app.use(cors());

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// เปิดใช้งาน API สำหรับล็อกอิน
app.use('/api/auth', authRoutes);

// ==========================================
// 1. สร้าง Schema (ตารางเก็บข้อมูล)
// ==========================================
const ReportSchema = new mongoose.Schema({
  // ✅ 1. เลขที่ใบงาน (Run Number)
  jobId: { type: String, unique: true }, 

  // ✅ 2. วันที่รับซ่อม (ล็อกค่าเวลาไว้ ไม่เปลี่ยนตามเวลาบันทึก)
  dateReceived: { type: Date },

  // ข้อมูลลูกค้า
  customerName: { type: String },
  address: { type: String },
  phone: { type: String },
  contactPerson: { type: String },

  // ข้อมูลสินค้า
  product: { type: String },
  brand: { type: String },
  model: { type: String },
  serialNumber: { type: String },
  condition: { type: String },
  accessories: { type: String },

  // ข้อมูลการซ่อม
  issue: { type: String },         // อาการเสีย
  details: { type: String },       // รายละเอียดเพิ่มเติม
  status: { type: String, default: "รอซ่อม" },
  technician: { type: String },    // ชื่อช่างผู้รับงาน

}, { timestamps: true }); // timestamps จะเก็บ createdAt, updatedAt แยกต่างหาก

const Report = mongoose.model("report", ReportSchema);

// ==========================================
// 2. API Routes
// ==========================================

// ✅ API: หาเลขที่ใบงานถัดไป (Auto Run Number)
app.get("/api/reports/next-id", async (req, res) => {
  try {
    // หาใบล่าสุด
    const lastReport = await Report.findOne().sort({ createdAt: -1 });
    let nextId = "IT-0000001"; // ค่าเริ่มต้น

    if (lastReport && lastReport.jobId) {
      // ตัด IT- ออก แล้วบวก 1
      const lastNumStr = lastReport.jobId.replace("IT-", "");
      const lastNum = parseInt(lastNumStr);
      const nextNum = lastNum + 1;
      // เติม 0 ข้างหน้าให้ครบ 7 หลัก
      nextId = `IT-${String(nextNum).padStart(7, "0")}`;
    }
    res.json({ nextId });
  } catch (error) {
    console.error("Error generating ID:", error);
    res.status(500).json({ error: "Cannot generate ID" });
  }
});

// ✅ API: ดึงรายการทั้งหมด
app.get("/api/reports", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 }); // เรียงจากใหม่ไปเก่า
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reports" });
  }
});

// ✅ API: บันทึกข้อมูลใหม่
app.post("/api/reports", async (req, res) => {
  console.log("📌 New Report Data:", req.body);
  try {
    const newReport = new Report(req.body);
    await newReport.save();
    res.json(newReport);
  } catch (error) {
    console.error("❌ Error saving report:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
  }
});

// ✅ API: ค้นหาข้อมูล
app.get("/api/reports/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "กรุณาใส่คำค้นหา" });

  try {
    const reports = await Report.find({
      $or: [
        { customerName: { $regex: query, $options: "i" } },
        { jobId: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
        { serialNumber: { $regex: query, $options: "i" } }
      ]
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

// ✅ API: อัปเดตข้อมูล
app.put("/api/reports/:id", async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

// ✅ API: ลบข้อมูล
app.delete("/api/reports/:id", async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "ลบสำเร็จ" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// app.use(express.json()); // อ่าน JSON จาก request
// app.use(cors()); // อนุญาตให้ React เรียก API ได้

// // เชื่อมต่อ MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // สร้าง Schema สำหรับแจ้งซ่อม
// const ReportSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   parcelnumber: { type: String, required: true },  // ✅ เพิ่มฟิลด์ใหม่
//   office: { type: String, required: true },        // ✅ เพิ่มฟิลด์ใหม่
//   phone: { type: String, required: true },         // ✅ เพิ่มฟิลด์ใหม่
//   issue: { type: String, required: true },
//   details: { type: String, required: true },       // ✅ เพิ่มฟิลด์ใหม่
//   status: { type: String, required: true, default: "รอซ่อม" }
// });

// const Report = mongoose.model("Report", reportSchema);

// // **📌 สร้าง API**
// // 1️⃣ ดึงรายการแจ้งซ่อมทั้งหมด
// app.get("/api/reports", async (req, res) => {
//   const reports = await Report.find();
//   res.json(reports);
// });

// // 2️⃣ เพิ่มรายการแจ้งซ่อมใหม่
// app.post("/api/reports", async (req, res) => {
//   const newReport = new Report(req.body);
//   await newReport.save();
//   res.json(newReport);
// });

// // 3️⃣ อัปเดตสถานะการแจ้งซ่อม
// app.put("/api/reports/:id", async (req, res) => {
//   const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(updatedReport);
// });

// // 4️⃣ ลบรายการแจ้งซ่อม
// app.delete("/api/reports/:id", async (req, res) => {
//   await Report.findByIdAndDelete(req.params.id);
//   res.json({ message: "ลบสำเร็จ" });
// });

// // เปิดเซิร์ฟเวอร์
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// 📌 GET: ดึงข้อมูลทั้งหมด
router.get("/", async (req, res) => {
  try {
    const reports = await prisma.report.findMany();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 POST: เพิ่มข้อมูลใหม่
router.post("/", async (req, res) => {
  try {
    const newReport = await prisma.report.create({ data: req.body });
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ message: "Failed to create report" });
  }
});

// 📌 GET: ค้นหาข้อมูล
router.get("/search", async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.json([]);
  }

  try {
    const results = await prisma.report.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { parcelnumber: { contains: query, mode: "insensitive" } },
          { office: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    res.json(results);
  } catch (error) {
    console.error("Error searching reports:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการค้นหา" });
  }
});

// 📌 PUT: อัปเดตข้อมูล (เฉพาะ status & details)
router.put("/:id", async (req, res) => {
  const { status, details } = req.body;
  const reportId = parseInt(req.params.id); // แปลง ID เป็นตัวเลข

  try {
    // ตรวจสอบว่ามีข้อมูลนี้หรือไม่
    const existingReport = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!existingReport) {
      return res.status(404).json({ message: "ไม่พบข้อมูลที่ต้องการแก้ไข" });
    }

    // อัปเดตเฉพาะฟิลด์ที่กำหนด
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: { status, details },
    });

    res.json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดต" });
  }
});

  // 📌 DELETE: ลบข้อมูลตาม ID
router.delete("/:id", async (req, res) => {
  const reportId = parseInt(req.params.id); // ✅ แปลงเป็นตัวเลข

  if (isNaN(reportId)) {
    return res.status(400).json({ message: "ID ไม่ถูกต้อง" });
  }

  try {
    const deletedReport = await prisma.report.delete({
      where: { id: reportId },
    });

    res.json({ message: "ลบข้อมูลสำเร็จ", deletedReport });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "ลบข้อมูลไม่สำเร็จ", error });
  }
});


export default router;

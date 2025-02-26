const Report = require("../models/Report");

// 📌 ดึงข้อมูลแจ้งซ่อมทั้งหมด
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 ค้นหาข้อมูลแจ้งซ่อมจาก query
exports.searchReports = async (req, res) => {
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
  } catch (error) {
    console.error("Error searching reports:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการค้นหา" });
  }
};

// 📌 อัปเดตข้อมูล (status & details)
exports.updateReport = async (req, res) => {
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
};

// 📌 ลบข้อมูลแจ้งซ่อม
exports.deleteReport = async (req, res) => {
  try {
    const deletedReport = await Report.findByIdAndDelete(req.params.id);

    if (!deletedReport) {
      return res.status(404).json({ message: "ไม่พบข้อมูลที่ต้องการลบ" });
    }

    res.json({ message: "ลบข้อมูลสำเร็จ", deletedReport });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบ" });
  }
};

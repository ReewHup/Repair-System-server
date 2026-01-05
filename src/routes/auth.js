const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.json({ success: false, message: "ไม่พบผู้ใช้" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "รหัสผ่านผิด" });

    // ✅ ส่ง thaiName กลับไปด้วย
    res.json({ 
        success: true, 
        message: "สำเร็จ", 
        username: user.username,
        thaiName: user.thaiName 
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
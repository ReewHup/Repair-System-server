require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

// จับคู่ User (อังกฤษ) -> ชื่อไทย
const users = [
  { username: "air",  password: "12345", thaiName: "แอร์" },
  { username: "au",   password: "12345", thaiName: "อุ๊" },
  { username: "may",  password: "12345", thaiName: "เม" },
  { username: "nut",  password: "12345", thaiName: "นัด" },
  { username: "boss", password: "12345", thaiName: "บอส" },
  { username: "ryu",  password: "12345", thaiName: "ริว" },
  { username: "o",    password: "12345", thaiName: "โอ" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to DB...");
    
    await User.deleteMany({}); // ล้างข้อมูลเก่าทิ้ง
    
    for (const u of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      await User.create({
        username: u.username,
        password: hashedPassword,
        thaiName: u.thaiName // ✅ บันทึกชื่อไทย
      });
      console.log(`Created: ${u.username} (${u.thaiName})`);
    }

    console.log("✅ เพิ่มข้อมูลเรียบร้อย!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  thaiName: { type: String, required: true } // ✅ สำคัญ: ช่องเก็บชื่อไทย
});
module.exports = mongoose.model('User', userSchema);
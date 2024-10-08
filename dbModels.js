const mongoose = require('mongoose');

// MongoDB connection
const connectDB = () => {
  mongoose.connect('mongodb://localhost:27017/student-teacher-platform')
    .then(() => {
      console.log('MongoDB Connected');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
};

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // Plain text password
  email: { type: String, required: true },     // Email address
  role: { type: String, required: true },      // 'student' or 'teacher'
});

const User = mongoose.model('User', UserSchema);

// Teacher Update Schema
const TeacherUpdateSchema = new mongoose.Schema({
  teacherName: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  datePosted: { type: Date, default: Date.now },
});

const TeacherUpdate = mongoose.model('TeacherUpdate', TeacherUpdateSchema);

// Export all in one object
module.exports = { connectDB, User, TeacherUpdate };

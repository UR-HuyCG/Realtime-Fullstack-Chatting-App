import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // tự động tạo index duy nhất cho trường này 
    trim: true,  // loại bỏ khoảng trắng ở đầu và cuối chuỗi
    lowercase: true 
  },    
  hashedPassword: { 
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  avatarUrl: {
    type: String, //link CDN để hiển thị hình
  },
  avatarId: {
    type: String, //Cloudinary public_id để xóa hình
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  phone:{
    type: String,
    sparse: true // cho phép giá trị null nhưng vẫn tạo index duy nhất (ko được trùng)
  }

}, {
    timestamps: true // tự động thêm createdAt và updatedAt
});

const User = mongoose.model('User', userSchema);
export default User;
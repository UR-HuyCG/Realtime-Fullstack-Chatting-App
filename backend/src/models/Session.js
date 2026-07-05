import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Kiểu dữ liệu ObjectId để tham chiếu đến User
        ref: 'User', // Tham chiếu đến model User
        required: true,
        index: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true }
);

//tự động xóa khi hết hạn
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // tự động xóa document khi hết hạn

export default mongoose.model('Session', sessionSchema);

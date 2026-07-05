import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';

export const protectedRoute = async (req, res, next) => {  //riêng middleware phải có next 
    try {
        //Lấy accessToken từ Header
        const authHeader = req.headers['authorization'];
        //có thể xem ảnh 1 trong readme để hiểu hơn 
        const token = authHeader && authHeader.split(' ')[1]; //nếu authHeader tồn tại thì lấy token, nếu không thì token = undefined
        
        //Xác nhận token có hợp lệ không
        if (!token) {
            return res.status(401).json({ message: "Không tìm thấy access token" });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if (err) {
                console.error("Lỗi khi xác minh JWT trong authMiddleware", err);
                return res.status(401).json({ message: "Access token hết hạn hoặc không hợp lệ" });
            }

            //tìm user
            const user = await User.findById(decodedUser.id).select('-hashedPassword'); //loại bỏ password ra khỏi user

            if (!user) {
                return res.status(401).json({ message: "Người dùng không tồn tại" });
            }
            
            //trả về user trong req
            req.user = user;     //gán user vào req để các route sau có thể sử dụng
            next(); 
        })
    } catch (error) {
        console.error("Lỗi khi xác minh JWT trong authMiddleware", error);
        return res.status(401).json({ message: "Lỗi hệ thống" });
    }
}
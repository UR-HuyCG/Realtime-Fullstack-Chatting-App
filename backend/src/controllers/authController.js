import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Session.js';

const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 *60 *60 *1000; //14 ngày

export const signUp = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;

        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({ message: 'Không thể thiếu username, password, email, firstName hoặc lastName' });
        }

        //kiểm tra xem username có tồn tại chưa
        const duplicate = await User.findOne({ username });

        if (duplicate) {
            return res.status(409).json({ message: 'Username đã tồn tại' });
        }

        //nếu chưa thì mã hóa password
        const hashedPassword = await bcrypt.hash(password, 10);  //số lần băm (salt rounds) là 10, càng cao thì càng an toàn nhưng tốn thời gian

        //tạo user mới
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`,
        });

        //return về 
        res.sendStatus(204);

    } catch (error) {
        console.error("Lỗi khi gọi signUp", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const signIn = async (req, res) => {
    try {
        //Lấy input
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Không thể thiếu username hoặc password' });
        }

        //Lấy hashedPassword từ database để so với password input
        const user = await User.findOne({ username }).exec();
        if (!user) {
            return res.status(401).json({ message: 'Username hoặc password không đúng' });
        }

        //Kiểm tra password
        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordCorrect) {
            return res.status(401).json({ message: 'Username hoặc password không đúng' });
        }

        //Nếu khớp, tạo accessToken = JWT
        const accessToken = jwt.sign({userId: user._id, username: user.username}, process.env.ACCESS_TOKEN_SECRET, { expiresIn:  ACCESS_TOKEN_TTL });

        //tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');

        //tạo session mới để lưu refresh token 
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        })

        //Trả refresh token về trong cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, //chỉ có thể truy cập cookie từ server, không thể truy cập từ client (JS)
            secure: true,
            sameSite: 'none', //be, fe deploy riêng
            maxAge: REFRESH_TOKEN_TTL 
        });

        //Trả access token về cho client
        return res.status(200).json({ message: `User ${user.displayName} đã log in!`, accessToken });

    } catch (error) {
        console.error("Lỗi khi gọi signIn", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const signOut = async (req, res) => {
    try {
        //Lấy refresh token từ cookie
        const token = req.cookies?.refreshToken; 
        if (token) {
        // xóa refresh token trong Session
        await Session.deleteOne({ refreshToken: token });
        // xóa cookie
        res.clearCookie("refreshToken");
        }
    return res.sendStatus(204);

    } catch (error) {
        console.error("Lỗi khi gọi signOut", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

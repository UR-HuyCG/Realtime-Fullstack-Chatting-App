export const authMe = async (req, res) => {
    try {
        const user = req.user; //lấy user từ middleware protectedRoute

        return res.status(200).json({ user });  // vì user là object nên không cần phải dùng JSON.stringify, res.json sẽ tự động chuyển đổi object sang JSON

    } catch (error) {
        console.log('Lỗi khi gọi authMe', error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
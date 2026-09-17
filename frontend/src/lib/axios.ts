import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";
// Axios là một thư viện JavaScript dùng đểg ửi HTTP request từ frontend tới backend.

/*
Thử hình dung thế này cho đơn giản nhé:

Ứng dụng của bạn (Web hoặc App) giống như khách ngồi trong nhà hàng, còn dữ liệu (danh sách bài viết, thông tin tài khoản...) nằm ở Server/API (Nhà bếp).

Axios chính là người bồi bàn:

Bạn bảo: "Lấy cho tôi danh sách bài viết" -> Axios chạy vào nhà bếp xin dữ liệu.

Khi nhà bếp làm xong -> Axios mang món ăn (dữ liệu) ra tận bàn cho bạn.

Nếu nhà bếp hết món hoặc bị lỗi -> Axios chạy ra báo ngay cho bạn biết để xử lý.

Tại sao không dùng "người bồi bàn mặc định" (Fetch API) mà lại dùng Axios?

Người bồi bàn mặc định Fetch API có sẵn trên trình duyệt, nhưng hơi vụng về:

Mang đồ ăn ra nhưng chưa mở nắp (bạn phải tốn thêm bước gõ .json() thì mới ăn/xem được).

Khi nhà bếp báo lỗi (như lỗi 404, 500), họ vẫn dọn đĩa rỗng ra và bảo "xong rồi", làm bạn phải tự mở ra kiểm tra mới biết bị lỗi.

Còn Axios là một người bồi bàn chuyên nghiệp hơn:

Mở sẵn nắp đĩa: Trả về dữ liệu dùng được ngay (response.data).

Báo lỗi chính xác: Nhà bếp lỗi là báo ngay lập tức, không bắt bạn đoán.

Dặn trước công việc (Interceptor): Bạn có thể dặn Axios "Mỗi lần vào bếp, hãy tự động mang theo chìa khóa (Token xác thực) nhé", bạn không cần dặn lại mỗi lần gọi món.

Tóm lại: Axios chỉ là một công cụ giúp ứng dụng của bạn gửi yêu cầu lấy hoặc gửi dữ liệu lên máy chủ một cách đơn giản, ít tốn code nhất.
*/


const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  withCredentials: true,
});

// gắn access token vào req header
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// tự động gọi refresh api khi access token hết hạn
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    const requestUrl = originalRequest.url ?? "";

    // những api không cần check
    if (
      requestUrl.includes("auth/signin") ||
      requestUrl.includes("auth/signup") ||
      requestUrl.includes("auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (error.response?.status === 403 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1;

      try {
        const res = await api.post("/auth/refresh");
        const newAccessToken = res.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
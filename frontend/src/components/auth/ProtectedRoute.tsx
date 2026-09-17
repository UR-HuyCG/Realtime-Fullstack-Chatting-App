import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react"; 
import { Navigate, Outlet } from "react-router";
/*
  Hãy tưởng tượng ứng dụng của bạn là một ngôi nhà:

  Khi chưa dùng Store, mỗi phòng (Component) muốn biết ai đang ở trong nhà đều phải tự đi hỏi hoặc chuyền tay nhau một tờ giấy (truyền props qua nhiều cấp).

  useAuthStore đóng vai trò như một bảng thông báo trung tâm ở phòng khách. Bất kỳ phòng nào (trang Profile, trang Dashboard, thanh Header) chỉ cần chạy lệnh useAuthStore() là có thể đọc ngay thông tin người dùng đang đăng nhập hoặc thực hiện đăng xuất.

  Ký tự @ đại diện cho thư mục gốc của dự án (thường là thư mục src/). Dùng @ giúp bạn không phải viết đường dẫn lằng nhằng kiểu ../../stores/useAuthStore.

  Tạm thời chỉ cần hiểu: ProtectedRoute lấy thông tin đăng nhập từ useAuthStore.
*/
/*
  React Hook là những hàm đặc biệt (bắt đầu bằng từ khóa use, như useState, useEffect) cho phép bạn "móc" (hook) các tính năng của React như quản lý bộ nhớ (state) hay xử lý vòng đời (lifecycle) vào các Function Component đơn giản.

  Vì sao BẮT BUỘC phải cần Hook?
  Không có Hook, React chỉ là một trang web "chết" (HTML/CSS tĩnh).
*/


/*
  Thay vì bắt bạn phải đi sửa từng chữ, từng con số trên màn hình bằng tay, React đưa ra một quy tắc đơn giản hơn nhiều: Bạn chỉ cần quản lý DỮ LIỆU. Mỗi khi DỮ LIỆU thay đổi, React sẽ TỰ ĐỘNG sửa MÀN HÌNH cho bạn.
  --> Do đó, React cho bạn một công cụ gọi là useState (nằm trong nhóm công cụ gọi chung là Hook).

  useState — Bộ nhớ tạm (Lưu trữ)

  Giúp ứng dụng nhớ một thông tin nào đó có thể thay đổi theo thời gian (ví dụ: số dư tài khoản, trạng thái nút bật/tắt, nội dung ô tìm kiếm).
  Khi thông tin này thay đổi, giao diện sẽ tự động vẽ lại để hiển thị con số/trạng thái mới.

  useEffect — Phản ứng tự động (Hành động)

  Cho phép bạn bảo ứng dụng: "Mỗi khi có thay đổi X xảy ra, hãy tự động chạy công việc Y".
  Thường dùng để: Gọi API lấy dữ liệu từ server khi vừa mở trang, cài đặt bộ đếm thời gian, hoặc cập nhật tiêu đề trang web.

*/

/*
Outlet dùng để làm giao diện chung (Layout). Khi các trang con có cùng một khung (như thanh Menu trên cùng và Sidebar bên trái), bạn dùng Outlet làm "chỗ trống" để chèn nội dung của từng trang vào.

Nhiệm vụ của Outlet: Đứng làm "chỗ trống" chờ sẵn. Nếu người dùng vào /profile, nó hiện trang Profile. Nếu vào /settings, nó đổi sang trang Settings — trong khi thanh Menu giữ nguyên.
*/
const ProtectedRoute = () => {

  /*
  Cách access token và refresh token phối hợp hoạt động

  Đăng nhập: Người dùng gửi tên đăng nhập và mật khẩu lên Server.

  Cấp token: Nếu hợp lệ, Server trả về cả Access Token và Refresh Token.

  Truy cập tài nguyên: Client lưu cả 2 token. Với mỗi request gọi API, Client đính kèm Access Token.

  Hết hạn: Khi Access Token hết hạn, API Server trả về lỗi 401 Unauthorized.

  Cấp lại token: Client tự động gửi Refresh Token lên Auth Server để xin một Access Token mới mà không cần bắt người dùng nhập lại mật khẩu.
  */

  const { accessToken, loading, refresh, fetchMe } = useAuthStore();  // lấy các thuộc tính từ useAuthStore. accessToken là token truy cập hiện tại, loading là trạng thái đang tải dữ liệu, refresh là hàm để làm mới token và fetchMe là hàm để lấy thông tin người dùng hiện tại.
  const [starting, setStarting] = useState(true);  //Khi mới mở trang: starting = true.
  /*
  Khi mới mở trang: starting = true.
  Quy trình kiểm tra vé (init) bắt đầu chạy: Hệ thống đi gọi API kiểm tra Token, Refresh Token, thông tin người dùng... (việc này tốn khoảng 0.5 - 1 giây).
  Trong lúc chờ init chạy: Vì starting đang là true, dòng lệnh if (starting || loading) sẽ chặn lại và hiển thị màn hình "Đang tải trang..." (tránh tình trạng lộ giao diện VIP hoặc bị đuổi về trang Đăng nhập quá sớm khi chưa kiểm tra xong).
  Khi init kiểm tra xong xuôi: Nó gọi setStarting(false) để chuyển starting thành false.
  Kế tiếp: Màn hình "Đang tải trang..." biến mất, nhường chỗ cho giao diện thật (<Outlet/> hoặc đuổi ra <Navigate/>).
  */

  /*
  Tóm gọn toàn bộ file thành 3 bước đơn giản
  Thay vì nhớ từng dòng code, bạn chỉ cần nhớ luồng thực tế này:
  --Bước 1: Treo biển "Đang tải trang..." (starting = true).

  --Bước 2: Đi kiểm tra vé ngầm (init() chạy trong useEffect):Mất vé/hết hạn $\rightarrow$ Đi lấy vé mới (refresh).Có vé rồi $\rightarrow$ Đi lấy thông tin tên tuổi (fetchMe).Kiểm tra xong xuôi $\rightarrow$ Bỏ biển "Đang tải" (starting = false).

  --Bước 3: Chốt hạ giao diện:Có vé $\rightarrow$ Cho vào (<Outlet/>).Không vé $\rightarrow$ Đuổi ra (<Navigate to="/signin"/>).Đừng cố học thuộc lòng code. Khi làm dự án, bạn chỉ cần hiểu luồng chạy này, còn syntax hay cách viết chi tiết cứ vừa làm vừa tra lại là sẽ quen tay ngay!

  */

  const init = async () => {
    let { accessToken: token, user: currentUser } = useAuthStore.getState();  //Mở trực tiếp "cánh cửa đằng sau" của kho Zustand để lấy giá trị mới nhất tại đúng thời điểm dòng lệnh đó thực thi.

    if (!token) {
      await refresh();
      token = useAuthStore.getState().accessToken;
    }

    if (token && !currentUser) {
      await fetchMe();
    }

    setStarting(false);
  };

  useEffect(() => {
  // 1. Công việc cần làm
  init(); 
  }, []); // 2. Mảng rỗng [] quy định KHI NÀO làm
  // Cặp ngoặc vuông [] ở cuối: Là "cái phanh": Chỉ chạy hàm init() đúng 1 lần duy nhất khi trang web vừa mới được mở lên màn hình".


  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }

  if (!accessToken) {
    return (
      <Navigate
        to="/signin"
        replace
      />
    );
  }

  return <Outlet></Outlet>;
};

export default ProtectedRoute;
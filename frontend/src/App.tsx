import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
/*
  function add() {
      return 5;
  }
*/

function App() { //function App() {} cấu trúc hàm mặc định của js
  return (
    // <></> là cấu trúc của react fragment, cho phép nhóm nhiều phần tử con mà k cần thêm phần tử cha vào DOM.
    <>
      <Toaster richColors />
      {/*Prop (property) là một cơ chế truyền dữ liệu hoặc cấu hình từ component cha xuống component con.

      Có thể hình dung component như một hàm, còn prop chính là các đối số (arguments) truyền vào hàm đó để thay đổi cách nó hoạt động hoặc hiển thị.

      Ví dụ về <Toaster richColors/>
      <Toaster/> là một component hiển thị thông báo dạng popup từ thư viện sonner

      Trong đoạn mã <Toaster richColors/>:

      richColors chính là một prop (dạng boolean).

      Khi viết tắt <Toaster richColors/>, nó tương đương với việc bạn đặt <Toaster richColors="{true}"/> */}
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route
            path="/signin"
            element={<SignInPage />}
          />
          <Route
            path="/signup"
            element={<SignUpPage />}
          />

          {/* protected routes */}
          <Route element={<ProtectedRoute />}> 
            <Route
              path="/"
              element={<ChatAppPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
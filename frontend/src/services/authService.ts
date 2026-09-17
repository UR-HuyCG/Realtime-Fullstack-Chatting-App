/* authService không quản lý state cũng không quyết định 
người dùng có được vào trang hay không.

Nó chỉ là lớp trung gian có nhiệm vụ nói:
"Muốn đăng ký thì gọi API này."

"Muốn đăng nhập thì gọi API kia."

"Muốn lấy thông tin user thì gọi API này." */

import api from "@/lib/axios";

export const authService = {
  signUp: async (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string
  ) => {
    const res = await api.post(
      "/auth/signup",
      { username, password, email, firstName, lastName },
      { withCredentials: true }
    );

    return res.data;
  },

  signIn: async (username: string, password: string) => {
    const res = await api.post("/auth/signin", { username, password });
    return res.data; // access token
  },

  signOut: async () => {
    return api.post("/auth/signout");
  },

  fetchMe: async () => {
    const res = await api.get("/user/me");
    return res.data.user;
  },

  refresh: async () => {
    const res = await api.post("/auth/refresh");
    return res.data.accessToken;
  },
};
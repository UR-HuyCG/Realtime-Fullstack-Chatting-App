// store trong Zustand hiểu đơn giản là “kho chứa dữ liệu dùng chung của ứng dụng”.

//Trong project này, useAuthStore chính là kho chứa trạng thái liên quan đến đăng nhập.

import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  setAccessToken: (accessToken: string) => void;
  clearState: () => void;
  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string
  ) => Promise<boolean>;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refresh: () => Promise<void>;
}
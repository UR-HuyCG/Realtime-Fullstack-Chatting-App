import { create } from "zustand";
import { toast } from "sonner";
import axios from "axios";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },
  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  signUp: async (username, password, email, firstName, lastName) => {
    try {
      set({ loading: true });

      //  gọi api
      await authService.signUp(username, password, email, firstName, lastName);

      toast.success("Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.");
      return true;
    } catch (error) {
      console.error(error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || "Đăng ký không thành công");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username, password) => {
    try {
      set({ loading: true });

      const { accessToken } = await authService.signIn(username, password);
      get().setAccessToken(accessToken);

      await get().fetchMe();

      if (!get().user) {
        return false;
      }

      toast.success("Chào mừng bạn quay lại với Moji 🎉");
      return true;
    } catch (error) {
      console.error(error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || "Đăng nhập không thành công!");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      await authService.signOut();
      get().clearState();
      toast.success("Logout thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xảy ra khi logout. Hãy thử lại!");
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();

      set({ user });
    } catch (error) {
      console.error(error);
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 401 || status === 403) {
        set({ user: null, accessToken: null });
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      } else {
        toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!");
      }
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      const accessToken = await authService.refresh();

      setAccessToken(accessToken);

      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      console.error(error);
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },
}));
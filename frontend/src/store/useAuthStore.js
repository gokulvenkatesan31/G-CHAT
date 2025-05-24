import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL = "http://localhost:3000";
export const useAuthStore = create((set, get) => ({
  user: null,
  onlineUsers: [],
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/checkAuth");
      set({ user: response.data });
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message);

      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      console.log("Form data:", formData);
      const response = await axiosInstance.post("/auth/signup", formData);
      if (response.status === 201) {
        toast.success("Account created successfully!");
      }
      set({ user: response.data });
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      if (response.status === 200) {
        toast.success("Logged out successfully!");
        set({ user: null });
        get().disconnectSocket();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },
  login: async (formData) => {
    try {
      set({ isLoggingIn: true });
      const response = await axiosInstance.post("/auth/login", formData);
      if (response.status === 200) {
        toast.success("Logged in successfully!");
        set({ user: response.data });
        get().connectSocket();
      }
    } catch (error) {
      // toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put("/auth/updateProfile", formData);
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        set({ user: response.data });
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { user } = get();
    if (!user || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: user._id,
      },
    });
    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    const { socket } = get();
    console.log("Disconnecting socket : " + socket);
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

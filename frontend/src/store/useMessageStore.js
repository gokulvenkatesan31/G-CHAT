import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useMessageStore = create((set, get) => ({
  messages: [],
  isLoadingMessages: false,
  users: [],
  selectedUser: null,
  isLoadingUsers: false,

  getUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const response = await axiosInstance.get("/messages/users");
      set({ users: response.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  getMessages: async (id) => {
    set({ isLoadingMessages: true });
    try {
      const response = await axiosInstance.get(`/messages/${id}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoadingMessages: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }
    try {
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      console.log("Message sent:", response.data);
      set((state) => ({
        messages: [...state.messages, response.data],
      }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.sender === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (user) => set({ selectedUser: user }),
}));

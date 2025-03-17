import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

// Chat işlemleri için zustand store'u oluşturur
export const useChatStore = create((set, get) => ({
  messages: [], //Mesajlar listesi
  users: [], //Kullanıcılar listesi
  selectedUser: null,//Seçili kullanıcı
  isUsersLoading: false,//Kullanıcılar yükleniyor mu
  isMessagesLoading: false,//Mesajlar yükleniyor mu

  //Kullanıcıları al
  getUsers: async () => {
    set({ isUsersLoading: true }); //Kullanıcılar yükleniyor durumunu başlat
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data }); //Kullanıcıları state'e kaydet
    } catch (error) {
      toast.error(error.response.data.message); //Hata mesajını göster
    } finally {
      set({ isUsersLoading: false }); //Kullanıcılar yüklendikten sonra yüklenme durumunu bitir
    }
  },

  //Seçilen kullanıcı ile ilgili mesajları al
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });//Mesajlar yükleniyor durumunu başlat
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data }); //Mesajları state'e kaydet
    } catch (error) {
      toast.error(error.response.data.message);//Hata mesajını göster
    } finally {
      set({ isMessagesLoading: false }); //Mesajlar yüklendikten sonra yükleme durumunu bitir
    }
  },

  // Mesaj gönder
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get(); //Seçili kullanıcı ve mevcut mesajlar
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] }); //Yeni mesajı mevcut mesajlara ekle
    } catch (error) {
      toast.error(error.response.data.message); //Hata mesajı göster
    }
  },

  //Yeni mesajları almak için socket
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return; //Eğer seçili kullanıcı yoksa işlem yapma

    const socket = useAuthStore.getState().socket; //Socket bağlantısnı al

    //newMessage eventi geldiğinde bu fonksiyon çalşışacak
    socket.on("newMessage", (newMessage) => {
      //Gelen mesaj, seçili kullanıcıdan gelmediyse işlem yapma
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage], //Yeni mesajı mevcut mesajlara ekle
      });
    });
  },

  //Mesajlardan çık
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

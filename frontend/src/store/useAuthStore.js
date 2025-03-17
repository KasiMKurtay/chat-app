import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Geliştirme ortamı için BASE_URL ayarını yap, yoksa prod ortamı kullan
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

//Auth işlemlerini yönetmek için zustand oluştur
export const useAuthStore = create((set, get) => ({
  authUser: null, //Oturum açmış kullanıcı bilgileri
  isSigningUp: false, // Kayıt işlemi durumunu takip et
  isLoggingIn: false, //Giriş işlemi durumunu takip et
  isUpdatingProfile: false, //Profil güncelleme Durumu
  isCheckingAuth: true, //Kimlik doğrulama durumu
  onlineUsers: [], //Çevrimiçi kullanıcılar
  socket: null, //Socket bağlantısı

  //Kullanıcının oturum açma durumunu kontrol et
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data }); //Kullanıcı bilgilerini state'e al
      get().connectSocket(); //Socket bağlantısı kur
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null }); //Eğer hata alırsak kullanıcıyı null yap
    } finally {
      set({ isCheckingAuth: false }); //Kimlik doğrulama kontrolü tamamlandır
    }
  },
  //Kullanıcı kaydı yap
  signup: async (data) => {
    set({ isSigningUp: true }); //Kayıt işlemi başladığını belirt
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data }); //Yeni kullanıcıyı state'e kaydet
      toast.success("Account created successfully"); //Başarılı kayıt mesajı
      get().connectSocket(); //Socket bağlantısı kurt
    } catch (error) {
      toast.error(error.response.data.message); //Hata mesajını göster
    } finally {
      set({ isSigningUp: false }); //Kayıt işlemi sonlandı
    }
  },
  //Kullanıcı girişi yap
  login: async (data) => {
    set({ isLoggingIn: true }); //Giriş işlemi başladığını belirt
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });//Kullanıcı bilgilerini state'e kaydet
      toast.success("Logged in successfully"); //Başarılı giriş mesajı

      get().connectSocket(); //Socket bağlantısını kur
    } catch (error) {
      toast.error(error.response.data.message); //Hata mesajını göster
    } finally {
      set({ isLoggingIn: false }); //Giriş işlemi sonlandı
    }
  },
  //Kullanıcı çıkışı yap
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout"); //Çıkış işlemi
      set({ authUser: null }); //Kullanıcı bilgisini sıfırla
      toast.success("Logged out successfully"); //Başarılı çıkış mesajı
      get().disconnectSocket();// Socket bağlantısnı kes
    } catch (error) {
      toast.error(error.response.data.message); //Hata mesajını göster
    }
  },
  //Profil resmi güncelle
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true }); //Profil güncelleme başladığını belirt
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data }); //Güncellenmiş kullanıcıyı state'e kaydet
      toast.success("Profile updated successfully");//Başarılı profil güncelleme mesajı
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message); //Hata mesajını göstter
    } finally {
      set({ isUpdatingProfile: false }); //Profil güncelleme sonlandı
    }
  },
  //Socket bağlantısını kur
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return; //Eğer kullanıcı yoksa ya da socket zaten bağlıysa devam etme

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id, //Socket bağlantısına kullanıcı ID'sini gönder
      },
    });
    socket.connect(); //Socket'i bağla

    set({ socket: socket }); //Socket'i state'e kaydet

    //Çevrimiçi kullanıcılar listesini al
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds }); //Çevrimiçi kullanıcıları state'e kaydet
    });
  },
  //Socket bağlantısnı kes
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();//Socket bağıysa bağlantıyı kes
  },
}));

import {create} from "zustand"
import { axiosInstance } from "../lib/axios"

export const useAuthStore = create((set) => ({
  authUser:null, //Kullanıcının oturum bilgisi
  isSigningUp:false, //Kayıt alma işlemi devam ediyor mu?
  isLoggingIng:false, //Giriş işlemi devam ediyor mu
  isUpdatingProfile:false,//Profil güncelleme işlemi devam ediyor mu

  isCheckingAuth:true, // oturum kontrolü devam ediyor mu

  checkAuth : async() => {
    try {
      const res = await axiosInstance.get("/auth/check") //endpoint'e istek atıyor
      set({authUser:res.data}) //İstek başarılıysa API'den dönen veri güncelleniyor
    } catch (error) {
      console.error("Error in checkAuth:", error.message)
      set({authUser:null})//Oturumun geçerli olmadığı anlamına geliyor
    }finally{
      set({isCheckingAuth:false}) //Oturum kontrolünün tamamlandığını ve artık kullanıcı arayüzünün (UI) güncellenebileceğini gösterir
    };
  },

  signup:async(data) => {
    
  }
}));
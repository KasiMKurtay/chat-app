import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";

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
    set ({isSigningUp: true}); //Kullanıcının kayıt olma işlemi başlatıldığında true olarak değiştirir
    try {
    const res = await axiosInstance.post("/auth/signup", data) //API'ye kayıt olma isteği gönderilir ve kullanıcı bilgileri iletilir
    set({authUser: res.data})// Başarıyla kayıt olunursa authUser state'i güncellenir ve kullanıcı bilgileri saklanır
    toast.success("Account created succesfully")// Kullanıcıya başarılı kayıt mesajı gösterilir.
    } catch (error) {
      toast.error(error.response.data.message);//Hata oluşursa API'dan gelen mesaj gösterilir
    } finally{
      set({isSigningUp: false}) //Kayıt olma işlemi tamamlandığında yüklenme durumu sıfırlanır
    }
  },

  login:async(data)=> {
    set({isLoggingIng:true}); //Kullanıcının giriş yapma işlemi başladığında true olarak yüklenme durumu gösterir
    try {
      const res = await axiosInstance.post("/auth/login", data); //API'ye giriş isteği gönderilir ve kullanıcı bilgileri ileitlir
      set({authUser: res.data}); //Giriş başarılı olursa authUser state'i güncellenir ve kullanıcı bilgileri saklanır
      toast.success("Logged in successfully");//Kullanıcıya başarılı giriş mesajı gösterilir
    } catch (error) {
      toast.error(error.response.data.message);//Hata oluşursa, API'den gelen hata mesajı kullanıcıya gösterilir
    }finally{
      set({isLoggingIng:false})//Giriş işlemi tamamlandığında yüklenme durumu sıfırlanır
    }
  },

  logout :async () => {
    try {
      await axiosInstance.post("/auth/logout");//API'ye çııkış isteği gönderilir
      set({ authUser: null }); //authUser state'i sıfırlanarak kullanıcı oturumdan çıkartılmış olur
      toast.success("Logged out successfully"); //Kullanıcıya başarılı çıkış mesajı gösterilir
    } catch (error) {
      toast.error(error.response.data.message);//Hata oluşursa, API'den gelen hata mesajı kullanıcıya gösterilir
    }
  },

  updateProfile: async(data) => {
    set ({isUpdatingProfile:true});
    try {
      const res = await axiosInstance.put("/auth/update-profile",data);
      set({authUser: res.data});
      toast.success("Profile Updated Successfully")
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message)
    }finally{
      set ({isUpdatingProfile:false});
    }
  },

  
}));
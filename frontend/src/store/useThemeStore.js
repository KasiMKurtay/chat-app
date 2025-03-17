import { create } from "zustand"

export const useThemeStore = create((set) => ({
  //İlk başlta localStorage'dan tema alınır, yoksa varsayılan olarak "coffe" teması kullanlır
  theme:localStorage.getItem("chat-theme") || "coffee",

  //Temayı ayarlayan fonksiyon
  setTheme:(theme) => {
    localStorage.getItem("chat-teme", theme) //Temayı localstorage'a kaydet
    set({theme}) //Zustand store'daki temayı güncelle
  },
}));
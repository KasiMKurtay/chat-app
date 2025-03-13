import { create } from "zustand"

export const useThemeStore = create((set) => ({
  theme:localStorage.getItem("chat-theme") || "coffee",
  setTheme:(theme) => {
    localStorage.getItem("chat-teme", theme)
    set({theme})
  },
}));
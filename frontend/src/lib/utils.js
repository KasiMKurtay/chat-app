export function formatMessageTime(date) {
  // Tarihi bir Date nesnesine dönüştür ve yerel saat formatında saat ve dakika bilgisi al
  return new Date(date).toLocaleDateString("en-US", {
    hour: "2-digit", // Saat kısmını iki haneli göster
    minute: "2-digit", // Dakika kısmını iki haneli göster
    hour12: false, // 24 saat formatı kullan (12 saatlik formatı engelle)
  })
}

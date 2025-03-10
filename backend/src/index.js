import express from "express"; // Express.js framework'ünü içe aktarır.
import dotenv from "dotenv"; // Çevresel değişkenleri (ENV) kullanmak için dotenv'i içe aktarır.
import authRoutes from "./routes/auth.route.js" // Kimlik doğrulama rotalarını içe aktarır.
import { connectDB } from "./lib/db.js"; // MongoDB bağlantı fonksiyonunu içe aktarır.
import cookieParser from "cookie-parser"
dotenv.config(); // `.env` dosyasındaki değişkenleri kullanabilmek için dotenv'i çalıştırır.

const app = express(); // Express uygulamasını oluşturur.

const PORT = process.env.PORT; // `.env` dosyasından gelen PORT değişkenini alır.

app.use(cookieParser()); //Gelen isteklerde çerezleri otomatik olarak ayrıştırır ve req.cookies üzerinden erişilebilir hale getirir
app.use(express.json()); // Gelen isteklerde JSON verilerini işleyebilmek için middleware ekler.

app.use("/api/auth", authRoutes); 
// Tüm kimlik doğrulama ile ilgili rotaları "/api/auth" altında kullanılabilir hale getirir.

app.listen(PORT, () => { 
  console.log("Server is running on PORT " + PORT); 
  connectDB(); // Sunucu başladıktan sonra MongoDB bağlantısını başlatır.
});

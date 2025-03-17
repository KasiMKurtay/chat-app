import express from "express"; // Express.js framework'ünü içe aktarır.
import dotenv from "dotenv"; // Çevresel değişkenleri (ENV) kullanmak için dotenv'i içe aktarır.
import cookieParser from "cookie-parser"
import cors from "cors"
import authRoutes from "./routes/auth.route.js" // Kimlik doğrulama rotalarını içe aktarır.
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js"; // MongoDB bağlantı fonksiyonunu içe aktarır.
import { app,server } from "./lib/socket.js";
dotenv.config(); // `.env` dosyasındaki değişkenleri kullanabilmek için dotenv'i çalıştırır.

const PORT = process.env.PORT; // `.env` dosyasından gelen PORT değişkenini alır.

app.use(cookieParser()); //Gelen isteklerde çerezleri otomatik olarak ayrıştırır ve req.cookies üzerinden erişilebilir hale getirir
app.use(express.json()); // Gelen isteklerde JSON verilerini işleyebilmek için middleware ekler.
app.use(cors({
  origin:"http://localhost:5173", //Sadece bu adresten gelen isteklerin kabul edilmesine izin veriyor
  credentials:true //Kullanıcı giriş yaptıysa ve kimlik doğrulama çerezleri saklanıyorsa bunları backend'e iletilmesine izin verir
}))

app.use("/api/auth", authRoutes); 
app.use("/api/messages", messageRoutes); 
// Tüm kimlik doğrulama ile ilgili rotaları "/api/auth" altında kullanılabilir hale getirir.

server.listen(PORT, () => { 
  console.log("Server is running on PORT " + PORT); 
  connectDB(); // Sunucu başladıktan sonra MongoDB bağlantısını başlatır.
});

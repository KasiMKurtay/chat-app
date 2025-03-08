import mongoose from "mongoose"; //MongoDB bağlantısı için mongoose'u içeri aktarır

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    //MongoDB'ye bağlantı kurar, bağlandır adresi, .env'den alır
    console.log(`MongoDB connected: ${conn.connection.host}`);
    //Bağlantı başarılı olursa terminale bağlı olduğu sunucunun adını yazdırır
  } catch (error) {
    console.log("MongoDB connection error", error.message);
    //Bağlantı hatası olursa, hatayı konsola yazdırır
    process.exit(1)
    //Hata durumunda uygulamayı durdurur
  }
};

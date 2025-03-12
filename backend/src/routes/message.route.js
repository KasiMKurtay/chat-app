import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js"

const router = express.Router()

router.get("/users", protectRoute, getUsersForSidebar) //Kullanıcılar için bir liste alır. Kimlik doğrulaması yapılır (projectRoute) middleware kullanılarak
router.get("/:id", protectRoute, getMessages) //Belirli bir kulalnıcının mesajlarını alır. Yine kimlik doğrulaması yapılır

router.post("/send/:id", protectRoute, sendMessage)//Mesaj gönderme işlemini yapar. Gönderlen mesaj, hedef kullanıcıyı (id) hedefler Kimlik doğrulaması yapılır

export default router


      /* MİDDLEWARE Nedir */
//Bir web uygulamasında, gelen istek ile yanıt arasındaki süreçte çalışan fonksiyonlardır. Bu fonksiyonlar, istek üzerinde işlem yapar örn; kimlik doğrulama veri doğrulama hata yönetimi. İşlem tamamlandıktan sonra bir sonraki middleware'e veya rota handler'ına geçilmesini sağlar.
//Middleware, genellikle express.js gibi frameworkler'de kullanılır ve next() fonksiyonu ile zincirleme işlem yapılrı
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async(req,res,next)=> {
  try {
    const token = req.cookies.jwt //kullanıcının web'de gözüken JWT token'i alır

    if(!token){
      return res.status(401).json({message:"Unauthorized - No Token Provided"}) //Token yoksa hata döner
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) //Bu işlem token'ın geçerli olup olmadığını ve içindeki bilginin çözümlenmesini sağlar

    if(!decoded){
      return res.status(401).json({message:"Unauthorized - Invalid Token"})
    }
    
    const user = await User.findById(decoded.userId).select("-password")//Token'da çözümlenen userID'yi veritbananında arar, Kullanıcı bulunursa şire bilgisi hariç tüm bilgileri çeker ŞİFRE HARİÇ!

    if(!user){
      return res.status(404).json({ message: "User not found" }); //Kullanıcı bulunamazsa, 404 Not Found hatası döner.
    }

    req.user = user; //Bulunan kullanıcığı req.user üzerine ekler Bu sonraki middleware'lar veya route handler'lar için kullanıabilir

    next() //Eğer her şey başarlıysa next() ile bir sonraki middleware veya route handler'a geçerr

  } catch {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
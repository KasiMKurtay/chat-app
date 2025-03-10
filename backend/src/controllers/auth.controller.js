import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"


export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;

  try {
    if (!email || !fullName || !password) { //Eksik alan kontrolü sağnaldı
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) { // Şifre uzunluğu 6'dan kısa olamaz
      return res.status(400).json({ message: "Password length must be at least 6 characters" });
    }

    const user = await User.findOne({ email }); //Eğer aynı mail girildiyse hata döndürüldü
    if (user) return res.status(400).json({ message: "E-mail already exists" });

    const salt = await bcrypt.genSalt(10); //genSalt ile şifre daha karmaşık hale getirildi
    const hashedPassword = await bcrypt.hash(password, salt);  //şifreye salt ile hashlendi

    const newUser = new User({ //Yeni kullanıcı oluşturuldu
      fullName,
      email,
      password: hashedPassword,
    });

   

    if(newUser){ //Kayıt başarılıysa
      generateToken(newUser._id, res)//ile JWT token oluşturup cookice ekliyoruz
      //Bu token, kullanıcının kimliğini doğruılamak için kullanılacaktır
      await newUser.save();  //Kullanıcı veritabanına kaydedildi
     
      res.status(201).json({
        _id:newUser._id,
        fullName:newUser.fullName,
        email:newUser.email,
        profilePic:newUser.profilePic,
      });
    }else{
      return res.status(400).json({message:"Invalid user data"})
    }

  } catch (error) {
    console.log("Error signup controller", error.message);
    res.status(500).json({message:"Internal Server Error"})
  }
}

export const login = async (req,res) => {
  const { email , password } = req.body //Kullanıcının giriş isteğiyle birlikte gönderdiği email ve password bilgilerini alıyoruz
  try {
    const user = await User.findOne({email}) //Veritabanında gönderilen e-mail'e sahip bir kullanıcı var mı diye kontrıol ediyoruz

    if(!user){ //Eğer kullanıcı yoksa
      return res.status(400).json({message:"Invalid credentials"})//Bu mesaj dönüyor
    }

    //Kullanıcının girdiği şifre veritabanında hashlenmiş şifre ile karşılaştırlır
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
    //bcrypt.compare() fonksiyonu, düz metin şifreyi hashlenmiş versiyonu ile kıyaslar ve eşleşme olup olmadığını kontrol eder
  
  if(!isPasswordCorrect){ //Eğer ki yanlışsa bu hata döndürlür
    return res.status(400).json({message:"Invalid credentials"})
  }

  generateToken(user._id, res) //Eğer kiri bilgileri doğruysa bir JWT token oluşturulur

  res.status(200).json({  //Kullanıcı bbaşarılı bir şekilde giriş yaptıysa, 200OK yanıtı döndürülür
    _id:user._id,
    fullName:user.fullName,
     email:user.email,
     profilePic:user.profilePic
  })

  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({message:"Internal Server Error"})
  }
}

export const logout = (req,res) => {
  try {
    res.cookie("jwt", "" ,{maxAge:0}) //JWT adlı çerezi temizler
    res.status(200).json({message:"Logged out successfully"}) //Başarılı çıkış mesajı
  } catch (error) {
    console.log("Error in logout controller", error.message); //Hata olursa
    res.status(500).json({message:"Internal Server Error"}) //500 döndürür
  }
}

export const updateProfile = async (req,res) => {
  try {
    const {profilePic} = req.body //req.body'den profilePic alır
    const userId = req.user._id //id belirler

    if(!profilePic){ //profil resmi gönderilmezse 400 status hata döner
      return res.status(400).json({message:"Profile pic is required"})
    }

    //Profil resmini Cloudinary'e yükler ve yüklenen resmin URL'ini alır
    const uploadResponse = await cloudinary.uploader.upload(profilePic)

    
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true})
    res.status(200).json(updatedUser)

  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({message:"Internal Server Error"})
  }
}

export const checkAuth = (req,res) => { //Kullancının oturum açığp açmadğını kontrol eder
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log("Error in chechAuth controller",error.message);
    res.status(500).json({message:"Internal Server Error"})
  }
}
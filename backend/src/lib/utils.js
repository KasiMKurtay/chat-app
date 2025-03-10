import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  // Token'ı oluştururken kullanıcı ID'sini ekliyoruz
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token 7 gün sonra geçersiz olacak
  });

  res.cookie("jwt", token, { // jwt adlı cookie'yi istemciye gönderiyoruz
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie'nin 7 gün geçerliliği
    httpOnly: true, // Cookie sadece HTTP istekleriyle erişilebilir, XSS saldırılarına karşı daha güvenli
    sameSite: "strict", // CSRF saldırılarına karşı koruma sağlar
    secure: process.env.NODE_ENV === "production", // Güvenli bağlantı (HTTPS) için yalnızca production ortamında gereklidir
  });

  return token;
};

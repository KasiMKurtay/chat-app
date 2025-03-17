import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState(""); //Mesaj metni
  const [imagePreview, setImagePreview] = useState(null); //Seçilen görselin önizlenmesi
  const fileInputRef = useRef(null); //File input'a erişim için refersans
  const { sendMessage } = useChatStore(); //Mesaj gönderme fonksiyonu

  // Kullanıcı resim seçtiğinde çağrılır
  const handleImageChange = (e) => {
    const file = e.target.files[0]; //İlk seçilen dosya
    if (!file.type.startsWith("image/")) { //Görsel değilse uyarı döner
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader(); //Dosyayı base64'e çevirmek için
    reader.onloadend = () => {
      setImagePreview(reader.result); //Önizleme için sonucu ayarla
    };
    reader.readAsDataURL(file); //Görseli oku
  };

  // Seçilen görseli siler
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; //İnput'u temizler
  };

  //Mesaj gönderme işlemi
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return; //Ne metin ne resim varsa gönderme

    try {
      await sendMessage({
        text: text.trim(), //Boşlukları kırp
        image: imagePreview, //Görsel varsa ekle
      });

      // Gönderim sonrası formu temizle
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error); //Hata varsa logla
    }
  };

  return (
    <div className="p-4 w-full">
      {/* Görsel önizleme varsa göster */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" /> {/*Silme butonu */}
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)} // Metin güncellemne
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          {/* Görsel seçme butonu */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()} //Tıklanınca input'u aç
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;

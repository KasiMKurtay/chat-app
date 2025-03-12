import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    //Mesajı gönderen kullanıcını ID'si, User modeline referans olarak tnaımlanmış ve zorunlu
    senderId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //Mesajın alıcısının ID'si. Bu da User modeline referans olarak tanımlanmış ve zorunlu
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  // MongoDB'nin otomatik olarak createdAt ve updatedAt alanlarını eklemesini sağlar
  { timestamps: true }
  //Bu mesajların gönderildiği zamanları takip etmek için faydalıdır
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
import { useChatStore } from "../store/useChatStore";//Mesajlarla ilgili global durumu yöneten özel hook
import { useEffect, useRef } from "react";//React'ın yan etki useEffect ve referans useRef hookları

import ChatHeader from "./ChatHeader"; //Chat başlığını gösteren bileşen
import MessageInput from "./MessageInput";//Mesaj yazma alkanının gösteren bileşen
import MessageSkeleton from "./skeletons/MessageSkeleton";//Mesaj yüklenirken iskelet ekran
import { useAuthStore } from "../store/useAuthStore"; //Kullanıcı oturum bilgilerini yöneten özel hook
import { formatMessageTime } from "../lib/utils"; //Mesaj saatini fornmatlayan özel yardımcı fonksiyon

const ChatContainer = () => {
  const {
    messages, //Mevcut mesaj listesi,
    getMessages, //Seçili kullanıcıya ait mesajları gösterern fonksiyon
    isMessagesLoading, //Mesajlar yükleniyor mu bilgisi
    selectedUser, //Konuşulan Kullanıcı
    subscribeToMessages, //Gerçek zamanlı mesaj takibi maşlatma
    unsubscribeFromMessages, //Gerçek zamanlı mesaj takibi durdurma 
  } = useChatStore();
  const { authUser } = useAuthStore(); //Giriş yapan kullanıcı bilgisi
  const messageEndRef = useRef(null); //Sayfanın en altına kaydırmak için referans

  //Seçili kullanıcı değiştiğpinde mesajları getir + canlı mesaj takibi başlat
  useEffect(() => {
    getMessages(selectedUser._id); //seçili kullanıcının mesajlarını al

    subscribeToMessages(); //Yeni gelen mesajları canlı takip et

    return () => unsubscribeFromMessages(); //Bileşen kaponınca takipten çık
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  //Mesaj listesi değiştikçe ,sayfanın en altına otomatik kaydır
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  //Mesajlar  yükleniyorsa iskelet durumu göster
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            {/* Mesaj zamanı */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)} {/* Saat formatı */}
              </time>
            </div>
            {/* Mesaj içeriği */}
            <div className="chat-bubble flex flex-col">
              {/* Resim varsa göster */}
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;

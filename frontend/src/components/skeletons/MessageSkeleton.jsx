const MessageSkeleton = () => {
  
  //6 Elemanlı, null değerlerle dolu bir dizi oluşturuyoruz. Bu dizi, 6 adet isketel mesaj göstermek için
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Dizideki her eleman için bir skeleton mesaj oluşturuyoruz */}
      {skeletonMessages.map((_, idx) => (
        // idx % 2 === 0 ise mesaj sola hizalanır değilse sağa hizalanır
        <div key={idx} className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}>
          {/* Profil Fotoğraf alanı */}
          <div className="chat-image avatar">
            <div className="size-10 rounded-full">
              <div className="skeleton w-full h-full rounded-full" />
            </div>
          </div>
        {/* Kullanıcı ismi veya zaman bilgisi gibi üst bilgi alanı */}
          <div className="chat-header mb-1">
            {/* 64px genişliğinde, 16px yüksekliğinde skeleton çubuğu */}
            <div className="skeleton h-4 w-16" />
          </div>
        {/* Mesaj bubble temsil eden kapsayıcı */}
          <div className="chat-bubble bg-transparent p-0">
            {/* 200px genişliğinded, 64px yüksekliğinde skeleton çubuğu */}
            <div className="skeleton h-16 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;

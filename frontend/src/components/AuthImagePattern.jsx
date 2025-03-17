const AuthImagePattern = ({ title, subtitle }) => {
  return (
    //Bu div sade büyük ekranlarda görünür
    //İçerikler ortalanır ve arka plan rengi base-200 olur, padding:48px
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      {/* İçerik kapsayıcı genişlik sınırı ve merkezleme */}
      <div className="max-w-md text-center">
        {/* 3 sütunlu, 3 satırlı grid ve 9 adet kare kutu için */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {/* 9 Adet kutu oluşturuyoruz map ile dönüyoruz */}
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        {/* Başlık alanı */}
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {/* Alt yazı */}
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;

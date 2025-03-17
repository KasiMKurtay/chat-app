import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // 8 Adet skeleton kullanıcı temsili için boş bir array oluşturuyoruz
  const skeletonContacts = Array(8).fill(null);

  return (
    // Yan menü (sidebar) için ana kapsayıcı "aside" etiketi
    // h-full: Yüksekliği tam
    // w-20: Küçük ekranlarda genişlik 80px
    // lg:w-72: Büyük ekranlarda genişlik 288px
    // border-r: Sağ kenarlık
    // flex-col: Dikey hizalama
    // transition-all duration-200: Geçiş efektleri için animasyon
    <aside
      className="h-full w-20 lg:w-72 border-r border-base-300 
    flex flex-col transition-all duration-200"
    >
      {/* Üst başlık */}
      <div className="border-b border-base-300 w-full p-5">
        {/* İkon ve Contacts yazısı, yatayda hizalanmış */}
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Skeleton kullanıcı listesi  */}
      <div className="overflow-y-auto w-full py-3">
        {/* 8 adet skeleton için map ile dönüyoruz */}
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>

            {/* Kullanıcı ismi ve ek bilgi skeletonları - sadece büyük ekranlarda görünür */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              {/* Kullanıcı ismini temsil eden skeleton çubuğu */}
              <div className="skeleton h-4 w-32 mb-2" />
              {/* Ek bilgi için daha küçük skeleton çubuğu */}
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;

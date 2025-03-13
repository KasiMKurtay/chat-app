import { Link } from "react-router-dom"; // Sayfalar arası yönlendirme yapmak için React Router'dan Link bileşeni import ediliyor.
import { useAuthStore } from "../store/useAuthStore"; // Kullanıcı yetkilendirme (auth) durumunu yönetmek için özel bir store kullanılıyor.
import { LogOut, MessageSquare, Settings, User } from "lucide-react"; // UI ikonları için Lucide React kütüphanesi kullanılıyor.

const Navbar = () => {
  const { logout, authUser } = useAuthStore(); // Auth store'dan `logout` fonksiyonu ve `authUser` verisi çekiliyor.

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      {/* Navbar genel yapılandırması */}
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Sol kısım - Logo ve Ana Sayfa Linki */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              {/* Logo alanı */}
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1> {/* Uygulama adı */}
            </Link>
          </div>

          {/* Sağ kısım - Kullanıcı işlemleri */}
          <div className="flex items-center gap-2">
            {/* Ayarlar butonu */}
            <Link
              to={"/settings"}
              className={`btn btn-sm gap-2 transition-colors`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span> {/* Küçük ekranlarda gizlenir */}
            </Link>

            {/* Eğer kullanıcı giriş yaptıysa aşağıdaki butonlar gösterilir */}
            {authUser && (
              <>
                {/* Profil Sayfasına Gitme Butonu */}
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* Çıkış Yapma Butonu */}
                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

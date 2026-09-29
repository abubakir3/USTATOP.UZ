import React from 'react';
import { Wrench, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string, param?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Usta<span className="text-blue-500">Top</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Usta va mijozlarni bog‘lovchi O‘zbekistondagi zamonaviy xizmatlar platformasi. Uy, ofis va biznesingiz uchun ishonchli ustalarni toping, solishtiring va bevosita bog‘laning.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>+998 71 200-00-00 (Qo‘llab-quvvatlash markazi)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>info@ustatop.uz</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span>O‘zbekiston, Toshkent shahri</span>
              </div>
            </div>
          </div>

          {/* Foydalanuvchilar */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Foydalanuvchilar
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('masters')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Usta topish
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Xizmatlar toifalari
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register', { defaultRole: 'master' })}
                  className="hover:text-emerald-400 text-emerald-400 transition-colors font-medium"
                >
                  Usta bo‘lish (Ro‘yxatdan o‘tish)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Shaxsiy kabinetga kirish
                </button>
              </li>
            </ul>
          </div>

          {/* Ommabop toifalar */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Ommabop xizmatlar
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('masters', { category: 'Santexnik' })}
                  className="hover:text-blue-400 transition-colors"
                >
                  Santexnik xizmatlari
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('masters', { category: 'Elektrik' })}
                  className="hover:text-blue-400 transition-colors"
                >
                  Elektrik montaj
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('masters', { category: 'Konditsioner ustasi' })}
                  className="hover:text-blue-400 transition-colors"
                >
                  Konditsioner sozlash
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('masters', { category: 'Kompyuter ustasi' })}
                  className="hover:text-blue-400 transition-colors"
                >
                  Kompyuter ta‘miri
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('masters', { category: 'Quruvchi va pardozchi' })}
                  className="hover:text-blue-400 transition-colors"
                >
                  Evroremont va kafel
                </button>
              </li>
            </ul>
          </div>

          {/* Yordam */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Yordam va Shartlar
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Ko‘p so‘raladigan savollar (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Foydalanish shartlari
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Maxfiylik siyosati
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('safety')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Xavfsizlik kafolati
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} UstaTop. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4">
            <span>O‘zbekiston bo‘ylab: Toshkent, Samarqand, Buxoro, Andijon, Farg‘ona, Namangan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

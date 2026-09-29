import React from 'react';
import {
  Wrench,
  Zap,
  Wind,
  Laptop,
  Hammer,
  Package,
  Cpu,
  Sparkles,
  Truck,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface CategoriesPageProps {
  onSelectCategory: (category: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      title: 'Santexnik',
      icon: Wrench,
      description: 'Kranlar, smesitel, unitaz, bide, vannaxona ta‘miri, tyopliy pol, quvur va kanalizatsiya tizimlari.',
      popularServices: ['Kran almashtirish', 'Issiq pol montaji', 'Kanalizatsiya tozalash', 'Smesitel sozlash'],
      startingPrice: '50 000 so‘mdan',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      title: 'Elektrik',
      icon: Zap,
      description: 'Elektr tarmoqlarini montaj qilish, avtomat shchitlari yig‘ish, rozetka va viklyuchatel, lyustralar osish.',
      popularServices: ['Shchit montaji', 'Rozetka o‘rnatish', 'Lyustra ilish', 'Qisqa tutashuvni tuzatish'],
      startingPrice: '40 000 so‘mdan',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      title: 'Konditsioner ustasi',
      icon: Wind,
      description: 'Konditsionerlarni o‘rnatish, yechish, chuqur kimyoviy tozalash, freon R410/R32 quyish va ta‘mirlash.',
      popularServices: ['Freon quyish', 'Antibakterial yuvish', 'Konditsioner montaji', 'Plata ta‘miri'],
      startingPrice: '80 000 so‘mdan',
      color: 'bg-sky-50 text-sky-600 border-sky-200',
    },
    {
      title: 'Kompyuter ustasi',
      icon: Laptop,
      description: 'Noutbuk va kompyuterlarni changdan tozalash, termopasta almashtirish, Windows/macOS o‘rnatish, SSD yangilash.',
      popularServices: ['Windows o‘rnatish', 'Termopasta yangilash', 'SSD qo‘yish', 'Virus tozalash'],
      startingPrice: '50 000 so‘mdan',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      title: 'Quruvchi va pardozchi',
      icon: Hammer,
      description: 'Kvartira va uylarni kalit topshirishgacha ta‘mirlash, kafel yotqizish, laminat, gipsokarton, bo‘yoq va shpaklyovka.',
      popularServices: ['Kafel yotqizish', 'Laminat montaji', 'Malyarka va oboy', 'Gipsokarton shift'],
      startingPrice: '25 000 so‘m / m²',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Mebel ustasi',
      icon: Package,
      description: 'Mebel yig‘ish, individual buyurtma bo‘yicha oshxona va shkaflar yasash, furnituralarni almashtirish va sozlash.',
      popularServices: ['Oshxona garnituri', 'Shkaf-kupe yig‘ish', 'Mebel restavratsiyasi', 'Eshik qulflari'],
      startingPrice: '100 000 so‘mdan',
      color: 'bg-orange-50 text-orange-600 border-orange-200',
    },
    {
      title: 'Maishiy texnika ustasi',
      icon: Cpu,
      description: 'Kir yuvish mashinalari, muzlatgich, gaz plita, duxovka, idish yuvish mashinalarini joyida diagnostika va ta‘mir qilish.',
      popularServices: ['Kir yuvish mashinasi', 'Muzlatgich freoni', 'Elektron plata', 'Nasos almashtirish'],
      startingPrice: '60 000 so‘mdan',
      color: 'bg-rose-50 text-rose-600 border-rose-200',
    },
    {
      title: 'Tozalash xizmati',
      icon: Sparkles,
      description: 'Kvartira va kottejlarni ta‘mirdan keyin tozalash, oynalarni yuvish, gilam va yumshoq mebellarni ximchistka qilish.',
      popularServices: ['General tozalash', 'Ta‘mirdan keyingi tozalik', 'Mebel ximchistkasi', 'Oyna yuvish'],
      startingPrice: '15 000 so‘m / m²',
      color: 'bg-teal-50 text-teal-600 border-teal-200',
    },
    {
      title: 'Yuk tashish',
      icon: Truck,
      description: 'Uy va ofis ko‘chirish, og‘ir mebellarni tashish, yuk ortuvchilar (gruzchiklar) va qurilish chiqindilarini olib ketish.',
      popularServices: ['Labo yuk tashish', 'Gazel mebel ko‘chirish', 'Gruzchik xizmati', 'Ofis ko‘chirish'],
      startingPrice: '120 000 so‘mdan',
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Barcha xizmat toifalari</h1>
        <p className="text-slate-600 text-sm">
          O‘zingizga kerakli sohani tanlang va ushbu yo‘nalishdagi eng yaxshi mutaxassislarni ko‘ring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${cat.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {cat.description}
                </p>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Ommabop xizmatlar:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.popularServices.map((srv, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Boshlang‘ich narx
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {cat.startingPrice}
                  </span>
                </div>
                <button
                  onClick={() => onSelectCategory(cat.title)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <span>Ustalarni ko‘rish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

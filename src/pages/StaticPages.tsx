import React, { useState } from 'react';
import { HelpCircle, ShieldCheck, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'UstaTop orqali usta chaqirish qanday amalga oshiriladi?',
      a: 'Siz kerakli xizmat toifasini tanlaysiz, ustalar profillarini solishtirasiz (sharhlar, reyting, narxlar) va to‘g‘ridan-to‘g‘ri "Buyurtma berish" yoki "Xabar yozish" orqali usta bilan bog‘lanasiz.',
    },
    {
      q: 'Ustalarning ishi qanday kafolatlanadi?',
      a: 'UstaTop platformasida tasdiqlangan (verifikatsiyadan o‘tgan) ustalar shaxsini tasdiqlovchi hujjatlar va sertifikatlarini taqdim etishgan. Bundan tashqari, har bir buyurtma yakunida mijozlar haqiqiy baho va sharh qoldirishadi.',
    },
    {
      q: 'Xizmat haqi qanday to‘lanadi?',
      a: 'Hozirgi vaqtda to‘lov to‘g‘ridan-to‘g‘ri mijoz va usta o‘rtasida ish to‘liq va sifatli yakunlangach naqd yoki karta orqali kelishiladi.',
    },
    {
      q: 'Men ham usta sifatida ro‘yxatdan o‘tsam bo‘ladimi?',
      a: 'Ha, albatta! "Usta bo‘lish" tugmasi orqali ro‘yxatdan o‘tib, o‘z xizmatlaringiz, narxlaringiz va bajargan ishlaringiz suratlarini joylashtirib, yangi mijozlar buyurtmalarini qabul qilishingiz mumkin.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Ko‘p so‘raladigan savollar (FAQ)</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          UstaTop platformasidan foydalanish bo‘yicha eng mashhur savollarga javoblar
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-3 cursor-pointer"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
              </button>
              {isOpen && (
                <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
    <h1 className="text-2xl font-black text-slate-900">Foydalanish shartlari</h1>
    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
      UstaTop xizmat ko‘rsatuvchi mustaqil ustalar va xizmatga muhtoj mijozlarni o‘zaro bog‘lovchi axborot platformasidir.
    </p>
    <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-3 leading-relaxed">
      <h3 className="font-bold text-slate-900 text-sm">1. Asosiy qoidalar</h3>
      <p>Foydalanuvchilar o‘z profillarida faqat ishonchli va to‘g‘ri ma‘lumotlarni kiritish majburiyatini oladilar. Soxta ma‘lumot yoki birovning fotosuratlaridan foydalanish qat‘iyan man etiladi.</p>
      <h3 className="font-bold text-slate-900 text-sm">2. Xizmat sifati</h3>
      <p>Bajarilgan ishlar bo‘yicha to‘liq mas‘uliyat xizmat ko‘rsatuvchi usta zimmasidadir. UstaTop tomonlar o‘rtasidagi shaffoflik va adolatli sharhlar tizimini ta‘minlaydi.</p>
    </div>
  </div>
);

export const PrivacyPage: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
    <h1 className="text-2xl font-black text-slate-900">Maxfiylik siyosati</h1>
    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
      Sizning shaxsiy ma‘lumotlaringiz UstaTop tomonidan xavfsiz himoyalanadi va uchinchi shaxslarga berilmaydi.
    </p>
    <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-3 leading-relaxed">
      <h3 className="font-bold text-slate-900 text-sm">Ma‘lumotlar xavfsizligi</h3>
      <p>Telefon raqamlar va aniq manzillar faqat tasdiqlangan buyurtmalar va tomonlar o‘rtasidagi xizmat ko‘rsatish maqsadlarida foydalaniladi.</p>
    </div>
  </div>
);

import React, { useState } from 'react';
import { MasterProfile, ServiceItem } from '../types';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, MapPin, DollarSign, FileText, Send, ImagePlus, CheckCircle2 } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  master: MasterProfile | null;
  selectedService?: ServiceItem | null;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  master,
  selectedService,
}) => {
  const { currentUser, createOrder, showToast } = useApp();

  const [serviceTitle, setServiceTitle] = useState(
    selectedService?.name || (master?.services?.[0]?.name ?? 'Usta xizmati')
  );
  const [description, setDescription] = useState('');
  const [city, setCity] = useState(master?.city || 'Toshkent');
  const [district, setDistrict] = useState(master?.district || 'Yunusobod tumani');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('11:00');
  const [budget, setBudget] = useState(selectedService?.price ? String(selectedService.price) : '');
  const [sampleImageSelected, setSampleImageSelected] = useState<string | null>(null);

  if (!isOpen || !master) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      showToast('Buyurtma berish uchun tizimga kiring', 'error');
      return;
    }

    if (!description.trim()) {
      showToast('Iltimos, bajarilishi kerak bo‘lgan ishni tasvirlab bering', 'error');
      return;
    }

    if (!address.trim()) {
      showToast('Iltimos, aniq manzilni kiriting', 'error');
      return;
    }

    createOrder({
      masterId: master.userId,
      serviceTitle: serviceTitle || 'Buyurtma xizmati',
      description,
      city,
      district,
      address,
      preferredDate,
      preferredTime,
      budget: budget ? Number(budget) : undefined,
      images: sampleImageSelected ? [sampleImageSelected] : [],
    });

    onClose();
  };

  const sampleProblemImages = [
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <img
              src={master.avatar}
              alt={master.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-100"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                {master.name}ga buyurtma yuborish
              </h3>
              <p className="text-xs text-blue-600 font-medium">{master.profession}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Service selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Xizmat turi
            </label>
            {master.services && master.services.length > 0 ? (
              <select
                value={serviceTitle}
                onChange={(e) => {
                  setServiceTitle(e.target.value);
                  const found = master.services.find((s) => s.name === e.target.value);
                  if (found) setBudget(String(found.price));
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {master.services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.price.toLocaleString()} so‘m / {s.priceUnit})
                  </option>
                ))}
                <option value="Boshqa xizmat">Boshqa maxsus xizmat</option>
              </select>
            ) : (
              <input
                type="text"
                value={serviceTitle}
                onChange={(e) => setServiceTitle(e.target.value)}
                placeholder="Kerakli xizmat nomi"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}
          </div>

          {/* Problem description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Muammo tavsifi (Nima qilish kerak?) *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masalan: Krandan suv tomayotgan edi, ichidagi rezinkasini almashtirish kerak..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Location row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Shahar
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Toshkent">Toshkent</option>
                <option value="Samarqand">Samarqand</option>
                <option value="Buxoro">Buxoro</option>
                <option value="Andijon">Andijon</option>
                <option value="Farg‘ona">Farg‘ona</option>
                <option value="Namangan">Namangan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Tuman
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Masalan: Yunusobod tumani"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Aniq manzil (ko‘cha, uy, xonadon) *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Masalan: Amir Temur ko‘chasi, 24-uy, 18-xonadon"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Qulay sana
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Qulay vaqt
              </label>
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-500" />
              Kutilayotgan byudjet (ixtiyoriy, so‘mda)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Masalan: 80 000"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Attach problem photo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <ImagePlus className="w-3.5 h-3.5 text-slate-500" />
              Muammo fotosurati (namunani tanlang)
            </label>
            <div className="flex gap-2">
              {sampleProblemImages.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSampleImageSelected(sampleImageSelected === img ? null : img)}
                  className={`relative rounded-xl overflow-hidden border-2 w-20 h-16 transition-all ${
                    sampleImageSelected === img ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-200'
                  }`}
                >
                  <img src={img} alt="namuna" className="w-full h-full object-cover" />
                  {sampleImageSelected === img && (
                    <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Buyurtma yuborish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

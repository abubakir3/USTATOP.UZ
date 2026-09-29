import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WeekDays, WorkingHoursDay } from '../types';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  Briefcase,
  DollarSign,
  Clock,
  MapPin,
  Image as ImageIcon,
  Save,
  Plus,
  Trash2,
} from 'lucide-react';

interface MasterSetupWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const MasterSetupWizard: React.FC<MasterSetupWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const { currentMasterProfile, updateMasterProfile, showToast } = useApp();

  const [step, setStep] = useState(1);

  // Step 1: Personal info
  const [name, setName] = useState(currentMasterProfile?.name || '');
  const [avatar, setAvatar] = useState(currentMasterProfile?.avatar || '');
  const [phone, setPhone] = useState(currentMasterProfile?.phone || '');
  const [city, setCity] = useState(currentMasterProfile?.city || 'Toshkent');
  const [district, setDistrict] = useState(currentMasterProfile?.district || 'Yunusobod tumani');
  const [address, setAddress] = useState(currentMasterProfile?.address || '');

  // Step 2: Professional info
  const [profession, setProfession] = useState(currentMasterProfile?.profession || 'Santexnik');
  const [category, setCategory] = useState(currentMasterProfile?.category || 'Santexnik');
  const [experienceYears, setExperienceYears] = useState(currentMasterProfile?.experienceYears || 5);
  const [bio, setBio] = useState(currentMasterProfile?.bio || '');
  const [skills, setSkills] = useState<string[]>(
    currentMasterProfile?.additionalServices || ['Kran ta‘miri', 'Kanalizatsiya', 'Quvurlar']
  );
  const [newSkillInput, setNewSkillInput] = useState('');

  // Step 3: Pricing
  const [startingPrice, setStartingPrice] = useState(currentMasterProfile?.startingPrice || 60000);
  const [priceType, setPriceType] = useState<any>(currentMasterProfile?.priceType || 'per_service');

  // Step 4: Working hours
  const daysList: WeekDays[] = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'];
  const [workingHours, setWorkingHours] = useState<Record<WeekDays, WorkingHoursDay>>(
    currentMasterProfile?.workingHours || {
      Dushanba: { working: true, start: '08:00', end: '19:00' },
      Seshanba: { working: true, start: '08:00', end: '19:00' },
      Chorshanba: { working: true, start: '08:00', end: '19:00' },
      Payshanba: { working: true, start: '08:00', end: '19:00' },
      Juma: { working: true, start: '08:00', end: '19:00' },
      Shanba: { working: true, start: '09:00', end: '18:00' },
      Yakshanba: { working: false, start: '09:00', end: '18:00' },
    }
  );

  // Step 5: Service area
  const [serviceRadius, setServiceRadius] = useState(currentMasterProfile?.serviceRadius || 25);

  // Step 6: Portfolio
  const [portfolio, setPortfolio] = useState(currentMasterProfile?.portfolio || []);
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortUrl, setNewPortUrl] = useState('');

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleAddPortfolio = () => {
    if (!newPortTitle.trim() || !newPortUrl.trim()) return;
    setPortfolio([
      ...portfolio,
      {
        id: `port-${Date.now()}`,
        masterId: currentMasterProfile?.userId || '',
        title: newPortTitle,
        imageUrl: newPortUrl,
      },
    ]);
    setNewPortTitle('');
    setNewPortUrl('');
  };

  const handleSaveAll = () => {
    updateMasterProfile({
      name,
      avatar,
      phone,
      city,
      district,
      address,
      profession,
      category,
      experienceYears: Number(experienceYears),
      bio,
      additionalServices: skills,
      startingPrice: Number(startingPrice),
      priceType,
      workingHours,
      serviceRadius: Number(serviceRadius),
      portfolio,
    });
    showToast('Profil muvaffaqiyatli saqlandi!', 'success');
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
        {/* Wizard Header Progress */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 sm:p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-200">
              Usta Profilini Sozlash
            </span>
            <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">
              Qadam {step} / 7
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            {step === 1 && '1. Shaxsiy ma‘lumotlar'}
            {step === 2 && '2. Kasbiy ma‘lumotlar va ko‘nikmalar'}
            {step === 3 && '3. Xizmat narxlari'}
            {step === 4 && '4. Ish vaqti jadvali'}
            {step === 5 && '5. Xizmat ko‘rsatish hududi'}
            {step === 6 && '6. Bajarilgan ishlar (Portfolio)'}
            {step === 7 && '7. Ma‘lumotlarni tasdiqlash va saqlash'}
          </h2>

          {/* Stepper bar */}
          <div className="grid grid-cols-7 gap-1.5 mt-6">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s <= step ? 'bg-amber-300' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Body */}
        <div className="p-6 sm:p-8 min-h-[400px]">
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">To‘liq ismingiz</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Profil rasmi (URL)</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Telefon raqam</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Shahar</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Tuman</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Aniq manzil (ixtiyoriy)</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ko‘cha va uy raqami"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Professional Info */}
          {step === 2 && (
            <div className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Asosiy mutaxassislik</label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="Masalan: Katta toifali Santexnik"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Toifa</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Santexnik">Santexnik</option>
                  <option value="Elektrik">Elektrik</option>
                  <option value="Konditsioner ustasi">Konditsioner ustasi</option>
                  <option value="Kompyuter ustasi">Kompyuter ustasi</option>
                  <option value="Quruvchi va pardozchi">Quruvchi va pardozchi</option>
                  <option value="Mebel ustasi">Mebel ustasi</option>
                  <option value="Maishiy texnika ustasi">Maishiy texnika ustasi</option>
                  <option value="Tozalash xizmati">Tozalash xizmati</option>
                  <option value="Yuk tashish">Yuk tashish</option>
                  <option value="Boshqa">Boshqa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Tajriba (yillar)</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">O‘zingiz haqingizda qisqacha (bio)</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Mijozlar sizni tanlashi uchun tajribangiz va kafolatlaringiz haqida yozing..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Ko‘nikmalar (teglar)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="Yangi ko‘nikma"
                    className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-xl outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    Qo‘shish
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-lg"
                    >
                      {s}
                      <button onClick={() => handleRemoveSkill(s)} className="text-slate-400 hover:text-rose-600">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Pricing */}
          {step === 3 && (
            <div className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Boshlang‘ich narx (so‘m)
                </label>
                <input
                  type="number"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Narx turi</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'per_service', label: 'Xizmatiga' },
                    { id: 'per_hour', label: 'Soatiga' },
                    { id: 'negotiable', label: 'Kelishilgan' },
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPriceType(p.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        priceType === p.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Working hours */}
          {step === 4 && (
            <div className="space-y-3 max-w-lg mx-auto">
              <span className="text-xs text-slate-500 block mb-2">
                Haftaning qaysi kunlari buyurtmalarni qabul qila olasiz?
              </span>

              {daysList.map((day) => {
                const item = workingHours[day];
                return (
                  <div
                    key={day}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer w-28">
                      <input
                        type="checkbox"
                        checked={item.working}
                        onChange={(e) =>
                          setWorkingHours({
                            ...workingHours,
                            [day]: { ...item, working: e.target.checked },
                          })
                        }
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span>{day}</span>
                    </label>

                    {item.working ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="time"
                          value={item.start}
                          onChange={(e) =>
                            setWorkingHours({
                              ...workingHours,
                              [day]: { ...item, start: e.target.value },
                            })
                          }
                          className="px-2 py-1 border border-slate-300 rounded-lg bg-white"
                        />
                        <span>—</span>
                        <input
                          type="time"
                          value={item.end}
                          onChange={(e) =>
                            setWorkingHours({
                              ...workingHours,
                              [day]: { ...item, end: e.target.value },
                            })
                          }
                          className="px-2 py-1 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                    ) : (
                      <span className="text-slate-400 font-semibold">Dam olish kuni</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 5: Service Area */}
          {step === 5 && (
            <div className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Xizmat ko‘rsatish radiusi (km): <strong className="text-blue-600">{serviceRadius} km</strong>
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={serviceRadius}
                  onChange={(e) => setServiceRadius(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>5 km (mahalla)</span>
                  <span>25 km (shahar)</span>
                  <span>100 km (viloyat)</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-800 leading-relaxed">
                Sizning belgilangan asosiy joylashuvingiz: <strong>{city}, {district}</strong>. Ushbu markazdan {serviceRadius} km masofadagi barcha mijozlar qidiruvida profilingiz ko‘rinadi.
              </div>
            </div>
          )}

          {/* STEP 6: Portfolio */}
          {step === 6 && (
            <div className="space-y-4 max-w-lg mx-auto">
              <span className="text-xs text-slate-500 block">
                Bajarilgan ishlaringizdan namunalar qo‘shing. Bu mijozlar ishonchini oshiradi.
              </span>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ish nomi</label>
                  <input
                    type="text"
                    value={newPortTitle}
                    onChange={(e) => setNewPortTitle(e.target.value)}
                    placeholder="Masalan: Yangi kvartirada tyopliy pol"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rasm havolasi (URL)</label>
                  <input
                    type="text"
                    value={newPortUrl}
                    onChange={(e) => setNewPortUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddPortfolio}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Portfolio ga qo‘shish
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {portfolio.map((item, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 h-28 group">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 text-white p-2 flex flex-col justify-between">
                      <span className="text-[11px] font-bold line-clamp-1">{item.title}</span>
                      <button
                        onClick={() => setPortfolio(portfolio.filter((_, i) => i !== idx))}
                        className="self-end text-rose-300 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Preview & Save */}
          {step === 7 && (
            <div className="space-y-4 max-w-lg mx-auto text-xs">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-emerald-950 text-sm">Barcha ma‘lumotlar tayyor!</h3>
                  <p className="text-emerald-800">Profilingiz mijozlar uchun jozibador va to‘liq ko‘rinadi.</p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Ism:</span>
                  <span className="font-bold text-slate-800">{name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Mutaxassislik:</span>
                  <span className="font-bold text-slate-800">{profession} ({category})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Tajriba:</span>
                  <span className="font-bold text-slate-800">{experienceYears} yil</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Joylashuv:</span>
                  <span className="font-bold text-slate-800">{city}, {district} ({serviceRadius} km)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Boshlang‘ich narx:</span>
                  <span className="font-bold text-slate-800">{startingPrice.toLocaleString()} so‘m</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Portfolio fotosuratlari:</span>
                  <span className="font-bold text-slate-800">{portfolio.length} ta rasm</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Oldingi
            </button>
          ) : (
            <button
              onClick={onCancel}
              className="px-5 py-2.5 text-slate-500 hover:text-slate-700 text-xs font-semibold"
            >
              Bekor qilish
            </button>
          )}

          {step < 7 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
            >
              Keyingisi
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSaveAll}
              className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Profilni saqlash va ishga tushirish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

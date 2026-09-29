import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Wrench,
  User as UserIcon,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Briefcase,
} from 'lucide-react';

interface AuthPagesProps {
  initialView?: 'login' | 'register' | 'forgot';
  defaultRole?: UserRole;
  onSuccess: (role: UserRole) => void;
  onNavigate: (tab: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  initialView = 'login',
  defaultRole = 'customer',
  onSuccess,
  onNavigate,
}) => {
  const { login, register, loginAs, showToast } = useApp();

  const [view, setView] = useState<'login' | 'register' | 'forgot'>(initialView);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);

  // Login inputs
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regProfession, setRegProfession] = useState('Santexnik');
  const [regCity, setRegCity] = useState('Toshkent');
  const [regDistrict, setRegDistrict] = useState('Yunusobod tumani');

  // Forgot password
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) {
      showToast('Telefon raqam yoki emailni kiriting', 'error');
      return;
    }

    const success = login(loginInput);
    if (success) {
      onSuccess(selectedRole);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      showToast('Barcha majburiy maydonlarni to‘ldiring', 'error');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Parollar mos kelmadi', 'error');
      return;
    }

    const newUser = register({
      role: selectedRole,
      name: regName,
      phone: regPhone,
      email: regEmail || `${Date.now()}@ustatop.uz`,
      profession: selectedRole === 'master' ? regProfession : undefined,
      city: regCity,
      district: regDistrict,
    });

    onSuccess(newUser.role);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPhone.trim()) return;
    setForgotSent(true);
    showToast('SMS tasdiqlash kodi telefoningizga yuborildi: 1234', 'info');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 p-6 text-white text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-2 text-white border border-white/20">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black">
            {view === 'login' && 'Tizimga kirish'}
            {view === 'register' && 'Ro‘yxatdan o‘tish'}
            {view === 'forgot' && 'Parolni tiklash'}
          </h2>
          <p className="text-blue-100 text-xs mt-1">
            UstaTop — O‘zbekistondagi professional ustalar platformasi
          </p>
        </div>

        {/* 1-Click Quick Demo Login Pill Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2 text-center">
            Tezkor 1-bosish bilan sinov kirishi:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                loginAs('user-cust-1');
                onSuccess('customer');
              }}
              className="px-2 py-2 bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 text-center transition-all shadow-xs cursor-pointer"
            >
              👤 Mijoz
            </button>
            <button
              onClick={() => {
                loginAs('user-master-1');
                onSuccess('master');
              }}
              className="px-2 py-2 bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 text-center transition-all shadow-xs cursor-pointer"
            >
              🔧 Usta
            </button>
            <button
              onClick={() => {
                loginAs('user-admin');
                onSuccess('admin');
              }}
              className="px-2 py-2 bg-white hover:bg-purple-50 hover:border-purple-300 border border-slate-200 rounded-xl text-xs font-semibold text-purple-700 text-center transition-all shadow-xs cursor-pointer"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* VIEW: LOGIN */}
          {view === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Telefon raqam yoki Email
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="+998 90 123-45-67 yoki email"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase text-slate-700">Parol</label>
                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Parolni unutdingizmi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Kirish</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Hisobingiz yo‘qmi? </span>
                <button
                  type="button"
                  onClick={() => setView('register')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Ro‘yxatdan o‘tish
                </button>
              </div>
            </form>
          )}

          {/* VIEW: REGISTER */}
          {view === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5 text-center">
                  Hisob turini tanlang
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('customer')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      selectedRole === 'customer'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserIcon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">Mijoz</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('master')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      selectedRole === 'master'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Wrench className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">Usta</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  To‘liq ismingiz *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Masalan: Jamshid Rustamov"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Telefon raqamingiz *
                </label>
                <input
                  type="text"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+998 90 123-45-67"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Elektron pochta (email)
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="namuna@mail.uz"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Master specific inputs */}
              {selectedRole === 'master' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Mutaxassislik (Kasbingiz) *
                    </label>
                    <select
                      value={regProfession}
                      onChange={(e) => setRegProfession(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
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
                      <option value="Boshqa">Boshqa mutaxassis</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Shahar
                      </label>
                      <select
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
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
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Tuman
                      </label>
                      <input
                        type="text"
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        placeholder="Yunusobod"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Parol *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Tasdiqlang *
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Ro‘yxatdan o‘tish</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Hisobingiz bormi? </span>
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Kirish
                </button>
              </div>
            </form>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {view === 'forgot' && (
            <div className="space-y-4">
              {!forgotSent ? (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ro‘yxatdan o‘tgan telefon raqamingizni kiriting. Biz sizga bir martalik tasdiqlash kodini yuboramiz.
                  </p>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                      Telefon raqamingiz
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      placeholder="+998 90 123-45-67"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer"
                  >
                    SMS kod yuborish
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">SMS kod yuborildi</h3>
                  <p className="text-xs text-slate-500">
                    Telefoningizga yangi parolni o‘rnatish uchun havola va tasdiqlash kodi yuborildi.
                  </p>
                  <button
                    onClick={() => {
                      setView('login');
                      setForgotSent(false);
                    }}
                    className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
                  >
                    Kirish sahifasiga qaytish
                  </button>
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ← Orqaga
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MasterProfile } from '../types';
import { MasterCard } from '../components/MasterCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  CheckCircle2,
  MapPin,
  Star,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

interface MastersSearchPageProps {
  initialSearch?: string;
  initialCategory?: string;
  onViewMaster: (master: MasterProfile) => void;
  onStartChat: (master: MasterProfile) => void;
  onRequestOrder: (master: MasterProfile) => void;
}

export const MastersSearchPage: React.FC<MastersSearchPageProps> = ({
  initialSearch = '',
  initialCategory = '',
  onViewMaster,
  onStartChat,
  onRequestOrder,
}) => {
  const { masters } = useApp();

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [minRating, setMinRating] = useState<number>(0);
  const [minExp, setMinExp] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('recommended');

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
    'Barchasi',
    'Santexnik',
    'Elektrik',
    'Konditsioner ustasi',
    'Kompyuter ustasi',
    'Quruvchi va pardozchi',
    'Mebel ustasi',
    'Maishiy texnika ustasi',
    'Tozalash xizmati',
    'Yuk tashish',
    'Boshqa',
  ];

  const cities = ['Barcha shaharlar', 'Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Farg‘ona', 'Namangan'];

  // Reset filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedCity('');
    setSelectedDistrict('');
    setMinRating(0);
    setMinExp(0);
    setMaxPrice(0);
    setVerifiedOnly(false);
    setAvailableOnly(false);
    setSortBy('recommended');
  };

  // Filter and sort
  const filteredMasters = useMemo(() => {
    return masters
      .filter((m) => {
        // Search across name, profession, services, bio, city, district
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchesName = m.name.toLowerCase().includes(q);
          const matchesProf = m.profession.toLowerCase().includes(q);
          const matchesBio = m.bio.toLowerCase().includes(q);
          const matchesCity = m.city.toLowerCase().includes(q);
          const matchesDist = m.district.toLowerCase().includes(q);
          const matchesServices = m.services.some(
            (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
          );
          if (!matchesName && !matchesProf && !matchesBio && !matchesCity && !matchesDist && !matchesServices) {
            return false;
          }
        }

        // Category
        if (selectedCategory && selectedCategory !== 'Barchasi') {
          if (m.category !== selectedCategory && !m.profession.toLowerCase().includes(selectedCategory.toLowerCase())) {
            return false;
          }
        }

        // City
        if (selectedCity && selectedCity !== 'Barcha shaharlar') {
          if (m.city !== selectedCity) return false;
        }

        // District
        if (selectedDistrict.trim()) {
          if (!m.district.toLowerCase().includes(selectedDistrict.toLowerCase())) return false;
        }

        // Min rating
        if (minRating > 0 && m.rating < minRating) return false;

        // Min experience
        if (minExp > 0 && m.experienceYears < minExp) return false;

        // Max price
        if (maxPrice > 0 && m.startingPrice > maxPrice) return false;

        // Verified only
        if (verifiedOnly && !m.isVerified) return false;

        // Available only
        if (availableOnly && !m.isAvailable) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
        if (sortBy === 'price_asc') return a.startingPrice - b.startingPrice;
        if (sortBy === 'price_desc') return b.startingPrice - a.startingPrice;
        if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
        // recommended
        return b.rating * 10 + b.reviewCount - (a.rating * 10 + a.reviewCount);
      });
  }, [
    masters,
    search,
    selectedCategory,
    selectedCity,
    selectedDistrict,
    minRating,
    minExp,
    maxPrice,
    verifiedOnly,
    availableOnly,
    sortBy,
  ]);

  // Sidebar filter component
  const FilterContent = (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Xizmat turi (Toifa)
        </label>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'Barchasi' ? '' : cat)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                (selectedCategory === cat || (!selectedCategory && cat === 'Barchasi'))
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{cat}</span>
              {(selectedCategory === cat || (!selectedCategory && cat === 'Barchasi')) && (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Shahar
        </label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {cities.map((c) => (
            <option key={c} value={c === 'Barcha shaharlar' ? '' : c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Tuman
        </label>
        <input
          type="text"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          placeholder="Masalan: Yunusobod, Chilonzor..."
          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Min rating */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Minimal reyting
        </label>
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          {[0, 4.0, 4.5, 4.8].map((val) => (
            <button
              key={val}
              onClick={() => setMinRating(val)}
              className={`py-1.5 px-2 rounded-lg font-semibold text-center border transition-all ${
                minRating === val
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {val === 0 ? 'Barchasi' : `${val}★+`}
            </button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Tajriba (yil)
        </label>
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          {[0, 3, 5, 10].map((val) => (
            <button
              key={val}
              onClick={() => setMinExp(val)}
              className={`py-1.5 px-2 rounded-lg font-semibold text-center border transition-all ${
                minExp === val
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {val === 0 ? 'Barchasi' : `${val}+ yil`}
            </button>
          ))}
        </div>
      </div>

      {/* Max starting price */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Maksimal boshlang‘ich narx
          </label>
          <span className="text-xs font-bold text-blue-600">
            {maxPrice > 0 ? `${maxPrice.toLocaleString()} so‘m` : 'Cheklovsiz'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="300000"
          step="25000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>0</span>
          <span>150 000</span>
          <span>300 000+</span>
        </div>
      </div>

      {/* Checkbox toggles */}
      <div className="space-y-3 pt-2 border-t border-slate-200/80">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-800">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Faqat tasdiqlangan ustalar
          </span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-800">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Hozir ishlayotganlar
          </span>
        </label>
      </div>

      {/* Reset button */}
      <div className="pt-2">
        <button
          onClick={handleResetFilters}
          className="w-full py-2.5 px-3 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Filtrlarni tozalash
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Usta yoki xizmat nomini yozing (santexnik, kafel, remont...)"
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-200 transition-colors"
            >
              <Filter className="w-4 h-4 text-blue-600" />
              Filtrlar
            </button>

            <div className="flex-1 sm:flex-none relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer pr-8"
              >
                <option value="recommended">Tavsiya etilgan</option>
                <option value="rating">Reyting bo‘yicha</option>
                <option value="reviews">Eng ko‘p sharh</option>
                <option value="price_asc">Narx: arzonidan</option>
                <option value="price_desc">Narx: qimmatidan</option>
                <option value="experience">Tajriba bo‘yicha</option>
              </select>
            </div>
          </div>
        </div>

        {/* Selected Category Tags Quick Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-medium shrink-0">Toifalar:</span>
          {categories.slice(0, 7).map((cat) => {
            const isActive = selectedCategory === cat || (!selectedCategory && cat === 'Barchasi');
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'Barchasi' ? '' : cat)}
                className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Filtrlar</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {filteredMasters.length} ta usta
              </span>
            </div>
            {FilterContent}
          </div>
        </aside>

        {/* Results List */}
        <main className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Qidiruv natijalari{' '}
              <span className="text-blue-600 text-sm font-semibold">
                ({filteredMasters.length} ta usta)
              </span>
            </h2>
          </div>

          {filteredMasters.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Bu qidiruv bo‘yicha usta topilmadi
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Iltimos, filtrlarni o‘zgartirib ko‘ring yoki qidiruv so‘zini soddaroq yozing.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Barcha filtrlarni tozalash
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMasters.map((master) => (
                <MasterCard
                  key={master.userId}
                  master={master}
                  onViewProfile={onViewMaster}
                  onStartChat={onStartChat}
                  onRequestOrder={onRequestOrder}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Bottom Sheet / Modal */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Filtrlar</h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto">{FilterContent}</div>
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-sm"
              >
                Natijalarni ko‘rish ({filteredMasters.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

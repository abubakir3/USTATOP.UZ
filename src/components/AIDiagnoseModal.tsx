import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, X, AlertTriangle, ArrowRight, Loader2, CheckCircle2, HelpCircle } from 'lucide-react';
import { AIDiagnosisResult } from '../types';

interface AIDiagnoseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
}

export const AIDiagnoseModal: React.FC<AIDiagnoseModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  const { diagnoseProblem } = useApp();
  const [problemText, setProblemText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIDiagnosisResult | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!problemText.trim()) return;

    setLoading(true);
    try {
      const res = await diagnoseProblem(problemText);
      setResult(res);
    } catch {
      // Fallback handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (cat: string) => {
    onSelectCategory(cat);
    onClose();
  };

  const samplePrompts = [
    'Vannaxonadagi krandan suv tomyapti va to‘xtamayapti',
    'Zaldagi rozetkadan uchqun chiqib, chiroqlar o‘chib qoldi',
    'Konditsioner yaxshi sovutmayapti, ichidan g‘alati hid kelyapti',
    'Kir yuvish mashinasi suvni to‘kmayapti va shovqin solyapti',
    'Yangi xonadonga laminat yotqizish va devorlarni bo‘yash kerak',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold tracking-wide backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI Yordamchi
            </span>
          </div>
          <h3 className="text-2xl font-bold">Qaysi usta kerakligini aniqlash</h3>
          <p className="text-blue-100 text-sm mt-1">
            Muammoni o‘z so‘zingiz bilan yozing, sun‘iy intellekt sizga eng mos usta toifasini tavsiya qiladi.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!result ? (
            <>
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Uyingizda yoki ofisingizda nima bo‘ldi?
                  </label>
                  <textarea
                    rows={4}
                    value={problemText}
                    onChange={(e) => setProblemText(e.target.value)}
                    placeholder="Masalan: Vannaxonadagi krandan suv tomyapti, pastdagi quvurni ham ko'rish kerak..."
                    className="w-full px-4 py-3 text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-sm leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-500">
                    Tezkor namunalar (bosib ko‘ring):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {samplePrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setProblemText(prompt);
                        }}
                        className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !problemText.trim()}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Tahlil qilinmoqda...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-300" />
                      Tahlil qilish va usta topish
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">
                    Tavsiya etilgan mutaxassis
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      result.urgency === 'Yuqori'
                        ? 'bg-rose-100 text-rose-700'
                        : result.urgency === "O'rtacha"
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    Shoshilinchlik: {result.urgency}
                  </span>
                </div>
                <h4 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  {result.category}
                </h4>
                <p className="text-slate-700 text-sm mt-3 leading-relaxed">
                  {result.explanation}
                </p>
              </div>

              {result.suggestedQuestions && result.suggestedQuestions.length > 0 && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                  <h5 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-slate-500" />
                    Ustadan so‘rash tavsiya etiladigan savollar:
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                    {result.suggestedQuestions.map((q, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>{result.disclaimer}</p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-xl text-sm transition-colors"
                >
                  Boshqa muammo yozish
                </button>
                <button
                  type="button"
                  onClick={() => handleApply(result.category)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm shadow-md shadow-blue-500/20 transition-colors"
                >
                  <span>{result.category} ustalarni ko‘rish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Server-side Gemini AI Category Advisor endpoint
  app.post('/api/ai-diagnose', async (req, res) => {
    try {
      const { description } = req.body;
      if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: 'Muammo tavsifi kiritilishi shart' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        // Fallback rule-based matching if API key is not configured
        const text = description.toLowerCase();
        let category = 'Boshqa';
        let explanation = "Kiritilgan muammo asosida umumiy xizmat ko'rsatish ustasiga murojaat qilish tavsiya etiladi.";
        let urgency = "O'rtacha";
        let suggestedQuestions = [
          "Ish uchun qancha vaqt ketadi?",
          "Kerakli ehtiyot qismlarni o'zingiz olib kelasizmi?",
          "Kafolat berasizmi?"
        ];

        if (text.includes('suv') || text.includes('kran') || text.includes('truba') || text.includes('quvur') || text.includes('sifon') || text.includes('kanalizatsiya') || text.includes('chanoq')) {
          category = 'Santexnik';
          explanation = "Muammo suv ta'minoti yoki kanalizatsiya tizimiga oid. Malakali santexnik usta quvur yoki kranni sozlab beradi.";
          urgency = "Yuqori";
          suggestedQuestions = ["Suv sizib chiqishini to'xtatish uchun klapan qayerda?", "Qanday qism almashtirilishi kerak?"];
        } else if (text.includes('tok') || text.includes('rozetka') || text.includes('chiroq') || text.includes('elektr') || text.includes('sim') || text.includes('avtomat') || text.includes('lyustra')) {
          category = 'Elektrik';
          explanation = "Elektr tizimidagi nosozliklar xavfsizlik uchun tezkor mutaxassis ko'rigini talab qiladi. Malakali elektrik chaqirish lozim.";
          urgency = "Yuqori";
          suggestedQuestions = ["Xavfsizlik avtomati o'chirilganmi?", "Simlar qizib ketmayaptimi?"];
        } else if (text.includes('konditsioner') || text.includes('sovut') || text.includes('freon') || text.includes('filtr')) {
          category = 'Konditsioner ustasi';
          explanation = "Konditsionerni tozalash, freon quyish yoki elektr blokini sozlash uchun ixtisoslashgan usta talab etiladi.";
          urgency = "O'rtacha";
        } else if (text.includes('kompyuter') || text.includes('noutbuk') || text.includes('windows') || text.includes('virus') || text.includes('ekran') || text.includes('protsessor')) {
          category = 'Kompyuter ustasi';
          explanation = "Kompyuter yoki noutbuk apparat va dasturiy ta'minotini sozlash bo'yicha IT mutaxassisi kerak.";
          urgency = "O'rtacha";
        } else if (text.includes('muzlatgich') || text.includes('kir yuvish') || text.includes('gaz plita') || text.includes('changyutgich') || text.includes('tefal') || text.includes('duxovka')) {
          category = 'Maishiy texnika ustasi';
          explanation = "Katta yoki kichik maishiy texnika vositalarini diagnostika qilish va ta'mirlash uchun usta kerak.";
          urgency = "O'rtacha";
        } else if (text.includes('mebel') || text.includes('shkaf') || text.includes('eshik') || text.includes('stol') || text.includes('stul') || text.includes('oshxona garnitur')) {
          category = 'Mebel ustasi';
          explanation = "Mebel yig'ish, eshiklarni sozlash yoki yangi mebel yasash uchun mebel ustasi mos keladi.";
          urgency = "Past";
        } else if (text.includes('devor') || text.includes('kraska') || text.includes('oboy') || text.includes('gipsokarton') || text.includes('kafel') || text.includes('remont') || text.includes('shpaklyovka')) {
          category = 'Quruvchi va pardozchi';
          explanation = "Uy ta'miri, kafel yotqizish, bo'yash yoki suvoq ishlari uchun pardozchi usta kerak.";
          urgency = "O'rtacha";
        }

        return res.json({
          category,
          explanation,
          urgency,
          suggestedQuestions,
          disclaimer: "Ushbu tavsiya tizim tomonidan berilgan dastlabki xulosadir. Aniq narx va tashxisni usta bilan bevosita aniqlashtiring."
        });
      }

      // If GEMINI_API_KEY is available, use @google/genai SDK with timeout
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Siz "UstaTop" O'zbekiston xizmatlar platformasining sun'iy intellekt yordamchisisiz.
Foydalanuvchi o'z uyida yoki ofisidagi muammoni tasvirlab berdi:
"${description}"

Quyidagi JSON formatida javob bering:
{
  "category": "Quyidagilardan biri: Santexnik, Elektrik, Konditsioner ustasi, Kompyuter ustasi, Maishiy texnika ustasi, Quruvchi va pardozchi, Mebel ustasi, Tozalash xizmati, Yuk tashish, Boshqa",
  "explanation": "O'zbek tilida 1-2 jumlada nega bu usta kerakligi va nimalarga e'tibor berish lozimligi",
  "urgency": "Yuqori | O'rtacha | Past",
  "suggestedQuestions": ["Usta bilan bog'langanda so'rash kerak bo'lgan 2-3 ta muhim savol"],
  "disclaimer": "Ushbu tavsiya AI tomonidan berilgan bo'lib, mutaxassisning to'liq texnik xulosasi o'rnini bosmaydi."
}
Faqat valid JSON qaytaring, boshqa matn yozmang.`;

      const aiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI request timeout')), 5000)
      );

      const response = (await Promise.race([aiPromise, timeoutPromise])) as any;
      const responseText = response.text || '{}';
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (err: any) {
      console.warn('AI diagnose fallback triggered:', err.message || err);
      // Fallback response based on text keywords
      const text = (req.body.description || '').toLowerCase();
      let category = 'Santexnik';
      let explanation = "Kiritilgan muammo suv ta'minoti yoki maishiy texnik tizimiga bog'liq.";
      if (text.includes('tok') || text.includes('rozetka') || text.includes('chiroq') || text.includes('elektr')) {
        category = 'Elektrik';
        explanation = "Elektr tizimidagi nosozliklar uchun malakali elektrik ustani chaqirish tavsiya etiladi.";
      } else if (text.includes('konditsioner')) {
        category = 'Konditsioner ustasi';
        explanation = "Konditsionerni tozalash va sozlash mutaxassisi kerak.";
      }
      return res.json({
        category,
        explanation,
        urgency: "O'rtacha",
        suggestedQuestions: ["Ish qancha vaqt oladi?", "Kafolat beriladimi?"],
        disclaimer: "Ushbu tavsiya AI tomonidan berilgan dastlabki maslahatdir.",
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // In development, hook up Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UstaTop server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

# خشبة · Khashaba - Premium Wood Furniture Website

موقع إلكتروني احترافي لبراند **خشبة** - معرض أثاث خشبي فاخر في مصر.

## ✨ المميزات

### 🎨 تصميم احترافي
- Next.js 16 + TypeScript + Tailwind CSS 4
- دعم كامل للعربية (RTL)
- تصميم متجاوب (Responsive) لكل الأجهزة
- شعار مخصص (Hexagon Tree Logo)

### 🤖 مساعد الذكاء الاصطناعي (Gemini)
ميزة "اقترح لي قطعتك" بتستخدم **Gemini** (عبر z-ai-web-dev-sdk):

- **VLM (Vision Language Model)** من Gemini لتحليل صور المساحات
- **Image Edit** من Gemini لتوليد صور معاينة بعد التعديل
- **MAX CREATIVITY MODE**: لما العميل سيب الكابشن فاضي (إبداع حر كامل)
- **GUIDED INNOVATIVE MODE**: لما العميل يكتب توجيه (يحترم التوجيه + يضيف لمسة إبداعية)
- **3 اقتراحات مختلفة**: العميل يقدر يطلب اقتراح تاني مختلف تمامًا
- **Navigation**: تنقل بين الاقتراحات (السابق/التالي + dots)
- دعم 9 أنواع أثاث خشبي:
  - رفوف معلقة، مكتبات، تكسية جدران، كونسولات
  - مكاتب، أبواب، ترابيزات، فواصل، وحدات تلفزيون

### 📋 أقسام الموقع
- **Hero**: مقدمة احترافية بصورة + شعار + إحصائيات
- **من نحن**: قصة البراند + إحصائيات حقيقية (+100 منتج، +5 سنوات خبرة، 9 أقسام)
- **خطوات التعامل**: 5 خطوات واضحة من التواصل لحد التسليم
- **الأقسام**: 9 أقسام أثاث مع صور حقيقية
- **اقترح لي قطعتك**: ميزة AI لاقتراح قطع مخصصة
- **المعرض**: معرض صور مع فلترة
- **تواصل معنا**: واتساب + موبايل + إيميل + سوشيال ميديا

## 🚀 التثبيت والتشغيل

### المتطلبات
- Node.js 18+ أو Bun
- مفتاح Gemini API من Google AI Studio

### الخطوات

```bash
# 1. تثبيت الـ dependencies
bun install

# 2. نسخ ملف البيئة
cp .env.example .env.local

# 3. عدّل .env.local وحط مفتاح Gemini API
# احصل عليه من: https://aistudio.google.com/apikey

# 4. تشغيل السيرفر المحلي
bun run dev

# 5. بناء للـ production
bun run build

# 6. تشغيل النسخة المبنية
bun run start
```

## 🔧 متغيرات البيئة المطلوبة

| المتغير | الوصف | مثال |
|---|---|---|
| `GEMINI_API_KEY` | مفتاح Gemini API من Google AI Studio | `AIzaSy...` |
| `DATABASE_URL` | مسار قاعدة بيانات SQLite | `file:/tmp/custom.db` |

## 📦 النشر على Vercel

1. ارفع المشروع على GitHub (public repo)
2. ادخل [vercel.com](https://vercel.com) واعمل login بـ GitHub
3. اضغط **Add New Project**
4. اختار الـ repo
5. في **Environment Variables**:
   - `GEMINI_API_KEY` = مفتاحك من Google AI Studio
   - `DATABASE_URL` = `file:/tmp/custom.db`
6. اضغط **Deploy**

## 🤖 الحصول على مفتاح Gemini API

1. افتح [Google AI Studio](https://aistudio.google.com/apikey)
2. سجّل دخول بحساب Google
3. اضغط **Create API Key**
4. اختار مشروع Google Cloud (أو خلّيه Default)
5. انسخ المفتاح (يبدأ بـ `AIzaSy...`)
6. حطه في `.env.local` أو في Vercel Environment Variables

**ملاحظة**: الـ Gemini API مجاني للاستخدام الشخصي مع حدود معقولة (15 request/minute للـ flash model)

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Database**: Prisma ORM + SQLite
- **AI**: Gemini (z-ai-web-dev-sdk) للـ Vision + Image Generation
- **Icons**: Lucide React
- **Fonts**: Cairo, Amiri, Marcellus

## 📁 بنية المشروع

```
src/
├── app/
│   ├── api/suggest/        # AI API (Gemini)
│   ├── page.tsx            # الصفحة الرئيسية
│   ├── layout.tsx          # Layout
│   └── globals.css         # الستايلات
├── components/ui/          # shadcn/ui components
├── lib/
│   ├── catalog.ts          # بيانات البراند والأقسام
│   ├── db.ts                # Prisma client
│   └── utils.ts             # utilities
└── hooks/                   # React hooks

public/
├── products/               # صور الأقسام (9 أقسام)
├── khashaba-logo.png       # اللوجو
├── hero-bg-v3.png          # صورة الـ Hero
└── robots.txt

prisma/
└── schema.prisma           # Database schema
```

## 📞 التواصل

- **واتساب**: 0107 038 6575
- **فيس بوك**: [khashaba.wood](https://www.facebook.com/profile.php?id=61594437931625)
- **إنستجرام**: [@khashaba.wood](https://www.instagram.com/khashaba.wood/?hl=en)

## 📄 الترخيص

© 2024 خشبة · KHASHABA · HANDCRAFTED WOOD · EST. 2024

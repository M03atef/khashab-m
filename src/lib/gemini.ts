import { CATEGORIES } from "@/lib/catalog";

export type SuggestRequest = {
  categoryId?: string;
  caption?: string;
  imageBase64?: string;
  mimeType?: string;
  variation?: number;
  /** Design style: modern, classic, scandinavian, industrial, japandi */
  style?: string;
  /** Color palette: warm, cool, neutral, wood, contrast */
  colorPalette?: string;
};

export type SuggestResult = {
  title: string;
  description: string;
  styleNotes: string[];
  previewImage: string;
  /** AI-edited image (base64 data URL) - same as user's photo but with proposed piece added */
  mockupImage?: string;
  categoryId: string;
  categoryName: string;
  mode: "max-creativity" | "guided";
  mock: boolean;
};

function pickCategory(categoryId?: string) {
  if (!categoryId) return undefined;
  return CATEGORIES.find((c) => c.id === categoryId);
}

/** Rich per-category mock packs — customer-ready Arabic sales + craft copy */
const MOCK_PACKS: Record<
  string,
  Array<{
    title: string;
    description: string;
    styleNotes: string[];
  }>
> = {
  bookcases: [
    {
      title: "مكتبة حائطية «نَسق» — ارتفاعات متدرجة",
      description:
        "مكتبة حائطية بأعمدة زان فاتح ورفوف بعمقين مختلفين عشان الكتب الكبيرة تبان جنب الديكور من غير زحمة. التصميم مفتوح من الجنب اليمين عشان الإضاءة الطبيعية تدخل، ومقاسه بيتظبط على عرض الحيطة في الشقق المصرية. تشطيب زيت طبيعي يبرز عروق الخشب ويتحمل الغبار.",
      styleNotes: [
        "زان مصري بتشطيب زيت دافئ",
        "رفوف بعمقين (كتب + ديكور)",
        "تركيب حائطي نظيف بدون براغي ظاهرة",
        "مقاس حسب عرض الحيطة",
      ],
    },
    {
      title: "مكتبة أرضية «مَدار» — عمود بصري للمساحات الضيقة",
      description:
        "عمود مكتبة ضيق وطويل ياخد زاوية الصالة أو جنب الباب من غير ما يسرق مساحة المشي. أدراج سفلية مغلقة للمجلات والريموت، ورفوف علوية مفتوحة للنباتات والكتب. مناسب لشقق القاهرة اللي الصالة فيها ضيقة بس عايزين قطعة تلفت النظر.",
      styleNotes: [
        "بصمة رأسية تكبّر الإحساس بالارتفاع",
        "تخزين مغلق + عرض مفتوح",
        "خشب جوز أو زان حسب ذوقك",
        "قاعدة ثابتة للشقق القديمة",
      ],
    },
    {
      title: "مكتبة مزدوجة «أفق» — خلف الكنبة أو التقسيم",
      description:
        "مكتبتين متماثلتين بفاصل مركزي للتحف أو التلفزيون الصغير — حلّ عملي لو عايز تفصل منطقة الجلوس عن المدخل من غير بارتشن ثقيل. الخطوط أفقية هادية تناسب الديكور المودرن والكلاسيك الخفيف، والتنفيذ حسب المقاس بعد صورة المساحة أو زيارة.",
      styleNotes: [
        "تكوين متماثل يهدّي العين",
        "يستخدم كفاصل بصري خفيف",
        "إمكانية إضافة إضاءة LED مخفية",
        "خامات فاخرة بتوصيل وتركيب في القاهرة",
      ],
    },
  ],
  consoles: [
    {
      title: "كونسول مدخل «ترحيب» — خط واحد أنيق",
      description:
        "كونسول نحيف بسطح عريض كفاية للمراية والمفاتيح والمزهرية، وأرجل مائلة بسيطة تعطي خفة بصرية من أول ما تدخل. درج واحد مخفي للجواز والريموت. مثالي لمداخل الشقق المصرية اللي العرض فيها محدود.",
      styleNotes: [
        "عمق مدروس للممرات الضيقة",
        "درج مخفي بدون مقابض ظاهرة",
        "خشب زان بتشطيب مطفي فاخر",
        "يتوافق مع مرايا خشبة",
      ],
    },
    {
      title: "كونسول صالة «إطار» — قطعة عرض بطلة",
      description:
        "كونسول أعرض للصالة أو خلف الكنبة، برف سفلي مفتوح للنباتات الكبيرة وسطح علوي مصقول يعكس الإضاءة. التصميم يجمع بين الحرفة المصرية والخطوط المودرن — قطعة تبان في الصور وتدوم سنين.",
      styleNotes: [
        "سطح مصقول يعكس الضوء",
        "رف سفلي للنباتات الثقيلة",
        "مقاسات حسب طول الحيطة",
        "تشطيب مقاوم للخدوش الخفيفة",
      ],
    },
    {
      title: "كونسول مزدوج الاستخدام «هدأة»",
      description:
        "كونسول يتحول بسهولة لطاولة عرض في المناسبات: الأدراج الجانبية تستوعب أدوات الضيافة، والسطح يتسع لصينية القهوة. اقتراح عملي للعائلات اللي بتحب الاستقبال في البيت.",
      styleNotes: [
        "أدراج عميقة للضيافة",
        "ارتفاع مريح للوقوف",
        "خشب طبيعي برائحة خفيفة",
        "تركيب وتوصيل حسب الاتفاق",
      ],
    },
  ],
  desks: [
    {
      title: "مكتب منزل «تركيز» — كابلات مخفية",
      description:
        "مكتب عمل بفتحة كابلات أنيقة ودُرجين بعمق مختلف للابتوب والأوراق. الحافة الأمامية مدوّرة عشان الراحة في الجلسات الطويلة، والرجلين بتصميم حرف A ثابت. مناسب لغرفة نوم أو ركن دراسة في الصالة.",
      styleNotes: [
        "إدارة كابلات نظيفة",
        "حافة مريحة للكتابة",
        "تخزين ذكي بدون فوضى",
        "خشب زان يتحمل الاستخدام اليومي",
      ],
    },
    {
      title: "مكتب تنفيذي «قرار» — حضور هادي",
      description:
        "مكتب أعرض بطابع تنفيذي خفيف: سطح كبير للاجتماعات الصغيرة، ووحدة أدراج جانبية قابلة للفصل. التشطيب داكن أو فاتح حسب ديكور المكتب المنزلي — يبان فاخر من غير ما يبقى ثقيل أو كلاسيك زيادة.",
      styleNotes: [
        "سطح واسع للاجتماعات المنزلية",
        "وحدة أدراج منفصلة اختيارية",
        "تشطيب داكن أو فاتح",
        "مصنوع حسب المقاس في ورشة خشبة",
      ],
    },
    {
      title: "مكتب زاوية «ركن» — أقصى استفادة من المساحة",
      description:
        "مكتب زاوية على شكل L يستغل ركن الغرفة ويسيب مساحة مشي أوضح. رف علوي صغير للشاشات أو الكتب المرجعية. حل ممتاز للشقق اللي مفيهاش أوفيس منفصل.",
      styleNotes: [
        "شكل L للمساحات الضيقة",
        "رف علوي اختياري",
        "ثبات عالي على الأرضيات غير المستوية",
        "ألوان خشب تناسب الحيطان الفاتحة",
      ],
    },
  ],
  doors: [
    {
      title: "باب داخلي «همس» — عزل صوتي خفيف",
      description:
        "باب زان بخطوط رأسية هادية ومفصلات مخفية قدر الإمكان، يدي إحساس بالهدوء بين الصالة وغرف النوم. إمكانية إضافة زجاج ساندبلست في الجزء العلوي لو عايزين نور من غير كشف كامل.",
      styleNotes: [
        "خشب زان مختار بعناية",
        "عزل صوتي/حراري محسّن",
        "زجاج ديكور اختياري",
        "قياس وتركيب في الموقع",
      ],
    },
    {
      title: "باب مدخل «واجهة» — أول انطباع",
      description:
        "باب خارجي/مدخل بطبقات خشب أقوى وتصميم يعكس هوية البيت من برّه. إمكانية نقوش هندسية خفيفة أو سطح أملس مودرن، مع طلاء/زيت مقاوم للعوامل الجوية حسب موقع التركيب.",
      styleNotes: [
        "متانة للمداخل الخارجية",
        "خيارات نقش أو سطح أملس",
        "تشطيب مقاوم للعوامل الجوية",
        "تصنيع حسب مقاس الفُتحة",
      ],
    },
    {
      title: "باب جرّار «انسياب» — للمساحات المفتوحة",
      description:
        "باب جرّار خشبي على ريل علوي مخفي يفصل المطبخ عن الصالة أو غرفة الملابس من غير ما ياخد مساحة فتح الباب التقليدي. مناسب للشقق المودرن اللي بتحب المساحات المتصلة.",
      styleNotes: [
        "توفير مساحة فتح الباب",
        "ريل علوي هادي",
        "ألواح خشب مصمتة أو مزجّجة",
        "تركيب متخصص من فريق خشبة",
      ],
    },
  ],
  floating_shelves: [
    {
      title: "رفوف معلقة «خط أفق» — فوق الكنبة",
      description:
        "ثلاث رفوف معلقة بسمك مريح وتركيب مخفي فوق الكنبة أو السرير. المسافات بين الرفوف متدرجة عشان الكتب والنباتات والإطارات يبانوا بطبقات من غير فوضى. الخشب فاتح يكبّر الحيطة بصرياً.",
      styleNotes: [
        "تركيب مخفي يتحمل وزن حقيقي",
        "مسافات متدرجة للعرض الطبقي",
        "خشب فاتح يوسّع الحيطة",
        "مقاس حسب عرض الكنبة",
      ],
    },
    {
      title: "رف مفرد عريض «لوحة» — قطعة فنية",
      description:
        "رف واحد سميك كأنه إطار معماري: مثالي لمزهرية كبيرة أو مجموعة منحوتات. الحواف مشطوفة برفق عشان الظل يقع بشكل جميل تحت الإضاءة الجانبية.",
      styleNotes: [
        "سمك بصري فاخر",
        "حواف مشطوفة للظل",
        "يحمل أوزان أثقل من الرفوف الرفيعة",
        "تشطيب زيت يبرز العروق",
      ],
    },
    {
      title: "مجموعة رفوف زاوية «ركن دافئ»",
      description:
        "رفوف زاوية متصلة بزاوية الغرفة — حلّ للشقق اللي الحيطان الفاضية فيها قليلة. تحول الركن الميت لمكتبة صغيرة أو عرض نباتات متدرّج.",
      styleNotes: [
        "يستغل الزوايا الميتة",
        "تركيب زاوية متين",
        "مناسب للنباتات المعلقة",
        "ألوان خشب حسب ديكور الغرفة",
      ],
    },
  ],
  modern_tables: [
    {
      title: "ترابيزة قهوة «دفء» — مركز الصالة",
      description:
        "ترابيزة قهوة بسطح عريض وأرجل منحوتة ببساطة، ارتفاع مريح للكوبايات واللابتوب. الأدراج الجانبية أو الرف السفلي للمجلات والريموت. قطعة تخلّي الصالة تبان مكتملة من أول نظرة.",
      styleNotes: [
        "ارتفاع مريح للجلوس المصري",
        "تخزين سفلي عملي",
        "خشب يتحمل الكوبات الساخنة بحذر",
        "مقاس حسب مساحة السجادة",
      ],
    },
    {
      title: "ترابيزة سفرة «جمع» — للعيلة والضيوف",
      description:
        "سفرة قابلة للتوسيع أو بمقاس ثابت حسب عدد الأفراد. الأرجل المدروسة تسيب مساحة للركب، والسطح مصقول سهل التنظيف. تصميم يصلح يومي وفي العزايم من غير ما يبان «ترابيزة مناسبات» بس.",
      styleNotes: [
        "خيارات توسعة للمناسبات",
        "راحة للركب تحت السطح",
        "تشطيب سهل المسح",
        "كراسي منفصلة أو توصية تنسيق",
      ],
    },
    {
      title: "ترابيزة جانبية «همسة» — جنب الكنبة",
      description:
        "ترابيزة صغيرة أنيقة للمصباح والموبايل والكوب — ارتفاع متناسق مع مسند الكنبة. تتحرك بسهولة وتنفع كزوجين على جنبَي الكنبة الكبيرة.",
      styleNotes: [
        "خفة بصرية وحركة سهلة",
        "ارتفاع متناسق مع الكنبة",
        "خشب مطابق لباقي القطع",
        "سعر مناسب كقطعة مكملة",
      ],
    },
  ],
  partitions: [
    {
      title: "فاصل شرائحي «نَفَس» — خصوصية من غير حجب",
      description:
        "بارتشن شرائحي عمودي يفصل الصالة عن المدخل أو المكتب المنزلي مع السماح بمرور الضوء والهواء. المسافات بين الشرائح تتظبط حسب مستوى الخصوصية اللي تفضّله.",
      styleNotes: [
        "ضوء يمر — خصوصية اختيارية",
        "شرائح خشب مصمتة",
        "ارتفاع حتى السقف أو جزئي",
        "تثبيت أرضي/سقفي حسب الحالة",
      ],
    },
    {
      title: "فاصل مكتبة «وظيفتين»",
      description:
        "فاصل يشتغل مكتبة من جهة وصورة حائطية خشبية من الجهة التانية — قطعة واحدة بتحل تقسيم المساحة والتخزين. مثالي للشقق المفتوحة اللي عايزة تحدد «منطقة» من غير حيطة.",
      styleNotes: [
        "تخزين + تقسيم في قطعة واحدة",
        "وجهان بتشطيب كامل",
        "مناسب للـ open space",
        "تصميم حسب مسار المشي",
      ],
    },
    {
      title: "فاصل ديكوري «إيقاع» — خطوط هندسية",
      description:
        "فاصل بنمط هندسي خفيف يشتغل كعمل فني قائم بذاته في الكافيهات والمنازل الراقية. الخشب الداكن أو الفاتح حسب الإضاءة المحيطة.",
      styleNotes: [
        "حضور فني مستقل",
        "نمط هندسي معاصر",
        "خشب داكن أو فاتح",
        "تركيب احترافي لتثبيت آمن",
      ],
    },
  ],
  tv_units: [
    {
      title: "وحدة تلفزيون معلقة «أفق الشاشة»",
      description:
        "وحدة TV معلقة بطول يغطّي الشاشة مع مساحات كابلات مخفية وأدراج للريموت والأجهزة. الخطوط أفقية تهدّي الحيطة وتخلي الشاشة جزء من الديكور مش قطعة إلكترونية ناشزة.",
      styleNotes: [
        "تعليق حائطي نظيف",
        "إدارة كابلات كاملة",
        "أدراج بعمق للأجهزة",
        "مقاس حسب عرض الشاشة",
      ],
    },
    {
      title: "وحدة أرضية «منصة» — استقرار وأناقة",
      description:
        "وحدة أرضية بقاعدة عريضة للشاشات الكبيرة، مع رفوف مفتوحة للصوتيات ودرج مغلق للفوضى. مناسبة للشقق اللي الحيطة فيها مش جاهزة لتعليق ثقيل.",
      styleNotes: [
        "ثبات للشاشات الكبيرة",
        "رفوف للصوتيات",
        "بدون حاجة لتعليق ثقيل",
        "تشطيب يطابق تكسية الحيطة لو مطلوبة",
      ],
    },
    {
      title: "نظام حائط ترفيه «مشهد كامل»",
      description:
        "وحدة + رفوف علوية أو تكسية خلفية خفيفة تحوّل جدار التلفزيون لمشهد متكامل. ننسّق المقاسات مع الشاشة والإضاءة الجانبية عشان النتيجة تبان «تصميم داخلي» مش مجرد ترابيزة تحت الشاشة.",
      styleNotes: [
        "تصميم جدار كامل اختياري",
        "تنسيق مع الإضاءة",
        "خشب فاخر بطبقات تشطيب",
        "معاينة أو صورة قبل التنفيذ",
      ],
    },
  ],
  wall_cladding: [
    {
      title: "تكسية جدار «دفء معماري» — خلف التلفزيون",
      description:
        "شرائح خشب أفقية أو رأسية تغطي جدار التلفزيون وتحوّله من حيطة فاضية لتحفة دافئة. الفواصل المدروسة تخلق ظلًا جميلًا مع الإضاءة المسائية، والتثبيت يراعي التهوية خلف الشاشة.",
      styleNotes: [
        "شرائح أفقية أو رأسية",
        "ظل جمالي مع الإضاءة",
        "تهوية خلف الشاشة",
        "تغطية كاملة أو جزئية حسب الميزانية",
      ],
    },
    {
      title: "تكسية مدخل «أول انطباع»",
      description:
        "تكسية خشبية لحيطة المدخل أو نص الحيطة خلف الكونسول — أول حاجة يشوفها الضيف. نقوش هندسية خفيفة أو سطح أملس حسب ستايل البيت.",
      styleNotes: [
        "تأثير فوري عند الدخول",
        "نقش أو سطح أملس",
        "يتناسق مع كونسول خشبة",
        "تركيب نظيف وسريع نسبياً",
      ],
    },
    {
      title: "تكسية مكتب/كافيه «هوية المكان»",
      description:
        "تكسية بمساحات أكبر للمكاتب والكافيهات: تحمّل أعلى وتنظيف أسهل، مع إمكانية دمج شعار أو إضاءة مخفية. خشبة بتشتغل المشاريع التجارية بنفس روح القطعة المنزلية الفاخرة.",
      styleNotes: [
        "تحمل الاستخدام التجاري",
        "إمكانية دمج إضاءة/شعار",
        "تشطيب سهل التنظيف",
        "معاينة موقع قبل التصنيع",
      ],
    },
  ],
};

function guidedOverride(
  caption: string,
  categoryName: string,
  pack: { title: string; description: string; styleNotes: string[] }
): { title: string; description: string; styleNotes: string[] } {
  const short = caption.trim().slice(0, 100);
  return {
    title: pack.title,
    description: `بناءً على طلبك («${short}»)، نقترح من قسم ${categoryName}: ${pack.description} هنظبط المقاس والخامة النهائية بعد صورة أوضح أو مكالمة قصيرة على واتساب.`,
    styleNotes: [
      ...pack.styleNotes.slice(0, 3),
      "ملتزم بتوجيهك + لمسة حرفية من خشبة",
    ],
  };
}

function buildMockSuggestion(input: SuggestRequest): SuggestResult {
  const category = pickCategory(input.categoryId);
  const caption = (input.caption || "").trim();
  const mode = caption ? "guided" : "max-creativity";
  const variation = Math.abs(input.variation ?? 0);
  
  // If no category selected, use MAX CREATIVITY mode
  const categoryName = category?.name || "إبداع حر";
  const categoryNameEn = category?.nameEn || "Free Creativity";
  const image =
    category.images[variation % category.images.length] ?? category.images[0];

  const packs = MOCK_PACKS[category.id] ?? [
    {
      title: `${category.name} · اقتراح مخصص`,
      description: category.description,
      styleNotes: [
        "خشب طبيعي فاخر",
        "تصنيع حسب المقاس",
        "تشطيب يدوي من ورشة خشبة",
        "تواصل واتساب لإتمام التفاصيل",
      ],
    },
  ];
  const pack = packs[variation % packs.length];
  const content =
    mode === "guided"
      ? guidedOverride(caption, category.name, pack)
      : pack;

  return {
    title: content.title,
    description: content.description,
    styleNotes: content.styleNotes,
    previewImage: image,
    categoryId: category.id,
    categoryName: category.name,
    mode,
    mock: true,
  };
}

function extractJsonObject(text: string): Record<string, unknown> | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = (fenced?.[1] ?? text).trim();
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>;
      } catch {
        return null;
      }
    }
    return null;
  }
}

const FEW_SHOT = `
أمثلة لجودة الرد (اتبع نفس المستوى — لا تنسخ حرفياً):

مثال 1 — مكتبات / صالة:
{"title":"مكتبة حائطية «نَسق» — ارتفاعات متدرجة","description":"مكتبة حائطية بأعمدة زان ورفوف بعمقين عشان الكتب والديكور يتكاملوا من غير زحمة. المقاس بيتظبط على عرض الحيطة، والتشطيب زيت طبيعي يبرز العروق ويتحمل غبار الشقق المصرية.","styleNotes":["زان بتشطيب زيت دافئ","رفوف بعمقين","تركيب حائطي نظيف","مقاس حسب الحيطة"]}

مثال 2 — رفوف معلقة فوق الكنبة:
{"title":"رفوف معلقة «خط أفق» — فوق الكنبة","description":"ثلاث رفوف بسمك مريح وتركيب مخفي فوق الكنبة. مسافات متدرجة للكتب والنباتات والإطارات، والخشب الفاتح يكبّر الحيطة بصرياً.","styleNotes":["تركيب مخفي يتحمّل","مسافات متدرجة","خشب فاتح","مقاس حسب عرض الكنبة"]}

مثال 3 — وحدات تلفزيون:
{"title":"وحدة تلفزيون معلقة «أفق الشاشة»","description":"وحدة معلقة بطول يغطي الشاشة مع كابلات مخفية وأدراج للريموت. الخطوط الأفقية تهدّي الحيطة وتخلي الشاشة جزء من الديكور.","styleNotes":["تعليق نظيف","كابلات مخفية","أدراج للأجهزة","مقاس حسب الشاشة"]}
`;

function buildSystemPrompt(
  categoryName: string,
  categoryNameEn: string,
  mode: "max-creativity" | "guided",
  variation: number
): string {
  return `أنت مستشار تصميم ومبيعات أثاث خشبي فاخر لبراند «خشبة / Khashaba» في مصر (القاهرة وضواحيها).
هدفك: ردّ عربي مصري فصيح مبسّط، جاهز يُعرض للعميل مباشرة — مقنع، حِرفي، وملموس (خامات، مقاس، استخدام، إحساس الغرفة).

الهوية:
- خشبة = حرفية يدوية + خشب طبيعي (زان / جوز / حسب الاتفاق) + تفصيل حسب المقاس.
- نبرة: دافئة، واثقة، بيع راقٍ بدون مبالغة رخيصة أو وعود سعر وهمية.
- اذكر لمسات عملية تناسب الشقق المصرية (مساحات ضيقة، غبار، إضاءة طبيعية، مدخل/صالة).

القسم المطلوب: ${categoryName} (${categoryNameEn}).
الوضع: ${
    mode === "guided"
      ? "GUIDED — احترم توجيه العميل حرفياً قدر الإمكان، ثم أضف لمسة حرفية ذكية من خشبة"
      : "MAX CREATIVITY — الكابشن فاضي؛ اقترح رؤية جريئة ومبهرة تناسب القسم"
  }.
رقم التنويع: ${variation + 1} (اقتراح مختلف تماماً عن تنويعات سابقة لنفس القسم).

أرجع JSON فقط بالمفاتيح:
- title: عنوان جذاب قصير (عربي) مع اسم قطعة مميز
- description: فقرة 2–4 جمل، ملموسة، جاهزة للعميل (بدون Markdown)
- styleNotes: مصفوفة 3–5 نصوص عربية قصيرة (خامة / تركيب / مقاس / لمسة تصميم)

ممنوع: الإنجليزية في القيم، كلام عام فارغ، ذكر أسعار، ذكر اسم أي نموذج AI.
${FEW_SHOT}`;
}

/** Prefer newer flash models; fall through if one is unavailable for the key. */
const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
] as const;

export function isAiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

async function buildGeminiSuggestion(
  input: SuggestRequest
): Promise<SuggestResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return buildMockSuggestion(input);
  }

  const category = pickCategory(input.categoryId);
  const caption = (input.caption || "").trim();
  const mode = caption ? "guided" : "max-creativity";
  const variation = Math.abs(input.variation ?? 0);
  
  // If no category selected, use MAX CREATIVITY mode
  const categoryName = category?.name || "إبداع حر";
  const categoryNameEn = category?.nameEn || "Free Creativity";

  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });

  const systemPrompt = buildSystemPrompt(
    categoryName,
    categoryNameEn,
    mode,
    variation
  );

  const parts: Array<
    { text: string } | { inlineData: { data: string; mimeType: string } }
  > = [{ text: systemPrompt }];

  if (caption) {
    parts.push({
      text: `توجيه العميل (التزم به ثم أبدع حوله):\n${caption}`,
    });
  } else {
    parts.push({
      text: "لا يوجد توجيه نصي — قدّم اقتراحاً حراً قوياً ومبهراً لهذا القسم.",
    });
  }

  if (input.imageBase64) {
    const mimeType = input.mimeType || "image/jpeg";
    const data = input.imageBase64.replace(/^data:[^;]+;base64,/, "");
    parts.push({
      inlineData: { data, mimeType },
    });
    parts.push({
      text: "حلّل صورة المساحة واقترح قطعة خشبية تناسبها.",
    });
  }

  const errors: string[] = [];
  // Try each model with retry for 503
  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) {
        console.info("[gemini] retrying model:", model, "attempt:", attempt + 1);
        await new Promise((r) => setTimeout(r, 2000));
      } else {
        console.info("[gemini] trying model:", model);
      }
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts }],
        config: {
          temperature: mode === "max-creativity" ? 1.05 : 0.85,
          responseMimeType: "application/json",
        },
      });

      const text =
        typeof response.text === "string"
          ? response.text
          : response.candidates?.[0]?.content?.parts
              ?.map((p) => ("text" in p ? p.text : ""))
              .join("\n") ?? "";

      console.info("[gemini] response text length:", text.length);
      console.info("[gemini] response preview:", text.slice(0, 200));

      if (!text || text.length === 0) {
        throw new Error(`Empty response from ${model}`);
      }

      const parsed = extractJsonObject(text);
      if (!parsed) {
        throw new Error(`Failed to parse JSON from ${model}: ${text.slice(0, 100)}`);
      }

      const styleNotes = Array.isArray(parsed?.styleNotes)
        ? (parsed!.styleNotes as unknown[])
            .filter((n): n is string => typeof n === "string")
            .slice(0, 6)
        : [];

      const fallback = buildMockSuggestion(input);
      const title =
        typeof parsed?.title === "string" && parsed.title.trim()
          ? parsed.title.trim()
          : "";
      const description =
        typeof parsed?.description === "string" && parsed.description.trim()
          ? parsed.description.trim()
          : "";

      if (!title && !description) {
        throw new Error(`Empty title/description from ${model}`);
      }

      console.info("[gemini] SUCCESS with model:", model);

      // Step 2: If user uploaded an image, edit it with the proposed piece
      let mockupImage: string | undefined;
      if (input.imageBase64) {
        try {
          console.info("[gemini] starting image edit...");
          const imageData = input.imageBase64.replace(/^data:[^;]+;base64,/, "");
          const imageMimeType = input.mimeType || "image/jpeg";

          const styleDesc = input.style || "modern minimalist";
          const colorDesc = input.colorPalette || "warm wood tones";

          const editPrompt = `You are an expert interior designer AI. Transform this room photo by adding wooden furniture in the empty spaces.

DESIGN BRIEF:
- Piece to add: ${title}
- Style: ${styleDesc}
- Color palette: ${colorDesc}
- Description: ${description}

CRITICAL PRESERVATION RULES (like ControlNet):
- PRESERVE the EXACT room structure: walls, floor, ceiling, windows, doors
- PRESERVE the EXACT camera angle and perspective
- PRESERVE all existing furniture - do NOT modify or remove any
- PRESERVE the natural lighting and shadows
- PRESERVE wall colors and floor texture

WHAT TO ADD:
- Add ONLY the proposed wooden furniture piece (${title})
- Place it in the most suitable empty spot in the room
- Match the style: ${styleDesc}
- Match the colors: ${colorDesc}
- The piece should be made of natural wood (oak, walnut, or as described)
- Add realistic shadows and reflections for the new piece
- The new piece must blend seamlessly with the existing room

STYLE GUIDELINES:
- Modern: clean lines, minimal, sleek
- Classic: ornate details, warm tones, traditional
- Scandinavian: light wood, white walls, cozy
- Industrial: dark metal + wood, raw textures
- Japandi: zen, natural, simple elegance

COLOR PALETTE GUIDELINES:
- Warm: browns, beiges, cream, gold accents
- Cool: grays, blues, whites, silver
- Neutral: monochrome, soft tones
- Wood: natural wood tones throughout
- Contrast: dark + light combination

OUTPUT QUALITY:
- Photorealistic result (NOT illustration, NOT 3D render)
- Architectural digest magazine quality
- 4K detail level
- The result should look like a real photo taken after renovation

Do NOT add: plants, accessories, wall art, rugs, or any items other than the main piece.
Do NOT change: wall color, floor type, ceiling, window position, existing furniture.`;

          const editResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: [
              {
                role: "user",
                parts: [
                  {
                    inlineData: {
                      data: imageData,
                      mimeType: imageMimeType,
                    },
                  },
                  { text: editPrompt },
                ],
              },
            ],
          });

          // Extract image from response
          const editCandidates = (editResponse as { candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { data?: string } }> } }> }).candidates;
          if (editCandidates && editCandidates[0]?.content?.parts) {
            for (const part of editCandidates[0].content.parts) {
              if (part.inlineData?.data) {
                mockupImage = `data:image/png;base64,${part.inlineData.data}`;
                console.info("[gemini] image edit SUCCESS, size:", part.inlineData.data.length);
                break;
              }
            }
          }
          if (!mockupImage) {
            console.info("[gemini] image edit: no image in response");
          }
        } catch (editErr) {
          console.error("[gemini] image edit failed:", editErr instanceof Error ? editErr.message : String(editErr));
        }
      }

      return {
        title: title || fallback.title,
        description: description || text.slice(0, 500) || fallback.description,
        styleNotes: styleNotes.length > 0 ? styleNotes : fallback.styleNotes,
        previewImage: mockupImage || (category.images[variation % category.images.length] ?? category.images[0]),
        mockupImage,
        categoryId: category?.id || "general",
        categoryName: category?.name || "اقتراح عام",
        mode,
        mock: false,
      };
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      if (attempt === 0 && errMsg.includes("503")) {
        console.info("[gemini] 503 on", model, "- will retry");
        continue;
      }
      errors.push(`${model}: ${errMsg.slice(0, 200)}`);
      console.error("[gemini] model", model, "failed:", errMsg);
      break;
    }
    } // end retry loop
  }

  throw new Error(`All models failed: ${errors.join(" | ")}`);
}

export async function createSuggestion(
  input: SuggestRequest
): Promise<SuggestResult> {
  if (!isAiConfigured()) {
    console.info("[gemini] aiConfigured=false mode=mock");
    const mock = buildMockSuggestion(input);
    (mock as SuggestResult & { _debug: string })._debug = "GEMINI_API_KEY not set";
    return mock;
  }
  try {
    const result = await buildGeminiSuggestion(input);
    return result;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("[gemini] createSuggestion error:", errMsg);
    const mock = buildMockSuggestion(input);
    (mock as SuggestResult & { _debug: string })._debug = errMsg;
    return mock;
  }
}

// Simple test function
export async function testGeminiConnection(): Promise<{ ok: boolean; error?: string; response?: string }> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "No API key" };
  }
  
  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: "Say hello in Arabic",
    });
    
    const text = typeof response.text === "string" ? response.text : "no text";
    return { ok: true, response: text.slice(0, 200) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

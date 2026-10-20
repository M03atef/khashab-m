/**
 * بيانات معرض خشبة
 * الصور دي صور حقيقية من منتجات خشبة - اتحطت من GitHub repo بتاع البراند
 */

export type Category = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  images: string[];
};

export const CATEGORIES: Category[] = [
  {
    id: "bookcases",
    name: "مكتبات",
    nameEn: "Bookcases & Bookshelves",
    description: "مكتبات خشبية بتصميمات مودرن وكلاسيك تناسب كل المساحات، من المكتبات الحائطية للرفوف الطويلة الطالعة للأعلى. كل مكتبة تُصنع بمقاسات حسب الطلب لتعظيم الاستفادة من المساحة المتاحة لديك.",
    icon: "📚",
    images: [
      "/products/bookcases/bookcases-01.jpg",
      "/products/bookcases/bookcases-02.jpg",
      "/products/bookcases/bookcases-03.jpg",
      "/products/bookcases/bookcases-04.jpg",
      "/products/bookcases/bookcases-05.png",
    ],
  },
  {
    id: "consoles",
    name: "كونسولات",
    nameEn: "Consoles",
    description: "كونسولات أنيقة للمدخل والصالة، بتصميمات بسيطة تعكس فخامة الخشب الطبيعي ولمساته الدافئة. مثالية لعرض التحف والإكسسوارات أو كقطعة بصرية تجذب الانتباه عند دخول البيت.",
    icon: "🪞",
    images: [
      "/products/consoles/consoles-01.jpg",
      "/products/consoles/consoles-02.jpg",
      "/products/consoles/consoles-03.jpg",
      "/products/consoles/consoles-04.jpg",
      "/products/consoles/consoles-05.jpg",
    ],
  },
  {
    id: "desks",
    name: "مكاتب",
    nameEn: "Desks",
    description: "مكاتب عمل ودراسة عملية وأنيقة، مصممة لراحة الاستخدام الطويل مع مساحات تخزين ذكية للأسلاك والأوراق. متوفرة بتصميمات مختلفة من المكتب الكلاسيكي للمكتب المودرن المفتوح.",
    icon: "💻",
    images: [
      "/products/desks/desks-01.jpg",
      "/products/desks/desks-02.jpg",
      "/products/desks/desks-03.jpg",
      "/products/desks/desks-04.jpg",
      "/products/desks/desks-05.jpg",
    ],
  },
  {
    id: "doors",
    name: "أبواب",
    nameEn: "Doors",
    description: "أبواب خشبية فاخرة بتصميمات داخلية وخارجية، تجمع بين المتانة والجمال والأمان. نستخدم خشب الزان والجوز والبلط المختار بعناية، مع إمكانية إضافة نقوش يدوية أو زجاج ديكور.",
    icon: "🚪",
    images: [
      "/products/doors/doors-01.jpg",
      "/products/doors/doors-02.jpg",
      "/products/doors/doors-03.jpg",
      "/products/doors/doors-04.jpg",
      "/products/doors/doors-05.jpg",
      "/products/doors/doors-06.jpg",
    ],
  },
  {
    id: "floating_shelves",
    name: "رفوف معلقة",
    nameEn: "Floating Shelves",
    description: "رفوف خشبية معلقة بتصميم عصري تضيف لمسة جمالية وعملية لأي حائط في بيتك. تركيب نظيف بدون مسامير ظاهرة، يتحمل أوزان ثقيلة، ومثالية للكتب والنباتات والإكسسوارات.",
    icon: "📐",
    images: [
      "/products/floating_shelves/floating_shelves-01.jpg",
      "/products/floating_shelves/floating_shelves-02.jpg",
      "/products/floating_shelves/floating_shelves-03.jpg",
      "/products/floating_shelves/floating_shelves-04.jpg",
      "/products/floating_shelves/floating_shelves-05.jpg",
      "/products/floating_shelves/floating_shelves-06.jpg",
      "/products/floating_shelves/floating_shelves-07.jpg",
      "/products/floating_shelves/floating_shelves-08.jpg",
    ],
  },
  {
    id: "modern_tables",
    name: "ترابيزات مودرن",
    nameEn: "Modern Tables",
    description: "ترابيزات سفرة وقهوة بتصميمات مودرن، تجمع بين الفن والوظيفة لتكون قلب البيت. متوفرة بمقاسات مختلفة تناسب الشقق الصغيرة والصالات الكبيرة، مع إمكانية التخصيص الكامل.",
    icon: "🍽️",
    images: [
      "/products/modern_tables/modern_tables-01.jpg",
      "/products/modern_tables/modern_tables-02.jpg",
      "/products/modern_tables/modern_tables-03.jpg",
      "/products/modern_tables/modern_tables-04.jpg",
      "/products/modern_tables/modern_tables-05.jpg",
    ],
  },
  {
    id: "partitions",
    name: "فواصل (بارتشنز)",
    nameEn: "Partitions",
    description: "فواصل خشبية لتقسيم المساحات بأناقة، تمنح خصوصية دون أن تفقد الإحساس بالاتساع. تصاميم مسطرة وشرائحية تعمل كقطعة فنية مستقلة بحد ذاتها وتضيف عمق للمساحة.",
    icon: "🪟",
    images: [
      "/products/partitions/partitions-01.jpg",
      "/products/partitions/partitions-02.jpg",
      "/products/partitions/partitions-03.jpg",
      "/products/partitions/partitions-04.jpg",
      "/products/partitions/partitions-05.jpg",
      "/products/partitions/partitions-06.jpg",
      "/products/partitions/partitions-07.png",
    ],
  },
  {
    id: "tv_units",
    name: "وحدات تلفزيون",
    nameEn: "TV Units",
    description: "وحدات تلفزيون خشبية بتصميمات عصرية تناسب كل أحجام الشاشات مع مساحات تخزين كافية للأجهزة والريموت والإكسسوارات. متوفرة بوحدات معلقة وأرضية وبأنظمة كابلات مخفية.",
    icon: "📺",
    images: [
      "/products/tv_units/tv_units-01.jpg",
      "/products/tv_units/tv_units-02.jpg",
      "/products/tv_units/tv_units-03.jpg",
      "/products/tv_units/tv_units-04.jpg",
      "/products/tv_units/tv_units-05.jpg",
    ],
  },
  {
    id: "wall_cladding",
    name: "تكسية جدران",
    nameEn: "Wall Cladding",
    description: "تكسية جدران خشبية تحوّل أي مساحة عادية إلى تحفة معمارية دافئة وفخمة. مثالية لجدار التلفزيون أو المدخل أو جدران المكاتب والكافيهات، متوفرة بنقوش هندسية وخطوط أفقية.",
    icon: "🪵",
    images: [
      "/products/wall_cladding/wall_cladding-01.jpg",
      "/products/wall_cladding/wall_cladding-02.jpg",
      "/products/wall_cladding/wall_cladding-03.jpg",
      "/products/wall_cladding/wall_cladding-04.jpg",
      "/products/wall_cladding/wall_cladding-05.jpg",
      "/products/wall_cladding/wall_cladding-06.jpg",
    ],
  },
];

// معلومات البراند
export const BRAND = {
  name: "خشبة",
  nameEn: "Khashaba",
  phone: "01070386575",
  phoneDisplay: "0107 038 6575",
  whatsapp: "201070386575",
  email: "info@khashaba.com",
  tagline: "نصنع لك الأثاث الذي يدوم",
  description:
    "خشبة براند متخصص في صناعة الأثاث الخشبي الفاخر بتصميمات تجمع بين الأصالة والحداثة. كل قطعة تخرج من ورشتنا تحمل لمسة حرفية فريدة وإتقان يدوي يضمن لها البقاء جيلاً بعد جيل.",
  address: "القاهرة، مصر",
  workingHours: "السبت - الخميس: 10 ص - 9 م",
  facebook: "https://www.facebook.com/profile.php?id=61594437931625",
  instagram: "https://www.instagram.com/khashaba.wood/?hl=en",
} as const;

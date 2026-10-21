/**
 * بيانات معرض خشبة
 * الصور دي صور حقيقية من منتجات خشبة
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
      "/products/bookcases/0821db6315e40922b64dbfd5760a6f71.jpg",
      "/products/bookcases/bceec4e9134a3a849fd7e8400ad73f7e.jpg",
      "/products/bookcases/bookcases-02.jpg",
      "/products/bookcases/bookcases-03.jpg",
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
      "/products/consoles/3d298bdd5ecae8fd89693d62ee935786.jpg",
      "/products/consoles/consoles-01.jpg",
      "/products/consoles/consoles-03.jpg",
      "/products/consoles/consoles-04.jpg",
      "/products/consoles/d4afa19a605ae04e27ff0f18f2608b42.jpg",
    ],
  },
  {
    id: "desks",
    name: "مكاتب",
    nameEn: "Desks",
    description: "مكاتب عمل ودراسة عملية وأنيقة، مصممة لراحة الاستخدام الطويل مع مساحات تخزين ذكية للأسلاك والأوراق. متوفرة بتصميمات مختلفة من المكتب الكلاسيكي للمكتب المودرن المفتوح.",
    icon: "💻",
    images: [
      "/products/desks/39a8f6907074120d6c99aedf887f8883.jpg",
      "/products/desks/bb8c8bf66f6e821126cb2afb4e2d3a23.jpg",
      "/products/desks/desks-02.jpg",
      "/products/desks/desks-04.jpg",
      "/products/desks/fbe764cde617ffa056d7cb1ef4d787f0.jpg",
    ],
  },
  {
    id: "doors",
    name: "أبواب",
    nameEn: "Doors",
    description: "أبواب خشبية فاخرة بتصميمات داخلية وخارجية، تجمع بين المتانة والجمال والأمان. نستخدم خشب الزان والجوز والبلط المختار بعناية، مع إمكانية إضافة نقوش يدوية أو زجاج ديكور.",
    icon: "🚪",
    images: [
      "/products/doors/6f96d4925ee700d2ff6261209e89ce40.jpg",
      "/products/doors/745c6d837720d640445acd33a48efdcc.jpg",
      "/products/doors/99706746508915190f08588f15f15897.jpg",
      "/products/doors/b11d93988e0502812b6fe0a4be41ec53.jpg",
      "/products/doors/e3d3e30e45db5241523f7834f347bb19.jpg",
      "/products/doors/ed76cb74d30d586e8db6872fe7ec7eb9.jpg",
    ],
  },
  {
    id: "floating_shelves",
    name: "رفوف معلقة",
    nameEn: "Floating Shelves",
    description: "رفوف خشبية معلقة بتصميم عصري تضيف لمسة جمالية وعملية لأي حائط في بيتك. تركيب نظيف بدون مسامير ظاهرة، يتحمل أوزان ثقيلة، ومثالية للكتب والنباتات والإكسسوارات.",
    icon: "📐",
    images: [
      "/products/floating_shelves/26078e526851b335e58ddb19b77efd6f.jpg",
      "/products/floating_shelves/2a38ad21439876760ccd4ae6c48944d8.jpg",
      "/products/floating_shelves/aa9810d4a9b7899f65e4416396eb1eed.jpg",
      "/products/floating_shelves/abce7681ec3cc1cb7ab9bedf7701a37a.jpg",
      "/products/floating_shelves/af6efb36c52f91b53db20a13af6c3eee.jpg",
      "/products/floating_shelves/b818b79a66dd788507ebedb1418207e6.jpg",
      "/products/floating_shelves/da3764fd02a2d0fedf1540853da2b62b.jpg",
      "/products/floating_shelves/floating_shelves-03.jpg",
    ],
  },
  {
    id: "modern_tables",
    name: "ترابيزات مودرن",
    nameEn: "Modern Tables",
    description: "ترابيزات سفرة وقهوة بتصميمات مودرن، تجمع بين الفن والوظيفة لتكون قلب البيت. متوفرة بمقاسات مختلفة تناسب الشقق الصغيرة والصالات الكبيرة، مع إمكانية التخصيص الكامل.",
    icon: "🍽️",
    images: [
      "/products/modern_tables/5bbc138b1736263de7f9885659954d8b.jpg",
      "/products/modern_tables/b7d85005d7eaea7754afa5971da2c5e0.jpg",
      "/products/modern_tables/modern_tables-02.jpg",
      "/products/modern_tables/modern_tables-03.jpg",
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
      "/products/partitions/5a93ce45276c5c055f29b1d8176b1622.jpg",
      "/products/partitions/8a1865502a7d10f5008ca3a0c170822f.jpg",
      "/products/partitions/bf38ac44e70c4b66f0b606e9c87d53cb.jpg",
      "/products/partitions/d42716b8c6b437016d4e34565a8169a8.jpg",
      "/products/partitions/download.png",
      "/products/partitions/partitions-01.jpg",
      "/products/partitions/partitions-02.jpg",
    ],
  },
  {
    id: "tv_units",
    name: "وحدات تلفزيون",
    nameEn: "TV Units",
    description: "وحدات تلفزيون خشبية بتصميمات عصرية تناسب كل أحجام الشاشات مع مساحات تخزين كافية للأجهزة والريموت والإكسسوارات. متوفرة بوحدات معلقة وأرضية وبأنظمة كابلات مخفية.",
    icon: "📺",
    images: [
      "/products/tv_units/2c0c6ae249576222fb542d52141ad6d2.jpg",
      "/products/tv_units/f23402dd0be34a12177d11f041678745.jpg",
      "/products/tv_units/tv_units-02.jpg",
      "/products/tv_units/tv_units-03.jpg",
      "/products/tv_units/tv_units-04.jpg",
    ],
  },
  {
    id: "wall_cladding",
    name: "تكسية جدران",
    nameEn: "Wall Cladding",
    description: "تكسية جدران خشبية تحوّل أي مساحة عادية إلى تحفة معمارية دافئة وفخمة. مثالية لجدار التلفزيون أو المدخل أو جدران المكاتب والكافيهات، متوفرة بنقوش هندسية وخطوط أفقية.",
    icon: "🪵",
    images: [
      "/products/wall_cladding/062cea1a34af237dca3b40c6a90b6ec5.jpg",
      "/products/wall_cladding/1ba8729eb3975707d266c0ee4332f49e.jpg",
      "/products/wall_cladding/41e6e0cd6cba1c0e2cc3c9fcaf69b211.jpg",
      "/products/wall_cladding/6c819a6b6520ac141426dd62d10f2420.jpg",
      "/products/wall_cladding/e4b7358716cfc47824d6e7ccd8f94d5c.jpg",
    ],
  },
  {
    id: "coffee_corner",
    name: "ركن القهوة",
    nameEn: "Coffee Corner",
    description: "أركان قهوة خشبية مخصصة لتحضير القهوة في بيتك، بتصميمات تجمع بين الأناقة والوظيفة. تتضمن رفوف للأكواب والأجهزة، ومساحات تخزين للبن والسكر، مع إضاءة دافئة تخلق جو القهوة الأصيل.",
    icon: "☕",
    images: [
      "/products/coffee_corner/39a53c05458d99c9d4bbc8db681d2e9e.jpg",
      "/products/coffee_corner/b406bebf6c086d477fde7d39f9ab3a93.jpg",
      "/products/coffee_corner/c730f49f660dfde0d23e3b4c22d6e81a.jpg",
      "/products/coffee_corner/c7d69e61012ba30a835193c185eefd46.jpg",
      "/products/coffee_corner/ddccd1bc65ba0a6ee74730905e3eba61.jpg",
      "/products/coffee_corner/e411884f49191b3db11b7896bc88b210.jpg",
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

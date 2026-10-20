#!/usr/bin/env python3
"""
انسخ صور المنتجات من GitHub repo لـ public/products/<category>/
وحدّث ملف catalog.ts بقائمة الصور الجديدة.
"""
import os
import shutil
import json
from pathlib import Path

REPO_BASE = Path("/home/z/my-project/khashab-repo/khashaba")
PUBLIC_BASE = Path("/home/z/my-project/public/products")
CATALOG_FILE = Path("/home/z/my-project/src/lib/catalog.ts")

# مابينج بين اسم الفولدر في الـ repo والـ id في الـ catalog
CATEGORY_MAP = {
    "Bookcases  Bookshelves = مكتبات": ("bookcases", "مكتبات", "Bookcases & Bookshelves", "📚", "مكتبات خشبية بتصميمات مودرن وكلاسيك تناسب كل المساحات، من المكتبات الحائطية للرفوف الطويلة الطالعة للأعلى. كل مكتبة تُصنع بمقاسات حسب الطلب لتعظيم الاستفادة من المساحة المتاحة لديك."),
    "Consoles": ("consoles", "كونسولات", "Consoles", "🪞", "كونسولات أنيقة للمدخل والصالة، بتصميمات بسيطة تعكس فخامة الخشب الطبيعي ولمساته الدافئة. مثالية لعرض التحف والإكسسوارات أو كقطعة بصرية تجذب الانتباه عند دخول البيت."),
    "Desks": ("desks", "مكاتب", "Desks", "💻", "مكاتب عمل ودراسة عملية وأنيقة، مصممة لراحة الاستخدام الطويل مع مساحات تخزين ذكية للأسلاك والأوراق. متوفرة بتصميمات مختلفة من المكتب الكلاسيكي للمكتب المودرن المفتوح."),
    "Door": ("doors", "أبواب", "Doors", "🚪", "أبواب خشبية فاخرة بتصميمات داخلية وخارجية، تجمع بين المتانة والجمال والأمان. نستخدم خشب الزان والجوز والبلط المختار بعناية، مع إمكانية إضافة نقوش يدوية أو زجاج ديكور."),
    "Floating Shelves": ("floating_shelves", "رفوف معلقة", "Floating Shelves", "📐", "رفوف خشبية معلقة بتصميم عصري تضيف لمسة جمالية وعملية لأي حائط في بيتك. تركيب نظيف بدون مسامير ظاهرة، يتحمل أوزان ثقيلة، ومثالية للكتب والنباتات والإكسسوارات."),
    "Modern Tables": ("modern_tables", "ترابيزات مودرن", "Modern Tables", "🍽️", "ترابيزات سفرة وقهوة بتصميمات مودرن، تجمع بين الفن والوظيفة لتكون قلب البيت. متوفرة بمقاسات مختلفة تناسب الشقق الصغيرة والصالات الكبيرة، مع إمكانية التخصيص الكامل."),
    "Partitions": ("partitions", "فواصل (بارتشنز)", "Partitions", "🪟", "فواصل خشبية لتقسيم المساحات بأناقة، تمنح خصوصية دون أن تفقد الإحساس بالاتساع. تصاميم مسطرة وشرائحية تعمل كقطعة فنية مستقلة بحد ذاتها وتضيف عمق للمساحة."),
    "TV Units": ("tv_units", "وحدات تلفزيون", "TV Units", "📺", "وحدات تلفزيون خشبية بتصميمات عصرية تناسب كل أحجام الشاشات مع مساحات تخزين كافية للأجهزة والريموت والإكسسوارات. متوفرة بوحدات معلقة وأرضية وبأنظمة كابلات مخفية."),
    "Wall Cladding": ("wall_cladding", "تكسية جدران", "Wall Cladding", "🪵", "تكسية جدران خشبية تحوّل أي مساحة عادية إلى تحفة معمارية دافئة وفخمة. مثالية لجدار التلفزيون أو المدخل أو جدران المكاتب والكافيهات، متوفرة بنقوش هندسية وخطوط أفقية."),
}

# تنظيف الـ public folder القديم
if PUBLIC_BASE.exists():
    shutil.rmtree(PUBLIC_BASE)
PUBLIC_BASE.mkdir(parents=True, exist_ok=True)

categories_data = []

# ترتيب ثابت للعرض
ORDER = [
    "Bookcases  Bookshelves = مكتبات",
    "Consoles",
    "Desks",
    "Door",
    "Floating Shelves",
    "Modern Tables",
    "Partitions",
    "TV Units",
    "Wall Cladding",
]

for folder_name in ORDER:
    cat_id, ar_name, en_name, icon, description = CATEGORY_MAP[folder_name]
    src_dir = REPO_BASE / folder_name
    dest_dir = PUBLIC_BASE / cat_id
    dest_dir.mkdir(parents=True, exist_ok=True)

    if not src_dir.exists():
        print(f"⚠️  MISSING: {src_dir}")
        continue

    # اجمع كل الصور
    images = []
    valid_exts = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
    for i, file_path in enumerate(sorted(src_dir.iterdir()), start=1):
        if file_path.suffix.lower() not in valid_exts:
            continue
        # اسم نظيف: <category>-01.jpg
        new_name = f"{cat_id}-{i:02d}{file_path.suffix.lower()}"
        dest_path = dest_dir / new_name
        shutil.copy2(file_path, dest_path)
        # الـ URL هيتقرأ من /products/<cat_id>/<file>
        images.append(f"/products/{cat_id}/{new_name}")
        print(f"✓ {folder_name} -> {new_name}")

    categories_data.append({
        "id": cat_id,
        "name": ar_name,
        "nameEn": en_name,
        "icon": icon,
        "description": description,
        "images": images,
    })

# اكتب الـ catalog.ts
catalog_content = '''/**
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
'''

for cat in categories_data:
    catalog_content += "  {\n"
    catalog_content += f'    id: "{cat["id"]}",\n'
    catalog_content += f'    name: "{cat["name"]}",\n'
    catalog_content += f'    nameEn: "{cat["nameEn"]}",\n'
    catalog_content += f'    description: "{cat["description"]}",\n'
    catalog_content += f'    icon: "{cat["icon"]}",\n'
    catalog_content += "    images: [\n"
    for img in cat["images"]:
        catalog_content += f'      "{img}",\n'
    catalog_content += "    ],\n"
    catalog_content += "  },\n"

catalog_content += '''];

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
'''

CATALOG_FILE.write_text(catalog_content, encoding="utf-8")
print(f"\n✅ Catalog updated: {CATALOG_FILE}")
print(f"📊 Total categories: {len(categories_data)}")
print(f"🖼️  Total images: {sum(len(c['images']) for c in categories_data)}")

# ملخص
print("\n--- ملخص الصور لكل قسم ---")
for c in categories_data:
    print(f"  {c['name']}: {len(c['images'])} صور")

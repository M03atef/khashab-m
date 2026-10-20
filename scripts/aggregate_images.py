#!/usr/bin/env python3
"""Aggregate image URLs from all category JSON files into a single manifest."""
import json
import os
import re
from pathlib import Path

SCRIPTS_DIR = Path("/home/z/my-project/scripts")
ASSETS_DIR = Path("/home/z/my-project/download/khashaba-assets/categories")

CATEGORIES = [
    ("bookcases", "Bookcases & Bookshelves", "مكتبات"),
    ("consoles", "Consoles", "كونسولات"),
    ("desks", "Desks", "مكاتب"),
    ("doors", "Doors", "أبواب"),
    ("floating_shelves", "Floating Shelves", "رفوف معلقة"),
    ("modern_tables", "Modern Tables", "ترابيزات مودرن"),
    ("partitions", "Partitions", "فواصل / بارتشنز"),
    ("tv_units", "TV Units", "وحدات تلفزيون"),
    ("wall_cladding", "Wall Cladding", "تكسية جدران"),
]

manifest = {}

for key, en_label, ar_label in CATEGORIES:
    json_path = SCRIPTS_DIR / f"{key}.json"
    if not json_path.exists():
        print(f"MISSING: {json_path}")
        continue

    raw = json_path.read_text(encoding="utf-8")
    # The file has a few stdout-prefix lines before the JSON. Find the first '{'
    start = raw.find("{")
    if start < 0:
        print(f"NO JSON in {json_path}")
        continue
    try:
        data = json.loads(raw[start:])
    except json.JSONDecodeError as e:
        print(f"PARSE ERROR in {json_path}: {e}")
        continue

    urls = []
    for item in data.get("results", []):
        url = item.get("original_url")
        if url:
            urls.append(url)

    manifest[key] = {
        "en_label": en_label,
        "ar_label": ar_label,
        "images": urls,
    }
    print(f"{key}: {len(urls)} images")

ASSETS_DIR.mkdir(parents=True, exist_ok=True)
out = Path("/home/z/my-project/scripts/manifest.json")
out.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"\nManifest saved to: {out}")
print(f"Total categories: {len(manifest)}")
print(f"Total images: {sum(len(m['images']) for m in manifest.values())}")

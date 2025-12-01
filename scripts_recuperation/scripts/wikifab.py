# scraper_wikifab_lowtech.py
import os
import re
import asyncio
from urllib.parse import urljoin, unquote, urlsplit, urlunsplit

import aiohttp
from aiohttp import ClientSession
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
from playwright._impl._errors import TargetClosedError
import json


# ======================================================================
#                            CONFIG WIKIFAB
# ======================================================================

SITE_WIKIFAB = {
    "name": "wikifab",
    "base": "https://wikifab.org/wiki/",
    "list_url": "https://wikifab.org/wiki/Accueil",
    "link_selector": "div.project-card > a[href^='/wiki/']",
    "href_attr": "href",
    "min_links": 12,
    "fallback_selector": "div.project-card a[href^='/wiki/'] img",
    "use_playwright": True,
    "load_more_selector": "div.load-more",
    "max_items": 115,
}

OUTPUT_DIR = "../pages_brutes"

HEADERS = {
    "User-Agent": "MakerLensAsync/1.0 (+https://github.com/divinebanon1-art/Scraping_part)"
}

MAX_CONCURRENCY = 15
RETRIES = 3
RETRY_SLEEP = 1.2


# ======================================================================
#                  FILTRAGE LOW-TECH : catégories bannies
# ======================================================================

BANNED_CATEGORY_WORDS = {
    "art", "déco", "decoration", "décoration",
    "jeux", "jeu", "loisirs", "loisir",
    "musique", "sons", "son"
}

SKIPPED_TUTOS = []


# ======================================================================
#                              UTILITAIRES
# ======================================================================

def safe_name(s: str) -> str:
    return "".join(c if c.isalnum() or c in ("-", "_", ".") else "_" for c in s)


def clean_text(s: str | None) -> str:
    if not s:
        return ""
    return " ".join(s.split()).strip()


def normalize_cat_text(c: str) -> list[str]:
    c = c.lower()
    c = re.sub(r"[^a-zàâçéèêëîïôûùüÿœ]", " ", c)
    return [t for t in c.split() if t]


def category_is_fun_only(cat: str) -> bool:
    tokens = normalize_cat_text(cat)
    if not tokens:
        return False

    neutral = {"et", "de", "du", "des", "en", "pour", "à", "a"}
    has_fun = False

    for t in tokens:
        if t in BANNED_CATEGORY_WORDS:
            has_fun = True
        elif t in neutral:
            continue
        else:
            return False

    return has_fun


def is_banned_only_categories(categories: list[str]) -> bool:
    if not categories:
        return False
    return all(category_is_fun_only(c) for c in categories)


def extract_categories_from_soup(soup: BeautifulSoup) -> list[str]:
    cat_div = soup.find("div", id="mw-normal-catlinks") or soup.find("div", id="catlinks")
    if not cat_div:
        return []
    ul = cat_div.find("ul")
    if not ul:
        return []
    return [clean_text(a.get_text()) for a in ul.find_all("a")]


# ======================================================================
#                     EXTRACTION LIENS (Playwright)
# ======================================================================

async def extract_links_with_playwright(site: dict) -> list[str]:
    print("\n🔎 Extraction des liens via Playwright...")
    links = []

    browser = None
    context = None
    page = None

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context()
            page = await context.new_page()

            await page.goto(site["list_url"], wait_until="networkidle")

            # "Voir plus"
            if site.get("load_more_selector"):
                for _ in range(20):
                    try:
                        load_more = page.locator(site["load_more_selector"])
                        if not await load_more.is_visible():
                            break
                        await load_more.click()
                        await page.wait_for_timeout(2000)
                    except:
                        break

            html = await page.content()

    except Exception as e:
        print("⚠️ Playwright error:", e)
        return []
    finally:
        try:
            if page:
                await page.close()
        except:
            pass
        try:
            if context:
                await context.close()
        except:
            pass
        try:
            if browser:
                await browser.close()
        except:
            pass

    # Parse HTML
    soup = BeautifulSoup(html, "html.parser")
    href_attr = site.get("href_attr", "href")

    for a in soup.select(site["link_selector"]):
        href = a.get(href_attr)
        if href:
            links.append(urljoin(site["base"], href))

    # Dédoublonner
    seen, uniq = set(), []
    for u in links:
        if u not in seen:
            seen.add(u)
            uniq.append(u)

    print("📌 Liens trouvés :", len(uniq))
    return uniq


# ======================================================================
#                          SCRAPER UNE PAGE
# ======================================================================

async def scrape_tutorial_page(session: ClientSession, site: dict, url: str, out_dir: str, sem: asyncio.Semaphore):
    global SKIPPED_TUTOS

    slug_raw = unquote(url.rstrip("/").rsplit("/", 1)[-1])
    slug = safe_name(slug_raw)

    os.makedirs(out_dir, exist_ok=True)
    html_path = os.path.join(out_dir, f"{slug}.html")
    meta_path = os.path.join(out_dir, f"{slug}.meta.json")

    # Skip si déjà téléchargé
    if os.path.exists(html_path) and os.path.exists(meta_path):
        return

    async with sem:
        html = None
        try:
            async with session.get(url) as r:
                if r.status == 200:
                    html = await r.text()
        except:
            pass

    if not html:
        SKIPPED_TUTOS.append({"url": url, "slug": slug, "reason": "download_failed"})
        return

    soup = BeautifulSoup(html, "html.parser")
    categories = extract_categories_from_soup(soup)

    # Filtre low-tech = si TOUTES les catégories sont bannies
    if is_banned_only_categories(categories):
        SKIPPED_TUTOS.append({
            "url": url,
            "slug": slug,
            "categories": categories,
            "reason": "categories_banned_only",
        })
        return

    # Sauvegarder HTML
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)

   


# ======================================================================
#                          PIPELINE PRINCIPAL
# ======================================================================

async def run_async():
    global SKIPPED_TUTOS

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    sem = asyncio.Semaphore(MAX_CONCURRENCY)
    site = SITE_WIKIFAB

    async with aiohttp.ClientSession(headers=HEADERS) as session:
        links = await extract_links_with_playwright(site)

        if site["max_items"]:
            links = links[:site["max_items"]]

        out_dir = os.path.join(OUTPUT_DIR, site["name"])

        await asyncio.gather(*[
            scrape_tutorial_page(session, site, url, out_dir, sem)
            for url in links
        ])

    skipped_path = os.path.join(OUTPUT_DIR, "wikifab_skipped.json")
    with open(skipped_path, "w", encoding="utf-8") as f:
        json.dump(SKIPPED_TUTOS, f, ensure_ascii=False, indent=2)

    print("\n✅ Scraping terminé")
    print("Tutos ignorés enregistrés dans :", skipped_path)


def main():
    asyncio.run(run_async())


if __name__ == "__main__":
    main()

# scraper_async_fixed.py
import os, asyncio, time
from urllib.parse import urljoin, unquote, urlsplit, urlunsplit

import aiohttp
from aiohttp import ClientSession, ClientTimeout
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

# ============= CONFIG MULTI-SITES =============
SITES = [
    {
        "name": "lowtechlab",
        "base": "https://wiki.lowtechlab.org/wiki/",
        "list_url": "https://wiki.lowtechlab.org/wiki/Explore",
        "link_selector": "div.project-card a[href^='/wiki/']",
        "href_attr": "href",
        "min_links": 5,
        "fallback_selector": "div.project-card a[href^='/wiki/'] img",
        "use_playwright": True,          # 🔁 on passe en mode dynamique
        "load_more_selector": "div.load-more",   # 🔘 bouton "Load more"
        "max_items": 200,
    },
    {
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
    },
]


OUTPUT_DIR = "../pages_html"
HEADERS = {"User-Agent": "MakerLensAsync/1.0 (+https://github.com/divinebanon1-art/Scraping_part)"}
MAX_CONCURRENCY = 15
RETRIES = 3
RETRY_SLEEP = 1.2
REQUEST_TIMEOUT = 25


# ============= UTILS =============
def safe_name(s: str) -> str:
    return "".join(c if c.isalnum() or c in ("-", "_", ".") else "_" for c in s)

def normalize_url(u: str) -> str:
    parts = list(urlsplit(u)); parts[3] = ""; parts[4] = "";
    return urlunsplit(parts)

def make_images_clickable_no_dupes(soup: BeautifulSoup, base_for_images: str):
    imgs = soup.find_all("img")
    seen = set()
    for img in imgs:
        raw = img.get("srcset") or ""
        if isinstance(raw, str):
            raw = raw.strip()
        else:
            raw = ""
            
        if raw:
            src = raw.split(",")[0].strip().split(" ")[0]
        else:
            data_src = img.get("data-src") or ""
            img_src = img.get("src") or ""
            src = str(data_src or img_src).strip()
            
        if not src:
            continue

        img_url = urljoin(base_for_images, src)
        norm_url = normalize_url(img_url)

        if norm_url in seen:
            if img.parent and img.parent.name == "a" and len(img.parent.contents) == 1:
                img.parent.decompose()
            else:
                img.decompose()
            continue
        seen.add(norm_url)

        img["src"] = norm_url
        parent = img.parent
        if parent and parent.name == "a" and parent.get("href"):
            parent["href"] = norm_url
            parent["target"] = "_blank"
            parent["rel"] = "noopener noreferrer"
        else:
            a = soup.new_tag("a", href=norm_url, target="_blank", rel="noopener noreferrer")
            img.replace_with(a); a.append(img)

# ============= HTTP (async) =============
async def fetch_text(session: ClientSession, url: str, *, tries: int = RETRIES) -> str | None:
    for i in range(tries):
        try:
            async with session.get(url) as resp:
                if resp.status == 200:
                    return await resp.text()
                print(f"[{i+1}/{tries}] HTTP {resp.status} -> {url}")
        except Exception as e:
            print(f"[{i+1}/{tries}] ERR {e} -> {url}")
        await asyncio.sleep(RETRY_SLEEP)
    return None

# ============= EXTRACTION LIENS AVEC PLAYWRIGHT =============
async def extract_links_with_playwright(site: dict) -> list[str]:
    print(f"🧭 Mode Playwright pour {site['name']} (JS + DOM final)")
    links = []

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context()
            page = await context.new_page()
            
            print(f"   🌍 Chargement de {site['list_url']}")
            await page.goto(site["list_url"], wait_until="networkidle")

            # Gestion éventuelle d’un bouton "Voir plus"
            if site.get("load_more_selector"):
                clicks_count = 0
                max_clicks = 20
                
                while clicks_count < max_clicks:
                    try:
                        load_more = page.locator(site["load_more_selector"])
                        if not await load_more.is_visible():
                            print(f"   ✅ Plus de bouton 'voir plus' après {clicks_count} clics")
                            break
                            
                        await load_more.click()
                        clicks_count += 1
                        print(f"   🔁 Clic {clicks_count} sur 'voir plus'...")
                        await page.wait_for_timeout(2000)
                    except Exception as e:
                        print(f"   ⚠️ Erreur clic {clicks_count}: {e}")
                        break

            html = await page.content()
            await context.close()
            await browser.close()
            
    except Exception as e:
        print(f"❌ Erreur Playwright: {e}")
        return []

    soup = BeautifulSoup(html, "html.parser")
    href_attr = site.get("href_attr", "href")

    for a in soup.select(site["link_selector"]):
        href = a.get(href_attr)
        if href:
            abs_url = urljoin(site["base"], str(href))
            links.append(abs_url)

    seen, uniq = set(), []
    for u in links:
        if u not in seen:
            seen.add(u)
            uniq.append(u)
    
    print(f"   📌 {len(uniq)} liens trouvés après expansion")
    return uniq


    # Parser le HTML avec BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")
    for a in soup.select(site["link_selector"]):
        href = a.get("href")
        if href:
            abs_url = urljoin(site["base"], str(href))
            links.append(abs_url)

    # D├®dup garde-ordre
    seen, uniq = set(), []
    for u in links:
        if u not in seen:
            seen.add(u); uniq.append(u)
    
    print(f"   ­ƒöù {len(uniq)} liens trouv├®s apr├¿s expansion")
    return uniq

# ============= EXTRACTION LIENS CLASSIQUE =============
def extract_links_from_html(html: str, site: dict) -> list[str]:
    soup = BeautifulSoup(html or "", "html.parser")
    links: list[str] = []

    for a in soup.select(site["link_selector"]):
        href = a.get(site["href_attr"])
        if not href:
            continue
        abs_url = urljoin(site["base"], str(href))
        links.append(abs_url)

    if len(links) < site.get("min_links", 0) and site.get("fallback_selector"):
        for img in soup.select(site["fallback_selector"]):
            a = img.find_parent("a")
            if not a:
                continue
            href = a.get("href")
            if href:
                abs_url = urljoin(site["base"], str(href))
                links.append(abs_url)

    seen, uniq = set(), []
    for u in links:
        if u not in seen:
            seen.add(u); uniq.append(u)
    return uniq

async def extract_links_for_site_html(session: ClientSession, site: dict) -> list[str]:
    html = await fetch_text(session, site["list_url"])
    if not html:
        print(f"ÔØî Liste introuvable: {site['list_url']}")
        return []
    return extract_links_from_html(html, site)

# ============= ROUTEUR D'EXTRACTION LIENS =============
async def extract_links_for_site(session: ClientSession, site: dict) -> list[str]:
    if site.get("use_playwright", False):
        return await extract_links_with_playwright(site)
    else:
        return await extract_links_for_site_html(session, site)

# ============= TRAITER UNE PAGE DE TUTO =============
async def scrape_tutorial_page(session: ClientSession, site: dict, url: str, out_dir: str, sem: asyncio.Semaphore):
    # 1) Calculer le slug à partir de l'URL
    slug_raw = unquote(url.rstrip("/").rsplit("/", 1)[-1]) or "index"
    slug = safe_name(slug_raw)

    # 2) Construire le chemin du fichier de sortie
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{slug}.html")

    # 3) Si le fichier existe déjà, on ne retélécharge pas
    if os.path.exists(out_path):
        print(f"   ↩️ déjà présent, skip : {out_path}")
        return

    # 4) Sinon, on télécharge la page normalement
    async with sem:
        html = await fetch_text(session, url)
    if not html:
        print(f"   -> ❌ page KO : {url}")
        return

    soup_page = BeautifulSoup(html, "html.parser")

    base_for_images = site["base"] if site["base"].endswith("/") else (site["base"] + "/")
    make_images_clickable_no_dupes(soup_page, base_for_images)

    # 5) Sauvegarde du HTML
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(str(soup_page))
    print(f"   ✅ {out_path}")


# ============= PIPELINE PRINCIPAL =============
async def run_async():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    timeout = ClientTimeout(total=REQUEST_TIMEOUT)
    connector = aiohttp.TCPConnector(limit=MAX_CONCURRENCY)
    sem = asyncio.Semaphore(MAX_CONCURRENCY)

    async with aiohttp.ClientSession(headers=HEADERS, timeout=timeout, connector=connector) as session:
        for site in SITES:
            print(f"\n=== {site['name']} ===")
            links = await extract_links_for_site(session, site)
            # Appliquer la limite PAR SITE
            max_items = site.get("max_items", None)
            if max_items is not None:
               links = links[:max_items]
            print(f"  ­ƒöù {len(links)} liens")

            if not links:
                print("  ÔÜá´©Å Aucun lien trouv├®, passage au site suivant")
                continue

            # Fichier de liens par site
            links_txt = os.path.join(OUTPUT_DIR, f"links_{site['name']}.txt")
            with open(links_txt, "w", encoding="utf-8") as f:
                for i, u in enumerate(links, 1):
                    f.write(f"{i}: {u}\n")

            site_pages_dir = os.path.join(OUTPUT_DIR, site["name"])

            tasks = [
                scrape_tutorial_page(session, site, url, site_pages_dir, sem)
                for url in links
            ]
            # T├®l├®charge les pages en parall├¿le
            await asyncio.gather(*tasks, return_exceptions=True)

    print("\n­ƒÄë Termin├® (async).")

def main():
    asyncio.run(run_async())

if __name__ == "__main__":
    main()

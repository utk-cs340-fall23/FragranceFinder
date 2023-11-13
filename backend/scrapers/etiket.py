import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import re
import json
import pandas as pd

def valid_float(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

def extract_price(string):
    match = re.search(r'\$\d+\.\d{2}', string)
    return match.group(0) if match else None


async def scrape_etiket(max_items):
    df = pd.DataFrame(columns=["brand", "title", "concentration", "gender", "size", "price", "link", "photoLink"])
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=False)
            page = await browser.new_page()
        
            await page.goto("https://etiket.ca/collections/fragrance")
            #await page.wait_for_selector("div.new-grid product-grid collection-grid boost-pfs-filter-products bc-al-style4")
        
            product_page = await browser.new_page()
            
            while df.shape[0] < max_items:
                catalog_content = await page.content()
                catalog = BeautifulSoup(catalog_content, "html.parser")
                
                products = catalog.find_all("a", class_="grid-item__link")
                #data_page = catalog.find("div", class_="pagination")
                #data_page = data_page.find("a", class_="btn btn--large btn--circle btn--icon")
                
                for product in products:
                    name = product.find("div", class_="grid-product__title")
                    brand = product.find("div", class_="grid-product__vendor").text.strip()
                    price = product.find("span", class_="grid-product__price--from")
                    link = "https://etiket.ca/"+product.get('href')
                    pic = product.find("img", class_="grid__image-contain lazyautosizes lazyloaded")
                
                
                    if name:
                        name = name.text.strip()
                    
                        if "edt" in name.lower():
                            cons = "EDT"
                        elif "eau de toilette" in name.lower():
                            cons = "EDT"
                        elif "edp" in name.lower():
                            cons = "EDP"
                        elif "eau de parfum" in name.lower():
                            cons = "EDP"
                        elif "extrait de parfum" in name.lower():
                            cons = "EDP"
                        else:
                            cons = None
                
                        if price:
                            price = extract_price(price.get_text(strip=True))
                        else:
                            price = None
                        
                        if pic:
                            pic = pic.get("srcset")
                        else:
                            pic = None
                
                        #print(pic)
                
                    df.loc[len(df)] = [brand, name, cons, "Unisex", 0.0, price, link, pic]
                
                
        
        
    finally:
        print(df)
        return df.to_json(orient="records")

if __name__ == "__main__":
    asyncio.run(scrape_etiket(10))
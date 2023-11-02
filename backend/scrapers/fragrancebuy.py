# fragrancebuy.ca scraper
import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import re
import json
import pandas as pd

async def scrape_fragbuy(max_items):
    all_fragrances = []

    df = pd.DataFrame(columns=["brand", "title", "concentration", "gender", "size", "price", "link", "photoLink"])    

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless = False)
            page = await browser.new_page()

            await page.goto('https://fragrancebuy.ca/collections/fullproductcatalogue?page=5&category_id=26315008')
            #await page.wait_for_timeout(25000)
            await page.wait_for_selector('div#products-grid.products-grid.fs-result-page-158897m')
            #await page.wait_for_selector('div', id='products-grid')
            print("Starting scroll!")
            async def scroll_down():
                for _ in range(15):
                    await page.evaluate('window.scrollBy(0,2000);')
                    await page.wait_for_timeout(1000)

            #await scroll_down()

            # FragranceBuy uses Shadow DOM meaning we need playwright to get the innerHtml and then parse it with BS4
            async def get_catalog_content():
                catalog_page = await page.evaluate('''() => {
                    shadowroot = document.querySelector("#fast-simon-serp-app").shadowRoot.querySelector("#products-grid");
                    return shadowroot.innerHTML;
                }''')
                print("catalog page shadowrooted")
                return catalog_page
            
            catalog_content = await get_catalog_content()
            if (catalog_content): print("catalog content found")
            else: print("No catalog contents!")

            #while df.shape[0] < max_items:
            #catalog_content = await page.content()
            catalog = BeautifulSoup(catalog_content, 'html.parser')

            products = catalog.find_all('div', class_="product-card fs-results-product-card fs-product-card fs-result-page-13alr9n product-card-border fs-product-has-compare-price" )

            if products:
                print("Found product grid")
            else:
                print("no products found")

            for product in products: 

                link = product.find('a', class_="fs-product-main-image-wrapper")
                if link: 
                    link = 'https://fragrancebuy.ca' + link.get('href')
                    print(link)
                else:
                    print("No link")
                    link = None
                
                photoLink = product.find('img', class_="image fs-result-page-4kuhex")
                if photoLink: 
                    photoLink = photoLink.get('src')
                    print(photoLink)
                else: 
                    print("No photolink")
                    photoLink = None

                brand = product.find('div', class_='vendor fs-product-vendor fs-result-page-1gfa8bs')
                if brand: 
                    brand = brand.text.strip()
                    print(brand)
                else: 
                    print("No brand")
                    brand = None

                title = product.find('span', class_='title fs-product-title fs-result-page-mihllj')
                gender = None
                if title:
                    title = title.text
                    print("title before strip")
                    print(title)

                    # Gender
                    if re.search(r"For Man/Woman", title, re.IGNORECASE):
                        gender = "Unisex"
                    elif re.search(r"For Man", title, re.IGNORECASE):
                        gender = "Male"
                    elif re.search(r"For Woman", title, re.IGNORECASE):
                        gender = "Female"
                    else:
                        gender = None
                    
                    print(f"Gender: {gender}")

                    title = re.sub(r"For Man/Woman|For Man|For Woman", '', title, re.IGNORECASE)
                    title = re.sub(rf"{brand}|By {brand}", '', title, re.IGNORECASE)
                    title = title.strip()
                    print(f"Title after strip: {title}")

                else:
                    print("No title")
                    title = None

                price = product.find('div', class_="price fs-result-page-3sdl0h")
                if price:
                    price = (price.text.strip().split())[0]
                    print(price)
                else: 
                    print("No price")
                    price = None

                print("______________")

                concentration = None
                size = None
                df.loc[len(df)] = [brand, title, concentration, gender, size, price, link, photoLink]


        await browser.close()

    finally:
        df.to_json('data/fragBuy.json', orient='records')
        return df.to_json(orient="records")


if __name__ == "__main__":
    asyncio.run(scrape_fragbuy(1))
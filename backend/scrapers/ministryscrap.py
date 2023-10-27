from playwright.async_api import async_playwright
import asyncio
from bs4 import BeautifulSoup
import re
import pandas as pd


async def scrape_ministry():
    async with async_playwright() as p:
            try:
                df = pd.DataFrame(columns=["brand", "title", "concentration", "gender", "size", "price", "link", "photoLink"])
                fragrance_list = []
                browser = await p.chromium.launch(headless=False)
                page = await browser.new_page()

                await page.goto('https://ministryofscent.com/collections/all-brands-1')
                await page.wait_for_timeout(1000)
                async def scroll_down():
                    for _ in range(12):
                        await page.evaluate('window.scrollBy(0,600);')
                        await page.wait_for_timeout(1000)
                await scroll_down()
                page_content = await page.content()
                soup = BeautifulSoup(page_content, 'html.parser')
                brands = soup.find_all('div', class_='grid__item small--one-half medium-up--one-third')
                
                for brand in brands:
                    brandlink = brand.find('a')
                    brandlink = brandlink.get('href')
                    brandlink = "https://ministryofscent.com" + brandlink
                    
                    await page.goto(brandlink)
                    #brandName = soup.find('h1', class_='section-header__title')
                    async def scroll_down():
                        for _ in range(15):
                            await page.evaluate('window.scrollBy(0,800);')
                            await page.wait_for_timeout(100)
                    await scroll_down()
                    await page.wait_for_selector('div.collection-grid__wrapper')
                    page_content = await page.content()
                    soup = BeautifulSoup(page_content, 'html.parser') 
                    products = soup.find_all('div', class_='grid-product__content')

                    for product in products:
                        fragrance = {}
                        prodlink = product.find('a')
                        prodlink = prodlink.get('href')
                        prodlink = "https://ministryofscent.com" + prodlink
                        #print(prodlink)
                        #df = pd.DataFrame(columns=["brand", "title", "concentration", "gender", "size", "price", "link", "photoLink"])
                        await page.goto(prodlink)
                        page_content = await page.content()
                        soup = BeautifulSoup(page_content, 'html.parser')
                        prodinfo = soup.find('div', class_='grid__item medium-up--one-half')
                        brandTop = prodinfo.find('div',class_='product-single__vendor')
                        brandTop = brandTop.text.strip()
                        gender = 'N/A'
                        brandName = str(brandTop)
                        #print(brandName)

                        prodName = prodinfo.find('h1',class_='h2 product-single__title')
                        prodName = prodName.text.strip()
                        #print(prodName)

                        prodPrice = prodinfo.find('span',class_='product__price')
                        prodPrice = prodPrice.text.strip()
                        price_float = float(prodPrice[1:])
                        #print(price_float)

                        sizeNcon = prodinfo.find('div', class_='variant-input')
                        size = 'N/A'
                        concentration = 'N/A'
                        if sizeNcon:
                            sizeNcon =  sizeNcon.text.strip()
                            if '100ml' in sizeNcon:
                                size = '100 ml'
                            elif '50ml' in sizeNcon:
                                size = '50 ml'
                            if 'Eau de Parfum' in sizeNcon:
                                concentration = 'EDP' 
                            elif 'Eau de Toilette' in sizeNcon:
                                concentration = 'EDT'
                            elif 'Extrait de Parfum':
                                concentration ='Parfum'
                        else:
                            sizeNcon = 'N/A'
                        #print(size)
                        #print(concentration)
                        split_size = size.split()
                        if (len(split_size) >= 2):
                            if (split_size[1] == "oz"):
                                sizeoz = float(split_size[0])
                                fragrance["sizeoz"] = sizeoz
                                            # ml = oz * 29.5735
                                            # Ml stored with no decimals places
                                fragrance["sizeml"] = float(int(sizeoz * 29.5736))

                            elif (split_size[1] == "ml"):
                                sizeml = float(split_size[0])
                                fragrance["sizeml"] = sizeml
                            #    print(sizeml)
                                            # oz = ml * 0.033814
                                            # Oz stored to 2 decimal places
                                fragrance["sizeoz"] = round(sizeml * 0.033814, 2)
                            else:
                                fragrance["sizeoz"] = None
                                fragrance["sizeml"] = None
                        else:
                            fragrance["sizeoz"] = None
                            fragrance["sizeml"] = None
                        photo = soup.find('img', class_='lazyautosizes lazyloaded')
                        photo = photo.get('srcset')
                        photo = photo.split()
                        photolink = photo[0]
                        if photolink:
                            fragrance['photoLink'] = photolink
                        fragrance["concentration"] = concentration
                        fragrance["price"] = price_float
                        fragrance["gender"] = gender
                        fragrance['link'] = prodlink
                        fragrance['brand'] = brandName
                        fragrance['title'] = prodName

                        fragrance_list.append(fragrance)
                        df.loc[len(df)] = [brandName, prodName, concentration, gender, size, prodPrice, prodlink, photolink] 
            finally:
                """for fragrance in all_fragrances:
                    print(f"Photo Link: {fragrance['photoLink']}")
                    print(f"Brand: {fragrance['brand']}")
                    print(f"Title: {fragrance['title']}")
                    print(f"Concentration: {fragrance['concentration']}")
                    print(f"Sizeoz {fragrance['sizeoz']}")
                    print(f"Sizeml: {fragrance['sizeml']}")
                    print(f"Price: {fragrance['price']}")
                    print(f"Gender: {fragrance['gender']}")
                    print(f"Link: {fragrance['link']}")
                    print("-----")"""
                #return df.to_json(orient="records")

                
if __name__ == "__main__":
    asyncio.run(scrape_ministry())
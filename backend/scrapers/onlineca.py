from playwright.async_api import async_playwright
import asyncio
from bs4 import BeautifulSoup
import re
import json
import pandas as pd

async def scrape_onlineca():
    async with async_playwright() as p:
        ## try:
            df = pd.DataFrame(columns=["brand", "title", "concentration", "gender", "size", "price", "link", "photoLink"])
            fragrance_list = []
            fragrance = {}
            browser = await p.chromium.launch(headless=False)
            page = await browser.new_page() 

            await page.goto('https://perfumeonline.ca/collections/new-arrivals')
            await page.wait_for_timeout(1000)
            async def scroll_down():
                for _ in range(12):
                    await page.evaluate('window.scrollBy(0,600);')
                    await page.wait_for_timeout(1000)
            
            ##await page.wait_for_selector('ul.collection-nav')
            page_content = await page.content()
            soup = BeautifulSoup(page_content, 'html.parser')
            brands = soup.find_all('li', class_='sidebar-link-lv1')
            for brand in brands:
                 brandName = brand.find('span')
                 brandName = brand.text.strip()
                 if 'arrivals' not in brandName:
                      if 'seller' not in brandName:
                           if 'sales' not in brandName:
                                if '$' not in brandName:
                                    #print(brandName)
                                    brandlink = brand.find('a')
                                    brandlink = brandlink.get('href')
                                    brandlink = 'https://perfumeonline.ca'+brandlink
                                    await page.goto(brandlink)
                                    page_content = await page.content()
                                    soup = BeautifulSoup(page_content, 'html.parser') 
                                    products = soup.find('div',class_='collection__products')
                                    prods = soup.find_all('div',class_='grid-item grid-item-border col-6 col-md-4 col-lg-3')

                                    for product in prods:
                                        prodlink = product.find('a')
                                        prodlink = prodlink.get('href')
                                        prodlink = 'https://perfumeonline.ca'+prodlink
                                        #print(prodlink)
                                        await page.goto(prodlink)
                                        page_content = await page.content()
                                        soup = BeautifulSoup(page_content, 'html.parser')
                                        prodTitle = soup.find('h1',class_='product-title')
                                        prodName = prodTitle.find('span')
                                        prodName = prodName.text.strip()
                                        gender = prodTitle.find('span',class_='product-type')
                                        #print(gender)
                                         
                                        if soup.find('span',class_='price on-sale'):
                                            price = soup.find('span',class_='price on-sale')
                                        else:
                                            price = soup.find('div',class_='prices')
                                        price = price.text.strip()
                                        pricesplit = price.split()
                                        price = pricesplit[0]
                                        price = float(price[1:])
                                        #print(price)
                                        if len(pricesplit)>2:
                                             price1 = pricesplit[0]
                                             price2 = pricesplit[2]
                                             #print(price1)
                                             #print(price2)
                                             price1 = float(price1[1:])
                                             price2 = float(price2[1:])
                                             if price1 < price2:
                                                  price = price1
                                             else:
                                                  price = price2
                                        price = price * 0.72
                                        #print(prodName)
                                        #print(price)

                                        sizeNcon = soup.find('div',class_='swatch-element')
                                        if sizeNcon:
                                            sizeNcon = sizeNcon.text.strip()
                                            sizeNcon = sizeNcon.split()
                                            size = sizeNcon[0]
                                            concentration = sizeNcon[1]
                                            #print(size)
                                            #print(concentration)
                                            if 'Eau de Parfum' in concentration:
                                                 concentration = 'EDP'
                                            elif 'Eau de Toilette' in concentration:
                                                 concentration = 'EDT'
                                            elif 'Extrait de Parfum' in concentration:
                                                 concentration = 'Parfum'
                                        photolink = soup.find('div',class_='halo-product-content')
                                        photolink = photolink.find('img')
                                        photolink = photolink.get('src')
                                        print(photolink)
                                        fragrance["sizeoz"] = size
                                        fragrance['photoLink'] = photolink
                                        fragrance["concentration"] = concentration
                                        fragrance["price"] = price
                                        fragrance["gender"] = gender
                                        fragrance['link'] = prodlink
                                        fragrance['brand'] = brandName
                                        fragrance['title'] = prodName

                                        #print(sizeNcon)
if __name__ == "__main__":
    asyncio.run(scrape_onlineca())
        ## finally:
# fragrancebuy.ca scraper
import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import re
import json
import pandas as pd

async def scrape_fragbuy(max_items):

    df = pd.DataFrame(columns=["brand", "title", "concentration", "gender", "size", "price", "link", "photoLink"])    

    try:
        async with async_playwright() as p:

            browser = await p.chromium.launch(headless = False)
            page = await browser.new_page()
            frag_page = await browser.new_page()

            fragranceCounter = 0

            for cur_page in range(96):
                if fragranceCounter >= max_items:
                    break

                if (cur_page == 0):
                    await page.goto('https://fragrancebuy.ca/collections/fullproductcatalogue')
                else:
                    page.close()
                    page = await browser.new_page()
                    await page.goto(f'https://fragrancebuy.ca/collections/fullproductcatalogue?page={(cur_page+1)}')

                await page.wait_for_selector('div.collection_page.col-xs-12')
                catalog_content = await page.content()

                catalog = BeautifulSoup(catalog_content, 'html.parser')

                products = catalog.find_all('div', class_="col-xs-12 col-lg-3 col-md-3 col-sm-3 product_thumbnail" )

                for product in products: 
                    if fragranceCounter >= max_items:
                        break

                    link = product.find('a', class_="thumbnail_image")
                    if link: 
                        fragranceCounter += 1
    
                        link = 'https://fragrancebuy.ca' + link.get('href')
                        await frag_page.goto(link)
                        
                        fragrance = await frag_page.content()
                        fragrance = BeautifulSoup(fragrance, 'html.parser')

                        await frag_page.close()
                        frag_page = await browser.new_page()

                        product_dropdown = fragrance.find('ul', class_='isp_product_dropdown')
                        if (product_dropdown):
                            product_dropdown_li = product_dropdown.find_next('li')
                            if (product_dropdown_li):
                                product_dropdown_a = product_dropdown_li.find('a')

                                if (product_dropdown_a):
                                    dropdownText = product_dropdown_a.text.strip()
                                    size_pattern = r'(\d+\s*(ml|oz))'
                                    concent_pattern = r'\b(EDP|EDT)\b'

                                    size_match = re.search(size_pattern, dropdownText, re.IGNORECASE)
                                    if (size_match):
                                        size = size_match.group(1) 
                                        size = re.sub(r'(?<=[0-9])oz', ' oz', size)
                                        size = re.sub(r'(?<=[0-9])ml', ' ml', size)

                                        #print(f"Size: {size}")
                                        concent_match = re.search(concent_pattern, dropdownText, re.IGNORECASE)


                                        if (concent_match):
                                            concentration = concent_match.group(1).upper()
                                        else:
                                            concentration = "Perfume"
                                        #print(f"Concentration: {concentration}")
                                    else:
                                        size = None
                                        concentration = None
                                else:
                                    size = None
                                    concentration = None

                            else:
                                size = None
                                concentration = None
                        else:
                            size = None 
                            concentration = None
                        #print(link)
                    else:
                        #print("No link")
                        link = None
                        size = None
                    
                    photoLink = product.find('img', class_='img-responsive')
                    if photoLink: 
                        photoLink = "https:" + photoLink.get('src').strip()
                        #print(photoLink)
                    else: 
                        #print("No photolink")
                        photoLink = None

                    brand = product.find('em', class_='vendor_italic')
                    if brand: 
                        brand = brand.text.strip()
                        #print(brand)
                    else: 
                        #print("No brand")
                        brand = None

                    title = product.find('span', class_='title')
                    gender = None
                    if title:
                        title = title.text
                        #print("title before strip")
                        #print(title)

                        # Gender
                        if re.search(r"For Man/Woman", title, re.IGNORECASE):
                            gender = "Unisex"
                        elif re.search(r"For Man", title, re.IGNORECASE):
                            gender = "Male"
                        elif re.search(r"For Woman", title, re.IGNORECASE):
                            gender = "Female"
                        else:
                            gender = None
                        
                        #print(f"Gender: {gender}")

                        title = re.sub(r"For Man/Woman|For Man|For Woman", '', title, re.IGNORECASE)
                        title = re.sub(rf"{brand}|By {brand}", '', title, re.IGNORECASE)
                        title = title.strip()
                        #print(f"Title after strip: {title}")

                    else:
                        #print("No title")
                        title = None

                    price = product.find('span', class_='sale_price_thumbnail')
                    if price:
                        price = price.find('span', class_='money')
                        price = (price.text.strip().split())[0]
                        #print(price)
                    else: 
                        #print("No price")
                        price = None

                    #concentration = None
                    #size = None 

                    df.loc[len(df)] = [brand, title, concentration, gender, size, price, link, photoLink]


        await browser.close()

    finally:
        df.to_json('data/fragBuy.json', orient='records')
        return df.to_json(orient="records")


if __name__ == "__main__":
    asyncio.run(scrape_fragbuy(3))


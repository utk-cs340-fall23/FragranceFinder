# Maxaroma Webscraper
import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import re
import json
#import atexit

all_fragrances = []

"""def print_fragrances():
    for fragrance in all_fragrances:
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

async def scrape_maxaroma():
    try: 
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless = False)
            page = await browser.new_page()

            # Max aroma best sellers list
            await page.goto('https://www.maxaroma.com/new-arrivals/p4u/special-na/view#&special-ts')

            await page.wait_for_selector('ul.listing_grid')

            # We need to open a separate page because for this website we must go to each individual fragrance page
            # So 1 page for the catalog of fragrances, and 1 page that goes to individual fragrance pages
            product_page = await browser.new_page()

            # Prints the current list of fragrances, even if exiting early
            #atexit.register(print_fragrances)
            while True:
                catalog_content = await page.content()
                catalog = BeautifulSoup(catalog_content, 'html.parser')
                #await page.wait_for_timeout(7000)
                #await page.mouse.click(0,0)
                #await page.click('div#list-more.pb-2')
            
                products = catalog.find_all('div', class_='product') 
                data_page = catalog.find('div', class_='pb-2', id='list-more')
                data_page = data_page.find('a', class_='list-more d-block')
                data_page = int(data_page['data-page'])
                if (data_page >= 365):
                    print(f"Data Page Num: {data_page}")
                    break
                print(f"Data Page: {data_page}")
                # Wait 7 seconds then click top left corner to close popup ad
                if data_page == 1:
                    await page.wait_for_timeout(7000)
                    await page.mouse.click(0,0)
            
                await page.click('div#list-more.pb-2') 
                # We have 25 products per data_page, page 1 = 0-24, page 2 = 25-49, etc...
                start_index = (data_page - 1) * 25
                for product in products[start_index:]:

                    fragrance = {}
                    link = product.find('a')

                    if link:
                        link = link.get('href')
                        await product_page.goto(link)
                        product_content = await product_page.content()
                        product_parser = BeautifulSoup(product_content, 'html.parser')

                        # name_div contains both the brand and the name of the fragrance
                        name_div = product_parser.find('div', class_='dtl_name asa')
                        brand = name_div.find('h1').get_text()
                        name = next(name_div.find('div').stripped_strings)

                        concentration = product_parser.find('small',class_='vtype').text.strip()

                        # table_div contains size and gender
                        table_div = product_parser.find('div', class_='pb15')
                        size_row = table_div.find('th', string='Size:')
                        #th Size->td->div->size
                        size = size_row.find_next('td').find('div').text.strip()
                        gender_row = table_div.find('th', string='Gender:')

                        gender = gender_row.find_next('td').find('span').text.strip()


                        price_div = product_parser.find('div',class_='dtl_salestext')

                        # Gets a link to the product image 
                        photoLink = product_parser.find('img', class_='product-img')
                        photoLink = photoLink.get('src') if photoLink else None
                        if photoLink: fragrance['photoLink'] = photoLink
                        else: fragrance['photoLink'] = None
                        # The product will either be on sale or it won't be.
                        # If it is on sale, class pdetail_dealprice prodprice replaces the original price
                        # It also may contain "DEAL: " so we must .find('strong') to just get the price we want
                        if (price_div.find('span', class_='pdetail_dealprice prodprice')):
                            price = price_div.find('span', class_='pdetail_dealprice prodprice').find('strong').text.strip()
                            # $ removed from string and price stored as float
                            price_float = float(price[1:])
                        elif (price_div.find('strong', class_='prodprice')):
                            price = price_div.find('strong', class_='prodprice').text.strip()
                            price_float = float(price[1:])

                        if not brand:
                            brand = None
                        if not name:
                            name = None
                        if not concentration:
                            concentration = None
                        else: # Standardization of data for databasing
                            if concentration.lower() == "eau de toilette" or concentration.lower() == "edt":
                                concentration = "EDT"
                            elif concentration.lower() == "eau de parfum" or concentration.lower() == "edp":
                                concentration = "EDP"
                            elif concentration.lower() == "parfum" or concentration.lower() == "extrait de parfum":
                                concentration = "Parfum"
                        if not size:
                            size = None
                        else:
                            size = size.lower()
                            
                            # If there is no space between the number and the size specifier one is added
                            # 3.4oz becomes 3.4 oz
                            size = re.sub(r'(?<=[0-9])oz', ' oz', size)
                            size = re.sub(r'(?<=[0-9])ml', ' ml', size)
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
                                    # oz = ml * 0.033814
                                    # Oz stored to 2 decimal places
                                    fragrance["sizeoz"] = round(sizeml * 0.033814, 2)
                                else:
                                    fragrance["sizeoz"] = None
                                    fragrance["sizeml"] = None
                            else:
                                fragrance["sizeoz"] = None
                                fragrance["sizeml"] = None


                        if not price:
                            price = None
                        if not gender:
                            gender = None
                        else:
                            if gender == "Men":
                                gender = "Male"
                            elif gender == "Women":
                                gender = "Female"
                            else:
                                gender = "Unisex"

                        fragrance["brand"] = brand
                        fragrance["title"] = name
                        fragrance["concentration"] = concentration
                        fragrance["price"] = price_float
                        fragrance["gender"] = gender
                        fragrance["link"] = link

                        all_fragrances.append(fragrance)
                        # Prints the current list of fragrances, even if exiting early

            await browser.close()
    finally:
            for fragrance in all_fragrances:
                print(f"Photo Link: {fragrance['photoLink']}")
                print(f"Brand: {fragrance['brand']}")
                print(f"Title: {fragrance['title']}")
                print(f"Concentration: {fragrance['concentration']}")
                print(f"Sizeoz {fragrance['sizeoz']}")
                print(f"Sizeml: {fragrance['sizeml']}")
                print(f"Price: {fragrance['price']}")
                print(f"Gender: {fragrance['gender']}")
                print(f"Link: {fragrance['link']}")
                print("-----")

            

if __name__ == "__main__":
    asyncio.run(scrape_maxaroma())
# Maxaroma Webscraper
import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import re

async def scrape_maxaroma():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless = False)
        page = await browser.new_page()

        # Max aroma best sellers list
        await page.goto('https://www.maxaroma.com/new-arrivals/p4u/special-na/view#&special-ts')

        await page.wait_for_selector('ul.listing_grid')

        catalog_content = await page.content()
        catalog = BeautifulSoup(catalog_content, 'html.parser')
        products = catalog.find_all('div', class_='product')

        # We need to open a separate page because for this website we must go to each individual fragrance page
        # So 1 page for the catalog of fragrances, and 1 page that goes to each fragrance page
        product_page = await browser.new_page()

        for product in products:

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
                # The product will either be on sale or it won't be.
                # If it is on sale, class pdetail_dealprice prodprice replaces the original price
                # It also may contain "DEAL: " so we must .find('strong') to just get the price we want
                if (price_div.find('span', class_='pdetail_dealprice prodprice')):
                    price = price_div.find('span', class_='pdetail_dealprice prodprice').find('strong').text.strip()
                elif (price_div.find('strong', class_='prodprice')):
                    price = price_div.find('strong', class_='prodprice').text.strip()

                if not brand:
                    brand = "N/A"
                if not name:
                    name = "N/A"
                if not concentration:
                    concentration = "N/A"
                else: # Standardization of data for databasing
                    if concentration.lower() == "eau de toilette" or concentration.lower() == "edt":
                        concentration = "EDT"
                    elif concentration.lower() == "eau de parfum" or concentration.lower() == "edp":
                        concentration = "EDP"
                    elif concentration.lower() == "parfum" or concentration.lower() == "extrait de parfum":
                        concentration = "Parfum"
                if not size:
                    size = "N/A"
                else:
                    size = size.lower()

                if not price:
                    price = "N/A"
                if not gender:
                    gender = "N/A"
                else:
                    if gender == "Men":
                        gender = "Male"
                    elif gender == "Women":
                        gender = "Female"
                    else:
                        gender = "Unisex"

                print(f"Brand: {brand}")
                print(f"Product Name: {name}")
                print(f"Concentration: {concentration}")    
                print(f"Price: {price}")
                print(f"Size: {size}")
                print(f"Gender: {gender}")
                print(f"Link: {link}")
                print("__________")

        await browser.close()
if __name__ == "__main__":
    asyncio.run(scrape_maxaroma())
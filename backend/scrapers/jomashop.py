# Jomashop Web Scraper
import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import re
import pandas as pd


def extract_price(string):
    match = re.search(r'\$\d+\.\d{2}', string)
    return match.group(0) if match else None


async def scrape_jomashop(max_items):
    df = pd.DataFrame(columns=["brand", "title", "concentration", "gender", "size", "price", "link", "photoLink"])
    try:
        async with async_playwright() as p:

            data_list = []
            browser = await p.chromium.launch(headless = False)
            page = await browser.new_page()

            await page.goto('https://jomashop.com/fragrances.html')
            await page.wait_for_timeout(1000)

            # Jomashop dynamically loads the page content so we must scroll
            # in order for the entire page to load
            async def scroll_down():
                for _ in range(12):
                    await page.evaluate('window.scrollBy(0,600);')
                    await page.wait_for_timeout(1000)

            await scroll_down()

            await page.wait_for_selector('li.productItem')
            page_content = await page.content()
            # Parse the HTML content using BeautifulSoup
            soup = BeautifulSoup(page_content, 'html.parser')

            product_items = soup.find_all('li', class_='productItem')[:max_items]
            for product_item in product_items:
                brand = product_item.find('span',class_='brand-name')
                name = product_item.find('span', class_='name-out-brand')
                price = product_item.find('div', class_='now-price')
                link = product_item.find('a', class_='productName-link')
                photoLink = product_item.find('img', class_='productImg')
                photoLink = photoLink.get('src') if photoLink else None
                gender = ""
                size = ""
                concentration = ""
                formattedName = ""

                if brand:
                    brand = brand.text.strip()
                else:
                    brand = "N/A"

                if name:
                    name = name.text.strip()
                    # Fragrance Gender Keywords
                    if "Men's" in name:
                        gender = "Male"
                    elif "Men" in name:
                        gender = "Male"
                    elif "(m)" in name:
                        gender = "Male"
                    elif "Ladies" in name:
                        gender = "Female"
                    elif "Women" in name:
                        gender = "Female"
                    elif "(f)" in name:
                        gender = "Female"
                    else:
                        gender = "Unisex"

                    # Bottle Size Formatting
                    if "oz" in name:
                        # Regular expression pattern
                        # Digit followed by an optional .digit then oz
                        pattern = r'(\d+(\.\d+)?)\s*(oz)'
                        match = re.search(pattern, name)
                        if match:
                            size = f"{match.group(1)} oz"
                        else:
                            size = "N/A"
                    else:
                        size = "N/A"

                    # Fragrance Concentration Parsing
                    # Jomashop does not have any standardization
                    # So many keywords must be checked
                    if "edt" in name.lower():
                        concentration = "EDT"
                    elif "eau de toilette" in name.lower():
                        concentration = "EDT"
                    elif "edp" in name.lower():
                        concentration = "EDP"
                    elif "eau de parfum" in name.lower():
                        concentration = "EDP"
                    elif "parfum" in name.lower():
                        concentration = "Parfum"
                    else:
                        concentration = "N/A"
                    name_words = name.split()
                    for i, word in enumerate(name_words):

                        # We skip the gender and brand when storing the fragrance name
                        if word == brand or word == "Men's" or word == "Ladies" or word == "Unisex" or word == "-":
                            continue
                        # All keywords that indicate the name of the fragrance name has finished
                        elif re.match(r'.*(edp|edt|eau|parfum|perfume|/)$', word.lower()) or i == len(name_words):
                            break # Fragrance Concentration means we have finished storing the name
                        # by can be used to indicate a fragrance by a brand,
                        # or may be the actual title of a fragrance
                        elif re.match(r'.*(by|for)$', word.lower()) and i < len(name_words) - 1:
                            if name_words[i+1] == brand:
                                break
                            if name_words[i+1] == "Men" or name_words[i+1] == "Women":
                                break
                        else:
                            if formattedName:
                                formattedName += " "
                            formattedName += word



                else:
                    name = "N/A"
                    size = "N/A"
                    gender = "N/A"
                    concentration = "N/A"
                    formattedName = "N/A"

                if price:
                    price = extract_price(price.get_text(strip=True))
                else:
                    price = None

                if link:
                    link = link.get('href')
                    link = "https://www.jomashop.com" + link
                else:
                    link = "N/A"

                #print("Brand:", brand)
                #print("Name:", name)
                #print("FormatName:", formattedName)
                #print("Concentration:", concentration)
                #print("Price:", price)
                #print("Gender:", gender)
                #print("Size:", size)
                #print("Link:",link)
                #print("-" * 30)

                #["brand", "title", "concentration", "gender", "size", "price", "link"]

                df.loc[len(df)] = [brand, formattedName, concentration, gender, size, price, link, photoLink]
    finally:
        return df.to_json(orient="records")
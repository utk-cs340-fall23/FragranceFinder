# Kien Nguyen
# Last updated: 10-25-23
import asyncio
import re
import os
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import pandas as pd

# The base URL of the website
baseurl = "https://www.fragrancenet.com/"
# The number of pages to scrape
num_pages = 1

# List of brand names to ignore in product names
brand_names = ["Dolce & Gabbana", "Gianni Versace"]  # Add more brand names as needed

# playing with getting the pricing after clicking on each button (to see real pricing)
async def get_prices(page):
    prices = {}

    # Extract and split the box IDs
    variant_text = await page.locator('.variantText.solo').all()
    index = 0
    for element in variant_text:
        await element.click()
        # Extract the HTML content of the product page
        product_page_data = await page.content()
        # Parse the product page using BeautifulSoup
        product_soup = BeautifulSoup(product_page_data, 'html.parser')
        pricing_element = product_soup.find('span', class_='pwcprice')
        # Get the price from the data-price attribute
        # Extract the pricing text and data-price attribute
        price = pricing_element.get('data-price')
        prices[index] = price
        index += 1
        #prices[box_id] = price
    return prices

async def get_product_info(browser, df, brand, name, concentration, gender, link, photoLink):
    # Extract the link to the product
    # link = product.find('a', href=True)['href']

    # Create a new page in the browser
    page = await browser.new_page()

    # Navigate to the product page
    await page.goto(link)

    # Wait for the page to load
    await page.wait_for_selector('.pricing')

    # Extract the HTML content of the product page
    product_page_data = await page.content()

    # Parse the product page using BeautifulSoup
    product_soup = BeautifulSoup(product_page_data, 'html.parser')

    prices = await get_prices(page)

    # Extract pricing and size details
    pricing_elements = product_soup.find_all('div', class_='variantText solo')
    index = 0
    #print(f"Brand: {brand}")
    #print(f"Name: {name}")
    #print(f"Concentration: {concentration}")
    #print(f"Gender: {gender}")
    for pricing_element in pricing_elements:
        # Extract the product size in ounces from the data-dim-value attribute
        size_oz = pricing_element['data-dim-value']
        # Convert the size to milliliters using the conversion factor
        size_ml = float(size_oz) * 29.5735
        # Print the extracted data
        #print(f"Price: {prices[index]:}, Size (oz): {size_oz}, Size (mL): {size_ml:.2f}")
        # Add the details to the DataFrame
        df.loc[len(df)] = [brand, name, concentration, gender, size_oz, prices[index], link, photoLink]
        index += 1
    #print(f"Link: {link}")
    #print(f"Image: {photoLink}")
    #print('\n')
    # Close the product page
    await page.close()
    return df

async def scrape_fragrancenet(max_items, headless):
    df = pd.DataFrame(columns=["brand", "title", "concentration", "gender", "size", "price", "link", "photoLink"])
    try:
        async with async_playwright() as p:
            # trying to get it run through without incognito (to grab proper pricing)
            # but it doesn't bypass through the bot security check
            """
            app_data_path = os.getenv("LOCALAPPDATA")
            user_data_path = os.path.join(app_data_path, 'Chromium\\User_Data\\Default')
            context = await p.chromium.launch_persistent_context(user_data_path, headless=False, channel="chrome", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36")
            # Create a new page in the browser
            page = await context.new_page()
            """
            headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
            }
            # Launch the Playwright browser
            browser = await p.chromium.launch(headless=headless)


            # Create a new page in the browser
            # page = await browser.new_page()

            page_number = 1
            #for page_number in range(1, num_pages + 1):
            while df.shape[0] <= max_items:  # Infinite loop to keep scraping
                # Generate the search URL for each page
                page = await browser.new_page()
                search_url = f"https://www.fragrancenet.com/fragrances?&page={page_number}"

                # Navigate to the search URL
                await page.goto(search_url)

                # Wait for the page to load
                await page.wait_for_selector('.resultItem.heightSync')

                # Extract the HTML content of the result set
                product_data = await page.inner_html('#resultSet')

                # Parse the HTML content using BeautifulSoup
                soup = BeautifulSoup(product_data, 'html.parser')

                # Find all product items on the page
                product_items = soup.find_all('div', class_='resultItem heightSync')

                # Iterate through each product on the page
                for product in product_items:
                    # Extract the name of the product
                    name = product.find('span', class_='brand-name').text.strip()

                    # Check if any brand names should be ignored
                    for brand_name in brand_names:
                        name = name.replace(brand_name, "").strip()

                    # Extract the brand with a try-except block
                    try:
                        brand_element = product.find('p', class_='des').find('a')
                        brand = brand_element.text.strip()
                    except AttributeError:
                        brand = "Brand not available"

                    # Extract the gender information
                    gender = product.find('span', class_='gender-badge').text.strip()

                    # Extract the link to the product
                    link = product.find('a', href=True)['href']

                    # Extract the savings information
                    # savings = product.find('span', class_='savings').text.strip()

                    # Extract the ratings information
                    # ratings = product.find('div', class_='starRatingContain').find('span', class_='sr-only').text.strip()

                    photoLink = product.find('img',src=True)['src']

                    concentration = product.find('p', class_='desc').text.strip()
                    if(concentration == "eau de toilette"):
                        concentration = "EDT"
                    elif(concentration == "eau de parfum"):
                        concentration = "EDP"

                    df = await get_product_info(browser, df, brand, name, concentration, gender, link, photoLink)

                    # Check if the maximum number of items has been reached
                    if df.shape[0] >= max_items:
                        break

                # Increment the page number
                page_number += 1
                await page.close()

            # Close the browser when done
            await browser.close()
    finally:
        return df.to_json(orient="records")

# Run the main function
if __name__ == "__main__":
    print(asyncio.run(scrape_fragrancenet(50)))

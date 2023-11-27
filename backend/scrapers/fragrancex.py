import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import re
import pandas as pd

# Copied from Nolan's jomashop, my website is also dynamic as well
async def scroll_down(page):
    for _ in range(5):
        await page.evaluate('window.scrollBy(0,1200);')
        await page.wait_for_timeout(500)

async def scrape_fragrancex(max_items):
    df = pd.DataFrame(columns=["brand", "title", "concentration", "gender", "size", "price", "link", "photoLink"])
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=False)
            page_number = 1

            # Generate the search URL for each page
            page = await browser.new_page()
            search_url = f"https://www.fragrancex.com/shopping/best"

            # Navigate to the search URL
            await page.goto(search_url)

            # Wait for the page to load
            await page.wait_for_selector('.product-grid-cell')

            page_content = await page.content()
            # Parse the HTML content using BeautifulSoup
            soup = BeautifulSoup(page_content, 'html.parser')

            product_items = soup.find_all('div', class_='product-grid-cell')

            # Iterate through each product on the page
            for product in product_items:
                # await scroll_down(page)
                brand = product.find('div', class_='product-desc-2').find('a').text.strip()
                title = product.find('h3', class_='serif').find('span').text.strip()
                gender = product.find('span', class_='category').text.strip()
                link = "https://www.fragrancex.com" + product.find('a', class_='link-2')['href']

                # Navigate to the product page
                await page.goto(link)

                # Wait for the product page to load
                await page.wait_for_selector('.listing-information')
                
                # Wait for the page to be fully loaded
                await page.wait_for_load_state('load')
                # Scroll to load in some stuff 
                await scroll_down(page)
                
                # souping the web page again because it followed a new link
                page_content = await page.content()
                soup = BeautifulSoup(page_content, 'html.parser')
                product_info = soup.find_all('div', class_='product media')
                # print(f"Brand: {brand}")
                # print(f"Name: {title}")
                # print(f"Gender: {gender}")
                # print(f"Link: {link}")
                # Find the div with the class 'c-12-of-12'
                product_info_div = soup.find('div', class_='c-12-of-12 product-specifications-wrapper')
                
                # Find the table within the div
                table = product_info_div.find('table', class_='table')

                # Print the content of the table for debugging
                #print(table)

                for row in table.find_all('tr'):
                    # Check if the row contains 'Fragrance Classification' in the text (case-insensitive)
                    #print(row.text.strip().casefold())
                    if 'Fragrance Classification' in row.text.strip():
                        # Find the cell with the concentration value in the second column
                        concentration_cell = row.find_all('td')[1]

                        # Check if the cell is found
                        if concentration_cell:
                            # Get the text content of the concentration cell
                            concentration = concentration_cell.text.strip()
                            if(concentration.lower() == "eau de toilette"):
                                concentration = "EDT"
                            elif(concentration.lower() == "eau de toilette (edt)"):
                                concentration = "EDT"
                            elif(concentration.lower() == "eau de parfum"):
                                concentration = "EDP"
                            elif(concentration.lower() == "eau de parfum (edp)"):
                                concentration = "EDP"
                            else:
                                concentration = "None"
                            # print(f"Concentration: {concentration}")

                        # Break the loop once the relevant row is found
                        break

                for item in product_info:
                    # Extract size, price, and photo link
                    size_element = item.find('h2', class_='listing-description').find('span')
                    size = size_element.text.strip() if size_element else None
                    # print(f"Size: {size}")

                    price_element = item.find('span', class_='price-value')
                    if price_element:
                        base_price = price_element.find('span', class_='base-price-val').text.strip()
                        sup_price = price_element.find('span', class_='sup-price sup-price-val').text.strip()
                        price = f"${base_price}.{sup_price}"
                    else:
                        price = None
                    # print(f"Price: {price}")

                    photo_link_element = item.find('picture').find('source', srcset=True)
                    if photo_link_element:
                        photo_link = photo_link_element['srcset'] 
                    else:
                        photo_link = "None"
                    #else:
                        #photo_link_element = item.find('picture').find('img', src=True)
                        #photo_link = photo_link_element['src']
                    # print(f"Photo: {photo_link}")
                    df.loc[len(df)] = [brand, title, concentration, gender, size, price, link, photo_link]
                    if df.shape[0] >= max_items:
                        return

                #print('\n')

            # Close the browser when done
            await browser.close()

    finally:
        return df.to_json(orient="records")

# Run the main function
if __name__ == "__main__":
    print(asyncio.run(scrape_fragrancex(50)))

import asyncio
import re
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

# The base URL of the website
baseurl = "https://www.fragrancenet.com/"
# The number of pages to scrape
num_pages = 1

# List of brand names to ignore in product names
brand_names = ["Dolce & Gabbana", "Gianni Versace"]  # Add more brand names as needed

async def get_product_info(browser, product):
    # Extract the link to the product
    link = product.find('a', href=True)['href']

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

    # Extract pricing and size details
    pricing_elements = product_soup.find_all('div', class_='variantText solo')

    for pricing_element in pricing_elements:
        dimname_span = pricing_element.find('div', class_='dimname').find('span', class_='text')
        size_text = dimname_span.text.strip()

        # Use regular expression to extract the numeric part for the size
        size_match = re.search(r'(\d+\.\d+)', size_text)
        
        if size_match:
            size = size_match.group(1)
        else:
            size = "Not found"
        
        price = pricing_element.find('div', class_='pricing').text.strip()
        print(f"Price: {price}, Size: {size}")

    # Close the product page
    await page.close()

async def main():
    # Launch the Playwright browser
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        
        # Create a new page in the browser
        page = await browser.new_page()

        # Iterate through the specified number of pages
        for page_number in range(1, num_pages + 1):
            # Generate the search URL for each page
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

                # Extract the price of the product
                price_element = product.find('span', class_='price types')
                price = price_element.find_next('span').text.strip() if price_element else "Price not available"

                # Extract the gender information
                gender = product.find('span', class_='gender-badge').text.strip()

                # Extract the link to the product
                link = product.find('a', href=True)['href']

                # Extract the savings information
                savings = product.find('span', class_='savings').text.strip()

                # Extract the ratings information
                ratings = product.find('div', class_='starRatingContain').find('span', class_='sr-only').text.strip()
                
                # Print the extracted data
                print(f"Name: {name}")
                print(f"Brand: {brand}")
                print(f"Gender: {gender}")
                print(f"Link: {link}")
                print(f"Savings: {savings}")
                print(f"Ratings: {ratings}")

                # Get pricing and size details from the product page
                await get_product_info(browser, product)
                print("\n")

        # Close the browser when done
        await browser.close()

# Run the main function
if __name__ == "__main__":
    asyncio.run(main())

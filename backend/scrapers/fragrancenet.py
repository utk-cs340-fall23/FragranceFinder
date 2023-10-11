from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

# The base URL of the website
baseurl = "https://www.fragrancenet.com/"

# The number of pages to scrape
num_pages = 3

# Launch the Playwright browser
with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)

    # Iterate through the specified number of pages
    for page_number in range(1, num_pages + 1):
        # Generate the search URL for each page
        search_url = f"https://www.fragrancenet.com/fragrances?&page={page_number}"

        # Open a new page in the browser
        page = browser.new_page()

        # Navigate to the search URL
        page.goto(search_url)

        # Wait for the page to load
        page.wait_for_load_state()

        # Extract the HTML content of the result set
        product_data = page.inner_html('#resultSet')

        # Close the page to free up resources
        page.close()

        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(product_data, 'html.parser')

        # Find all product items on the page
        product_items = soup.find_all('div', class_='resultItem heightSync')

        # Iterate through each product on the page
        for product in product_items:
            # Extract the name of the product
            name = product.find('span', class_='brand-name').text.strip()

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
            print(f"Price: {price}")
            print(f"Gender: {gender}")
            print(f"Link: {link}")
            print(f"Savings: {savings}")
            print(f"Ratings: {ratings}")
            print("\n")

    # Close the browser when done
    browser.close()


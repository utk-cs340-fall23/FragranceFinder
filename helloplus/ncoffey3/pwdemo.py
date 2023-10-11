# Nolan Coffey 
# Webscraping Demo using Playwright and Beautiful Soup
# This program opens up the website fragrancebuy in a browser and scrapes the price of laytonexclusif and prints it out

from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto('https://fragrancebuy.ca/products/parfumsmarlylaytonexclusif-man')
    html = page.inner_html('#main')
    page.is_visible('div.sale_price')
    soup = BeautifulSoup(html, 'html.parser')
# Find the 'span' element with class 'money'
    money_span = soup.find('span', class_='money')

# Extract 'data-currency-usd' attribute value
    data_currency_usd = money_span.get('data-currency-usd')
    print(data_currency_usd)

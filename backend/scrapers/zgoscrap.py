from playwright.async_api import async_playwright
import asyncio
from bs4 import BeautifulSoup
import re

async def scrape_olfac():
    async with async_playwright() as p:
        data_list = []
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()

        await page.goto('https://www.zgoperfumery.com/fragrances/')
        await page.wait_for_timeout(1000)

        async def scroll_down():
            for _ in range(12):
                await page.evaluate('window.scrollBy(0,600);')
                await page.wait_for_timeout(1000)
        await scroll_down()
        await page.wait_for_selector('ul.productGrid')
        page_content = await page.content()
        soup = BeautifulSoup(page_content, 'html.parser')

        products = soup.find_all('li', class_='product')
        for product in products:
            link = product.find('a')
            link = link.get('href')
            await page.goto(link)
            await page.wait_for_selector('div.productView')
            page_content = await page.content()
            soup = BeautifulSoup(page_content, 'html.parser')

            prodinfo = soup.find('div', class_='productView')
            brandinfo = prodinfo.find('div',class_='productView-brandName')
            name = prodinfo.find('p',class_='productView-title')
            price =  prodinfo.find('span', class_='price price--withoutTax')
            sizeinfo = prodinfo.find('label',class_='form-label form-label--alternate form-label--inlineSmall')
            if brandinfo:
                brand = brandinfo.find('span')
                brand = brand.text.strip()
            else:
                brand = 'N/A'

            if sizeinfo:
                size = sizeinfo.find('span')
                size = size.text.strip()
            else:
                size = 'N/A'

            if price:
                price = price.text.strip()
            else:
                price = 'N/A'
            
            if name:
                name = name.text.strip()
            else:
                name = 'N/A'
            print("Brand:",brand)
            print("Size:",size)
            print("price:",price)
            print("Name:",name)
            print("Link:",link)
            print("-" * 30)
if __name__ == "__main__":
    asyncio.run(scrape_olfac())
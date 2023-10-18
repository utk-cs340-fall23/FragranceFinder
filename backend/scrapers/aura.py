# William Duff
# This program scrapes men's and women's fragrance information from aurafragrance.com
# Last updated 10/18/2023

import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

async def scrapeAura():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless = False)
        page = await browser.new_page()
    
        # Men's Fragrances from Aura Fragrance
        '''mensBrands = []
        mensTitles = []
        mensConcentrations = []
        mensSizes = []
        mensPrices = []
        mensGenders = []
        mensStocks = []
        mensLinks = []
        pageNumbers = []'''
    
        await page.goto("https://www.aurafragrance.com/collections/mens-fragrances?page=1", timeout = 600000)
        html = await page.inner_html('#shopify-section-collection-template')
        soup = BeautifulSoup(html, 'html.parser')

        # Finding the total number of fragrances in the catalog to get the correct number of pages to scrape from
        pageList = []
        pageNumbersFind = soup.find('ul', class_='pagination-custom')
        listItems = pageNumbersFind.find_all('li')
        
        for i in range(0, len(listItems)):
            pageList.append((listItems[i]).text)
        
        totalPages = pageList[5].replace('\n', "")
    
        # Men's scraping
        for i in range(1, int(totalPages) + 1):
            fragPages = []
            catalogPage = "https://www.aurafragrance.com/collections/mens-fragrances?page=" + str(i)
        
            # Opening the catalog page
            await page.goto(catalogPage, timeout = 600000)
            html = await page.inner_html('#shopify-section-collection-template')
            soup = BeautifulSoup(html, 'html.parser')
        
            # Collecting links to individual fragrance pages
            targetDivs = soup.find_all('div', class_='grid-uniform')
            targetDiv = targetDivs[1]
            linkTags = targetDiv.find_all('a')
    
            for a in linkTags:
                href = a.get('href')
                fragPages.append(href)
        
            # Going to the individual fragrance page
            for j in range(0, len(fragPages)):
                fragPage = "https://www.aurafragrance.com" + fragPages[j]
                
                await page.goto(fragPage, timeout = 600000)
                html = await page.inner_html('#shopify-section-product-template')
                soup = BeautifulSoup(html, 'html.parser')
                sizes = []
                stocks = []
                prices = []
                
                sizeBoxes = soup.find('select', class_='product-variants')
                
                sizeInfo = sizeBoxes.find_all('option')
                
                for displayedSize in sizeInfo:
                    sizes.append(displayedSize.text)
                    stocks.append(displayedSize.text)
                    prices.append(displayedSize.text)
                
                for k in range(0, len(sizes)):
                    size = str(sizes[k])
                    stock = str(stocks[k])
                    price = str(prices[k])
                    
                    print("initial:", size) ###############
                    
                    # Formatting size
                    if ((("x" in size or "X" in size) and ("total" in size or "Samples" in size or "Sample" in size))
                        or " & " in size or "oz" not in size or "OZ" not in size):
                        continue
                    
                    size = size.replace("\n", "").replace('z', 'Z').replace('o', 'O').replace(" ", "")
                    position = size.find('Z')
                    size = size[:position + 1]
                    
                    if size[0] == ".":
                        size = "0" + size
                        
                    size = size[:3] + " " + size[3:]
                    
                    # Formatting Stock and Price
                    if '$' in stock:
                        stock = "In Stock"
                        
                        position = price.find('$')
                        price = price[position:]
                        price = price.replace(" USD", "")
                    else:
                        stock = "Sold Out"
                        price = "NA"
            
        browser.close()
        
if __name__ == "__main__":
    asyncio.run(scrapeAura())
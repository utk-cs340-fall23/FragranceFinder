# William Duff
# This program scrapes men's and women's fragrance information from aurafragrance.com
# Last updated 10/16/2023

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
    
        await page.goto("https://www.aurafragrance.com/collections/mens-fragrances?page=1")
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
            await page.goto(catalogPage)
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
                
                await page.goto(fragPage)
                html = await page.inner_html('#shopify-section-product-template')
                soup = BeautifulSoup(html, 'html.parser')
                sizes = []
                #stocks = []
                prices = []

                print(fragPage)
                
                # I think you will have to scrape the variants out of the scripts from the individual fragrance page
                # Once you have done that, loop through on each page and scrape the data if the variant exists
                    # You might run into the program staopping if the page cannot be found (timeout)
                    
                # There has to be a more optimal way of scraping the size and price than this ^^
                # Keep checking if there is a way to scrape size and price using the page info, idk why sizeBoxes continues to be empty
                
                
                
                
                sizeBoxes = soup.find_all('li', class_='swatch-view-item')
                
                print(sizeBoxes)
                
                sizeInfo = sizeBoxes.find('div', class_='swatch-button-title-text')
                #stockInfo = sizeBoxes.find('span', class_='prod-dtl-instock instock')
                priceInfo = sizeBoxes.find('div', class_='swatch-button-price-hidden')
                
                for displayedSize in sizeInfo:
                    sizes.append(displayedSize.text)
                #for displayedStock in stockInfo:
                    #stocks.append(displayedStock.text)
                for hiddenPrice in priceInfo:
                    prices.append(hiddenPrice.text)
                
                print(sizeInfo)
                print(priceInfo)
            
        browser.close()
        
if __name__ == "__main__":
    asyncio.run(scrapeAura())
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
        mensBrands = []
        mensTitles = []
        mensConcentrations = []
        mensSizes = []
        mensPrices = []
        mensGenders = []
        mensStocks = []
        mensLinks = []
    
        # Opening the Aura Fragrance men's catalog page, timeout required due to potential long loading times
        await page.goto("https://www.aurafragrance.com/collections/mens-fragrances?page=1", timeout = 600000)
        html = await page.inner_html('#shopify-section-collection-template')
        soup = BeautifulSoup(html, 'html.parser')

        # Scraping list of all branfs for later use
        brandNames = []
        brandList = soup.find('ul', class_='advanced-filters')
        brandListItems = brandList.find_all('li', class_='advanced-filter')
        for i in range(0, len(brandListItems)):
            brandNames.append((brandListItems[i]).text)
        brandNames[52] = "Dkny"
        brandNames[56] = "Echt Kolnisch Wasser"
        brandNames[68] = "Fcuk"
        brandNames[113] = brandNames[113].replace('g', 'G')
        
        # Finding the total number of fragrances in the catalog to get the correct number of pages to scrape from
        pageList = []
        pageNumbersFind = soup.find('ul', class_='pagination-custom')
        pageListItems = pageNumbersFind.find_all('li')
        
        for i in range(0, len(pageListItems)):
            pageList.append((pageListItems[i]).text)
        
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
                
                # Scraping size, stock, and price information from individual fragrance pages
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
                    
                    # Scraping brand, title, concentration, and gender from individual fragrance page
                    infoCluster = soup.find('h1').text
                    
                    # Formatting size
                    if "O7" in size:
                        size = size.replace("O7", "OZ")
                    
                    if ((("x" in size or "X" in size) and ("total" in size or "Samples" in size or "Sample" in size))
                        or ("Samples" in size or "Sample" in size) and ("OZ" not in size or "oz" not in size)):
                        continue
                    
                    size = size.replace("\n", "").replace('z', 'Z').replace('o', 'O').replace(" ", "")
                    position = size.find('Z')
                    size = size[:position + 1]
                    
                    if size[0] == ".":
                        size = "0" + size
                        
                    size = size[:3] + " " + size[3:]
                    
                    # Formatting the rest of the information
                    if '$' in stock:
                        stock = "In Stock"
                        
                        position = price.find('$')
                        price = price[position:]
                        price = price.replace(" USD", "")
                    else:
                        stock = "Sold Out"
                        price = "NA"
                    
                    if "Men" in infoCluster:
                        gender = "Male"
                        infoCluster = infoCluster.replace("for Men", "")
                    else:
                        gender = "Unisex"
                        infoCluster = infoCluster.replace("Unisex", "")
                    
                    if "EDP" in infoCluster:
                        concentration = "EDP"
                        infoCluster = infoCluster.replace("EDP", "")
                    elif "EDT" in infoCluster:
                        concentration = "EDT"
                        infoCluster = infoCluster.replace("EDT", "")
                    else:
                        concentration = "NA"
                    
                    for m in range(0, len(brandNames)):
                        if brandNames[m] in infoCluster:
                            brand = brandNames[m]
                            infoCluster = infoCluster.replace(brand, "")
                    if len(brand) == 0:
                        brand = "NA"
                    
                    infoCluster = infoCluster.replace("by", "").replace("   ", " ").replace("  ", " ")
                    if len(infoCluster) == 0:
                        title = "NA"
                    else :
                        if infoCluster[0] == " ":
                            infoCluster = infoCluster[1:]
                        if "By" in infoCluster and (infoCluster[0] != "B" and infoCluster[1] != "y"):
                            position = infoCluster.find("By")
                            infoCluster = infoCluster[:position]
                        for m in range(1, len(infoCluster)):
                            if infoCluster[len(infoCluster) - 1] == " ":
                                infoCluster = infoCluster[:len(infoCluster) - 1]
                            else:
                                continue
                        
                        title = infoCluster
                        
                    # APPEND TO EACH LIST --------------------------------------
        browser.close()
        
if __name__ == "__main__":
    asyncio.run(scrapeAura())
# William Duff
# This program scrapes men's and women's fragrance information from aurafragrance.com
# Last updated 11/09/2023

import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import pandas as pd

async def scrape_aura(max_items, headless):
    async with async_playwright() as p:
        df = pd.DataFrame(columns=["brand", "title", "concentration", "gender", "size", "price", "link", "photoLink"])
        browser = await p.chromium.launch(headless=headless)
        page = await browser.new_page()

        # Men's Fragrances from Aura Fragrance
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
        for i in range(1, 15):
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
                    brand = ""
                    link = fragPage
                    size = str(sizes[k])
                    stock = str(stocks[k])
                    price = str(prices[k])

                    # Scraping brand, title, concentration, gender, and image link from individual fragrance page
                    infoCluster = soup.find('h1').text

                    imageLinkContainer = soup.find('div', class_='product-photo-container')
                    imageLinkTag = imageLinkContainer.find('img')
                    imageLink = imageLinkTag.get('src')

                    # Formatting size
                    if "O7" in size:
                        size = size.replace("O7", "OZ")

                    if ((("x" in size or "X" in size) and ("total" in size or "Samples" in size or "Sample" in size))
                        or ("Samples" in size or "Sample" in size) and ("OZ" not in size or "oz" not in size)
                        or ("1/3" in size) or (" Set " in infoCluster or " set " in infoCluster)):
                        continue

                    size = size.replace("\n", "").replace('z', 'Z').replace('o', 'O').replace(" ", "")
                    position = size.find('Z')
                    size = size[:position + 1]

                    if size[0] == ".":
                        size = "0" + size

                    if size[0].isalpha():
                        position = size.find('/')
                        size = size[position + 1:]
                    position = size.find('O')
                    sizeOZ = size[:position]
                    sizeOZ = sizeOZ + " oz"

                    # Formatting the rest of the information
                    if '$' in stock:
                        stock = "In Stock"

                        position = price.find('$')
                        price = price[position + 1:]
                        price = price.replace(" USD", "")
                        price = "$" + price
                    else:
                        stock = "Sold Out"
                        price = None

                    if "EDP" in infoCluster:
                        concentration = "EDP"
                        infoCluster = infoCluster.replace("EDP", "")
                    elif "EDT" in infoCluster:
                        concentration = "EDT"
                        infoCluster = infoCluster.replace("EDT", "")
                    else:
                        concentration = None

                    for m in range(0, len(brandNames)):
                        if brandNames[m] in infoCluster:
                            brand = brandNames[m]
                            infoCluster = infoCluster.replace(brand, "")
                    if len(brand) == 0:
                        brand = None

                    if "Men" in infoCluster and "en and " not in infoCluster:
                        gender = "Male"
                        infoCluster = infoCluster.replace("for Men", "")
                    elif "men" in infoCluster and "en and " not in infoCluster:
                        gender = "Male"
                        infoCluster = infoCluster.replace("for men", "")
                    elif ("Men" in infoCluster and "en and " in infoCluster) or ("men" in infoCluster and "en and " in infoCluster):
                        gender = "Unisex"
                        position = infoCluster.find("for")
                        infoCluster = infoCluster[:position]
                    else:
                        gender = "Unisex"
                        infoCluster = infoCluster.replace("Unisex", "")

                    infoCluster = infoCluster.replace("by", "").replace("   ", " ").replace("  ", " ")
                    if len(infoCluster) == 0:
                        title = None
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

                    # Databasing th results
                    df.loc[len(df)] = [str(brand), str(title), str(concentration), str(gender), str(sizeOZ),
                                        str(price), str(link), str(imageLink)]

        # Women's Fragrances from Aura Fragrance
        # Opening the Aura Fragrance women's catalog page, timeout required due to potential long loading times
        await page.goto("https://www.aurafragrance.com/collections/womens-fragrances?page=1", timeout = 600000)
        html = await page.inner_html('#shopify-section-collection-template')
        soup = BeautifulSoup(html, 'html.parser')

        # Scraping list of all branfs for later use
        brandNames = []
        brandList = soup.find('ul', class_='advanced-filters')
        brandListItems = brandList.find_all('li', class_='advanced-filter')
        for i in range(0, len(brandListItems)):
            brandNames.append((brandListItems[i]).text)
        brandNames[66] = "Dkny"
        brandNames[70] = "Echt Kolnisch Wasser"
        brandNames[87] = "Fcuk"
        brandNames[132] = brandNames[132].replace('g', 'G')

        # Finding the total number of fragrances in the catalog to get the correct number of pages to scrape from
        pageList = []
        pageNumbersFind = soup.find('ul', class_='pagination-custom')
        pageListItems = pageNumbersFind.find_all('li')

        for i in range(0, len(pageListItems)):
            pageList.append((pageListItems[i]).text)

        totalPages = pageList[5].replace('\n', "")

        # Women's scraping
        for i in range(1, 15):
            fragPages = []
            catalogPage = "https://www.aurafragrance.com/collections/womens-fragrances?page=" + str(i)

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
                    brand = ""
                    link = fragPage
                    size = str(sizes[k])
                    stock = str(stocks[k])
                    price = str(prices[k])

                    # Scraping brand, title, concentration, gender, and image link from individual fragrance page
                    infoCluster = soup.find('h1').text

                    imageLinkContainer = soup.find('div', class_='product-photo-container')
                    imageLinkTag = imageLinkContainer.find('img')
                    imageLink = imageLinkTag.get('src')

                    # Formatting size
                    if "O7" in size:
                        size = size.replace("O7", "OZ")

                    if ((("x" in size or "X" in size) and ("total" in size or "Samples" in size or "Sample" in size))
                        or ("Samples" in size or "Sample" in size) and ("OZ" not in size or "oz" not in size)
                        or ("1/3" in size) or (" Set " in infoCluster or " set " in infoCluster)):
                        continue

                    size = size.replace("\n", "").replace('z', 'Z').replace('o', 'O').replace(" ", "")
                    position = size.find('Z')
                    size = size[:position + 1]

                    if size[0] == ".":
                        size = "0" + size

                    if size[0].isalpha():
                        position = size.find('/')
                        size = size[position + 1:]
                    position = size.find('O')
                    sizeOZ = size[:position]
                    sizeOZ = sizeOZ + " oz"

                    # Formatting the rest of the information
                    if '$' in stock:
                        stock = "In Stock"

                        position = price.find('$')
                        price = price[position + 1:]
                        price = price.replace(" USD", "")
                        price = "$" + price
                    else:
                        stock = "Sold Out"
                        price = None

                    if "EDP" in infoCluster:
                        concentration = "EDP"
                        infoCluster = infoCluster.replace("EDP", "")
                    elif "EDT" in infoCluster:
                        concentration = "EDT"
                        infoCluster = infoCluster.replace("EDT", "")
                    else:
                        concentration = None

                    for m in range(0, len(brandNames)):
                        if brandNames[m] in infoCluster:
                            brand = brandNames[m]
                            infoCluster = infoCluster.replace(brand, "")
                    if len(brand) == 0:
                        brand = None

                        ############ Make "NA" = None on aura, check what they would be on gift and venba, add oz to size, and add $ to price

                    if "Women" in infoCluster and "en and " not in infoCluster:
                        gender = "Female"
                        infoCluster = infoCluster.replace("for Women", "")
                    elif "women" in infoCluster and "en and " not in infoCluster:
                        gender = "Female"
                        infoCluster = infoCluster.replace("for women", "")
                    elif ("Women" in infoCluster and "en and " in infoCluster) or ("women" in infoCluster and "en and " in infoCluster):
                        gender = "Unisex"
                        position = infoCluster.find("for")
                        infoCluster = infoCluster[:position]
                    else:
                        gender = "Unisex"
                        infoCluster = infoCluster.replace("Unisex", "")

                    infoCluster = infoCluster.replace("by", "").replace("   ", " ").replace("  ", " ")
                    if len(infoCluster) == 0:
                        title = None
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

                    # Databasing the results
                    df.loc[len(df)] = [str(brand), str(title), str(concentration), str(gender), str(sizeOZ),
                                        str(price), str(link), str(imageLink)]

        await browser.close()

        return df.to_json(orient="columns")

if __name__ == "__main__":
    asyncio.run(scrape_aura(2000))

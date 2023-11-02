# William Duff
# This program scrapes men's and women's fragrance information from giftexpress.com
# Last updated 10/25/2023

import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import pandas as pd

async def scrapeGiftExpress():
    async with async_playwright() as p:
        df = pd.DataFrame(columns=["brand", "title", "concentration", "gender", "size", "price", "stock", "link", "photoLink"])
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Men's Fragrances from Gift Express
        pageNumbers = []
        
        await page.goto("https://www.giftexpress.com/mens-fragrances.html?perfume_type=2893%2C2894%2C2895%2C2916")
        html = await page.inner_html('#maincontent')
        soup = BeautifulSoup(html, 'html.parser')

        # Finding the total number of fragrances in the catalog to get the correct number of pages to scrape from
        pageNumbersFind = soup.find_all('span', class_='toolbar-number')
        for number in pageNumbersFind:
            pageNumbers.append(number.text)

        totalFrags = pageNumbers[2]
        totalPages = int(-(-(int(totalFrags) / 20) // 1))

        # Men's scraping
        for i in range(1, totalPages + 1):
            fragPages = []
            catalogPage = "https://www.giftexpress.com/mens-fragrances.html?p=" + str(i) + "&perfume_type=2893%2C2894%2C2895%2C2916"

            # Opening the catalog page, the first page was already opened
            if i > 1:
                await page.goto(catalogPage)
                html = await page.inner_html('#maincontent')
                soup = BeautifulSoup(html, 'html.parser')

            # Finding the ordered list of links
            targetOL = soup.find('ol', class_='products list items product-items')
            listItems = targetOL.find_all('li')

            # Collecting the links to individual fragrance pages
            for j in range(0, len(listItems), 3):
                a = listItems[j].find('a', class_='product photo product-item-photo')
                href = a.get('href')
                fragPages.append(href)

            # Going to the individual fragrance page to scrape important data
            for j in range(0, len(fragPages)):
                await page.goto(fragPages[j])
                html = await page.inner_html('#maincontent')
                soup = BeautifulSoup(html, 'html.parser')
                sizes = []
                stocks = []
                prices = []

                # Scraping individual data for each size, will create a new list item for each attribute being scraped
                sizeBoxes = soup.find('div', class_='products-detal')

                # Some of the pages do not have size segments listed, so the information will need to be scraped from a different area
                if sizeBoxes.text is not None:
                    sizeInfo = sizeBoxes.find_all('span', class_='size')
                    stockInfo = sizeBoxes.find_all('span', class_='prod-dtl-instock instock')
                    priceInfo = sizeBoxes.find_all('span', class_='price')

                    for displayedSize in sizeInfo:
                        sizes.append(displayedSize.text)
                    for displayedStock in stockInfo:
                        stocks.append(displayedStock.text)
                    for displayedPrice in priceInfo:
                        prices.append(displayedPrice.text)

                    for k in range(0, len(sizes)):
                        if sizes[k] != "Standard":
                            brand = soup.find('td', {'class': 'col data'}).text
                            title = soup.find('div', class_='b-name').text
                            concentration = soup.find('div', {'class': 'pro-perfume-type pb5'}).text
                            size = str(sizes[k])
                            gender = soup.find('div', class_='b-name').text
                            price = str(prices[k])
                            stock = str(stocks[k])
                            mensLink = fragPages[j]
                            mensImgTag = soup.find('img')
                            mensImageLink = mensImgTag.get('src')

                            # Formatting the scraped data for uniformity
                            mensBrand = brand.replace('\n', "").rstrip(" ")
                            position = title.find("by")
                            mensTitle = title[:position - 1]
                            mensTitle = mensTitle.replace('\n', "")
                            mensConcentration = concentration.replace('\n', "").replace("Type: ", "")
                            size = size.replace('\n', "").replace("(Tester) ", "")
                            position = size.find("oz")
                            mensSizeOZ = size[:position - 1]
                            if "Unisex" in gender:
                                mensGender = "Unisex"
                            else:
                                mensGender = "Male"
                            mensPrice = price.replace('\n', "").replace('$', "").rstrip(" ")
                            mensStock = stock.replace('\n', "").replace("Notify Me", "").replace("ready to ship", "").replace("s", "S")

                            if mensConcentration == "Eau De Cologne":
                                mensConcentration = "EDC"
                            elif mensConcentration == "Eau De Toilette":
                                mensConcentration = "EDT"
                            elif mensConcentration == "Eau De Parfum":
                                mensConcentration = "EDP"
                            elif mensConcentration == "Parfum":
                                mensConcentration = mensConcentration
                            else:
                                mensConcentration = "NA"
                                
                            df.loc[len(df)] = [str(mensBrand), str(mensTitle), str(mensConcentration), str(mensGender), round(float(mensSizeOZ), 2), 
                                               float(mensPrice), str(mensStock), str(mensLink), str(mensImageLink)]
                else:
                    brand = soup.find('td', {'class': 'col data'}).text
                    title = soup.find('div', class_='b-name').text
                    concentration = soup.find('div', {'class': 'pro-perfume-type pb5'}).text
                    size = soup.find('span', {'class': 'pro-size'}).text
                    gender = soup.find('div', class_='b-name').text
                    price = soup.find('span', {'class': 'price'}).text
                    stock = soup.find('div', {'class': 'pro-stock'})
                    mensLink = fragPages[j]
                    mensImgTag = soup.find('img')
                    mensImageLink = mensImgTag.get('src')

                    # Formatting, same as above
                    mensBrand = brand.replace('\n', "").rstrip(" ")
                    position = title.find("by")
                    mensTitle = title[:position - 1]
                    mensTitle = mensTitle.replace('\n', "")
                    mensConcentration = concentration.replace('\n', "").replace("Type: ", "")
                    size = size.replace('\n', "").replace("(Tester) ", "")
                    position = size.find("oz")
                    mensSizeOZ = size[:position - 1]
                    if "Unisex" in gender:
                        mensGender = "Unisex"
                    else:
                        mensGender = "Male"
                    mensPrice = price.replace('\n', "").replace('$', "").rstrip(" ")
                    mensStock = stock.replace('\n', "").replace("Notify Me", "").replace("ready to ship", "").replace("s", "S")

                    if mensConcentration == "Eau De Cologne":
                        mensConcentration = "EDC"
                    elif mensConcentration == "Eau De Toilette":
                        mensConcentration = "EDT"
                    elif mensConcentration == "Eau De Parfum":
                        mensConcentration = "EDP"
                    elif mensConcentration == "Parfum":
                        mensConcentration = mensConcentration
                    else:
                        mensConcentration = "NA"
                            
                    df.loc[len(df)] = [str(mensBrand), str(mensTitle), str(mensConcentration), str(mensGender), round(float(mensSizeOZ), 2), 
                                        float(mensPrice), str(mensStock), str(mensLink), str(mensImageLink)]

        # Women's Fragrances from Gift Express
        pageNumbers = []

        await page.goto("https://www.giftexpress.com/womens-fragrances.html?perfume_type=2893%2C2894%2C2895%2C2916")
        html = await page.inner_html('#maincontent')
        soup = BeautifulSoup(html, 'html.parser')

        # Finding the total number of fragrances in the catalog to get the correct number of pages to scrape from
        pageNumbersFind = soup.find_all('span', class_='toolbar-number')
        for number in pageNumbersFind:
            pageNumbers.append(number.text)

        totalFrags = pageNumbers[2]
        totalPages = int(-(-(int(totalFrags) / 20) // 1))

        # Women's scraping
        for i in range(1, totalPages + 1):
            fragPages = []
            catalogPage = "https://www.giftexpress.com/womens-fragrances.html?p=" + str(i) + "&perfume_type=2893%2C2894%2C2895%2C2916"

            # Opening the catalog page
            if i > 1:
                await page.goto(catalogPage)
                html = await page.inner_html('#maincontent')
                soup = BeautifulSoup(html, 'html.parser')

            # Finding the ordered list of links
            targetOL = soup.find('ol', class_='products list items product-items')
            listItems = targetOL.find_all('li')

            # Collecting the links to individual fragrance pages
            for i in range(0, len(listItems), 3):
                a = listItems[i].find('a', class_='product photo product-item-photo')
                href = a.get('href')
                fragPages.append(href)

            # Going to the individual fragrance page to scrap important data
            for j in range(0, len(fragPages)):
                await page.goto(fragPages[j])
                html = await page.inner_html('#maincontent')
                soup = BeautifulSoup(html, 'html.parser')
                sizes = []
                stocks = []
                prices = []

                # Scraping individual data for each size, will create a new list item for each attribute being scraped
                sizeBoxes = soup.find('div', class_='products-detal')

                if sizeBoxes.text is not None:
                    sizeInfo = sizeBoxes.find_all('span', class_='size')
                    stockInfo = sizeBoxes.find_all('span', class_='prod-dtl-instock instock')
                    priceInfo = sizeBoxes.find_all('span', class_='price')

                    for displayedSize in sizeInfo:
                        sizes.append(displayedSize.text)
                    for displayedStock in stockInfo:
                        stocks.append(displayedStock.text)
                    for displayedPrice in priceInfo:
                        prices.append(displayedPrice.text)

                    for k in range(0, len(sizes)):
                        if sizes[k] != "Standard":
                            brand = soup.find('td', {'class': 'col data'}).text
                            title = soup.find('div', class_='b-name').text
                            concentration = soup.find('div', {'class': 'pro-perfume-type pb5'}).text
                            size = str(sizes[k])
                            gender = soup.find('div', class_='b-name').text
                            price = str(prices[k])
                            stock = str(stocks[k])
                            womensLink = fragPages[j]
                            womensImgTag = soup.find('img')
                            womensImageLink = womensImgTag.get('src')

                            # Formatting the scraped data for uniformity
                            womensBrand = brand.replace('\n', "").rstrip(" ")
                            position = title.find("by")
                            womensTitle = title[:position - 1]
                            womensTitle = womensTitle.replace('\n', "")
                            womensConcentration = concentration.replace('\n', "").replace("Type: ", "")
                            size = size.replace('\n', "").replace("(Tester) ", "")
                            position = size.find("oz")
                            womensSizeOZ = size[:position - 1]
                            if "Unisex" in gender:
                                womensGender = "Unisex"
                            else:
                                womensGender = "Female"
                            womensPrice = price.replace('\n', "").replace('$', "").rstrip(" ")
                            womensStock = stock.replace('\n', "").replace("Notify Me", "").replace("ready to ship", "").replace("s", "S")

                            if womensConcentration == "Eau De Cologne":
                                womensConcentration = "EDC"
                            elif womensConcentration == "Eau De Toilette":
                                womensConcentration = "EDT"
                            elif womensConcentration == "Eau De Parfum":
                                womensConcentration = "EDP"
                            elif womensConcentration == "Parfum":
                                womensConcentration = womensConcentration
                            else:
                                womensConcentration = "NA"
                                
                            df.loc[len(df)] = [str(womensBrand), str(womensTitle), str(womensConcentration), str(womensGender), round(float(womensSizeOZ), 2), 
                                               float(womensPrice), str(womensStock), str(womensLink), str(womensImageLink)]
                else:
                    brand = soup.find('td', {'class': 'col data'}).text
                    title = soup.find('div', class_='b-name').text
                    concentration = soup.find('div', {'class': 'pro-perfume-type pb5'}).text
                    size = soup.find('span', {'class': 'pro-size'}).text
                    gender = soup.find('div', class_='b-name').text
                    price = soup.find('span', {'class': 'price'}).text
                    stock = soup.find('div', {'class': 'pro-stock'})
                    womensLink = fragPages[j]
                    womensImgTag = soup.find('img')
                    womensImageLink = womensImgTag.get('src')

                    # Formatting, same as above
                    womensBrand = brand.replace('\n', "").rstrip(" ")
                    position = title.find("by")
                    womensTitle = title[:position - 1]
                    womensTitle = womensTitle.replace('\n', "")
                    womensConcentration = concentration.replace('\n', "").replace("Type: ", "")
                    size = size.replace('\n', "").replace("(Tester) ", "")
                    position = size.find("oz")
                    womensSizeOZ = size[:position - 1]
                    if "Unisex" in gender:
                        womensGender = "Unisex"
                    else:
                        womensGender = "Female"
                    womensPrice = price.replace('\n', "").replace('$', "").rstrip(" ")
                    womensStock = stock.replace('\n', "").replace("Notify Me", "").replace("ready to ship", "").replace("s", "S")

                    if womensConcentration == "Eau De Cologne":
                        womensConcentration = "EDC"
                    elif womensConcentration == "Eau De Toilette":
                        womensConcentration = "EDT"
                    elif womensConcentration == "Eau De Parfum":
                        womensConcentration = "EDP"
                    elif womensConcentration == "Parfum":
                        womensConcentration = womensConcentration
                    else:
                        womensConcentration = "NA"
                            
                    df.loc[len(df)] = [str(womensBrand), str(womensTitle), str(womensConcentration), str(womensGender), round(float(womensSizeOZ), 2), 
                                        float(womensPrice), str(womensStock), str(womensLink), str(womensImageLink)]
                    
        browser.close()
        
        return df.to_json(orient="columns")

if __name__ == "__main__":
    asyncio.run(scrapeGiftExpress())
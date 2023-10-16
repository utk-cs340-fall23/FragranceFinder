# William Duff
# This program scrapes men's and women's fragrance information from giftexpress.com
# Last updated 10/12/2023

import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

async def scrapeGiftExpress():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless = False)
        page = await browser.new_page()

        # Men's Fragrances from Gift Express
        mensBrands = []
        mensTitles = []
        mensConcentrations = []
        mensSizes = []
        mensPrices = []
        mensGenders = []
        mensStocks = []
        mensLinks = []
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
                            title = soup.find('h2').text
                            concentration = soup.find('div', {'class': 'pro-perfume-type pb5'}).text
                            size = str(sizes[k])
                            gender = soup.find('h2').text
                            price = str(prices[k])
                            stock = str(stocks[k])
                            link = fragPages[j]

                            # Formatting the scraped data for uniformity
                            mensBrand = brand.replace('\n', "").rstrip(" ")
                            position = title.find("by")
                            mensTitle = title[:position - 1]
                            mensTitle = mensTitle.replace('\n', "")
                            mensConcentration = concentration.replace('\n', "").replace("Type: ", "")
                            mensSize = size.replace('\n', "").replace("(Tester) ", "")
                            position = mensSize.find('z')
                            mensSize = mensSize[:position + 1]
                            position = gender.find("for")
                            mensGender = gender[position + 4:]
                            mensGender = mensGender.replace('\n', "")
                            mensPrice = price.replace('\n', "").rstrip(" ")
                            mensStock = stock.replace('\n', "").replace("Notify Me", "").replace("ready to ship", "").replace("s", "S")

                            mensBrands.append(mensBrand)
                            mensTitles.append(mensTitle)
                            if mensConcentration == "Eau De Cologne":
                                mensConcentrations.append("EDC")
                            elif mensConcentration == "Eau De Toilette":
                                mensConcentrations.append("EDT")
                            elif mensConcentration == "Eau De Parfum":
                                mensConcentrations.append("EDP")
                            elif mensConcentration == "Parfum":
                                mensConcentrations.append(mensConcentration)
                            else:
                                mensConcentrations.append(mensConcentration)
                            mensSizes.append(mensSize)
                            if mensGender == "Men":
                                mensGenders.append("Male")
                            elif mensGender == ("Unisex"):
                                mensGenders.append('Unisex')
                            else:
                                mensGenders.append(mensGender)
                            mensPrices.append(mensPrice)
                            mensStocks.append(mensStock)
                            mensLinks.append(link)
                else:
                    brand = soup.find('td', {'class': 'col data'}).text
                    title = soup.find('h2').text
                    concentration = soup.find('div', {'class': 'pro-perfume-type pb5'}).text
                    size = soup.find('span', {'class': 'pro-size'}).text
                    gender = soup.find('h2').text
                    price = soup.find('span', {'class': 'price'}).text
                    stock = soup.find('div', {'class': 'pro-stock'})
                    link = fragPages[j]

                    # Formatting, same as above
                    mensBrand = brand.replace('\n', "").rstrip(" ")
                    position = title.find("by")
                    mensTitle = title[:position - 1]
                    mensTitle = mensTitle.replace('\n', "")
                    mensConcentration = concentration.replace('\n', "").replace("Type: ", "")
                    mensSize = size.replace('\n', "").replace("(Tester) ", "")
                    position = mensSize.find('z')
                    mensSize = mensSize[:position + 1]
                    position = gender.find("for")
                    mensGender = gender[position + 4:]
                    mensGender = mensGender.replace('\n', "")
                    mensPrice = price.replace('\n', "").rstrip(" ")
                    mensStock = stock.replace('\n', "").replace("Notify Me", "").replace("ready to ship", "").replace("s", "S")

                    mensBrands.append(mensBrand)
                    mensTitles.append(mensTitle)
                    if mensConcentration == "Eau De Cologne":
                        mensConcentrations.append("EDC")
                    elif mensConcentration == "Eau De Toilette":
                        mensConcentrations.append("EDT")
                    elif mensConcentration == "Eau De Parfum":
                        mensConcentrations.append("EDP")
                    elif mensConcentration == "Parfum":
                        mensConcentrations.append(mensConcentration)
                    else:
                        mensConcentrations.append(mensConcentration)
                    mensSizes.append(mensSize)
                    if mensGender == "Men":
                        mensGenders.append("Male")
                    elif mensGender == ("Unisex"):
                        mensGenders.append('Unisex')
                    else:
                        mensGenders.append(mensGender)
                    mensPrices.append(mensPrice)
                    mensStocks.append(mensStock)
                    mensLinks.append(link)

        # Women's Fragrances from Gift Express
        womensBrands = []
        womensTitles = []
        womensConcentrations = []
        womensSizes = []
        womensPrices = []
        womensGenders = []
        womensStocks = []
        womensLinks = []
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
                            title = soup.find('h2').text
                            concentration = soup.find('div', {'class': 'pro-perfume-type pb5'}).text
                            size = str(sizes[k])
                            gender = soup.find('h2').text
                            price = str(prices[k])
                            stock = str(stocks[k])
                            link = fragPages[j]

                            # Formatting the scraped data for uniformity
                            womensBrand = brand.replace('\n', "").rstrip(" ")
                            position = title.find("by")
                            womensTitle = title[:position - 1]
                            womensTitle = womensTitle.replace('\n', "")
                            womensConcentration = concentration.replace('\n', "").replace("Type: ", "")
                            womensSize = size.replace('\n', "").replace("(Tester) ", "")
                            position = womensSize.find('z')
                            mensSize = womensSize[:position + 1]
                            position = gender.find("for")
                            womensGender = gender[position + 4:]
                            womensGender = womensGender.replace('\n', "")
                            womensPrice = price.replace('\n', "").rstrip(" ")
                            womensStock = stock.replace('\n', "").replace("Notify Me", "").replace("ready to ship", "").replace("s", "S")

                            womensBrands.append(womensBrand)
                            womensTitles.append(womensTitle)
                            if womensConcentration == "Eau De Cologne":
                                womensConcentrations.append("EDC")
                            elif womensConcentration == "Eau De Toilette":
                                womensConcentrations.append("EDT")
                            elif womensConcentration == "Eau De Parfum":
                                womensConcentrations.append("EDP")
                            elif womensConcentration == "Parfum":
                                womensConcentrations.append(womensConcentration)
                            else:
                                womensConcentrations.append(womensConcentration)
                            womensSizes.append(womensSize)
                            if womensGender == "Women":
                                womensGenders.append("Female")
                            elif womensGender == ("Unisex"):
                                womensGenders.append('Unisex')
                            else:
                                womensGenders.append(womensGender)
                            womensPrices.append(womensPrice)
                            womensStocks.append(womensStock)
                            womensLinks.append(link)
                else:
                    brand = soup.find('td', {'class': 'col data'}).text
                    title = soup.find('h2').text
                    concentration = soup.find('div', {'class': 'pro-perfume-type pb5'}).text
                    size = soup.find('span', {'class': 'pro-size'}).text
                    gender = soup.find('h2').text
                    price = soup.find('span', {'class': 'price'}).text
                    stock = soup.find('div', {'class': 'pro-stock'})
                    link = fragPages[j]

                    # Formatting, same as above
                    womensBrand = brand.replace('\n', "").rstrip(" ")
                    position = title.find("by")
                    womensTitle = title[:position - 1]
                    womensTitle = womensTitle.replace('\n', "")
                    womensConcentration = concentration.replace('\n', "").replace("Type: ", "")
                    womensSize = size.replace('\n', "").replace("(Tester) ", "")
                    position = womensSize.find('z')
                    womensSize = womensSize[:position + 1]
                    position = gender.find("for")
                    womensGender = gender[position + 4:]
                    womensGender = womensGender.replace('\n', "")
                    womensPrice = price.replace('\n', "").rstrip(" ")
                    womensStock = stock.replace('\n', "").replace("Notify Me", "").replace("ready to ship", "").replace("s", "S")

                    womensBrands.append(womensBrand)
                    womensTitles.append(womensTitle)
                    if womensConcentration == "Eau De Cologne":
                        womensConcentrations.append("EDC")
                    elif womensConcentration == "Eau De Toilette":
                        womensConcentrations.append("EDT")
                    elif womensConcentration == "Eau De Parfum":
                        womensConcentrations.append("EDP")
                    elif womensConcentration == "Parfum":
                        womensConcentrations.append(womensConcentration)
                    else:
                        womensConcentrations.append(womensConcentration)
                    womensSizes.append(mensSize)
                    if womensGender == "Women":
                        womensGenders.append("Female")
                    elif womensGender == ("Unisex"):
                        womensGenders.append('Unisex')
                    else:
                        womensGenders.append(womensGender)
                    womensPrices.append(womensPrice)
                    womensStocks.append(womensStock)
                    womensLinks.append(link)

        browser.close()

if __name__ == "__main__":
    asyncio.run(scrapeGiftExpress())

# William Duff
# Last updated 10/04/2023

from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

with sync_playwright() as p:
    browser = p.chromium.launch(headless = False)
    page = browser.new_page()
    
    # Men's Fragrances from Gift Express
    mensBrands = []
    mensTitles = []
    mensSizes = []
    mensPrices = []
    mensStocks = []
    pageNumbers = []
    
    page.goto("https://www.giftexpress.com/mens-fragrances.html?p=1")
    html = page.inner_html('#maincontent')
    soup = BeautifulSoup(html, 'html.parser')
    
    # Finding the total number of fragrances in the catalog to get the correct number of pages to scrape from
    pageNumbersFind = soup.find_all('span', class_='toolbar-number')
    for number in pageNumbersFind:
        pageNumbers.append(number.text)
    
    totalFrags = pageNumbers[2]
    totalPages = int(-(-(int(totalFrags) / 20) // 1))
            
    # Men's fragrances on Gift Express
    for i in range(1, totalPages + 1):
        fragPages = []
        hrefs = [] 
        catalogPage = "https://www.giftexpress.com/mens-fragrances.html?p=" + str(i)
        
        # Opening the catalog page
        if i > 1:
            page.goto(catalogPage)
            html = page.inner_html('#maincontent')
            soup = BeautifulSoup(html, 'html.parser')
        
        # Finding the ordered list of links 
        targetOL = soup.find('ol', class_='products list items product-items')
        listItems = targetOL.find_all('li')
        
        # Collecting the links to individual fragrance pages
        for i in range(0, len(listItems), 3):
            a = listItems[i].find('a', class_='product photo product-item-photo')
            href = a.get('href')
            fragPages.append(href)

        # Going to the individual fragrance page to scrape important data
        for j in range(0, len(fragPages)): 
            page.goto(fragPages[j])
            html = page.inner_html('#maincontent')
            soup = BeautifulSoup(html, 'html.parser')
            sizes = []
            stocks = []
            
            # Scraping individual data for each size, will create a new list item for each attribute being scraped
            sizeBoxes = soup.find('div', class_='products-detal')
            
            # Some of the pages do not have size segments listed, so the information will need to be scraped from a different area
            if sizeBoxes.text is not None:
                sizeInfo = sizeBoxes.find_all('span', class_='size')
                stockInfo = sizeBoxes.find_all('span', class_='prod-dtl-instock instock')
                
                for displayedSize in sizeInfo:
                    sizes.append(displayedSize.text)
                for displayedStock in stockInfo:
                    stocks.append(displayedStock.text)
                    
                for k in range(0, len(sizes)):
                    if sizes[k] != "Standard":
                        brand = soup.find('td', {'class': 'col data'}).text
                        title = soup.find('h2').text
                        size = str(sizes[k])
                        price = soup.find('span', {'class': 'price'}).text
                        stock = str(stocks[k])
                    
                        # Formatting the scraped data for uniformity
                        mensBrand = brand.replace('\n', "").rstrip(" ")
                        position = title.find("by")
                        mensTitle = title[:position - 1]
                        mensTitle = mensTitle.replace('\n', "")
                        mensSize = size.replace('\n', "").replace("(", "").replace(")", "").replace("\xa0", "")
                        position = mensSize.find('z')
                        mensSize = mensSize[position + 1:]
                        mensPrice = price.replace('\n', "").rstrip(" ")
                        mensStock = stock.replace('\n', "").replace("Notify Me", "").replace("ready to ship", "").replace("s", "S")
    
                        mensBrands.append(mensBrand)
                        mensTitles.append(mensTitle)
                        mensSizes.append(mensSize)
                        mensPrices.append(mensPrice)
                        mensStocks.append(mensStock)
            else:
                brand = soup.find('td', {'class': 'col data'}).text
                title = soup.find('h2').text
                size = soup.find('span', {'class': 'pro-size'}).text
                price = soup.find('span', {'class': 'price'}).text
                stock = soup.find('div', {'class': 'pro-stock'})

                mensBrand = brand.replace('\n', "").rstrip(" ")
                position = title.find("by")
                mensTitle = title[:position - 1]
                mensTitle = mensTitle.replace('\n', "")
                mensSize = size.replace('\n', "").replace("(", "").replace(")", "").replace("\xa0", "")
                position = mensSize.find('z')
                mensSize = mensSize[position + 1:]
                mensPrice = price.replace('\n', "").rstrip(" ")
                mensStock = stock.replace('\n', "").replace("Notify Me", "").replace("ready to ship", "").replace("s", "S")
    
                mensBrands.append(mensBrand)
                mensTitles.append(mensTitle)
                mensSizes.append(mensSize)
                mensPrices.append(mensPrice)
                mensStocks.append(mensStock)
                
            print("scraped size =  ", size)
            print("formatted size =", mensSize)
            print("scraped price =  ", price)
            print("formatted price =", mensPrice)
            print("scraped brand =  ", brand)
            print("formatted brand =", mensBrand)
            print("scraped title =  ", title)
            print("formatted title =", mensTitle)
            print("scraped stock =  ", stock)
            print("formatted stock =", mensStock)

   # Women's Fragrances from Gift Express
    womensBrands = []
    womensTitles = []
    womensSizes = []
    womensPrices = []
    womensStocks = []
    pageNumbers = []  
    
    page.goto("https://www.giftexpress.com/womens-fragrances.html?p=1")
    html = page.inner_html('#maincontent')
    soup = BeautifulSoup(html, 'html.parser')
    
    # Finding the total number of fragrances in the catalog to get the correct number of pages to scrape from
    pageNumbersFind = soup.find_all('span', class_='toolbar-number')
    for number in pageNumbersFind:
        pageNumbers.append(number.text)
    
    totalFrags = pageNumbers[2]
    totalPages = int(-(-(int(totalFrags) / 20) // 1))
            
    # Women's fragrances on Gift Express
    for i in range(1, totalPages + 1):    
        fragPages = []
        hrefs = [] 
        catalogPage = "https://www.giftexpress.com/womens-fragrances.html?p=" + str(i)
        
        # Opening the catalog page
        if i > 1:
            page.goto(catalogPage)
            html = page.inner_html('#maincontent')
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
            page.goto(fragPages[j])
            html = page.inner_html('#maincontent')
            soup = BeautifulSoup(html, 'html.parser')
            sizes = []
            stocks = []
            
            # Scraping individual data for each size, will create a new list item for each attribute being scraped
            sizeBoxes = soup.find('div', class_='products-detal')
            
            if sizeBoxes.text is not None:
                sizeInfo = sizeBoxes.find_all('span', class_='size')
                stockInfo = sizeBoxes.find_all('span', class_='prod-dtl-instock instock')
                
                for displayedSize in sizeInfo:
                    sizes.append(displayedSize.text)
                for displayedStock in stockInfo:
                    stocks.append(displayedStock.text)
                    
                for k in range(0, len(sizes)):
                    if sizes[k] != "Standard":
                        brand = soup.find('td', {'class': 'col data'}).text
                        title = soup.find('h2').text
                        size = str(sizes[k])
                        price = soup.find('span', {'class': 'price'}).text
                        stock = str(stocks[k])
                    
                        # Formatting the scraped data for uniformity
                        womensBrand = brand.replace('\n', "").rstrip(" ")
                        position = title.find("by")
                        womensTitle = title[:position - 1]
                        womensTitle = mensTitle.replace('\n', "")
                        womensSize = size.replace('\n', "").replace("(", "").replace(")", "").replace("\xa0", "")
                        position = womensSize.find('z')
                        womensSize = womensSize[position + 1:]
                        womensPrice = price.replace('\n', "").rstrip(" ")
                        womensStock = stock.replace('\n', "").replace("Notify Me", "").replace("ready to ship", "").replace("s", "S")
    
                        womensBrands.append(womensBrand)
                        womensTitles.append(womensTitle)
                        womensSizes.append(womensSize)
                        womensPrices.append(womensPrice)
                        womensStocks.append(womensStock)
            else:
                brand = soup.find('td', {'class': 'col data'}).text
                title = soup.find('h2').text
                size = soup.find('span', {'class': 'pro-size'}).text
                price = soup.find('span', {'class': 'price'}).text
                stock = soup.find('div', {'class': 'pro-stock'})

                womensBrand = brand.replace('\n', "").rstrip(" ")
                position = title.find("by")
                womensTitle = title[:position - 1]
                womensTitle = mensTitle.replace('\n', "")
                womensSize = size.replace('\n', "").replace("(", "").replace(")", "").replace("\xa0", "")
                position = womensSize.find('z')
                womensSize = womensSize[position + 1:]
                womensPrice = price.replace('\n', "").rstrip(" ")
                womensStock = stock.replace('\n', "").replace("Notify Me", "").replace("ready to ship", "").replace("s", "S")
    
                womensBrands.append(womensBrand)
                womensTitles.append(womensTitle)
                womensSizes.append(womensSize)
                womensPrices.append(womensPrice)
                womensStocks.append(womensStock)
            
    browser.close() 
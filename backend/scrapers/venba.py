# William Duff
# This program scrapes men's and women's fragrance information from venbafragrance.com
# Last updated 11/09/2023

import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import pandas as pd

async def scrape_venba(max_items):
    async with async_playwright() as p:
        df = pd.DataFrame(columns=["brand", "title", "concentration", "gender", "size", "price", "link", "photoLink"])
        browser = await p.chromium.launch(headless = False)
        page = await browser.new_page()
        
        
        '''
        # Men's Fragrances from Venba Fragrance
        await page.goto("https://www.venbafragrance.com/collections/men?page=1")
        html = await page.inner_html('#MainContent')
        soup = BeautifulSoup(html, 'html.parser')
        
        # Finding all brand names for later use
        brandNames = []
        brandList = soup.find('ul', class_='collection-nav')
        brandListItems = brandList.find_all('li', 'sidebar__item')
        for i in range(0, len(brandListItems)):
            brandName = brandListItems[i].text
            brandName = brandName.replace('\n', "")
            
            brandNames.append(brandName)
        
        # Needs to be run twice because of how Python handles iterators
        for i in range(2):
            for i in range(len(brandNames)):
                if i == len(brandNames):
                    break
            
                if ("All Collections" in brandNames[i] or "All Bottles" in brandNames[i] or "Best Seller" in brandNames[i]
                    or "Clearance" in brandNames[i] or "Men" in brandNames[i] or "New Arrivals" in brandNames[i]
                    or "Sample" in brandNames[i] or "Tester" in brandNames[i] or "Unisex" in brandNames[i]
                    or "Women" in brandNames[i]):
                        del brandNames[i]
        
        # Finding total number of pages to scrape from
        pageNumbersFind = soup.find('ul', class_='pagination-custom')
        pageListItems = pageNumbersFind.find_all('li', class_='pagination-custom__num')
        
        for i in range (0, len(pageListItems)):
            pageListInfo = pageListItems[i].text
            pageListInfo = pageListInfo.replace(" ", "").replace('\n', "")
            totalPages = pageListInfo
        
        # Men's scraping
        for i in range(1, int(totalPages) + 1):
            fragPages = []
            catalogPage = "https://www.venbafragrance.com/collections/men?page=" + str(i)
            
            # Opening the catalog page
            await page.goto(catalogPage)
            html = await page.inner_html('#MainContent')
            soup = BeautifulSoup(html, 'html.parser')
            
            # Collecting links to individual fragrance pages
            targetDiv = soup.find('div', class_='js-grid')
            linkTags = targetDiv.find_all('a')
    
            for index, a in enumerate(linkTags):
                if index % 3 == 0:
                    href = a.get('href')
                    fragPages.append(href)
                
            # Going to the individual fragrance page
            for j in range(0, len(fragPages)):
                fragPage = "https://www.venbafragrance.com/" + fragPages[j]
                tcellList = []
                
                await page.goto(fragPage)
                html = await page.inner_html('#MainContent')
                soup = BeautifulSoup(html, 'html.parser')
                
                # Collecting information
                infoCluster = soup.find('h1', class_='product__title').text
                
                if ("Extrait" in infoCluster or "Cologne" in infoCluster or "Sample" in infoCluster
                    or "EDP oz" in infoCluster):
                    continue
                position = infoCluster.find(" oz")
                infoCluster = infoCluster[:position + 3]
                link = fragPage
                imageLinkDiv = soup.find('div', class_='lazy-image mobile-zoom-wrapper')
                imageTag = imageLinkDiv.find('img')
                imageLink = imageTag.get('src')
                price = soup.find('span', class_='product__price').text
                infoTable = soup.find('div', class_='productheader')
                
                if infoTable != None:
                    trows = infoTable.find_all('tr')
                    
                if infoTable == None or trows == []:
                    if "EDP" in infoCluster:
                        concentration = "EDP"
                    elif "EDT" in infoCluster:
                        concentration = "EDT"
                    elif "Parfum" in infoCluster:
                        concentration = "Parfum"
                    else:
                        concentration = None
                    
                    if "Men" in infoCluster or "Man" in infoCluster:
                        gender = "Male"
                    else:
                        gender = "Unisex"    
                else:
                    for tcell in trows:
                        tcellList.append(tcell.text)
                
                    gender = tcellList[3]
                    concentration = tcellList[4]
                    
                    # Beginning formatting
                    if "Eau de Parfum" in concentration:
                        concentration = "EDP"
                    elif "Eau de Toilette" in concentration:
                        concentration = "EDT"
                    elif "Parfum" in concentration:
                        concentration = "Parfum"
                    else:
                        concentration = None
                    
                    if "Men" in gender:
                        gender = "Male"
                    else:
                        gender = "Unisex"
                
                if concentration == None:
                    continue
                
                # Formatting continued
                imageLink = "https:" + imageLink
                price = price.replace('\n', "")
                    
                for brandName in brandNames:
                    if brandName in infoCluster:
                        brand = brandName
                        if brand == "Escentric Molecule":
                            infoCluster = infoCluster.replace(brand + "s ", "")
                        else:
                            infoCluster = infoCluster.replace(brand + " ", "")
                        break
                    
                if "Maison Margiela" in infoCluster:
                    brand = "Maison Martin Margiela"
                    infoCluster = infoCluster.replace("Maison Margiela ", "")
                    
                position = infoCluster.find(concentration)
                if position != -1:
                    sizeOZ = infoCluster[position + len(concentration) + 1:]
                    infoCluster = infoCluster.replace(" " + concentration + " ", "").replace(sizeOZ, "")
                elif "EDP" in infoCluster:
                    position = infoCluster.find("EDP")
                    sizeOZ = infoCluster[position + len("EDP") + 1:]
                    infoCluster = infoCluster.replace(" " + "EDP" + " ", "").replace(sizeOZ, "")
                elif "EDT" in infoCluster:
                    position = infoCluster.find("EDT")
                    sizeOZ = infoCluster[position + len("EDT") + 1:]
                    infoCluster = infoCluster.replace(" " + "EDT" + " ", "").replace(sizeOZ, "")
                elif "Parfum" in infoCluster:
                    position = infoCluster.find("Parfum")
                    sizeOZ = infoCluster[position + len("Parfum") + 1:]
                    infoCluster = infoCluster.replace(" " + "Parfum" + " ", "").replace(sizeOZ, "")
                infoCluster = infoCluster.replace(" for Men", "").replace(" Man", "")
                title = infoCluster
                
                # Databasing the results
                df.loc[len(df)] = [str(brand), str(title), str(concentration), str(gender), str(sizeOZ), 
                                    str(price), str(link), str(imageLink)]
        
        '''    
            
        # Women's Fragrances from Venba Fragrance
        await page.goto("https://www.venbafragrance.com/collections/women?page=1")
        html = await page.inner_html('#MainContent')
        soup = BeautifulSoup(html, 'html.parser')
        
        # Finding all brand names for later use
        brandNames = []
        brandList = soup.find('ul', class_='collection-nav')
        brandListItems = brandList.find_all('li', 'sidebar__item')
        for i in range(0, len(brandListItems)):
            brandName = brandListItems[i].text
            brandName = brandName.replace('\n', "")
            
            brandNames.append(brandName)
        
        # Needs to be run twice because of how Python handles iterators
        for i in range(2):
            for i in range(len(brandNames)):
                if i == len(brandNames):
                    break
            
                if ("All Collections" in brandNames[i] or "All Bottles" in brandNames[i] or "Best Seller" in brandNames[i]
                    or "Clearance" in brandNames[i] or "Men" in brandNames[i] or "New Arrivals" in brandNames[i]
                    or "Sample" in brandNames[i] or "Tester" in brandNames[i] or "Unisex" in brandNames[i]
                    or "Women" in brandNames[i]):
                        del brandNames[i]
        
        # Finding total number of pages to scrape from
        pageNumbersFind = soup.find('ul', class_='pagination-custom')
        pageListItems = pageNumbersFind.find_all('li', class_='pagination-custom__num')
        
        for i in range (0, len(pageListItems)):
            pageListInfo = pageListItems[i].text
            pageListInfo = pageListInfo.replace(" ", "").replace('\n', "")
            totalPages = pageListInfo
        
        # Women's scraping
        for i in range(1, int(totalPages) + 1):
            fragPages = []
            catalogPage = "https://www.venbafragrance.com/collections/women?page=" + str(i)
            
            # Opening the catalog page
            await page.goto(catalogPage)
            html = await page.inner_html('#MainContent')
            soup = BeautifulSoup(html, 'html.parser')
            
            # Collecting links to individual fragrance pages
            targetDiv = soup.find('div', class_='js-grid')
            linkTags = targetDiv.find_all('a')
    
            for index, a in enumerate(linkTags):
                if index % 3 == 0:
                    href = a.get('href')
                    fragPages.append(href)
                
            # Going to the individual fragrance page
            for j in range(0, len(fragPages)):
                fragPage = "https://www.venbafragrance.com/" + fragPages[j]
                tcellList = []
                
                await page.goto(fragPage)
                html = await page.inner_html('#MainContent')
                soup = BeautifulSoup(html, 'html.parser')
                
                # Collecting information
                infoCluster = soup.find('h1', class_='product__title').text
                
                if ("Extrait" in infoCluster or "Cologne" in infoCluster or "Sample" in infoCluster
                    or "EDP oz" in infoCluster):
                    continue
                position = infoCluster.find(" oz")
                infoCluster = infoCluster[:position + 3]
                link = fragPage
                imageLinkDiv = soup.find('div', class_='lazy-image mobile-zoom-wrapper')
                imageTag = imageLinkDiv.find('img')
                imageLink = imageTag.get('src')
                price = soup.find('span', class_='product__price').text
                infoTable = soup.find('div', class_='productheader')
                
                if infoTable != None:
                    trows = infoTable.find_all('tr')
                    
                if infoTable == None or trows == []:
                    if "EDP" in infoCluster:
                        concentration = "EDP"
                    elif "EDT" in infoCluster:
                        concentration = "EDT"
                    elif "Parfum" in infoCluster:
                        concentration = "Parfum"
                    else:
                        concentration = None
                    
                    if "Her" in infoCluster:
                        gender = "Female"
                    else:
                        gender = "Unisex"    
                else:
                    for tcell in trows:
                        tcellList.append(tcell.text)
                
                    gender = tcellList[3]
                    concentration = tcellList[4]
                    
                    # Beginning formatting
                    if "Eau de Parfum" in concentration:
                        concentration = "EDP"
                    elif "Eau de Toilette" in concentration:
                        concentration = "EDT"
                    elif "Parfum" in concentration:
                        concentration = "Parfum"
                    else:
                        concentration = None
                    
                    if "Feminine" in gender or "Women" in gender:
                        gender = "Female"
                    else:
                        gender = "Unisex"
                        
                if concentration == None:
                    continue
                        
                # Formatting continued
                imageLink = "https:" + imageLink
                price = price.replace('\n', "")
                    
                for brandName in brandNames:
                    if brandName in infoCluster:
                        brand = brandName
                        if brand == "Escentric Molecule":
                            infoCluster = infoCluster.replace(brand + "s ", "")
                        else:
                            infoCluster = infoCluster.replace(brand + " ", "")
                        break
                    
                if "Maison Margiela" in infoCluster:
                    brand = "Maison Martin Margiela"
                    infoCluster = infoCluster.replace("Maison Margiela ", "")
                    
                position = infoCluster.find(concentration)
                if position != -1:
                    sizeOZ = infoCluster[position + len(concentration) + 1:]
                    infoCluster = infoCluster.replace(" " + concentration + " ", "").replace(sizeOZ, "")
                elif "EDP" in infoCluster:
                    position = infoCluster.find("EDP")
                    sizeOZ = infoCluster[position + len("EDP") + 1:]
                    infoCluster = infoCluster.replace(" " + "EDP" + " ", "").replace(sizeOZ, "")
                elif "EDT" in infoCluster:
                    position = infoCluster.find("EDT")
                    sizeOZ = infoCluster[position + len("EDT") + 1:]
                    infoCluster = infoCluster.replace(" " + "EDT" + " ", "").replace(sizeOZ, "")
                elif "Parfum" in infoCluster:
                    position = infoCluster.find("Parfum")
                    sizeOZ = infoCluster[position + len("Parfum") + 1:]
                    infoCluster = infoCluster.replace(" " + "Parfum" + " ", "").replace(sizeOZ, "")
                infoCluster = infoCluster.replace(" for Her", "")
                title = infoCluster
                
                # Databasing the results
                df.loc[len(df)] = [str(brand), str(title), str(concentration), str(gender), str(sizeOZ), 
                                    str(price), str(link), str(imageLink)]
        
        await browser.close()
        
        return df.to_json(orient="columns")
        
if __name__ == "__main__":
    asyncio.run(scrape_venba(10000))

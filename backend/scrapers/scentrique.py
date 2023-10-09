from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

with sync_playwright() as p:

    linksToScrape = []

    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto('https://www.scentrique.com/fragrances')
    html = page.inner_html('#TPASection_jqwvt965')
    soup = BeautifulSoup(html, 'html.parser')
    ul_list = soup.find('ul', class_='S4WbK_ uQ5Uah c2Zj9x H1ux6p')

    for i in ul_list:
        #linksToScrape.append(i.find("a", class_="oQUvqL x5qIv3")["href"])
        subbrowser = p.chromium.launch(headless=False)
        subpage = subbrowser.new_page()
        subpage.goto(i.find("a", class_="oQUvqL x5qIv3")["href"])
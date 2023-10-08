from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto('https://www.scentrique.com/fragrances')
    html = page.inner_html('#TPASection_jqwvt965')
    #page.is_visible('div.sale_price')
    soup = BeautifulSoup(html, 'html.parser')
# Find the 'span' element with class 'money'
    ul_list = soup.find('ul', class_='S4WbK_ uQ5Uah c2Zj9x H1ux6p')

    for i in ul_list:
        #parse li data here
        text = i.find("h3", class_="s__7GeSCC oJwdGxV---typography-11-runningText oJwdGxV---priority-7-primary syHtuvM FzO_a9")
        price = i.find("span", class_="cfpn1d")
        print(text.decode_contents(), " ", price.decode_contents())
        
# Extract 'data-currency-usd' attribute value
    #data_currency_usd = money_span.get('data-currency-usd')
    #print(data_currency_usd)
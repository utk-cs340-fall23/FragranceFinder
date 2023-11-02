# Sprint 2
Kien Nguyen, KienKong, Fragrance Finder

### What you planned to do
- Access Each Product in FragranceNet.com to grab necessary information [#29](https://github.com/utk-cs340-fall23/FragranceFinder/issues/29)
- Cleaning up for format to match model/Fragrance.js database [#30](https://github.com/utk-cs340-fall23/FragranceFinder/issues/30)
- Using pandas to translate dataframes to a json after running webscraper [#38](https://github.com/utk-cs340-fall23/FragranceFinder/issues/35)

### What you did not do
- I was not able to translate the gathered information into data that can be read through the json file to be able to be used in the frontend. I was also not
able to finish getting the price fully correctly because playwright runs the window in incognito, and it seems to make the discount not be accounted for
in the pricing.

### What problems you encountered
- There were formatting issues when it comes to getting the oz in the size, but that was easily fixed by finding another area of information (in data-dim-value)
- The price does not display correctly when I run the program because it opens in incognito mode. This makes it so the discount doesn't apply when grabbing
the pricing, making the price of the fragrance be the original flat price
- Tried to bypass the incognito mode launch, but the website has a security implementation to prevent me from scraping if it is not run in incognito
- Trying to convert the data I have into json, but have not finished because I need to adjust the way I return the data

### Issues you worked on
- [#29] Access Each Product in FragranceNet.com (https://github.com/utk-cs340-fall23/FragranceFinder/issues/29)
- [#30] Cleaning up for format to match model/Fragrance.js database (https://github.com/utk-cs340-fall23/FragranceFinder/issues/30)

### Files you worked on
- fragrancenet.py (/backend/scrapers/fragrancenet.py)

### What you accomplished
I was able to make it so the webscraper can continue to webscrape all of the pages until it runs out of items to scrape, but for testing, I set the limit to 
1 page. Since the pricing isn't listed in the front page, I access all of the products by going into the product link and grabbing each of the pricing and
their relative sizes (oz). I then finalize all of the information and display it the way that we want to to be organized. For example, the type of fragrance 
EDT/EDP is shortened, so that when it runs into the filter that we have on our frontend webpage, we can classify and pick certain categories and refine our
searches. 

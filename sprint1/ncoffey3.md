#Sprint 1

Nolan Coffey, ncoffey3, Fragrance Finder

#What you planned to do:
* Create a webscraper for jomashop.com 
* Create a webscraper for maxaroma.com
* Clean the parsed data into a standardized format (brand, name, concentration, size, price)
* Database the results



#What you did not do:
* Database the results


#What problems you encountered

* jomashop.com had no standard formatting for their products, so parsing the data was quite a challenge. For example name of the fragrance and the size, concentration, and gender were all stored in one string. But order and keywords were variable. 
* Figuring out how each site's html file stored the content was an interesting challenge.

Issues Worked on:

* [#22](https://github.com/utk-cs340-fall23/FragranceFinder/issues/22) Create webscraper for jomashop.com

* [#23](https://github.com/utk-cs340-fall23/FragranceFinder/issues/23) Create webscraper for maxaroma.com

* [#25](https://github.com/utk-cs340-fall23/FragranceFinder/issues/25) Clean the parsed data from webscrapers into a standardized format 

# Files you worked on
* jomashop.py (backend/scrapers/jomashop.py)
* maxaroma.py (backend/scrapers/maxaroma.py)
* scrapingdemo.py (backend/scrapers/scrapingdemo.py)

# What you accomplished

I was able to successfully use playwright and beautifulsoup in order to create two working webscrapers. I used playwright in order to successfully retrieve the html file from jomashop by scrolling down the page because jomashop dynamically loads the page while scrolling. I used playwright for maxaroma in order to go to each individual fragrance page from the product list on the catalog page. Once I retrieved the html files I used beautifulsoup in order to parse the information I wanted. I created a standard format of Brand, Product Name, Concentration, Price, Size, Gender, and Link. Then I created a file called scrapingdemo.py in order to run both scrapers asynchronously. This is a demo of how our full product will run the scrapers asynchronously in the background. 

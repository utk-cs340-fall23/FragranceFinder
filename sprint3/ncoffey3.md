# Sprint 3
- Name: Nolan Coffey
- Github Username: ncoffey3
- Project: Fragrance Finder


## What you planned to do:
* Revamp the Jomashop scraper in order to be able to scrape the entire site instead of just the first page
* Redo the FragranceBuy scraper in order to scrape all necessary fields, mainly size and concentration
* Refine the FragranceBuy scraper in order to be able to scrape the entire site
* Database the FragranceBuy results

# What you did not do:
* N/A

# What problems you encountered:
* I had issues with databasing some jomashop fragrances due to the long length of the photolink that exceeded our databases column length. I solved this by altering our database model however. 

# Issues Worked on:
* [#69](https://github.com/utk-cs340-fall23/FragranceFinder/issues/69) Revamp Jomashop Scraper to Scrape Entire Site
* [#70](https://github.com/utk-cs340-fall23/FragranceFinder/issues/70) Create Scraper for FragranceBuy
* [#71](https://github.com/utk-cs340-fall23/FragranceFinder/issues/71) Database FragranceBuy results
* [#72](https://github.com/utk-cs340-fall23/FragranceFinder/issues/72) Alter database model to increase photolink column size

# Files you worked on
* backend\scrapers\jomashop.py
* backend\scrapers\fragrance_buy.py
* backend\utils\parsing.js
* backend\models\Fragrance.js

# What you accomplished

- I achieved my goal of revamping the jomashop scraper so now it has the capability to scrape the entire site. I let the scraper run for about 20 minutes and it scraped and databased over 10,000 fragrances. Jomashop is also a very quick scraper, this is due to the fact that it does not need to open individual fragrance pages, and instead can scrape all needed fields by just scrolling down the catalog page.

- I also achieved my goal of redoing the FragranceBuy scraper, unfortunately it cannot work the same as the jomashop scraper by just scrolling down the page. Instead it must go to each individual page, because this is the only way to scrape size and fragrance concentration. I was successful in redoing the scraper and it now has the capability of scraping the entire site and databasing the fragrances. I also added functionality that allows the user to specify the max number of items to scrape and then stop once those have been scraped. 

- I also altered our parsing script for proper error checking and our fragrance database model in order to be able to successfully database photolinks that are of a long length. I also helped my webscraping teammates start to database their fragrances. 


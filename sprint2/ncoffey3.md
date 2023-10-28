# Sprint 2
Name: Nolan Coffey
Github: ncoffey3
Project: Fragrance Finder

## What you planned to do:
* Work on making the Maxaroma scraper more robust for error checking
* Work on allowing the Maxaroma scraper to scrape the entire site or until cancelled instead of just the first page
* Work on database the results of Maxaroma
* Get started on a webscraper for Fragrancebuy.ca

# What you did not do:
* N/A

# What problems you encountered 
* Ensuring that the maxaroma webscraper would not crash was difficult due to many situations that needed to be accounted for
* Databasing the results were difficult due to the data types

# Issues Worked on:
* [#23](https://github.com/utk-cs340-fall23/FragranceFinder/issues/23) Create webscraper for maxaroma.com
* [#24](https://github.com/utk-cs340-fall23/FragranceFinder/issues/24) Database the Results from jomashop and maxaroma
* [#25](https://github.com/utk-cs340-fall23/FragranceFinder/issues/25) Clean the parsed data from webscrapers into a standardized format
* [#35](https://github.com/utk-cs340-fall23/FragranceFinder/issues/35) Using pandas to translate dataframes to a json after running webscraper
* [#51](https://github.com/utk-cs340-fall23/FragranceFinder/issues/51) Create Webscraper for Fragrancebuy.ca

# Files you Worked on:
*backend\models\Fragrance.js
*backend\scrapers\scrapingdemo.py
*backend\scrapers\MasterScript.py
*backend\models\FragranceListing.js
*backend\scripts\seedData.js
*backend\scrapers\maxaroma.py
*backend\scrapers\fragrancebuy.py


# What you Accomplished:

I accomplished my goals with the Maxaroma webscraper. It now potentially can scrape the entire site and should any error occur, none of the fragrances that had been scraped during the process will be lost. I also integrated the Maxaroma scraper with the database allowing our fragrances to be stored and display on the frontend page. I have a strong start on the fragrancebuy scraper and I will try to focus on databasing it. 

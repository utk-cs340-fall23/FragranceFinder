# Sprint 2
Stephen Souther (ssouther) FragranceFinder

### What you planned to do
- Define a uniform format for the scrapers to transfer data to the database updater script as json
- Modify one of the scrapers to output the format outlined above
- Create a master script that calls multiple scrapers and combines the output of all scrapers into one json
- Create a script that inserts or updates all of the data from the master script into the database while avoiding duplicate records
- Send emails for price changes if an item is on there watch list

### What you did not do
- The email notifications on price changes were not implemented due to the frontend team not working on the user accounts and watch list in this sprint

### What problems you encountered
- The scrapers were not outputting their price and size as floats so the data field in the database was changed to a string which would have caused a problem with finding price changes or new lowest prices if the field wasn't a float. This was changed back to a float at the last second by another backend team member.
- One of the websites had started a sales event which broke one of the scrapers and inserted incorrect data.
- Sequelize's documentation is very confusing and often not very helpful.

### Issues you worked on
- [#24](https://github.com/utk-cs340-fall23/FragranceFinder/issues/24) Database the Results from jomashop and maxaroma
- [#25](https://github.com/utk-cs340-fall23/FragranceFinder/issues/25) Clean the parsed data from webscrapers into a standardized format
- [#35](https://github.com/utk-cs340-fall23/FragranceFinder/issues/35) Using pandas to translate dataframes to a json after running webscraper

### Files you worked on
- backend\models\FragranceListing.js
- backend\scrapers\jomashop.py
- backend\scrapers\MasterScript.py
- backend\utils\dbUpdater.js

### What you accomplished
Even though I didn't create as many lines of code as I had in the previous sprint, the database updater script and master script both had to be made a top priority to reliably insert and update data so that the frontend team has a database with data in it. The master script was made such that it calls only one script and recieves json text from the script, it can be either the master script or an individual scraper because the way the json data is formatted, the database updater doesn't care which it is and will work regardless. Once the frontend team creates the user account and watch list system, then the database updater script will email users of a price change on an item that is on their watch list.
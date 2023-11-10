# Sprint 2
Stephen Souther (ssouther) FragranceFinder

### What you planned to do
- Reworked the database updater script for simplification of the code and to check user watchlists
- Reimplemented the email notification system
- Created a scraper for etiket.ca

### What you did not do
- Fix the issue of photo link sometimes not being found in the etiket.ca
- Implementation of etiket.ca scraper into the master script

### What problems you encountered
- The database updater code as it existed in its previous version was convoluted and potentially didn't align with the logic of how emails were being dealt with and was reworked as such
- Sequelize can't check for exact matches for float values so a work around had to be implemented to find the approximate value rather than an exact matches
- The etiket.ca scraper sometimes can't find the photo link from the page because the website doesn't consistently handle product images the same way

### Issues you worked on
- [#59](https://github.com/utk-cs340-fall23/FragranceFinder/issues/59) Simplify dbUpdate code
- [#52](https://github.com/utk-cs340-fall23/FragranceFinder/issues/52) Reintegrate email notifications with dbUpdater.js
- [#7](https://github.com/utk-cs340-fall23/FragranceFinder/issues/7) Create webscraper for etiket.ca

### Files you worked on
- backend\utils\dbUpdater.js
- backend\scrapers\etiket.py
- backend\scrapers\maxaroma.py

### What you accomplished
I had initially planned to reimplement the email notification system and create two scrapers, however, it was discovered shortly after that the database updater would need to be reworked to avoid sending one email for each product and to instead send only one email will all products on the user's watchlist. The code for the database updater was also simplified in the process. As a result I decided to create only one scraper and rework the database updater and reimplement email notifications.
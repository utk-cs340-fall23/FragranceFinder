# Sprint 1
Stephen Souther (ssouther) FragranceFinder

### What you planned to do
- Enable multipage hosting on the frontend using React-Router
- Create and email bot to email price, stock, and discount changes
- Defining how the webscrapers should output there data to the NodeJS server
- Inputting or updating the data from the webscrapers into the database by using the method defined by the previous point
- Creating a webscraper for scentrique.com and etiket.ca 

### What you did not do
- I couldn't get much of the needed data from the individual products on scentrique.com code.
- I didn't create a scraper for etiket.ca.
- I didn't input or update data in the database when the entry didn't exist or was modified.

### What problems you encountered
- Due to how the html code on scentrique.com was, this made it hard to find the exact data that was wanted but then I hit a wall where some data might be impossible to get because of the formatting of the website.
- The library we are using for interacting with the database is called sequelize and none of us are familiar with it and the decision to use this library didn't occur until the last week of this sprint.
- I had planned to make the scraper for etiket.ca and find a way to deal with scentrique.com to get the data I needed during fall break but I cought covid-19 on Friday before fall break and wasn't able to work on anything until late Sunday evening.

### Issues you worked on
- In the beginning, the React server didn't have multipage functionality which I implemented early on as I knew it would be needed later on by the frontend team
- I was attempting to at least get scentrique.com's scraper outputting the data we are interested in but ran out of time.
- I created an email notification system that sends and email if the webscraper returns data that is different to what is already in the database.
- The above point also defined how that data coming into the NodeJS server should be formatting however, in its current state, it can only handle one data entry at a time.

### Files you worked on
- server.js (backend/server.js)
- scraperfaker.py (backend/scrapers/scraperfaker.py)
- scentrique.py (backend/scrapers/scentrique.py)
- mail.js (backend/config/mail.js)
- mailRoutes.js (backend/routes/mailRoutes.js)
- App.js (frontend/src/App.js)
- email.js (frontend/src/pages/demos/email.js)
- email.css (frontend/src/pages/CSS/email.css)

### What you accomplished
I was able to get React-Router running very early on as it would be important later and I got the email bot setup for future use. I was able to create a method for checking an existing data entry against the data that was retrieved from the scrapers and detect if there was a change or not. If a change in price, discount, stock, or any combination of those three were detected, it would then send an email saying what changed. At the moment it can only handle one data entry at a time but next sprint is when processing multiple data entries will be added. I am still not very good with playwright and beautifulsoup which likely contributed to me not having much done with the webscrapers. I've also come up with a way that our webscrapers should be communicating with NodeJS which involves having a "master" script that will run each scraper for each website. Each webscraper will return json to the master script where the master script will combine all json outputs it got and send it to NodeJS for processing.

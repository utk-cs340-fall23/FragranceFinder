# Sprint 1
William Duff, Shm00py, Fragrance Finder

### What you planned to do
- Scrape Men's fragrance data (brand, title, size, price, and availability) on giftexpress.com
- Scrape Women's fragrance data (brand, title, size, price, and availability) on giftexpress.com
- Format the data to fit the uniform style we decided on
- Begin databasing the data
(Give a short bulleted list of the items you planned to do for this sprint. Include the github issue number and link to the issue)

### What you did not do
- I did not database the scraped information

### What problems you encountered
- giftexpress.com had a decent amount of bugs that had to be accounted for i the code, making the coding aspect a little less straight forward
- Formatting for the scraped data was different for each category of information, so there was a lot of time spent on figuring out what exactly needed to be formatted.

### Issues you worked on
(List the specific github issues that you worked on with a link to the issue (ex: [#1](https://github.com/utk-cs340-fall22/ClassInfo/issues/1) Sample Issue)

### Files you worked on
- giftExpress.py
(Give a bulleted list of the files in your github repo that you worked on. Give the full pathname.)

### What you accomplished
I accomplished scraping the data for the men's and women's catalogs of products on giftexpress.com. To do this, I had the program open up the
respective catalog pages, then scrape the data from the individual product pages. This looped until the final product on the final page of the catalog was scrapped.
When I was done scraping, I had to format the data. This took a lot of trial and error to figure out because each catagory of information was formatted differently 
on the website itself.

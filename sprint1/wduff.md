# Sprint 1
William Duff, Shm00py, Fragrance Finder

### What you planned to do
- Scrape Men's fragrance data (brand, title, size, price, and availability) on giftexpress.com [#16](https://github.com/utk-cs340-fall23/FragranceFinder/issues/16)
- Scrape Women's fragrance data (brand, title, size, price, and availability) on giftexpress.com [#17](https://github.com/utk-cs340-fall23/FragranceFinder/issues/17)
- Format the data to fit the uniform style we decided on [#19](https://github.com/utk-cs340-fall23/FragranceFinder/issues/19)
- Begin databasing the data [#20](https://github.com/utk-cs340-fall23/FragranceFinder/issues/20)

### What you did not do
- I did not database the scraped information
- There were a few pieces of information like concentration and gender that we had not initially discussed scraping that I am not scraping yet but would be easy to grab

### What problems you encountered
- giftexpress.com had a decent amount of bugs that had to be accounted for i the code, making the coding aspect a little less straight forward
- Formatting for the scraped data was different for each category of information, so there was a lot of time spent on figuring out what exactly needed to be formatted

### Issues you worked on
- [#16](https://github.com/utk-cs340-fall23/FragranceFinder/issues/16) Men's Scraping
- [#17](https://github.com/utk-cs340-fall23/FragranceFinder/issues/17) Women's Scraping
- [#19](https://github.com/utk-cs340-fall23/FragranceFinder/issues/19) Formatting Data
- [#20](https://github.com/utk-cs340-fall23/FragranceFinder/issues/16) Databasing Results

### Files you worked on
- giftExpress.py (FragranceFinder/backend/scrapers/giftExpress.py)

### What you accomplished
I accomplished scraping the data for the men's and women's catalogs of products on giftexpress.com. To do this, I had the program open up the
respective catalog pages, then scrape the data from the individual product pages. This looped until the final product on the final page of the catalog was scrapped.
When I was done scraping, I had to format the data. This took a lot of trial and error to figure out because each catagory of information was formatted differently 
on the website itself.

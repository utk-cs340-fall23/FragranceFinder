# Sprint 2
William Duff, Shm00py, Fragrance Finder

### What you planned to do
- Scrape Men's fragrance data (brand, title, concentration, size, price, gender, availability, image link, and link to the page) on aurafragrance.com [#37](https://github.com/utk-cs340-fall23/FragranceFinder/issues/37)
- Scrape Women's fragrance data (brand, title, concentration, size, price, gender, availability, image link, and link to the page) on aurafragrance.com [#38](https://github.com/utk-cs340-fall23/FragranceFinder/issues/38)
- Format the data to fit the uniform style we decided on [#39](https://github.com/utk-cs340-fall23/FragranceFinder/issues/39)
- Begin databasing the data [#40](https://github.com/utk-cs340-fall23/FragranceFinder/issues/40)

### What you did not do
- I was able to accomplish all of my tasks

### What problems you encountered
- aurafragrance.com had a ton amount of formatting differences and typos that had to be accounted for in the code, making the formatting a time consuming process.
- There was a little confusion towards the end of the sprint about what the database could actually handle.

### Issues you worked on
- [#37](https://github.com/utk-cs340-fall23/FragranceFinder/issues/37) Men's Scraping
- [#38](https://github.com/utk-cs340-fall23/FragranceFinder/issues/17) Women's Scraping
- [#39](https://github.com/utk-cs340-fall23/FragranceFinder/issues/19) Formatting Data
- [#40](https://github.com/utk-cs340-fall23/FragranceFinder/issues/40) Get Data Ready to be Databased

### Files you worked on
- giftExpress.py (FragranceFinder/backend/scrapers/giftExpress.py)
- aura.py (FragranceFinder/backend/scrapers/aura.py)

### What you accomplished
I accomplished scraping the data for the men's and women's catalogs of products on aurafragrance.com. To do this, I had the program open up the
respective catalog pages, then scrape the data from the individual product pages. This looped until the final product on the final page of the catalog was scrapped.
When I was done scraping, I had to format the data. This took a lot of trial and error to figure out because each catagory of information was formatted differently 
on the website itself.

# Sprint 2
William Duff, Shm00py, Fragrance Finder

### What you planned to do
- Scrape Men's fragrance data (brand, title, concentration, size, price, gender, image link, and link to the page) on venbafragrance.com [#37](https://github.com/utk-cs340-fall23/FragranceFinder/issues/37)
- Scrape Women's fragrance data (brand, title, concentration, size, price, gender, availability, image link, and link to the page) on venbafragrance.com [#38](https://github.com/utk-cs340-fall23/FragranceFinder/issues/38)
- Format the data to fit the uniform style we decided on [#39](https://github.com/utk-cs340-fall23/FragranceFinder/issues/39)
- Make data database compatable [#40](https://github.com/utk-cs340-fall23/FragranceFinder/issues/40)

### What you did not do
- I was able to accomplish all of my tasks

### What problems you encountered
- The initial site I was trying to scrape turned out to be impossible to scrape in the way that I needed to because of how the site loaded, so I had to switch to venbafragrance.com a little later in the sprint.
- Setting up the database on my computer had a huge learning curve, which took some time

### Issues you worked on
- [#37](https://github.com/utk-cs340-fall23/FragranceFinder/issues/37) Men's Scraping
- [#38](https://github.com/utk-cs340-fall23/FragranceFinder/issues/17) Women's Scraping
- [#39](https://github.com/utk-cs340-fall23/FragranceFinder/issues/19) Formatting Data
- [#40](https://github.com/utk-cs340-fall23/FragranceFinder/issues/40) Get Data Ready to be Databased

### Files you worked on
- giftExpress.py (FragranceFinder/backend/scrapers/giftExpress.py)
- aura.py (FragranceFinder/backend/scrapers/aura.py)
- venba.py (FragranceFinder/backend/scrapers/venba.py)
- MasterScript.py (FragranceFinder/backend/scrapers/MasterScript.py)

### What you accomplished
I accomplished scraping the data for the men's and women's catalogs of products on venbafragrance.com. To do this, I had the program open up the
respective catalog pages, then scrape the data from the individual product pages. This looped until the final product on the final page of the catalog was scrapped.
When I was done scraping, I had to format the data. This took a lot of trial and error to figure out because each catagory of information was formatted differently 
on the website itself. I then wrote code for the data to be databased once the program ran in MasterScript.py.

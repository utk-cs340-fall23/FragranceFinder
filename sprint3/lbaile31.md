# Sprint 3
Name: Lakelon Bailey:
GitHub username: LakelonBailey
Project: Fragrance Finder

## What you planned to do:
* Add the ability to sort fragrance results.
* Add a general search bar for fragrance browsing.
* Add the ability to add/remove items from watchlist.
* Add the ability to view watchlisted/un-watchlisted items.

# What you did not do:
* N/A

# What problems you encountered
* N/A

# Issues Worked on:
* [#13](https://github.com/utk-cs340-fall23/FragranceFinder/issues/13) Create search bar
* [#43](https://github.com/utk-cs340-fall23/FragranceFinder/issues/43) Create API endpoint for determining search defaults
* [#45](https://github.com/utk-cs340-fall23/FragranceFinder/issues/45) Style sign in page
* [#46](https://github.com/utk-cs340-fall23/FragranceFinder/issues/46) Style sign up page
* [#55](https://github.com/utk-cs340-fall23/FragranceFinder/issues/55) Add ability to sort fragrance browsing results
* [#56](https://github.com/utk-cs340-fall23/FragranceFinder/issues/56) Add ability to add/remove items from watchlist
* [#57](https://github.com/utk-cs340-fall23/FragranceFinder/issues/57) Add ability to filter watchlisted/un-watchlisted items

# Files you worked on
* backend/routes/watchlistRoutes.js
* frontend/src/components/Browsing.js
* frontend/src/components/AuthForm.js
* backend/routes/fragranceListingRoutes.js
* frontend/src/components/Navigation.js
* backend/scrapers/MasterScript.py
* backend/models/Fragrance.js
* backend/actions/watchlistActions.js
* backend/actions/fragranceListingActions.js
* frontend/src/utils/requests.js
* frontend/src/components/FragranceListings.js
* frontend/src/pages/Home.js
* frontend/src/utils/auth.js
* frontend/src/pages/Signup.js
* frontend/src/assets/css/auth.css
* frontend/src/components/FragranceListingCard.js
* backend/utils/auth.js
* backend/actions/index.js
* backend/models/index.js
* backend/routes/userRoutes.js
* backend/routes/index.js
* backend/utils/parsing.js
* frontend/src/pages/Login.js
* frontend/src/assets/css/navbar.css
* backend/utils/dbUpdater.js
* backend/scripts/seedData.js
* frontend/src/components/FilterBar.js

# What you accomplished
Main tasks:
- I added the ability to sort fragrance results on 8 different field and direction combinations.
- I implemented a search bar for fragrance browsing that searches key words against brand, title, and gender.
- I added the ability for users to add/remove items from their watchlist from the browsing interface.
- I added the ability for users to filter fragrances on watchlisted status if they are logged in.

Additional tasks:
- I improved state management/performance across a few existing components.
- I styled the login and signup pages with react-bootstrap components.
- I improved file structure by separating actions from routes.

Overall, I accomplished the completion of all MVP functionality associated with the web application. This encompasses almost all of my responsibility for the project, as I decided to work on the web application while the others created scrapers for all the websites. In the final sprint, I plan on improving styling and frontend state management/performance. I also plan on helping out the team in finishing their tasks if needed.
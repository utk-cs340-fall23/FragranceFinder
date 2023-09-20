# Fragrance Finder
## Setup
### Install Node
1. Install the latest version of node at [NodeJs.org](https://nodejs.org)
### Install MySQL
1. Install the latest version of MySQL at [MySQL.com](https://www.mysql.com/downloads/)
### Clone Repo
2. Clone repository found at [github.com/utk-cs340-fall23/FragranceFinder](https://github.com/utk-cs340-fall23/FragranceFinder)
### Install Dependencies
3. Open 2 separate terminals. One for the backend folder of the project, and one for the frontend folder of the project.
4. In each folder, run `npm i` to install respective dependencies. The backend and frontend both have their own dependenices. Information on these dependencies is found in their associated `package.json` files.
### Load DB Schema
5. Run `npm run load-db-local` in the backend folder to load the database schema into MySQL `fragrance_finder_db` database.
### Start servers
6. In the backend folder, run `npm run start`
7. Now, in the frontend folder, run `npm run start`. This should open a browser window at http://localhost:3000. This is the location of the frontend. If the frontend says "TEST API ENDPOINT SUCCESS", this means your frontend is correctly interacting with the backend API.
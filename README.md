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
### Start servers
5. Starting backend: run `npm run start` in the `backend` directory.
6. Starting frontend: run `npm run start` in the `frontend` directory.
### Using Web Scrapers
7. Our web scraping scripts are written in Python. They require usage of a Python virtual environment. In order to create this, move to the `backend` directory and run `python3 -m venv venv`. This will create a virtual environment called `venv`. To activate the environment, run `source venv/bin/activate`. Finally, in order to install Python dependenices, run `pip install -r requirements.txt`.
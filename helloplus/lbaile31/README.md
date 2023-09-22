# CRUD Example for Hello World Plus
I created a CRUD example for this assignment. This demonstrates basic stage management and RESTful API requests on the frontend, and basic database interaction on the backend. These are skills that will be necessary for this project. The frontend code for this is found in `frontend/src/CrudExample.js`. The backend code for this is found in `backend/routes/basicCrudRoutes.js`;

# Install instructions
1. Download and install the latest version of [Nodejs](https://nodejs.org)
2. Download and install the latest version of [MySQL](https://www.mysql.com/downloads/)
3. Clone the repository's "dev" branch [github.com/utk-cs340-fall23/FragranceFinder](https://github.com/utk-cs340-fall23/FragranceFinder)
4. Open a teminal in both the frontend and backend folders and run the command `npm i` to install each folder's dependencies.
5. Create a .env file in the backend folder and define the following:
   * DB_HOST=localhost
   * DB_USER=root
   * DB_PASSWORD=(enter a password if one is set)
   * DB_NAME=fragrance_finder_db
6. Load the database schema with the command `mysql -u <username> -p < schema/schema.sql` while in the backend folder.
7. Run the command `npm run start` in the main project directory.
8. Open your browser and go to http://localhost:3000/crud to view the page I created.
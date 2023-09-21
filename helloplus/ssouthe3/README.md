# React multipage handler
I made modifications to the [App.js](https://github.com/utk-cs340-fall23/FragranceFinder/blob/dev/frontend/src/App.js) file in "frontend/src" folder that activated React-Router and added the sub directory "pages" in the same folder that will contain all of our webpages. Before this, Lakelon Bailey had written a database read and write example in [App.js](https://github.com/utk-cs340-fall23/FragranceFinder/blob/dev/frontend/src/App.js) which I then moved into it's own [webpage](https://github.com/utk-cs340-fall23/FragranceFinder/blob/dev/frontend/src/pages/CrudExample.js) and then created [index.js](https://github.com/utk-cs340-fall23/FragranceFinder/blob/dev/frontend/src/pages/index.js) in the "pages" sub directory that contains links to each of our team member's hello plus demos. After I had accomplished this, I then moved on to my original goal which was to create the backend code for sending a "hello world" email.

# Email bot hello world
After multipage viewing was setup then I moved on to making the backend and frontend components for the email bot's hello world. I started by creating the [email.js](https://github.com/utk-cs340-fall23/FragranceFinder/blob/dev/frontend/src/pages/email.js) file in the "pages" sub directory and wrote the html for the client side display and the POST request handling to pass the entered email address to the backend. This required me to modify [server.js](https://github.com/utk-cs340-fall23/FragranceFinder/blob/dev/backend/server.js) in the backend folder and added the "/api/email" post handle and added code to [server.js](https://github.com/utk-cs340-fall23/FragranceFinder/blob/dev/backend/server.js) to login to an SMTP email service using [Nodemailer](https://nodemailer.com/).

# Install instructions
1. Download and install the latest version of [Nodejs](https://nodejs.org)
2. Download and install the latest version of [MySQL](https://www.mysql.com/downloads/)
3. Clone the repository's "dev" branch [github.com/utk-cs340-fall23/FragranceFinder](https://github.com/utk-cs340-fall23/FragranceFinder)
4. Open a teminal in both the frontend and backend folders and run the command `npm i` to install each folder's dependencies.
5. Create a .env file in the backend folder define the following:
   * EMAIL_HOST=(your email service's SMTP domain name)
   * EMAIL_PORT=(your email service's SMTP port number)
   * EMAIL_SECURE=false
   * EMAIL_USER=(your email address)
   * EMAIL_PASS=(your email addresses password)
   * DB_HOST=localhost
   * DB_USER=root
   * DB_PASSWORD=(enter a password if one is set)
   * DB_NAME=fragrance_finder_db
6. Load the database schema with the command `npm run load-db-local` while in the backend folder
7. Run the command `npm run start` in both the frontend and backend folders
8. Open your browser and go to http://localhost:3000/email

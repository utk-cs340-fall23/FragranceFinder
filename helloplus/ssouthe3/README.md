# React multipage handler
I made modifications to the App.js file in "frontend/src" folder that activated React-Router and added the sub directory "pages" in the same folder that will contain all of our webpages. Before this, Lakelon Bailey had written a database read and write example in App.js which I then moved into it's own webpage and then created index.js in the "pages" sub directory that contains links to each of our team member's hello plus demos. After I had accomplished this, I then moved on to my original goal which was to create the backend code for sending a "hello world" email.

# Email bot hello world
After multipage viewing was setup then I moved on to making the backend and frontend components for the email bot's hello world. I started by creating the email.js file in the "pages" sub directory and wrote the html for the client side display and the POST request handling to pass the entered email address to the backend. This required me to modify server.js in the backend folder and added the "/api/email" post handle and added code to server.js to login to an SMTP email service using nodemailer.

# Install instructions

# Sprint 1

Name: Lakelon Bailey:
GitHub username: LakelonBailey or OutliersAdvantage
Project: Fragrance Finder

## What you planned to do:
* Complete login page skeleton
* Complete signup page skeleton
* Complete authentication/authorization flow and middleware
* Establish baseline database models



# What you did not do:
* N/A


# What problems you encountered
* Some GitHub conflict issues.
* Due to not reading the sprint requirements well enough earlier on into the sprint, I did not properly utilize GitHub for my work. More specifically, I did not include the issue number in my commit messages. I plan on rectifying this in future sprints as well as working on issues in issue-specific branches, e.g. `issue-26/login-page`.

# Issues Worked on:
* [#5](https://github.com/utk-cs340-fall23/FragranceFinder/issues/6) Create user authentication/authorization mechanism

* [#6](https://github.com/utk-cs340-fall23/FragranceFinder/issues/6) Create database schemas with Sequelize

* [#26](https://github.com/utk-cs340-fall23/FragranceFinder/issues/26) Create login page skeleton

* [#27](https://github.com/utk-cs340-fall23/FragranceFinder/issues/2) Create signup page skeleton

# Files you worked on
* frontend/src/index.js
* frontend/src/setupTests.js
* frontend/src/App.js
* sprint1/lbaile31.commits.txt
* frontend/src/utils/auth.js
* backend/models/UserFragrance.js
* backend/utils/auth.js
* backend/config/db.js
* frontend/src/reportWebVitals.js
* backend/routes/mailRoutes.js
* package.json
* backend/package.json
* frontend/src/pages/Login.js
* frontend/src/utils/requests.js
* backend/routes/index.js
* frontend/src/pages/Signup.js
* frontend/src/pages/index.js
* backend/models/User.js
* README.md
* frontend/src/pages/CSS/crudexample.css
* backend/models/Fragrance.js
* backend/routes/user-routes.js
* frontend/src/pages/demos/CrudExample.js
* frontend/src/App.test.js
* frontend/src/pages/demos/email.js
* backend/models/index.js
* backend/server.js
* frontend/src/setupProxy.js
* frontend/package.json
* backend/requirements.txt
* frontend/src/App.css
* backend/routes/basicCrudRoutes.js
* backend/models/FragranceListing.js
* frontend/src/index.css

# What you accomplished
I successfully created the user authentication/authorization flow.

- As part of authentication, I created the login page and the signup page skeletons. These allow users to log into an existing account or create a new account. Once one of those actions is complete, a JSON Web Token (JWT) is created to be passed in the Authorization header in all requests as a Bearer token.

- As part of authorization, I developed an authorization middleware that can be applied to any endpoint. This middleware will verify the Bearer token that is sent with the request, and will return a 401 (Unauthorized) error if the token is invalid (expired, not signed with the correct secret, etc.). On the frontend, I developed a few utilities (sendGet and sendPost) to be used for requests. These automatically apply the existing token to the Authorization header if it is found in localStorage.

I also created the initial versions of the database models that will be used in the project. These models and their relationships can be found in the `backend/models/` directory.

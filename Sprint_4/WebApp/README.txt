********************** What Has Been Done ********************

• Implemented the button to take the user to the bottom/top of the page after starting 
scrolling 150px down of the page (otherwise is hidden). File => scroll.js.

• Set up the background of the pages with relevant images and semi-transparent tables, which
where redesigned.

• Added the filtering options by Nahid. Works flawlessly 👏. Restructured them and eliminated the 
redundant code by creating a formSetup.js and a formTemplate.pug which are imported on the pages
where the filters are needed. Code looks clean.

• Done authentication. The registration and login process works perfectly, same with logout.
Only Home is accessible for unregistered users. login/logout process sent the user back to Home
page. Files => login and register.pug (navbar.pug was altered accordingly), authentication,
authMiddleware and passport-config.js. index.js has code lines addition as well, and all the report
route pages suffered slight changes necessary for checking if the user is logged in or not for
website accessibility.

• A new necessary users table schema has been created (in the same world.sql database).

• Styled the login/register pages.

• Enforced the use of .env to contain all sensitive data and to be appropriately incorporated in 
.gitignore.

• Better authentication error handling. Ex: 'Email already in use', 'Wrong password', etc.

• Restructured the whole project because as the project grew, I found it difficult to find 
certain files at times. The files are still in the required main directories, but in subdirectories.

• Added a contact page, created a new Gmail address: contact.ment.team@gmail.com and using nodemail
all messages sent in real-time are instantly redirected and sent to that email address. 
Files => contact.js and contact.pug, index.js modified to accommodate the contact page route, 
footer.pug modified to contain the link to the Contact page.

• Predefined Admin user credentials, which have the right to Add and Delete the data within the tables,
once logged in. The files insertion flows from Country -> City -> Capital -> Language and deletion
flows from Language -> City -> Country as there are key constraints and is the logical way to do it.
Deleting the country will produce a cascade effect and delete all the cities and languages associated
with that country from the respective tables. An attention message which explains it is displayed.
Files => The whole folder of src/models/repositories, addCapital.pug, addCity.pug, addCountry.pug,
addLanguage.pug, deleteCity.pug, deleteCountry.pug, deleteLanguage.pug. 
index.js and navbar.pug suffered slight modifications as well.


********************** To Do ********************

• Fix the duplicates entries of cities, countries and languages with proper checks and error handlings
when adding new data. The capital must not allow a country to have more than one capital. All these
needs to be changed in its .js equivalent files in the src/models/repositories folder.

• When delete a city, the country id capital must be deleted as well, in deleteCity.js.
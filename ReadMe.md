# iBill  
Live Demo: https://ibill.herokuapp.com/
## Summary
iBill is an application that allows users to log items sold to customers.
## Usage
- Create, Update, Delete, Retrieve items in a Sortable and Searchable table
## UI/UX 
The user gets started by clicking the Register link for an account, and then sign in to be redirected to their own dashboard. In this application, one user account can create and store their own list of items which make up their billing database. 
The landing page provides basic information and instruction of usage for the iBill application.
<p align="center">
   <img src="https://github.com/nnh242/ibill/blob/master/public/screenshots/index.PNG">
</p>
The user can sign in with exsiting account or register then sign in.
            
I want to give the user simplicity and ease of access while using this application, so I kept the UI clean and simple.
           
Credit to Gravit Designer Tutorials for the UI inspiration of this application.

The user can sign in with exsiting account 

![LogIn ScreenShot](https://github.com/nnh242/ibill/blob/master/public/screenshots/login.PNG)

or register then sign in.

![Register ScreenShot](https://github.com/nnh242/ibill/blob/master/public/screenshots/register.PNG)

I want to give the user simplicity and ease of access while using this application, so I kept the UI clean and simple.Credit to Gravit Designer Tutorials for the UI inspiration of this application. At a glance of the dashboard, the user can see all items orderered. Each billing database is unique to the user's account. The orders are displayed in a sortable and searchable data table. The user can sort orders by order number, customer's name, order's description and amount. In the search box above the data table, the user can type in any keyword and the table will dynamically filters and displays only matching orders. This is a useful feature to quickly see how many orders are made by a single customer or to find information of a single order when user only remembers one of the inputs such as price or order number. 

![Dashboard ScreenShot](https://github.com/nnh242/ibill/blob/master/public/screenshots/dashboard.PNG)

## API:
* Items
    * CREATE: api/items- POST to to this endpoint and a valid request will create an item with an id in the response
    * READ:  
        * api/items/ - GET all items in the user account to display on the dashboard 
        * api/items/:id - GET an item by id
    * UPDATE: api/items/:id - PUT request to this endpoint will update the item's fields (order number, client, price, quantity)
    * DELETE: api/items/:id - DELETE request to this endpooint to delete a specific item
* Users
    * CREATE: To register a new user, the endpoint is api/users/register 
    * READ: To log in, GET user by id, the endpoint is api/users/:id

## Technologies
* Front-End
    * HTML
    * CSS
    * Javascript
    * Notify.js
    * DataTables
* Back-End
    * Node.js
    * MongoDB
* Authentication
    * Passport.js
    * JWT
    * bscrypt
* Testing
    * Mocha
    * Chai
    * Faker.js


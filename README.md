## How to install app

Install Npm, then install angular by :
npm install -g @angular/cli

then just open a terminal in the project's folder and run npm install.
This will install all dependencies and packages.

## How to run the app

To simply run the app, run ng serve

## To run the the app on mobile too

run ng serve --host 0.0.0.0 --port 4200 or any unused port

## Fake SSL Certificate generated by openSSL package 

I created a fake SSL Certificate for mobile devices because the browser on my Iphone wouldn't allow the navigator.geolocation.getCurrentPosition() to work
unless it was https instead of http, and I'm using the navigator for the WeatherApi.

If it gave you an error, just turn airplane mode on then off to refresh your location, that will fix it

## To run the app on all platforms (desktop or mobile) and with the SSL certificate

ng serve --ssl true --ssl-key "C:\path\to\localhost.key" --ssl-cert "C:\path\to\localhost.crt" --host 0.0.0.0 --port 4200
Which is the below in my case:
ng serve --ssl true --ssl-key "C:\Users\Baraa Asus\Desktop\University\Submitted Work\Itxi\Itxi\Localhost SSL\localhost.key" --ssl-cert "C:\Users\Baraa Asus\Desktop\University\Submitted Work\Itxi\Itxi\Localhost SSL\localhost.crt" --host 0.0.0.0 --port 4200

## To build the app

Run ng build --configuration=production

## To compile the scss pages and pass them to styles.scss at development, run

npm run watch:sass

## To compile and compress the scss files we install the following packages and npm-run-all to run them all togethor

npm install sass npm-run-all postcss autoprefixer postcss-cli --save-dev

## Then, execute the build command to run all the sass commands

npm run build:sass

## I went complete zoneless

Since I'm utilising signals, I removed zoneJs and went full zoneless. However, I added the package back for the unit tests because I got error "in this configuration angular requires zone.js" and it seems I need to change all my unit tests to apply the transformation. Aa a conclusion, I added back zoneJs to the spec files, but the real angular app is completely zoneless!

---

## Navigating the App: Step-by-Step Guide

### The User Flow

The user selects the products he/she liked from either the landing-page or the product-page, then he/she opens the cart, either alter the cart or leave as it is and pay for his products. The pay button in the cart will then take him to the homepage, as the user successfully purchased his items. (I didn't do a payment page as that won't add any value to the app since I'm not really using a backend and fakestoreapi doesn't support such one)

### Landing-page

The user will be introduced first to the login page where he will see a product of each category, alongside four buttons that navigate the user to the products section of the chosen category.

After the introduction section, there is the weather-advised clothing section, where we suggest 1 pair of cloth (1 piece per gender) according to the weather conditions, and each product has a navigation link that takes the user to the product page where all the product's details are displayed.. For example, if its sunny, we suggest a lightweight T-shirt, whereas if it was rainy, we suggest a jacket, and so on. However, to fetch the weather codes of the user and suggest the cloth accordingly, we need the user to allow us to know his/her location. If, the user didn't allow us to have his/her location, we suggest any cloth without displaying any animations regarding the weather.And all this is over a video showing the process of manufactoring the cloth.

In our 3rd section, our main section, we offer the user our 4 categories which he can select each to fetch its products or disselects to fetch all products. In addition to using the input search field to search the product by name (if it's already in store because there is no such option api in the fakestore api) or by id (which is supported on the fakestoreapi). And when the user empties the search input field, fetched proucts (category's products or all products) displays again instead of the searched products and no http request will be sent hence.

I made sure that the app is user-friendly by implementing features like horizontal scrolling on the products when they aren't fitting in the whole screen width (100vw, in other words, when there are more than 6 products for example), and ensured to return back the normal vertical scrolling when the screen width is enough for displaying all the products.

In a real app, infinite loading or pagination would be used in fetching the products, but no such feature is supported by the fakestoreapi, as there are no api endpoints that provides an offset, only a limit.

### Product-page

In addition of displaying all the details of the product, it also suggests similar related products as it slideshows them at the 2nd section of the page. In our case, there are only 20 products in total in the fakestoreapi, so there aren't really much products that I can suggest, that's why I am suggesting all products instead of real related products.

### Cart

The cart is always saved at the locatStorage of the browser to save its state between pages and to return it back to the user the next time he/she visits again our page. The cart can be added to it from the product-page or the landing-page at the products section. 

The products' quantities are synched between the cart and the product quantity displayed at the product page.

When the user removes an item from the cart, it instantly removes the active class from the cart icon/button found in the product card in the landing page and in the product page.

The user can either remove the item from cart by decrementing its quantity to 0 or by directly pressing on the trash can icon.

### Saved Items

The user can't save an item unless he/she is logged in as the saved items should be saved and fetched from the backend database.

And when the user tries to view his/her saved items without being logged in, he/she will be kindly asked to login instead. 

### Log-page

This component is responsible for letting the user to create an account, login, or to reset his/her password, and it flows as following:

When the user enters an email. Since we are using a fake backend, I created 3 scenarios.

- I placed 1 correct email that will let the user sign in successfully on the fakestoreapi.
- I placed 1 custom email (wrong email) that functions as a non-existent email so when the user enters it, it will simulate a waiting time of a http response and returns an error.
- The user enters any different email of the above cases which will lead the user to creating an account.

After the user enters the email, the user will be:

- proceeded to the password section, where he/she will be asked to enter any single password and will be logged in afterwards.
- asked to enter an existent email.
- proceeded to the password section, where he/she will be given 2 password input fields to fill and will have his/her account created afterwards.

Also, the user will be given an option to change the email at the password section which will redo the email validation process. And he/she will also be given an option to reset password in the password section, but it only takes in his/her email and return him to the email validation step as we are operation on a fake backed(fakestoreapi), so I can't really reset the password.

It's worth noting that the animations are really worked on to ensure that they all run extremely smoothly without irritating the eye of the user, and to add a sense of motivation for the user to sign in or create an account as it removes the boredness of the log process. 

### Header

The header is only shown on desktops and contains the following:

- 1 optional search field which is displayed when the user is on the landing page , and it's responsible for searching for the product/s

- A character avatar which upon hovering over, will display a nav that lets the user navigates between the pages

- A menu containing 2 icons, one responsible for openeing the cart, and one responsible for opening the saved items.

### Footer

The footer showcases the 4 main advantages of the store, and provides navigation icons for the socials of the store.

### Mobile Navigation Menu

This component is only shown on mobile devices as it takes the responsibilities of the header, which is providing the navigation links of the pages, and opens the cart and the saved items. The search input field of the header is now displayed after the 4 categories' buttons in the landing page instead of the header.

## What can a user do

### A user with an account vs a user without an account

Most of the website functionalies can be accessed without creating an account. Since this is an e-commerce app, we don't want the user to be encouraged to leave the app by requesting him/her often to sign in. Instead to encourage the user to make purchases quickly and at ease, we don't ask him/her to sign in to be able to make purchases.

Both users, with or without an account can :

- use the cart freely.
- purchase any product.
- navigate through the products and search for a product.

However, the user with an account can save a product, whereas the user without an account can't.

## Security & Restrictions

I placed many restriction and security measures to prevent unwanted or malicious acts such as saving a product without signin in or doing an sql injection. Input Regex and Jwt are one of the examples I used to in implementing these restriction and security measures .

## Possible Enhancements

-  Implementing a PWA could reduce the number of HTTP requests sent to the backend by utilizing offline caching, allowing previously fetched data, such as products, to be reused without requiring repeated requests.

- Corporating SSR could significantly enhance the app's performance by pre-rendering the initial page on the server. This approach improves loading times and provides a better user experience, especially for users with slower networks or devices, while also improving SEO for the app ( However, this isn't currently related as we are focusing on performance in this assessment).

- The heavy load of signals could have been reduced by using normal variables instead of signals in cases where change detection is not a concern after the initial setup of the component.

## Responsivity

I developed the app for 2 screens mainly ( it's responsive for most mobiles and desktops, but it won't be perfect except on iphone 13 and on 2560 x 1600 laptop screen), since it's only an assessment. I ensured and tested its responsiveness on iphone 13 mobile screens and on my 2560 x 1600 laptop screen.

## Working Hours

Around 160-180 hours were spent on this project.







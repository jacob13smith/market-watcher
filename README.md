# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* This is a reusable repository containing code for generic resource management operations.
* Version 1.0.0

### How to setup ###

* Setup .env file credentials to work with your mongo database. Set the secret to a random hash ( this is for sessions ).
* `yarn` installs all dependencies.
* `yarn build` runs webpack and compiles everything in public/js/public.js.
* `yarn start` runs node index.js to start the server.

### Back-end folers/files ###
* /routes - This folder is where you write your endpoints. Look at test for example case.
* /lib - All back-end classes / modules reside here.
* /RouteHandler - This class handles your apps back-end routing, it refers to Routes.js for all first level endpoints.
* /Email - Just a simple class using nodemailer to send out emails.
* /DB - Class that connects to your mongo database using your credentials in .env.
* /DBHandler - Static class you can call in any file to make database calls to the connected database.
* /DBCollections - Defines each collection in /db.

### Front-end folders/files ###
* /public - This folder is where front-end related code resides.
* /public/components - This folder is where your Vue structure lives. Everything is based off App.vue.
* /public/js/routes - Vue-Routing.
* /public/js/store - Vuex.
* /public/js/modules/ - If your front-end scales too large for your store.js file you can use this folder to chunk sections of your code.
* /public/scss/ - public is relative to all apps using this framework. Private is overwritten on a specific app using this framework.
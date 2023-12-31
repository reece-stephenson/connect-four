# Connect Four

Connect four is a game where two players can compete in turns to mark a position in a grid. The winner is the player who
successfully managed to connect four dots is declared the winner. This online version allows player to connect together and play
the same game session

# Dependencies
Using Node.js v18.16.0

## frontend

````"cookie-parser": "^1.4.6",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-bearer-token": "^2.4.0",
    "express-rate-limit": "^6.7.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.3.1",
    "nodemon": "^1.14.9",
    "ws": "^8.13.0"```
````

## identity server

```
    "argon2": "^0.27.1",
    "cors": "^2.8.5",
    "crypto-js": "^4.1.1",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-bearer-token": "^2.4.0",
    "express-rate-limit": "^6.7.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.3.0",
    "pure-uuid": "^1.6.3"

```

</br>

# Database

The application makes use of a mongoDB database as the primary resource store of the application.
The following steps are required to create your own MongoDB cluster which can be used with the local instance of this application.

1. visit `https://mongodb.com/atlas/cluster/register` to register and open a free mongoDB account
2. Enter your full name, email address and password, and agree to the terms and conditions of the service to sign up
3. You should be prompted to `build your own cluster`.
4. Select your cloud provider (AWS)
5. Select any of the free tier regions that are available to instantiate the database.
6. Select `MO sandbox` cluster and name your DB cluster appropriately
7. Navigate to `Security > Database Access ` and click on `add new user` to create a database user for the cluster
8. Provide username, password and privileges
9. Navigate to `Security > Network Access ` and whitelist the network(s) IP address that will be used to access the cluster
10. Once the cluster is instantiated, click on `connect` on the cluster and then `connect your application (drivers)` in order to obtain
    the connection string from step 3. The connection string should be in the format `mongodb+srv://<username>:<password>@<cluster>/?retryWrites=true&w=majority`

</br>

# Environmental Variables

Set up a .env file with the following variables in the respective folders

## identity service
```
MONGO_URI = {database connection string obtained from previous steps}
APP_URL = "http://localhost:3000"
NODE_ENV="development"
```

## frontend

```
MONGO_URI = {database connection string obtained from previous steps}
ID_URL = "http://localhost:4001"
NODE_ENV = "development"
```

</br>

# How to Run
Connect Four has been created using NodeJS version 18, so you will need this version to run the application. 

## frontend

navigate to the subdirectory

`cd frontend`

install all dependencies

`npm install`

run the application

`npm start`

you should see a message in your terminal
```
Successfully connected to database
server running on port 3000 in development mode
```

## identity service

navigate to the subdirectory

`cd identity_service`

install all dependencies

`npm install`

run the application

`npm start`

you should see a message in your terminal
```
Successfully connected to database
server running on port 4001 in development mode
```

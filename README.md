# connect-four

Connect four is a game where two players can compete in turns to mark a position in a grid. The winner is the player who
successfully managed to connect four dots is declared the winner. This online version allows player to connect together and play
the same game session

# dependencies

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

# environmental variables

set up a .env file with the following variables

`MONGO_URI = {db-url}
PORT (identity server) = 5000 (default)
PORT (app) = 4001 (default)`

# how to run

## frontend

navigate to the subdirectory

`cd frontend`

install all dependencies

`npm install`

run the application

`node app.js`

## identity service

create an instance of a mongoose database and assign the instance link to the
`MONGO_URI` variable

`MONGO_URI ={database-url}`
navigate to the subdirectory

`cd identity_service`

install all dependencies

`npm install`

run the application

`node index.js`

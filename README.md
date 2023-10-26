# login_register_backend
This is the login and registration repository. The code is made in NodeJS on 25.10.2023 and the database is in MongoDB.
Let's go over all the files and folders in alphabetical order.
The config folder has db.js and default.json.
In db.js we setup the MongoDB database and connect to MongoDB.
In default.json we have to put the MongoDB URI to connect to our MongoDB Atlas Database.
We also put the jwtSecret as per our wish.
The middleware folder has auth.js which is used as a middleware to verify the tokens for secure access.
In the models folder we define the Schema for Users.
We take in name, email, user*name and password as input to register the user and that has been defined in the Schema.
The email id and the user_name has to be unique.
Routes folder has another folder inside called api inside which there are two files - auth.js and users.js.
The auth.js is used for both loggin in the user using jwtoken. It checks if email or user_name exists. The user is free to use either email or username for loggin in. Along with that the user will have to enter the password.
Also, if the user has just registered then he can directly login has he will have the token.
users.js is used to register a user.
The user has to enter name, email, user_name and password as input to register.
Name can only be alphabet, number, dot(.), dash(-), underscore(*) and blank*space( ).
The email has to be in valid emaid format.
The user name can only be alphabet, number, dot(.), dash(-) and underscore(*).
This is done so as to differentiate user name and email.
Password has to have 8 characters with at least one alphabet one number and one special character.
server.js connects to the server.

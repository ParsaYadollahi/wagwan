const fbfunctions = require('firebase-functions');
const app = require('express')();

const FBAuth = require("./util/fbAuth"); // Security so no anyone can upload to the db

const { getAllScreams, postOneScream } = require("./handlers/screams");
const { signup, login, uploadImage } = require("./handlers/users");

// Screams routes in screams.js
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);

// Users Routes in Users.js
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage)

// Good practice to have :
// https://baseurl.com/api/.....
// By doing exports, we can import the api function
exports.api = fbfunctions.https.onRequest(app); // this will give is the extension

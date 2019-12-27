const fbfunctions = require('firebase-functions');
const app = require('express')();

const FBAuth = require("./util/fbAuth"); // Security so no anyone can upload to the db

const { getAllScreams, postOneScream, getScream, commentOnScream, likeScream, unlikeScream, deleteScream} = require("./handlers/screams");
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require("./handlers/users");

// Screams routes in screams.js
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.get('/scream/:screamId', getScream);
app.delete('/scream/:screamId', FBAuth, deleteScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);
app.get('/scream/:screamId/like', FBAuth, likeScream);
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);

//TODO: ROUTES (deleteScream, LikeAScream, unlikeAScream, commentOnScream)

// Users Routes in Users.js
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage)
app.post('/users', FBAuth, addUserDetails);
app.get('/users', FBAuth, getAuthenticatedUser);

// Good practice to have :
// https://baseurl.com/api/.....
// By doing exports, we can import the api function
exports.api = fbfunctions.https.onRequest(app); // this will give is the extension

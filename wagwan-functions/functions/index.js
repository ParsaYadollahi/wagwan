const fbfunctions = require('firebase-functions');
const app = require('express')();
const { db } = require('./util/admin');

const FBAuth = require("./util/fbAuth"); // Security so no anyone can upload to the db

const {
    getAllScreams,
    postOneScream,
    getScream,
    commentOnScream,
    likeScream,
    unlikeScream,
    deleteScream
} = require("./handlers/screams");

const {
    signup,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser,
    getUserDetails,
    leaveOnRead
} = require("./handlers/users");

// Screams routes in screams.js
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.get('/scream/:screamId', getScream);
app.delete('/scream/:screamId', FBAuth, deleteScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);
app.get('/scream/:screamId/like', FBAuth, likeScream);
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);

// Users Routes in Users.js
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage)
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, leaveOnRead);

// Good practice to have :
// https://baseurl.com/api/.....
// By doing exports, we can import the api function
exports.api = fbfunctions.region('us-central1').https.onRequest(app); // this will give is the extension

exports.createNotificationOnLike = fbfunctions
  .region('us-central1')
  .firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
          return db
          .doc(`/notifications/${snapshot.id}`)
          .set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            screamId: doc.id
          });
        }
      })
      .catch((err) => console.error(err));
  });
exports.deleteNotificationOnUnLike = fbfunctions
  .region('us-central1')
  .firestore.document('likes/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });
exports.createNotificationOnComment = fbfunctions
  .region('us-central1')
  .firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            screamId: doc.id
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });


// exports.createNotificationOnLike = fbfunctions.region('us-central1').firestore.document('/likes/{id}')
//     .onCreate((snapshot) => { // snapshot of like document
//         db.doc(`/screams/${snapshot.data().screamId}`).get()
//             .then(doc => {
//                 if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle){ // will always
//                     return db.doc(`/notifications/${snapshot.id}`).set({
//                         createdAt: new Date().toISOString(),
//                         recipient: doc.data().userHandle,
//                         sender: snapshot.data().userHandle,
//                         type: 'like',
//                         read: false,
//                         screamId: doc.id
//                     });
//                 }
//             })
//             .catch(err => {
//                 console.error(err);
//                 return; // no need for response since db trigger, not api endpoint
//             });
//     });

// exports.deleteNotificationOnUnlike = fbfunctions.region('us-central1').firestore.document('likes/{id}')
//     .onDelete((snapshot) => {
//         db.doc(`/notifications/${snapshot.id}`).delete()
//             .catch(err => {
//                 console.error(err);
//                 return;
//             });
//         });

// exports.createNotificationOnComment = fbfunctions.region('us-central1').firestore.document('comments/{id}')
//     .onCreate((snapshot) => {
//         db.doc(`/screams/${snapshot.data().screamId}`).get()
//             .then(doc => {
//                 if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle){ // will always exist
//                     return db.doc(`/notifications/${snapshot.id}`).set({
//                         createdAt: new Date().toISOString(),
//                         recipient: doc.data().userHandle,
//                         sender: snapshot.data().userHandle,
//                         type: 'comment',
//                         read: false,
//                         screamId: doc.id
//                     })
//                 }
//             })
//             .catch(err => {
//                 console.error(err);
//                 return; // no need for response since db trigger, not api endpoint
//             });
//     });

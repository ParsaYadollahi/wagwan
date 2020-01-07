const fbfunctions = require('firebase-functions');
const app = require('express')();
const { db } = require('./util/admin');

const FBAuth = require("./util/fbAuth"); // Security so no anyone can upload to the db

// Need to deploy to live server
const cors = require('cors');
app.use(cors());

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

exports.createNotificationOnLike = fbfunctions.region('us-central1').firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`).get()
      .then((doc) => {
        if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) { // Make sure the user handle isnt the same as the person liking it
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            screamId: doc.id
          })
        }
      })
      .catch((err) => console.error(err));
  });

exports.deleteNotificationOnUnLike = fbfunctions.region('us-central1').firestore.document('likes/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = fbfunctions.region('us-central1').firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`).get()
      .then((doc) => {
        if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
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

exports.UserImageChange = fbfunctions.region('us-central1').firestore.document('/users/{userId}')
  .onUpdate((change) => { // snapshot
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) { // if the before and after are same
      console.log('Image has changed')

      // Change image of posts that user mage
      const batch = db.batch();
      return db.collection('screams').where('userHandle', '==', change.before.data().handle).get()
      .then((data) => {
        data.forEach(doc => { //for eacn doc that the user created
          const scream = db.doc(`/screams/${doc.id}`); // get the id of the scream of the doc
          batch.update(scream, { userImage: change.after.data().imageUrl }); // update the doc
        });
        return batch.commit();
      });
    } else return true;
  });

// Delete notifications, likes and comments when delete scream
exports.screamDeleted = fbfunctions.region('us-central1').firestore.document('/screams/{screamId}')
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    // Delete comments
    return db.collection('comments').where('screamId', '==', screamId).get() // get the comments
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`)); // delete each comment
        });
        // delete like
        return db.collection('likes').where('screamId', '==', screamId).get()
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`)); // delete each comment
        });
        return db.collection('notifications').where('screamId', '==', screamId).get()
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`)); // delete each comment
        });
        return batch.commit();
      })
      .catch(err => {
        console.error(err);
      })
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

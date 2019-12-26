const admin = require('firebase-admin');
admin.initializeApp(); //function already knows that .firebaserc is  id of app, so pass nothing
const db = admin.firestore(); // Firestore is fetching the data in firebase (nosql db for more structured quering and easy since key:value)


module.exports = { admin , db };
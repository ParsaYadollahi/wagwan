const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(); //function already knows that .firebaserc is  id of app, so pass nothing

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello World!");
});


// get data
exports.getScreams = functions.https.onRequest((req, resp) => {
    admin // Can check out more imports from firebase.get-data
        .firestore()
        .collection('screams')
        .get()
        .then((data) => {
            let screams = [];
            data.forEach((doc) => { // Data is a collection of elements, looping thru them all and adding them to an Array
                screams.push(doc.data()); // adding to list
            });
            return resp.json(screams);
        })
    .catch((err) => console.error(err));
});

// create data
exports.createScream = functions.https.onRequest((req, resp) => {
    const new_Scream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createAt: admin.firestore.Timestamp.fromDate(new Date())
    };

    admin
        .firestore()
        .collection('screams')
        .add(new_Scream) // takes json obj and adds it to database (one above)
        .then(doc => { //returns a promise | If here means weve made a new docs
            resp.json({message: `document ${doc.id} created successfully`});
        })
        .catch(err => {
            resp.status(500).json({error: 'something went wrong fam'});
            console.error(err);
        });
});
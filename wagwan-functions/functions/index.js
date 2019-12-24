const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(); //function already knows that .firebaserc is  id of app, so pass nothing

const express = require('express');
const app = express();

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello World!");
});

////////////////////////////////////////////////////////////////////////////
//     GET without express
////////////////////////////////////////////////////////////////////////////
// get data WITHOUT EXPRESS
exports.getScreams = functions.https.onRequest((req, resp) => {
    admin // Can check out more imports from firebase.get-data
        .firestore()
        .collection('screams') // get elements at 'screams' in db
        .get()
        .then((data) => { // promise 
            let screams = []; // initialize array to add screams to it
            data.forEach((doc) => { // Data is a collection of elements, looping thru them all and adding them to an Array
                screams.push(doc.data()); // adding to list
            });
            return resp.json(screams); // respond with array
        })
    .catch((err) => console.error(err)); // catch any error and print it
});
////////////////////////////////////////////////////////////////////////////

// create data | will update in real time (post req)
exports.createScream = functions.https.onRequest((req, resp) => {
    // catch case that sending get req to link for  post req
    if (req.method !== 'POST') {
        return resp.status(400).json({ error: 'My guy, you sending a get request to a post method'});
    }
    const new_Scream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createAt: admin.firestore.Timestamp.fromDate(new Date())
    };

    admin
        .firestore()
        .collection('screams') // like python dictionary, get elements at screams
        .add(new_Scream) // takes json obj and adds it to database (one above)
        .then(doc => { //returns a promise | If here means weve made a new docs
            resp.json({ message: `document ${doc.id} created successfully`}); // respond with when successfully did post req
        })
        .catch((err) => {
            resp.status(500).json({error: 'something went wrong fam'}); // respond a status of 500 and give message (server error)
            console.error(err);
        });
});
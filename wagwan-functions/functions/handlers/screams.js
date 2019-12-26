const { db } = require('../util/admin');

exports.getAllScreams = (req, resp) => { 
    db
        .collection('screams') // get elements at 'screams' in db
        .orderBy('createAt', 'desc') // order the output by the keyword "createdat"
        .get()
        .then((data) => { // promise 
            let screams = []; // in itialize array to add screams to it
            data.forEach((doc) => { // Data is a collection of elements, looping thru them all and adding them to an Array
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createAt: doc.data().createAt
                }); // adding to list
            });
            return resp.json(screams); // respond with array
        })
    .catch((err) => console.error(err)); // catch any error and print it
};

exports.postOneScream = (req, resp) => { // takes in path and handler
    if (req.body.body.trim() === ""){
        return res.status(400).json({ body: "Body must not be empty" });
    }
    // DONT need to catch if sending a get to a post method, express takes care of that
    const new_Scream = {
        body: req.body.body,
        userHandle: req.user.handle, // Since its been added to the request, can just leave it like that (i.e, only need to send a body in post req and we good)
        createAt: new Date().toISOString()
    };

    db.collection('screams') // like python dictionary, get elements at screams
    .add(new_Scream) // takes json obj and adds it to database (one above)
    .then((doc) => { //returns a promise | If here means weve made a new docs
    resp.json({ message: `document ${doc.id} created successfully`}); // respond with when successfully did post req
    })
    .catch((err) => {
        resp.status(500).json({error: 'something went wrong fam'}); // respond a status of 500 and give message (server error)
        console.error(err);
    });
};
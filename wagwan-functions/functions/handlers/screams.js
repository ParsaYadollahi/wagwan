const { db } = require('../util/admin');

exports.getAllScreams = (req, resp) => {
    db
        .collection('screams') // get elements at 'screams' in db
        .orderBy('createdAt', 'desc') // order the output by the keyword "createdat"
        .get()
        .then((data) => { // promise
            let screams = []; // in itialize array to add screams to it
            data.forEach((doc) => { // Data is a collection of elements, looping thru them all and adding them to an Array
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
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
        createdAt: new Date().toISOString(),
        userImage: req.user.imageUrl,
        likeCount: 0,
        commentCount: 0,
    };

    db.collection('screams') // like python dictionary, get elements at screams
    .add(new_Scream) // takes json obj and adds it to database (one above)
    .then((doc) => { //returns a promise | If here means weve made a new docs
        const responseScream = new_Scream;
        responseScream.screamId = doc.id; // Can change ID but not actual type, so we good
        resp.json(responseScream); // respond with when successfully did post req
    })
    .catch((err) => {
        resp.status(500).json({error: 'Something went wrong fam'}); // respond a status of 500 and give message (server error)
        console.error(err);
    });
};

// Fetch Scream
exports.getScream = (req, res) => {
    let screamData = {}

    db.doc(`/screams/${req.params.screamId}`).get()
        .then((doc) => {
            if (!doc.exists){
                return res.status(404).json({ error: "Scream not found" }) // In case send request to /scream/id that doesnt exist
            }
            screamData = doc.data();
            // Want to add id of scream
            screamData.screamId = doc.id;
            return db
                .collection ('comments')
                .orderBy('createdAt', 'desc')
                .where('screamId', '==', req.params.screamId)
                .get() // Get the comments with specified id
        })
        .then((data) => {
            screamData.comments = [];
            data.forEach((doc) => {
                screamData.comments.push(doc.data());
            });
            return res.json(screamData); // screamdata already json
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        })
}

// Comment on a comment
exports.commentOnScream = (req, res) => {
    if (req.body.body.trim() === '') { // Empty comment
        return res.status(400).json({ error: "Must not be empty" });
    }
    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        screamId: req.params.screamId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
    };

    db.doc(`/screams/${req.params.screamId}`).get()
        .then((doc) => {
            if(!doc.exists){ // if the screamId doenst exist
                return res.status(404).json({ error: 'Scream not found' });
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 })
        })
        .then(() => {
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            res.json(newComment);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Something went wrong" });
        })
}


// Like a scream, Do not put likes in the same document as everything else because each document can be max 4 MB, so gonna put it in another collection
exports.likeScream = (req, res) => {
    // Gonna query thru like, to see if likes already exists (cannot like twice)
    const likeDocs = db.collection('likes').where('userHandle', '==', req.user.handle)
        .where('screamId', '==', req.params.screamId).limit(1); // Gets docs for specified like

    const screamDocs = db.doc(`screams/${req.params.screamId}`);

    let screamData = {};

    screamDocs.get()
        .then(doc => {
            if (doc.exists) { // Scream exists
                screamData = doc.data(); // unload data
                screamData.screamId = doc.id; // unload the id
                return likeDocs.get(); // return data
            } else {
                return res.status(404).json({ error: 'Scream not found' }); // scream doesnt exist
            }
        })
        .then(data => {
            if (data.empty) {
                return db.collection('likes').add({
                    screamId: req.params.screamId,
                    userHandle: req.user.handle
                }) // Need to nest then in the if block
                .then(() => {
                    screamData.likeCount++; // Incrememnt the likes
                    return screamDocs.update({ likeCount: screamData.likeCount }) // Increment the like property in the scream db
                })
                .then(() => {
                    return res.json(screamData);
                })
            } else { // Can't like Again
                return res.status(400).json({ error: "Scream already liked" })
            }
        })
        .catch( err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        })
}


exports.unlikeScream = (req, res) => {
    const likeDocs = db.collection('likes').where('userHandle', '==', req.user.handle)
        .where('screamId', '==', req.params.screamId).limit(1); // Gets docs for specified like

    const screamDocs = db.doc(`screams/${req.params.screamId}`);

    let screamData;

    screamDocs.get()
        .then(doc => {
            if (doc.exists) { // Scream exists
                screamData = doc.data(); // unload data
                screamData.screamId = doc.id; // unload the id
                return likeDocs.get(); // return data
            } else {
                return res.status(404).json({ error: 'Scream not found' }); // scream doesnt exist
            }
        })
        .then(data => {
            if (data.empty) {
                return res.status(400).json({ error: "Scream not liked" })
            } else { // Can't like Again
                return db.doc(`/likes/${data.docs[0].id}`)
                .delete() // returns the id of the like
                .then(() => {
                    screamData.likeCount--;
                    return screamDocs.update({ likeCount: screamData.likeCount });
                })
                .then(() => {
                    res.json(screamData);
                })
            }
        })
        .catch( err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}

// Delete Scream
exports.deleteScream = (req, res) => {
    const document = db.doc(`/screams/${req.params.screamId}`);
    document
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return res.status(404).json({ error: 'Scream not found' });
        }
        // make sure its the right person that your deleting (Not delete someone elses scream)
        if (doc.data().userHandle !== req.user.handle) {
          return res.status(403).json({ error: 'Unauthorized' });
        } else {
          return document.delete();
        }
      })
      .then(() => {
        res.json({ message: 'Scream deleted successfully' });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  };

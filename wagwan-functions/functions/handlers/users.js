// Import db
const { db, admin } = require("../util/admin");
// Good practice to keep the config file seperated
const config = require("../util/config");
// Import package firebase
const firebase = require("firebase");
firebase.initializeApp(config);

const { validateSignUpData, validateLoginData, reduceUserDetails } = require("../util/validators");

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    const { valid, errors } = validateSignUpData(newUser); // destructuring

    if (!valid) return res.status(400).json(errors);

    const noImg = 'no-image.png'

    let token, userId;
    db.doc(`/users/${newUser.handle}`)
        .get()
        .then(doc => {
            if (doc.exists) { // if exist, there's a prob cuz all HANDLES must be unique
                return res.status(400).json({ handle: 'This handle is already taken'}) // return an object error
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(
                        newUser.email,
                        newUser.password
                ); // firebase's way for new user account with password
            }
        })
        .then((data) => { // want to return access token
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idtoken) => {
            token = idtoken;
            const userCredentials = { // schema for email of user
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${
                    config.storageBucket
                }/o/${noImg}?alt=media`, // Base url for the image
                userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials); // returns a write result
        })
        .then(() => {
            res.status(201).json({ token }); // return a status of 201 if successfully written
        })
        .catch((err) => {
            console.error(err);
            if (err.code === "auth/email-already-in-use"){ // send error code if the email already exists
                return res.status(400).json({ email: "Email is already in use"});
            } else {
                return res.status(500).json({ general: "Something went wrong, please try again" }); // error code anything else
            }
        })
}


// Login user
exports.login =  (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const { valid, errors } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);

    firebase // Firebases way of authentication
        .auth()
        .signInWithEmailAndPassword(
            user.email,
            user.password
        )
        .then(data => { return data.user.getIdToken();
        })
    .then(token => { return res.json({ token });
    })
    .catch(err => {
        console.log(err);
        return res
        .status(403)
        .json({ general: 'Wrong Credentials, please try again'}); // If password does not match the user email
    });
};

// Add user details
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({ message: 'Details added successfully'});
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code })
        })
}
// Get user Details
exports.getAuthenticatedUser = (req, res) => {
    let resData = {}; // response data (append while going thru promise chain)

    db.doc(`/users/${req.user.handle}`).get() // Get docs from user with specified name
        .then((doc => {
            if (doc.exists) { // If the mans exists
                resData.credentials = doc.data(); // Resdata credits key has docs data (the db schema and info)
                return db.collection('likes').where('userHandle', '==', req.user.handle).get() // return the likes from the collections
            }
        }))
        .then (data => {
            resData.likes = []; // Will crash without cuz will get confused with types
            data.forEach(doc => {
                resData.likes.push(doc.data()); // append the likes to the list for each of the users
            })
            return db.collection('notifications').where('recipient', '==', req.user.handle)
                .orderBy('createdAt', 'desc').limit(10).get();
        })
        .then((data) => {
            resData.notifications = [];
            data.forEach(doc => {
                resData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    createdAt: doc.data().createdAt,
                    screamId: doc.data().screamId,
                    type: doc.data().type,
                    read: doc.data().read,
                    notificationId: doc.id,
                })
            });
            return res.json(resData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

// Upload profile pic of user
exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    let imageFileName;
    let imageToBeUploaded = {}; // empty object

    const busboy = new BusBoy({ headers: req.headers });
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') { // If type of image not wanted
            return res.status(400).json( { error: 'Wrong file type submitted'});
        }

        // ex: Image.png (need to get the extension, png)
        const imageExtension = filename.split('.')[filename.split('.').length - 1]; // returns an array (need last item)
        //6758872759.png
        imageFileName = `${Math.round(Math.random() * 1000000000)}.${imageExtension}`; // Give random name to file + extension
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype }

        file.pipe(fs.createWriteStream(filepath)); // create the file (image) obj
    });
    busboy.on('finish', () => { // finish event
        admin
        .storage()
        .bucket()
        .upload(imageToBeUploaded.filepath, { // All in firebase admin sdk documents
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
                config.storageBucket
            }/o/${imageFileName}?alt=media`; // base url to insert image into
            // need to add this url to user document
            return db.doc(`/users/${req.user.handle}`).update({ imageUrl }); // add it to this users image
        })
        .then(() => {
            return res.json({ message: "Image Successfully uploaded"});
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: err.code });
        });
    });
    busboy.end(req.rawBody);
};

// Get a User's Details
exports.getUserDetails = (req, res) => {
    let userData = {}
    db.doc(`/users/${req.params.handle}`).get() // Url to get the USER (name of user)
        .then(doc => { // get the user
            if (doc.exists) { // If the doc exists (if user exists)
                userData.user = doc.data(); // Get the user data
                return db.collection('screams').where('userHandle', '==', req.params.handle) // Get the screams of the specified user
                    .orderBy('createdAt', 'desc').get(); // Ordered
            } else { // If it doesnt, return 404 not found
                return res.status(404).json({ error: 'User not found' });
            }
        })
        .then(data => {
            userData.screams = []; // initialize a scream to be returned
            data.forEach(doc => {
                userData.screams.push({ // Push the data with the Id
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    userHandle: doc.data().userHandle,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    screamId: doc.id // adds the id
                })
            });
            return res.json(userData); // Returns the data
        })
        .catch( err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

// send an array of id's of notifications that the user has just seen (ones that were just read)
exports.leaveOnRead = (req, res) => {
    let batch = db.batch(); // multip proc
    req.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, { read: true }); // modify the specified Notification's ID to read
    });
    batch.commit()
        .then(() => {
            return res.json({ message: 'The notification marked as read' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

const fbfunctions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp(); //function already knows that .firebaserc is  id of app, so pass nothing
const config = {
    apiKey: "AIzaSyDB7JOFrVN1aZJ4nwm5og1c8tGjIuvpWp0",
    authDomain: "wagwan-6797c.firebaseapp.com",
    databaseURL: "https://wagwan-6797c.firebaseio.com",
    projectId: "wagwan-6797c",
    storageBucket: "wagwan-6797c.appspot.com",
    messagingSenderId: "1029580455728",
    appId: "1:1029580455728:web:4f2560ebb1f653dcd892f5",
    measurementId: "G-Q2R590GX26"
};

const firebase = require('firebase'); // firebase is server
firebase.initializeApp(config);

const db = admin.firestore(); // Firestore is fetching the data in firebase (nosql db for more structured quering and easy since key:value)

exports.helloWorld = fbfunctions.https.onRequest((request, response) => {
 response.send("Hello World!");
});


app.get('/screams', (req, resp) => { 
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
})

const FBAuth = (req, res, next) => { // NEXT if return it and call it as a function, will procede as a handler (middlewear)
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1]; // Will return the string split in two into an array
    } else {
        console.error('No token found')
        return resp.status(403).json({ error: 'Unauthorized'})
    }
    // We now have a token at this point
    // Now must verify that this token is initialized by our application
    admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
        req.user = decodedToken; // Need to get the handle seperately, handle not stored in firebase authentication system, stored in collections
        console.log(decodedToken);
        return db.collection('users')
            .where('userId', '==', req.user.uid)
            .limit(1) // limits results to 1
            .get();
    })
    .then(data => {
        req.user.handle = data.docs[0].data().handle; // Grabing the handle object from the collections db
        return next(); // returning the NEXT() function
    })
    .catch(err => {
        console.error('Error while verifying token ', err);
        return res.status(403).json(err);
    })
}

app.post('/scream', FBAuth,(req, resp) => { // takes in path and handler
    if (req.body.body.trim() === ""){
        return res.status(400).json({ body: "Body must not be empty" });
    }
    // DONT need to catch if sending a get to a post method, express takes care of that
    const new_Scream = {
        body: req.body.body,
        userHandle: req.user.handle, // Since its been added to the request, can just leave it like that (i.e, only need to send a body in post req and we good)
        createAt: new Date().toISOString()
    };

    db
        .collection('screams') // like python dictionary, get elements at screams
        .add(new_Scream) // takes json obj and adds it to database (one above)
        .then(doc => { //returns a promise | If here means weve made a new docs
            resp.json({ message: `document ${doc.id} created successfully`}); // respond with when successfully did post req
        })
        .catch((err) => {
            resp.status(500).json({error: 'something went wrong fam'}); // respond a status of 500 and give message (server error)
            console.error(err);
        });
})

// Helper function for empty string
const IsEmpty = (string) => {
    if (string.trim() === '') return true; // Trim to remove white spaces
    else return false; 
}

// Check for valid email
const IsEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)) return true;
    else return false;
}


// SignUp route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    let errors = {}

    // Information Validation (dont need to be taking care of no sending anything, since React will send null === "" if nothing is sent)
    if (IsEmpty(newUser.email)) {
        errors.email = 'Must not be empty'
    } else if (!IsEmail(newUser.email)) {
        errors.email = 'Must be a valid email address'
    }
    if (IsEmpty(newUser.password)) {
        errors.password = "Must not be empty"
    }
    if (newUser.password !== newUser.confirmPassword){
        errors.confirmPassword = "Passwords must match"
    }
    if (IsEmpty(newUser.handle)) {
        errors.handle = "Must not be empty"
    }

    // Break if errors
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);



    //TO DO: validate JSON

    let token, userId;
    db.doc(`/users/${newUser.handle}`)
        .get()
        .then(doc => {
            if (doc.exists) { // if exist, theres a prob cuz all HANDLES must be unique
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
                createAt: new Date().toISOString(),
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
                return res.status(500).json({ error: err.code }); // error code anything else
            }
        })
});

app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    let errors = {}
    if (IsEmpty(user.email)) {errors.email = "Must not be empty"}
    if (IsEmpty(user.password)) {errors.password = "Must not be empty"}

    if (Object.keys(errors).length > 0) {return res.status(400).json(errors);}

    firebase
        .auth()
        .signInWithEmailAndPassword(
            user.email,
            user.password
        )
        .then(data => { return data.user.getIdToken();})
        .then(token => { return res.json({token});})
        .catch(err => {
            console.log(err);
            if (err.code === "auth/wrong-password") {
                return res
                .status(403)
                .json({ general: 'Wrong Credentials, please try again'}); // If password does not match the user email
            } else return res.status(500).json({ error: err.code });
        })
})

// Good practice to have :
// https://baseurl.com/api/.....
// By doing exports, we can import the api function
exports.api = fbfunctions.https.onRequest(app); // this will give is the extension
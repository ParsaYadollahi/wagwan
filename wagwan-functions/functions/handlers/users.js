// Import db
const { db } = require("../util/admin");
// Good practice to keep the config file seperated
const config = require("../util/config");
// Import package firebase
const firebase = require("firebase");
firebase.initializeApp(config);

const { validateSignUpData, validateLoginData } = require("../util/validators");

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    const { valid, errors } = validateSignUpData(newUser); // destructuring

    if (!valid) return res.status(400).json(errors);

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
}

exports.login =  (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const { valid, errors } = validateLoginData(user);

    if (!valid) return res.status(400).json(errors);


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
}
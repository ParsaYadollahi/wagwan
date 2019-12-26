const { admin, db } = require("./admin");

module.exports = (req, res, next) => { // NEXT if return it and call it as a function, will procede as a handler (middlewear)
    let idToken;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        idToken = req.headers.authorization.split('Bearer ')[1]; // Will return the string split in two into an array
    } else {
        console.error('No token found')
        return resp.status(403).json({ error: 'Unauthorized'})
    }

    // We now have a token at this point
    // Now must verify that this token is initialized by our application
    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            req.user = decodedToken; // Need to get the handle seperately, handle not stored in firebase authentication system, stored in collections
            console.log(decodedToken);
            return db.collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1) // limits results to 1
                .get();
    })
    .then((data) => {
        req.user.handle = data.docs[0].data().handle; // Grabing the handle object from the collections db
        return next(); // returning the NEXT() function
    })
    .catch((err) => {
        console.error('Error while verifying token ', err);
        return res.status(403).json(err);
    })
}

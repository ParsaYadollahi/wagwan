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

exports.validateSignUpData = (data) => {
    let errors = {}

    // Information Validation (dont need to be taking care of no sending anything, since React will send null === "" if nothing is sent)
    if (IsEmpty(data.email)) {
        errors.email = 'Must not be empty'
    } else if (!IsEmail(data.email)) {
        errors.email = 'Must be a valid email address'
    }
    if (IsEmpty(data.password)) {
        errors.password = "Must not be empty"
    }
    if (data.password !== data.confirmPassword){
        errors.confirmPassword = "Passwords must match"
    }
    if (IsEmpty(data.handle)) {
        errors.handle = "Must not be empty"
    }

    return {
        errors,
        valid:  Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateLoginData = (data) => {
    let errors = {}
    if (IsEmpty(data.email)) {errors.email = "Must not be empty"}
    if (IsEmpty(data.password)) {errors.password = "Must not be empty"}

    return {
        errors,
        valid:  Object.keys(errors).length === 0 ? true : false
    }
}

// User website validator
exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if (!IsEmpty(data.bio.trim())){ // If bio is empty
        userDetails.bio = data.bio;
    }
    if (!IsEmpty(data.website.trim())){
        // https://website.com (want to append https:// at begining of the website if not added by user)
        if (data.website.trim().substring(0, 4) !== 'http'){  // http
            userDetails.website = `http://${data.website.trim()}`; // append https
        } else {
            userDetails.website = data.website;
        }
    }
    if (!IsEmpty(data.location.trim())) {
        userDetails.location = data.location;
    }

    return userDetails;
}

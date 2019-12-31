// ==================================================================
// validation
// ==================================================================

const validator = require('validator');
var fs = require('fs');

notAllowed = [];

fs.readFile('bannedwords.txt', 'utf8', function (err, data) {
    if (err) throw err;
    let mystring = data.split("\n")
    for (let i = 0; i < mystring.length; i++) {
        notAllowed.push(mystring[i])
    }
});

function containsBlackListedStuff(myString) {
    if (myString === '') return false;
    // first check alpha numeric or . ? , space ! $ # are only in string
    let charNotValid = true;
    for (let i = 0; i < myString.length; i++) {
        charNotValid = true;
        let myASCIINumb = myString.charCodeAt(i);
        if (myASCIINumb >= 32 && myASCIINumb <= 39) charNotValid = false;
        if (myASCIINumb >= 48 && myASCIINumb <= 57) charNotValid = false;
        if (myASCIINumb >= 65 && myASCIINumb <= 90) charNotValid = false;
        if (myASCIINumb >= 97 && myASCIINumb <= 122) charNotValid = false;
        if (myASCIINumb === 44) charNotValid = false;
        if (myASCIINumb === 46) charNotValid = false;
        if (myASCIINumb === 63) charNotValid = false;
        if (myASCIINumb === 13) charNotValid = false;
        if (myASCIINumb === 10) charNotValid = false;
        if (charNotValid) {
            break;
        }
    }

    if (charNotValid) return true;

    // now check if bad words are present
    for (let i = 0; i < notAllowed.length; i++) {
        if (validator.contains(myString, notAllowed[i])) {
            return true;
        }
    }
    return false;
}

module.exports = function validateInputs(req) {
    let validationResult = {
        pass: true,
        message: 'success',
    };

    if (!validator.isEmail(req.body.email.toLowerCase())) {
        validationResult.pass = false;
        validationResult.message = 'This is not a valid email address.';
    }

    if (containsBlackListedStuff(req.body.password)) {
        validationResult.pass = false;
        validationResult.message = 'This is not a valid password.';
    }

    if (req.body.oldPassword) {
        if (containsBlackListedStuff(req.body.oldPassword)) {
            validationResult.pass = false;
            validationResult.message = 'This is not a valid password.';
        }
    }

    if (containsBlackListedStuff(req.body.firstName)) {
        validationResult.pass = false;
        validationResult.message = 'This is not a valid first name.';
    }

    if (containsBlackListedStuff(req.body.lastName)) {
        validationResult.pass = false;
        validationResult.message = 'This is not a valid last name.';
    }

    if (containsBlackListedStuff(req.body.bio)) {
        validationResult.pass = false;
        validationResult.message = 'This is not a valid bio.';
    }

    if (containsBlackListedStuff(req.body.role)) {
        validationResult.pass = false;
        validationResult.message = 'This is not valid role.';
    }

    if (!validationResult.pass)
        validationResult.message +=
        '  Valid characters are alpha numeric, period, space, return, linefeed, ? ! $ #.';

    return validationResult;
}
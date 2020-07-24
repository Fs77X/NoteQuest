require("dotenv").config()
// imported libraries
var admin = require("firebase-admin")

// imported credentials required to access firebase
var serviceAccount = require("./firebase_credential.json")

var db;

// Initializes the database, must be called prior to running any other database functions
var initialize = function() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://notequest-9a6e6.firebaseio.com"
    });
    
    db = admin.database()
}

// Example of how to append to the database
//put_data("CSE115a", "Julig", "this_is_a_google_drive_link.com", "THESE ARE MY NOTES", "atomhave")

// Adds the passed data to the database.  Will post under classID/professor.
var put_data = function (classID, _professor, _URL, _name, _uploader) {
    // Push the new entry to the provided class/professor pathway
    db.ref(classID + "/" + _professor).push().set({
        url: _URL, // The URL to the given notes
        name: _name, // The name of the notes document
        uploader: _uploader, // The student id of the uploader
        rating: 0, // The user rating, should be 0 by default
        upvoted: [] // Simply a placeholder
    })
}


// Returns a multi-dimensional array of strings that represent all the available URLs and the corresponding file names of the specific class from the given professor.
// First entry is the file name, second entry is the file URL
var get_class_files_by_date = function (classID, _professor, callback) {
    var allValues = []

    // Find pathway of respective class and professor
    var ref = db.ref(classID + "/" + _professor)

    // Retrieve the data
    ref.once("value")
        .then(function (snapshot) {
            snapshot.forEach((child) => {
                // Push each found instnace into the array
                allValues.push([child.val().name, child.val().url]);
            });
            // Callback the completed values array
            callback(allValues.reverse());
        }).catch(error => {
            console.log("error".error)
        })
}

// Returns a multi-dimensional array of strings that represent all the available URLs and the corresponding file names of the specific class from the given professor.
// First entry is the file name, second entry is the file URL
// Entries are sorted first by their rating, and second by their upload date
var get_class_files_by_rating = function (classID, _professor, callback) {
    var allValues = []
    var ref = db.ref(classID + "/" + _professor)

    // Query the database by rating, sorting in descending order
    ref.orderByChild("rating").once("value")
        .then(snapshot => {
            snapshot.forEach(child => {
                allValues.push([child.val().name, child.val().url])
            })

            // Return the opposite, so the highest rated, newest entries appear first
            callback(allValues.reverse());
        }).catch(error => {
            console.log("error".error)
        })
}

// Returns an array of all the classes that have notes
var get_classes = function (callback){
    // Set reference at root
    var ref = db.ref()

    // Retrieve data for all classes
    ref.once("value").then(snap => {
        var key = Object.keys(snap.val())

        // Return all the top level keys (classes)
        callback(key)
    }).catch(error => {
        console.log("error".error)
    })
}


// Returns an array of professors for the provided class
var get_professors = function (classID, callback) {
    // Set reference point at specified classID
    var ref = db.ref(classID)

    // Retrieve the value from the database
    ref.once("value").then(snapshot => {
        var key = Object.keys(snapshot.val())

        // Return all keys associated with the given class
        callback(key)
    }).catch(error => {
        console.log("error".error)
    })
}


// Return a list of users that have upvoted a file with the given ID
var get_upvote_list = function (classID, _professor, _URL, callback) {
    var ref = db.ref(classID + "/" + _professor)

    // Find a reference to the specified url and return all the users that have upvoted it
    ref.orderByChild("url").equalTo(_URL).once("child_added", snapshot => {
        callback(snapshot.val().upvoted)
    })
}


// Add a user to the list of users that have upvoted 
var user_upvoted = function (user, classID, _professor, _URL) {
    var ref = db.ref(classID + "/" + _professor)

    // Query the database to find the instnace of the given url
    ref.orderByChild("url").equalTo(_URL).once("child_added", snapshot => {
        var upvotedList = snapshot.val().upvoted

        // Catch case where there is no upvote list
        if (!upvotedList) {
            upvotedList = [user]
        }

        // Check to see if the user is already in the upvote list
        else if (!upvotedList.includes(user)) {
            upvotedList.push(user)
        } else {
            console.log("User has already upvoted this note!")
        }

        // Update the upvote list with the new values
        snapshot.ref.update({
            upvoted: upvotedList,
            rating: upvotedList.length
        })
    })
}

// Remove a user from the list of users that have upvoted
var user_unupvoted = function(user, classID, _professor, _URL) {
    var ref = db.ref(classID + "/" + _professor)

    // Query the database to find the instnace of the given url
    ref.orderByChild("url").equalTo(_URL).once("child_added", snapshot => {
        var upvotedList = snapshot.val().upvoted

        // Catch case where there is no upvote list
        if (!upvotedList) {
            console.log("No upvote list present!\nUser has not upvoted this note!")
            return
        }

        // Check to see if the user is already in the upvote list
        if (upvotedList.includes(user)) {
            var index = upvotedList.indexOf(user)
            upvotedList.splice(index, 1)
        } else {
            console.log("User has not upvoted this note!")
        }

        // Update the upvote list with the new values
        snapshot.ref.update({
            upvoted: upvotedList,
            rating: upvotedList.length
        })
    })
}

// export all function(s) need to implement feature(s)
module.exports = {
    initialize,
    get_class_files_by_date,
    get_class_files_by_rating,
    put_data,
    get_classes,
    get_professors,
    user_upvoted,
    user_unupvoted,
    get_upvote_list
}
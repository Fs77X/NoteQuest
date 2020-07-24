// google drive authorization libraries
const {google} = require("googleapis"); // google drive api
const credentials = require("./google_drive_cred.json"); // drive credentials
const scopes = ["https://www.googleapis.com/auth/drive"]; // scope of drive
// drive authentication
const auth = new google.auth.JWT(
   credentials.client_email, null,
   credentials.private_key, scopes
);

// establishing our connection to drive
const drive = google.drive({
   version: "v3",
   auth
});

//export the variable that established connection with google
module.exports = drive
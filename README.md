# NoteQuest

## Installation Instructions

### Prerequisites

This project requires your local machine to have a recent version of node.js installed.  Please see the [Node JS official site](https://nodejs.org/en/) for installation.

The remainder of this guide will assume you have node.js installed and added to your system path.

### Dependencies

Inside the repository, please issue the following command line commands.

`cd server`
`npm install`

and

`cd client`
`npm install`

### Keys and Environment

Inside the `server` folder, there will be 2 files called `firebase_credential.json` and `google_drive_cred.json`.  They will not be populated by default, and need to be set up according to service accounts for the corresponding firebase and google drive accounts you wish to use for the application.  Please see the corresponding [Firebase Guide](https://firebase.google.com/docs/admin/setup) and [Google Drive Guide](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) for how to set up and generate these keys.

Inside the `client` folder, there will be a file called `.env`. There will be variables that aren't filled in. To get those values, setup a firebase project and then add an app.
After adding the app, there will be some code with a firebaseConfig variable. In those exact order, copy and past each value from each key into the .env file. This way, you don't have to have
your keys in the code. [Link to .env creation](https://create-react-app.dev/docs/adding-custom-environment-variables/)

Inside the `server` folder, there is a file called `drive_folder.json`. Create a list object that is called `parents` and set its value to a list [`<parent folder id>`], and place the folder_id inside. This will be where all the files will be inserted into. To get the id, go on to drive manually, while inside that folder, look at the url:
`https://drive.google.com/drive/u/0/folders/10l2JdqxGZloye5Ss2tkX79DavF4LSoZP`
It should look something like this. The id is the last part of the url after `folders`. So for this example you would copy and paste in: `10l2JdqxGZloye5Ss2tkX79DavF4LSoZP` to our json file under the key `parents`, and replace the current value in the list.

### Running the Application

Two independent processes must be run in order to use the application.  The following commands should be run from command line.

- Command line 1
`cd server`
`npm start`

- Command line 2
`cd client`
`npm start`

### Templates/Images used
We used this [React.JS template](https://github.com/AldoHub/React-Firebase-Auth) which gave us a head start in the front end development. We ended up heavily modifying this for 
our needs. The fiat slug image we used for our homepage can be found [here](http://2014.igem.org/wiki/images/5/53/UCSC_slug_logo.png)
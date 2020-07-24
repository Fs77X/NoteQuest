import firebase from "firebase/app";
import "firebase/auth";
// import "firebase/firestore";
// import "firebase/storage";

//get config fron environment variables
const config = {
    apiKey: process.env.REACT_APP_FB_APIKEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_databaseURL,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId
  
}
//firebase class that handles authentication client side
class Firebase{
    constructor(){
        firebase.initializeApp(config);
        this.auth = firebase.auth();
    }

    //signs up user with their email, password and provided name
    //if user has message in response, then return as that is an error, otherwise  update new user's displayname
    async signup(email, password, name){
        const user = await firebase.auth().createUserWithEmailAndPassword(email, password).catch( err => {
            console.log(err);
            return err;
        });
        //updates username
        if(user.hasOwnProperty("message")){
            return user

        } else{
            await firebase.auth().onAuthStateChanged(function(user) {
                user.updateProfile({
                    displayName: name
                }).then(function(){
                    console.log(user.displayName)
                }).catch(err => {
                    console.log(err)
                    return err
                })
            });
            return user
        }


    }
    //logs user in and returns user object, otherwise return error
    async login(email, password){
        const user = await firebase.auth().signInWithEmailAndPassword(email, password).catch( err => {
            console.log(err);
            return err;
        });
        return user;
    }
    //logs user out
    async logout(){
        await firebase.auth().signOut().catch(err => {
            console.log(err);
        });
    }
    //get current user state
    async getUserState(){
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve);
        });
    }


}

export default new Firebase();
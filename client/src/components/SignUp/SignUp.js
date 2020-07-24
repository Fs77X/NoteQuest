import { TextField, Button } from '@material-ui/core';
import React, { useState } from "react";
import { Redirect, withRouter } from "react-router-dom";
import firebase from "../../firebase/config";
import Axios from "axios";

const SignUp = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("")
    const [routeRedirect, setRedirect] = useState(false);

    //signs up user after verifying email with server
    const createUser = async (name, email, password) => {
        const response = await firebase.signup(email, password, name);
        //if we get user key in our json, then we can send the email verification, otherwise alert the client with message from firebase
        if (response.hasOwnProperty("message")) {
            alert(response.message);
        }
        if (response.hasOwnProperty("user")) {
            await response.user.sendEmailVerification().then(function () {
                alert("Succesfully made account, check email and then come back and login!")
            }).catch(function (error) {
                alert("Something wrong I hold my head")
            });
            firebase.logout()
            setRedirect(true);
        }
    }



    //signin handles the signin event
    //will create formData to check email in the backend
    //if email, password or name is missing then we'll alert user and let them fill it in
    //if everything is there, then we will attempt to check with backend
    //if status = 403 then UCSC email wasn't entered, if status = 400 then bad client
    //if server returns 500 then return server broke
    //if server is offline then we'll notify the user too
    //if it was succesful, we will send data to firebase using function signup(3)
    const signSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email)
        let valid = false
        if (!email) {
            alert('Please put your email')
        } else if (!password) {
            alert('Please put your password')
        } else if (!name) {
            alert('Please put your name')
        } else if (name !== "" && password !== "" && email !== "") {
            await Axios.post('http://localhost:8080/verify_email', formData).then(res => {
                valid = true
            }).catch(err => {
                try {
                    const status = err.response.status
                    if (status === 403) {
                        alert("Please enter a valid UCSC email!")
                    } else if (status === 400) {
                        alert("bad client!")
                    } else {
                        alert("Server broke, try again")
                    }
                    console.log(err.response.status)

                }
                catch{
                    alert('server offline try again later')
                }

            })
            //if valid is true, then sign up user with name, email and password
            if (valid) {
                await createUser(name, email, password)
            }

        }

    }


    const redirect = routeRedirect;
    if (redirect) {
        return <Redirect to="/" />
    }

    //renders sign up form
    return (
            <React.Fragment>
                {/*Form will submit onSubmit using the button at the very end*/}
                <form onSubmit={signSubmit}>
                    <p>Create a new Account</p>
                    <div>
                        {/*Textfield for email, sets value using setEmail into email*/}
                        <TextField
                            required
                            id="outlined-required email"
                            label="Email"
                            variant="outlined"
                            onChange={(e) => setEmail(e.target.value)}
                            color="secondary"
                        />

                    </div>
                    <div>
                        {/*Textfield for password, sets password using setPassword to password*/}
                        <TextField
                            required
                            id="outlined-required pass"
                            label="Password"
                            variant="outlined"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            color="secondary"
                        />

                    </div>

                    <div>
                        {/*Textfield for name, sets name using SetName to name*/}
                        <TextField
                            required
                            id="outlined-required"
                            label="Name"
                            variant="outlined"
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            color="secondary"
                        />

                    </div>
                    {/*Button handles submit (type = submit intertwines with form submit)*/}
                    <Button variant="contained" 
                    type="submit" 
                    style={{backgroundColor:"#003c6c", 
                        color:'white'
                    }} 
                    value="Create Account">
                        Create Account
                    </Button>
                </form>
            </React.Fragment>
    )
}

export default withRouter(SignUp);
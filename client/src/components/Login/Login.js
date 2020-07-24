import { TextField, Button } from '@material-ui/core';
import React, { useState } from "react";
import { Redirect, withRouter } from "react-router-dom";
import firebase from "../../firebase/config";


const Login = () => {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tryAgain, setTry] = useState(false)
    const [routeRedirect, setRedirect] = useState(false);
    //login handles logging in the user
    //if message has message then we need to alert the user that email or password is wrong
    //if message has user, then we know the user is logged in
    //we also check if they're verified
    const login = async (e) => {
        e.preventDefault();
        let response = await firebase.login(email, password);
        if (response.hasOwnProperty("message")) {
            setTry(true)
            alert(response.message);
        }
        if (response.hasOwnProperty("user")) {
            const user = response.user
            if (!user.emailVerified) {
                setTry(false)
                alert("You need to verify email")
            } else {
                setRedirect(true);
            }

        }


    }


    const redirect = routeRedirect;
    if (redirect) {
        return <Redirect to="/" />
    }

    //renders login form
    return (
        <React.Fragment>
            <form onSubmit={login}>
                <p>Welcome Back</p>
                <div>
                    {/*Textfield for email, setEmail sets variable email*/}
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
                    {/*Textfield for password, setPassword sets variable password*/}
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
                
                {/*Shows is required warning with red css*/}
                <h5>* is required</h5>
                {tryAgain ? 
                <h5 className="tryAgain" 
                style={{color:"red", 
                    font:"Time New Roman"
                }}>
                    Email or Password is wrong
                </h5> 
                : null}


                {/*Button which submits login form, that is a blue button*/}
                <Button variant="contained" 
                style={{backgroundColor:"#003c6c", 
                        color:'white'
                }} 
                type="submit" 
                value="Login">
                    Login
                </Button>

            </form>
        </React.Fragment>

    )

}

export default withRouter(Login);
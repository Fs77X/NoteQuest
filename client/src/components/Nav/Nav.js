import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import firebase from "../../firebase/config";
import { Button, IconButton } from '@material-ui/core';
import { WiMoonAltWaningGibbous1, WiMoonAltWaningCrescent6 } from "react-icons/wi";



const Nav = (props) => {
    const [userState, setuserState] = useState(null);
    const [theme,setTheme] = useState(props.theme)

    //handles the toggle for navbar
    const toggleDarkMode = () => {
        if(theme === 'dark'){
            setTheme('light')
        } else{
            setTheme('dark')
            
        }
    }

    //once toggled, send that to App.JS to handle the actual change event
    useEffect(() => {
        if(theme === 'dark'){
            props.onClick('light')
        } else{
            props.onClick('dark')
            
        }

    }, [theme])

    //getsuserState, updates nav bar to display in a logged in state or logged out state
    useEffect(() => {
        firebase.getUserState().then(user => {
            if (user) {
                setuserState(user);
            }
        })
    })

    //handles the logout on the navbar (sets state to null and redirects to login)
    const logout = () => {
        //logout the user
        firebase.logout();
        setuserState(null);
        props.history.replace("/login");
    }

    //Buttons change for navbar if user is logged in then we display New Post and Notes, otherwise we display sign up and login. 
    //Toggle button for dark and light mode is always displayed 
    let buttons;
    if (userState != null) {
        buttons = (
            <React.Fragment>
                <li>
                    <IconButton
                        aria-label="toggle"
                        onClick={toggleDarkMode}
                    >
                    {/*the button for switching light or dark mode*/}
                    {theme==='dark' 
                        ? <WiMoonAltWaningCrescent6 style={{color:'black'}}/> 
                        :  <WiMoonAltWaningGibbous1 style={{color:'white'}}/>}
                        
                        
                    </ IconButton>
                </li>
                <li><Button><Link to="/create" style={{color: '#fdc700'}}>New Post</Link></Button></li>
                <li><Button><Link to="/notes" style={{color: '#fdc700'}}>Notes</Link></Button></li>
                <li><Button variant="contained" style={{background: 'linear-gradient(45deg, #fdc700 30%, #f29813 90%)',
                    border: 0,
                    borderRadius: 3,
                    color: '#003c6c',
                    height: 35,
                    padding: '0 30px',}} type="submit" value="logout" onClick={logout}>Log Out</Button></li>
            </React.Fragment>
        )
    } else {
        buttons = (
            <React.Fragment>
                <li>
                <IconButton
                    aria-label="upload picture"
                    component="span"
                    onClick={toggleDarkMode}

                >
                {/*the button for switching light or dark mode*/}
                {theme==='dark' 
                    ? <WiMoonAltWaningCrescent6 style={{color:'black'}}/> 
                    :  <WiMoonAltWaningGibbous1 style={{color:'white'}}/>}
                </ IconButton>
                </li>
                <li><Button><Link to="/signup" style={{color: '#fdc700'}}>Sign Up</Link></Button></li>
                <li><Button><Link to="/login" style={{color: '#fdc700'}}>Log In</Link></Button></li>
            </React.Fragment>
        )
    }

    //returns buttons, also has our home button (NoteQuest) on display
    return (
        <nav>
            <ul>
                <li><Button><Link to="/" style={{fontSize: '1.1rem', color:'#fdc700'}}>NoteQuest</Link></Button></li>
            </ul>
            <ul>
                {buttons}
            </ul>
        </nav>
    )
}

export default withRouter(Nav);

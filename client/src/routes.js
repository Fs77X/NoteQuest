import React from "react";
import { Switch, Route } from "react-router-dom";

//components
import Main from "./components/Main/Main";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import Create from "./components/Create/Create";
import Note from "./components/Note/notes"

const Routes = () =>(
    <Switch>
        <Route exact path="/signup" component = {SignUp} />
        <Route exact path="/login" component = {Login} />
        <Route exact path="/" component = {Main} />
        <Route exact path="/create" component = {Create} />
        <Route exact Path = "/notes" component = {Note} />
     
    </Switch>
)

export default Routes;

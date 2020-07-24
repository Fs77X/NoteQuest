import React, { useState, useEffect } from "react";
import { Grid, FormControl, InputLabel, Select } from '@material-ui/core';
import firebase from "../../firebase/config";
import MNOTES from "./MNotes"
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

//function handles getting notes with class and professor picked by user
async function getnotes(prof, classSelected) {
    let response = await axios.get('http://localhost:8080/send_data?mode=file&class=' + classSelected + '&prof=' + prof)
    let data = await response.data
    const blob = await data["file"]
    return blob

}

//processBlob returns array of keys and values meant for the select menus
function processBlob(blob){
    let arr = []
    blob.forEach(element => {
        let dropDownEle = { label: element, value: element };
        arr.push(dropDownEle);
    });

    return arr
}

//function for returning professors from class selected
async function getProfs(classSelected) {
    let response = await axios.get('http://localhost:8080/send_data?mode=prof&class='.concat(classSelected))
    let data = await response.data;
    const blob = data["prof"]
    let profs = processBlob(blob)
    return profs

}


//function does the displaying of the notes
function ShowNotes(props) {
    //getting vars set up from props
    const selected = props.selected
    const gotFiles = props.gotfile
    const files = props.files
    const profSel = props.profSel
    const classSel = props.classSel
    const user = props.user

    if (selected && gotFiles) {
        //if selected and the files have been retrived, display
        //if selected but haven't gotten the files, then tell the user its loading
        //otherwise return null 
        return (<div className="notesContainer">
            {//mapping function returns an array of note modules to render
            files.map(function (f) {
                    return (
                        <MNOTES name={f[0]} 
                        link={f[1]} 
                        profSel={profSel} 
                        classSel={classSel} 
                        key={uuidv4()} 
                        user={user} 
                        /> 
                    )
                })
            }

        </div>)
    } else if (selected && !gotFiles) {
        return (<div className="processing">
            <p>Request is being processed</p>
            <div className="loader">Loading...</div>
        </div>)
    } else {
        return null
    }

}


//Note renders the page
const Note = (props) => {
    //classChoices is for list of classes of notes that exists in db
    const [classChoices, setClasses] = useState(null)
    //list of professors for class picked
    const [profChoices, setProfs] = useState(null)
    //sets when class is selected (fetches professor list)
    const [isSelected, setSelected] = useState(false)
    //sets when the page is ready on initial render (fetches class list)
    const [isReady, setReady] = useState(false)
    //allSet means class and professor set
    const [allSet, setAllSet] = useState(false)
    //class picked by user
    const [classSelect, setClassSelect] = useState('') 
    //professor selected by user
    const [profSelect, setProfSelect] = useState('')
    //when files are recieved from backend, we can start displaying the note modules
    const [gotFiles, setGotFiles] = useState(false)
    //list of files of notes
    const [files, setFiles] = useState(false)
    //gets username for liking functionality
    const [currUser, setUser] = useState(null)

    //getClasses returns classes in processed array with processBlob for select menu
    const getClasses = async() => {
        const response = await axios.get('http://localhost:8080/send_data?mode=class')
        const data = await response.data;
        const blob = data["classes"]
        let classes = processBlob(blob)
        setClasses(classes)
        setReady(true)

    }
    
    //initially ran on first render (fetches data for class)
    //redirect user if not logged in or not verified
    //fetches data via get request for classes and sets it up
    useEffect(() => {
        async function loadData() {
            firebase.getUserState().then(user => {
                if (!user) {
                    alert("You must be logged in to access this page!")
                    props.history.replace("/login");
                } else {
                    if (!user.emailVerified) {
                        alert("You need to verify email")
                        props.history.replace("/")
                    } else{
                        setUser(user)
                    }
                }
            })
            await getClasses()
        }
        loadData()


    }, [])

    //handles when class is picked, fetches prof list for that class (the classSelect in array makes so that useEffect triggers when classSelect changes)
    useEffect(() => {
        async function classPicked() {
            if (classSelect != '') {
                const opt = await getProfs(classSelect);
                setProfs(opt)
                await setSelected(true)
                await setProfSelect('')
            } 
        }
        classPicked()
    }, [classSelect])

    //handles when professor is picked, fetches list of files for class and professor picked (profSelect in array in bottom helps trigger function everytime profSelect is called)
    useEffect(() => {
        async function profPicked() {
            if (profSelect != '') {
                setAllSet(true)
                const arr = await getnotes(profSelect, classSelect)
                await setFiles(arr)
                setGotFiles(true)

            }
        }
        profPicked()
    }, [profSelect])



    //handle class change in select menu
    const handleClassChange = async (event) => {
        setGotFiles(false)
        setAllSet(false)
        await setClassSelect(event.target.value)

    };

    //handleProf change in select menu
    const handleprof = async (event) => {
        setAllSet(false)
        await setProfSelect(event.target.value)


    }





    //renders the select interface, only renders the second select menu when it first select menu has class selected and the notes when class and professor have been selected
    return (
            <div>
                <form>
                    {/*div and material-ui grid used for placing select menus next to each other with some space in between*/}
                    <div style = {{flexGrow: 2, flexDirection:"column", position:"relative",  justifyContent:"center"}}>
                        <Grid container spacing = {4}>
                            <Grid item xs={6}>
                                {isReady ? //displays loading icon until class list is fetched from backend, otherwise displays class select menu
                                <div>
                                    <h1>Choose class</h1>
                                    <FormControl variant="outlined">
                                        <InputLabel htmlFor="classPick" color="secondary">
                                            Class:
                                        </InputLabel>
                                        {/*Renders select menu for class list */}
                                        <Select
                                            native
                                            value={classSelect}
                                            onChange={handleClassChange}
                                            inputProps={{
                                                name: "value",
                                                id: "classPick"
                                            }}
                                            label="Class"
                                            color="secondary"
                                        >
                                        {/*renders class list with mapping function and none as a default selection*/}
                                        <option aria-label="None" value="" />
                                        {classChoices.map(function(f) {
                                            return (<option value={f.value} key={uuidv4()}>{f.label}</option>);
                                        })}
                                        </Select>

                                    </FormControl>
                                </div>
                                : <div className="processing">
                                    <p>Loading...</p>
                                    <div className="loader">Loading...</div>
                                </div>}

                            </Grid>

                            <Grid item xs={6}>
                                {isSelected ? //handles when class is selected, if class isn't selected then render null, otherwise render the select menu for professors, change handled by handleProf
                                        <div style = {{}}>
                                            <h1>Choose professor: </h1>
                                            <FormControl variant="outlined">
                                                <InputLabel htmlFor="classPick" color="secondary">
                                                    Instr:
                                                </InputLabel>
                                                {/*Renders select menu for professor list */}
                                                <Select
                                                    native
                                                    value={profSelect}
                                                    onChange={handleprof}
                                                    inputProps={{
                                                        name: "value",
                                                        id: "classPick"
                                                    }}
                                                    label="Class"
                                                    color="secondary"
                                                >
                                                {/*renders professor list with mapping function and none as a default selection*/}
                                                <option aria-label="None" value="" />
                                                {profChoices.map(function(f) {
                                                    return (<option value={f.value} key={uuidv4()}>{f.label}</option>);
                                                })}
                                                </Select>

                                            </FormControl>
                                        </div>
                                
                                    : null
                                }
                            </Grid>

                        </Grid>
                
                    </div>
                </form>
                {/*handles rendering notes module*/}
                <ShowNotes 
                selected={allSet} 
                gotfile={gotFiles} 
                files={files} 
                profSel={profSelect} 
                classSel={classSelect} 
                user={currUser}
                />
            </div>
    );
}

export default Note;

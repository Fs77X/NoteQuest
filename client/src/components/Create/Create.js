import { TextField, Button, Grid, FormControl, InputLabel, Select } from '@material-ui/core';
import React, { useEffect, useState } from "react";
import { Redirect } from 'react-router';
import firebase from "../../firebase/config";
import { useForm } from "react-hook-form"
import axios from 'axios'; 
import { v4 as uuidv4 } from 'uuid';


const Create = (props) => {

    //isBusy handles what to render (loading or form)
    const [isBusy, setIsBusy] = useState(false);
    //triggers the redirect
    const [routeRedirect, setRedirect] = useState(false);
    //gets the file
    const [fileSelected, setFile] = useState(null);
    //form handling things
    const {register, handleSubmit} = useForm()
    //for handling options for class codes
    const [classCodes, setCodes] = useState(null)
    //for subject
    const [subjSelect, setSubj] = useState('')



    //updates file variable in function
    const onFileChange = event =>  {
        setFile(event.target.files[0])
    }



    //handles uploading of the document and then redirects or 
    //if it didn't upload then report to user something happened and try again
    const upload = async (formData, combStr) => {
        const res = await axios.post("http://localhost:8080/upload_file", formData); 
        const resdat = res.data
        if(resdat.status === true){
            alert("Notes uploaded to class: " + combStr)
            setIsBusy(false)
            setRedirect(true)
        } else{
            alert("Something went wrong, please try again!")
            setIsBusy(false)
        }

    }


    //onSubmit handles the process for submitting notes to the server
    //we recieve data from our form and append it to our formdata
    //then we attempt to do a post request to our server and if status returns True, then 
    //notes uploaded succesfully. If successful, then we return the user to /notes so they can 
    //see notes. Otherwise, we tell them something went wrong and return them to the /create page
    const onSubmit = async (data) => {
        const user = await firebase.getUserState()
        setIsBusy(true)
        const resStr = data.class.replace(/[^0-9a-zA-Z]/g, '')
        if(resStr.length > 4){
            alert('Enter a valid course no. please!')
            setIsBusy(false)
            setFile(null)
            return
        }
        const combStr = data.subject + resStr
        if(data.notes.length !== 0){
            const formData = new FormData()
            formData.append('avatar', data.notes[0])
            formData.append('class', combStr)
            formData.append('prof', data.prof)
            formData.append('user', user.displayName)
            await upload(formData, combStr)

        } else{
            alert("Please select file")
            setFile(null)
            setIsBusy(false)
        }

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

    //sets option for getting class codes
    const get_class_codes = async() => {
        let response = await axios.get('http://localhost:8080/send_class_codes')
        const data = await response.data;
        const blob = data["codes"]
        let codes = processBlob(blob)
        setCodes(codes)

    }


    //useEffect is called once when this page first loads, this will redirect the user if they aren't logged in and tried accessing the page
    //also checks if user is verified
    useEffect(() => {
        async function check(){
            //checks through firebase if user is signed in
            firebase.getUserState().then(user => {
                if (!user) {
                    alert("You must be logged in to access this page!")
                    props.history.replace("/login");
                } else {
                    if (!user.emailVerified) {
                        alert("You need to verify your email before accessing this page!")
                        props.history.replace("/")
                    }
                }
            })
            await get_class_codes()
        }
        check()

    }, [])

    const redirect = routeRedirect;
    if (redirect) {
        return <Redirect to="/notes" />

    }




    const handleOnchange = async (event) => {
        await setSubj(event.target.value)

    }

    let createForm;
    //render loading or form for uploading notes
    if (isBusy) {
        createForm = <div className="processing">
            <p>Request is being processed</p>
            <div className="loader">Loading...</div>
        </div>
    } else if(!classCodes){
        createForm = <div className="processing">
            <p>Request is being processed</p>
            <div className="loader">Loading...</div>
        </div>

    } else { //Returns form for submitting notes
        createForm = 
            <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Upload notes</h1>
            <div style = {{flexGrow: 1, 
                flexDirection:"column"
            }}>
                {/* Grid uses CSS Flexbox to organize the form elements (in column)*/}
                <Grid container spacing = {2}>
                    <Grid item xs={2}>
                        {/* Getting Subject, inputRef gets the value from the Select menu from name subject */}
                        <FormControl required variant="outlined">
                            <InputLabel 
                            htmlFor="subjectPick" 
                            color="secondary">
                                Subject:
                            </InputLabel>
                            <Select
                            native
                            value={subjSelect}
                            onChange={handleOnchange}
                            inputProps={{
                                name: "subject",
                                id: "subjectPick",
                            }}
                            inputRef={register}
                            label="Subject"
                            name="subject"
                            color="secondary"
                            >
                            {/* options have each option for classCodes, none is first option as default 
                            mapping function here basically creates an array of options to show up for our select menu*/}
                            <option aria-label="None" value="" />
                            {classCodes.map(function(f) {
                                return (<option value={f.value} key={uuidv4()}>{f.label}</option>);
                            })}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={4} style={{paddingLeft:"30px"}}>
                        {/* Textfield for getting class number, we get user input from inputRef and the name (class) */}
                        <TextField
                            required
                            id="outlined-secondary=required"
                            label="Course No."
                            variant="outlined"
                            type="text"
                            inputRef={register}
                            name="class"
                            color="secondary"
                        />


                    </Grid>

                    <Grid item xs={5}  
                        style={{paddingLeft:"30px"}}>
                        {/* Textfield for getting professor from user, we get user input from inputRef and the name (prof) */}
                        <TextField
                            required
                            id="outlined-secondary-required"
                            label="Professor"
                            variant="outlined"
                            type="text"
                            inputRef={register}
                            name="prof"
                            style={{maxHeight:"10px"}}
                            color="secondary"
                        />
                    </Grid>
                </Grid>
            </div>

            
            <div style = {{flexGrow: 1, flexDirection:"column"}}>
                <Grid container spacing = {2}>
                    <Grid item xs={3}>
                    <label>
                        {/* Input for getting file from user that's displayed as a button, we get user input from inputRef and the name (notes) */}
                        <input ref={register} 
                            type="file" 
                            name="notes"
                            onChange={onFileChange}
                            style={{ display: "none" }}
                        />
                            <Button style={{background: 'linear-gradient(45deg, #fdc700 30%, #f29813 90%)',
                                            border: 0,
                                            borderRadius: 3,
                                            color: '#003c6c',
                                            height: 48,
                                            padding: '0 30px',}}
                            variant="contained" 
                            component="span">
                                Upload File
                            </Button>
                    </label>

                    </Grid>
                    {/* Displays if there's a file selected so the user knows that they picked, otherwise doesn't render anything */}
                    <Grid item xs={3}>
                        {fileSelected ? 
                        <div style={{ left: '50%',
                            marginRight:"-50%",
                            textAlign:'center', 
                            justifyContent:'center'
                        }}>
                            <h1 style={{fontSize:'12px', font:"Times New Roman"}}>{fileSelected.name}</h1>
                        </div>
                         :
                        null}
                    </Grid>
                </Grid>
            </div>

            {/* Button for posting notes, type="submit" submits the form*/}
            <div>
                <Button variant="contained" style={{background: 'linear-gradient(45deg, #003c6c 30%, #006aad 90%)',
                    border: 0,
                    borderRadius: 3,
                    color: '#fdc700',
                    height: 48,
                    padding: '0 30px',}} 
                    type="submit" 
                    value="create post"
                >
                    Post Notes
                </Button>
            </div>


        </form>

    }

    //where it actually renders the form
    return ( <div>
                {createForm}
            </div>


    )


}
export default Create;
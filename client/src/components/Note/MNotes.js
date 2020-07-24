import React, { useState, useEffect } from "react";
import Iframe from 'react-iframe'
import { Button, Grid } from '@material-ui/core';
import ThumbsUpIcon from '@material-ui/icons/ThumbUp'
import axios from 'axios';


//little notes module
function MNotes(props) {
    //state for whether its displaying notes or not
    const [showNotes, setNotes] = useState(false)
    //state of text, default its show notes since notes is closed
    const [text, changeText] = useState("Show notes")
    //background color for button (initial load state)
    const [bColor, setBColor] = useState("#003c6c")
    //text color for button (initial load state)
    const [tColor, setTColor] = useState("#fdc700")
    //color for thumbs, initially white when first loaded
    const [thumbUpColor, setThumbUpColor] = useState("white")
    //set so changeLike in useeffect doesn't run on initial loading of page
    const [finishLoad, setFinish] = useState(false)
    //sets amount of likes locally
    const [amountLikes, setAmount] = useState(0)
    //sets like state(for color of button)
    const [like, setLike] = useState(false)
    
    //changeLike() in useEffect is a react hook triggered everytime the like state changes
    //like state is used to show what color it is (like or not liked) on the front end and 
    //with the change we have to update the amount of likes to the server
    //this function will only trigger when thte initial load is finished
    //at the end of the request we set thumb color to whatever it should display (gold or grey color)
    //added AbortController to solve possible memory leak issues
    useEffect(() => {

        async function changeLike(){
            const abortCtrl = new AbortController();
            const opts = { signal: abortCtrl.signal };
            if(finishLoad){
                // console.log('like in changelike: ', like) 
                const profSel = props.profSel
                const classSel = props.classSel
                const user = props.user.displayName
                //if color changed to gray, then unupvote, otherwise upvote
                if(like === false){
                    await axios.get('http://localhost:8080/get_rating?user=' + user + '&mode=unupvote&class=' + classSel + '&prof=' + profSel + '&url=' + props.link, opts).then(res =>{
                        if(res.status !== 200){
                            alert('Uh oh, something went wrong, try again later')
                        }
                        const likes = amountLikes - 1
                        setAmount(likes)
                    })

                } else{
                    await axios.get('http://localhost:8080/get_rating?user=' + user + '&mode=upvote&class=' + classSel + '&prof=' + profSel + '&url=' + props.link, opts).then(res =>{
                        if(res.status !== 200){
                            alert('Uh oh, something went wrong, try again later')
                        }
                        const likes = amountLikes + 1
                        setAmount(likes)
                    })

                }


            }
            return () => abortCtrl.abort();

        }

        function setColorButton(){
            if(like){
                setThumbUpColor('#fdc700')
            } else{
                (setThumbUpColor("#91908C"))
            }

        }

        setColorButton()
        changeLike()

    }, [like])


    //initially ran when loading each note (gets likes)
    //first get likes for specific note and then check if the user name is in the array
    //then update the state of the like button 
    useEffect(() => {
        async function getLikes(){
            const profSel = props.profSel
            const classSel = props.classSel
            const user = props.user
            const res = await axios.get('http://localhost:8080/get_rating?mode=status&class=' + classSel + '&prof=' + profSel + '&url=' + props.link)
            if(res !== {}){
                const data = await res.data
                if(data.upvoted){
                    setAmount(data.upvoted.length)
                    if(data.upvoted.indexOf(user.displayName) > -1){
                        await setLike(true)
                    }

                }
                setFinish(true)

            } else{
                console.log(res)
            }
        }
        getLikes()
        
    }, [])



    //toggle notes handles the button color and text
    const toggleNotes = () => {
        setNotes(!showNotes)
        if(bColor === "#003c6c"){
            setBColor("#fdc700")
            setTColor('#003c6c')
        }else{
            setBColor("#003c6c")
            setTColor("#fdc700")
        }
    }

    //function that toggles the like button to like or unlike
    const toggleThumb = (action) => {
        if(action == "up") {
            if (thumbUpColor == "#91908C"){
                setLike(true)
            }
            else {
                setLike(false)
            }
        }
    }

    //handles the change of the button text
    useEffect(() => {
        if(showNotes) {
            changeText(" Close Notes")
        } else{
            changeText(" Show Notes")
        }

    }, [showNotes])
    
    
    //renders notes Module
    return (
        <div style={{position:"relative", 
            paddingTop:'20px', 
            paddingBottom:"50px",
            flexDirection:"column",
            justifyContent:"center", 
            textAlign:"center"
        }}>
            {/* div to display like and open/close button in column with material ui grid*/}
            <h1>{props.name}</h1>
            <div style ={{position:"relative",
                paddingBottom:"10px", textAlign:"center", flexGrow:1, flexDirection:'row'}}>
                <Grid container justify="center" spacing={2}>
                    <Grid item xs={1}>
                        <Button variant="contained" onClick={(e) => { toggleNotes() }} 
                            style = {{position:"relative", backgroundColor:bColor, color:tColor}}>
                            {text}
                        </Button>
                    </Grid>
                    <Grid item xs={1} style={{paddingTop:'13px'}}>
                        <ThumbsUpIcon color="secondary" 
                            onClick={(e) => { toggleThumb("up") }} 
                            style = {{position:"relative", color:thumbUpColor}}
                        />
                            <div style={{textAlign:"center"}}>
                                <h1 style ={{fontSize:'10px'}}>{amountLikes}</h1>
                            </div>
                        </Grid>
                </Grid>

            </div>
            
            {/*showNotes toggles when button is clicked and displays notes or nothing at all*/}
            {showNotes ? 
            <div style={{paddingBottom:'20px'}}>
                <Iframe url={props.link}
                    width="650px"
                    height="800px"
                    id="myId"
                    className="myClassname"
                    display="initial"
                    position="relative" />


            </div>  
                : null
            }
        </div>
    )
    


}

export default MNotes;
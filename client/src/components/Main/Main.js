import React from "react";
import img from "../../fiat-slug.png";
import { FiLogIn } from "react-icons/fi";
import { Grid } from "@material-ui/core"
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { FaShareSquare, FaStickyNote } from "react-icons/fa";


const Main = () => {

  //simply is our home/main page
  return (
    <React.Fragment>
      <header id='soHead'>
        <div>
          {/*React CSS transitions, last for 3000MS (3 seconds) for header portion*/}
          <ReactCSSTransitionGroup
            transitionName="example"
            transitionAppear={true}
            transitionAppearTimeout={3000}
            transitionEnter={false}
            transitionLeave={false}
          > 
            <h1 style={{ color: 'black' }}>NoteQuest</h1>
            <p style={{ color: 'black', fontSize: '30px' }}>UCSC's central hub for class notes!</p>
          
          </ReactCSSTransitionGroup>
          
        </div>
        <img src={img} alt="slugbois" />
      </header>
      
      
      
      {/*React CSS transitions, last for 3000MS (3 seconds) for body portion*/}
      <ReactCSSTransitionGroup
        transitionName="example"
        transitionAppear={true}
        transitionAppearTimeout={3000}
        transitionEnter={false}
        transitionLeave={false}
      >
          <div style={{ flexGrow: 1, 
            flexDirection: 'column', 
            textAlign: 'center', 
            paddingRight: '3.5em', 
            paddingTop: '3em' 
          }}>
            {/*Individual body elements with icons*/}
            <Grid container justify="center">
              <Grid item xs={4}>
                <h1>Sign in</h1>
                <FiLogIn size={70} />
                <p>Use your UCSC email to get access</p>
              </Grid>
              <Grid item xs={4}>
                <h1>Upload notes</h1>
                <FaStickyNote size={70} />
                <p>Notes will be organized by class and professor</p>
              </Grid>
              <Grid item xs={4}>
                <h1>Share via NoteQuest</h1>
                <FaShareSquare size={70} />
                <p>Share notes to your classmates in just one click</p>
              </Grid>
            </Grid>
          </div>

      </ReactCSSTransitionGroup>
    </React.Fragment>
  )
}

export default Main;
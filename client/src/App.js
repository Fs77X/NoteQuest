import React, {useState} from 'react';
import { Paper } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
//routes
import Routes from "./routes";
import Nav from "./components/Nav/Nav";

//settings for Dark Theme
const darkTheme = createMuiTheme({
  palette: {
      type: "dark",
      secondary: {
        main:'#ffffff'
      }
  }, 

})

//settings for Light Theme
const lightTheme = createMuiTheme({
  palette: {
      type: "light",
      secondary: {
        main:'#3f51b5'
      }
  },

})

function App() {
  //sets theme for app
  const [theme, setTheme] = useState('dark');

  //handles the toggle to change the body style from child nav bar
  const toggleTheme = (newTheme) => {
    if (newTheme === 'light') {
      setTheme('dark');
      document.body.style = 'background: rgba(66, 66, 66, 1);';
    } else {
      setTheme('light');
      document.body.style = 'background: rgba(255,255,255,1);';
      
    }
  }



  return (
    <div className="App">
      <Nav theme={theme} onClick={toggleTheme}/>
      <div>
        {/*changes the theme which also changes the UI stylizing*/}
        <ThemeProvider theme = {theme === 'light' ? lightTheme : darkTheme}>
          {/*Paper forces the styling to change between light and dark mode for material UI stuff*/}
          <Paper elevation={0} style={{height: "auto"}}>
            <Routes />
          </Paper>
        </ThemeProvider>
      </div>
    </div>
  );
}

export default App;

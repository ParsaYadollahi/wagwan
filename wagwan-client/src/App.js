import React, { Component } from 'react';
import{ BrowserRouter as Router , Switch, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeFile from './util/theme';
import jwtDecode from 'jwt-decode';

// Redux
import { Provider } from 'react-redux'
import store from './redux/store'

// Components
import NavBar from './components/navbar';
import AuthRoute from './util/AuthRoute'

//Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

const theme = createMuiTheme(themeFile);

// Get token
let authenticated;
const token = localStorage.FBIdToken;
if (token){
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) { // The token expired (in seconds)
    window.location.href = '/login' // go back to login page
    authenticated = false;
  } else {
    authenticated = true;
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}> // Any child of Provider can access the store
            <Router>
            <NavBar />
              <div className='container'>
                <Switch>
                  <Route exact  path="/" component={home}/>
                  <AuthRoute
                    exact
                    path="/login"
                    component={login}
                    authenticated={authenticated} />
                  <AuthRoute
                    exact
                    path="/signup"
                    component={signup}
                    authenticated={authenticated} />
                </Switch>
              </div>
            </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;

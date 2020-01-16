import React, { Component } from 'react';
import{ BrowserRouter as Router , Switch, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import jwtDecode from 'jwt-decode';
import axios from 'axios';


// Redux
import { Provider } from 'react-redux'
import store from './redux/store'
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

// Components
import NavBar from './components/Layout/Navbar';
import AuthRoute from './util/AuthRoute';
import themeFile from './util/theme';


//Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import user from './pages/users';
import reset from './pages/reset'

const theme = createMuiTheme(themeFile);

axios.defaults.baseURL = "https://us-central1-wagwan-6797c.cloudfunctions.net/api";

// Get token

const token = localStorage.FBIdToken;
if (token){
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) { // The token expired (in seconds)
    store.dispatch(logoutUser()); // Will remove token and logout
    window.location.href = '/login'; // go back to login page
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <Router>
            <NavBar />
              <div className='container'>
                <Switch>
                  <Route exact path="/" component={home} />
                  <AuthRoute exact path="/login" component={login} />
                  <AuthRoute exact path="/signup" component={signup} />
                  <Route exact path="/users/:handle" component={user} />
                  <Route exact path="/users/:handle/scream/:screamId" component={user} />
                  <Route exact path="/reset" component={reset} />
                </Switch>
              </div>
            </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;

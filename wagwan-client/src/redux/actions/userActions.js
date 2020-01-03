import {
    SET_USER,
    SET_ERRORS,
    CLEAR_ERRORS,
    LOADING_UI,
    SET_UNAUTHENTICATED,
    LOADING_USER
} from '../types';
import axios from 'axios';

export const loginUser = ( userData, history ) => (dispatch) => { // Need dispatch becuase asynchronous code
    dispatch({ type: LOADING_UI }); // Link method component to action (userData to Loading UI)
    axios
        .post('/login', userData )
            .then(response => {
                setAuthHeader(response.data.token)

                dispatch(getUserData());
                dispatch({ type: CLEAR_ERRORS }); // If not errors, we can redirect
                history.push('/'); // Push state in url and go to it (redirect to home page)
            })
            .catch(err => {
                dispatch({
                    type: SET_ERRORS,
                    payload: err.response.data
                });
            });
}

// Almost same as Login
export const signupUser = ( newUserData, history ) => (dispatch) => { // Need dispatch becuase asynchronous code
    dispatch({ type: LOADING_UI }); // Link method component to action (newUserData to Loading UI)
    axios
        .post('/signup', newUserData )
            .then(response => {
                setAuthHeader(response.data.token)

                dispatch(getUserData());
                dispatch({ type: CLEAR_ERRORS }); // If not errors, we can redirect
                history.push('/'); // Push state in url and go to it (redirect to home page)
            })
            .catch(err => {
                dispatch({
                    type: SET_ERRORS,
                    payload: err.response.data
                });
            });
}

// Log user out
export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FBIdToken'); // Remove token from local storage
    delete axios.defaults.headers.common['Authorization']; // Delete entry (removes the auth header)
    dispatch({ type: SET_UNAUTHENTICATED }); // Will clear user state (==> set inital state (empty everything))
}

export const getUserData = () => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios
        .get('/user')
            .then(res => {
                dispatch({
                    type: SET_USER,
                    payload: res.data // Data that sent to reducer
                })
            })
            .catch(err => console.log(err));
}

export const uploadImage = (formData) => (dispatch) => {
    // Call user loading action
    dispatch({ type: LOADING_USER });
    axios.post('/user/image', formData)
        .then(res => {
            dispatch(getUserData());
        })
        .catch(err => console.log(err));
};

// ftn that send request to edit details
export const editUserData = (userData) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post('/user', userData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err => console.log(err));
}


const setAuthHeader = (token) => {
    console.log(token);
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem('FBIdToken', `Bearer ${token}`);
    axios.defaults.headers.common['Authorization'] = FBIdToken; // Each request gonna have a header looking like dat
}

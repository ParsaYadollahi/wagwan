import {
    SET_USER,
    SET_ERRORS,
    CLEAR_ERRORS,
    LOADING_UI
} from '../types';
import axios from 'axios';

export const loginUser = ( userData, history ) => (dispatch) => { // Need dispatch becuase asynchronous code
    dispatch({ type: LOADING_UI }); // Link method component to action (userData to Loading UI)
    axios
        .post('/login', userData )
            .then(response => {
                console.log(response.data);
                const FBIdToken = `Bearer ${response.data.token}`;
                localStorage.setItem('FBIdToken', `Bearer ${response.data.token}`);
                axios.defaults.headers.common['Authorization'] = FBIdToken; // Each request gonna have a header looking like dat

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

export const getUserData = () => (dispatch) => {
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

import {
    SET_USER,
    SET_ERRORS,
    CLEAR_ERRORS,
    LOADING_UI,
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED
} from '../types';

const initialState = { // userReducer
    athenticated: false,
    credentials: {},
    likes: [],
    notifications: []
};

export default function(state = initialState, action) { // Takes action and initial state
    switch(action.type){
        // If any of the  states change
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            };
            case SET_UNAUTHENTICATED:
                return initialState;
            case SET_USER:
                return {
                    authenticated: true, // We got user data
                    ...action.payload
                };
                default:
                    return state;
    }
}

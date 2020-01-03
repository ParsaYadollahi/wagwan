import {
    SET_USER,
    SET_ERRORS,
    CLEAR_ERRORS,
    LOADING_UI,
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    LOADING_USER
} from '../types';

const initialState = { // userReducer
    athenticated: false,
    loading: false,
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
                    loading: false,
                    ...action.payload
                };
            case LOADING_USER:
                return {
                    ...state,
                    loading: true
                }
                default:
                    return state;
    }
}

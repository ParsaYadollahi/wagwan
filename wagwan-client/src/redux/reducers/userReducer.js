import {
    SET_USER,
    SET_ERRORS,
    CLEAR_ERRORS,
    LOADING_UI,
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    LOADING_USER,
    LIKE_SCREAM,
    UNLIKE_SCREAM
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
                };
            case LIKE_SCREAM:
                return {
                    ...state,
                    likes: [
                        ...state.likes,
                        { // add new like
                            userHandle: state.credentials.handle,
                            screamId: action.payload.screamId
                        }
                    ]
                }
            case UNLIKE_SCREAM:
                return { // remove the like and user
                    ...state,
                    likes: state.likes.filter(like => like.screamId !== action.payload.screamId)
                }
                default:
                    return state;
    }
}

import {
    SET_SCREAMS,
    LIKE_SCREAM,
    UNLIKE_SCREAM,
    LOADING_DATA
} from '../types';

const initialState = {
    screams: [], // array holding all screams
    scream: {}, // details of one scream
    loading: false,
};

export default function(state = initialState, action){
    switch(action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case SET_SCREAMS:
            return {
                ...state,
                screams: action.payload,
                loading: false
            }
        case LIKE_SCREAM:
        case UNLIKE_SCREAM:
            // Add like to array of user like and increment like
            let index = state.screams.findIndex((scream) => scream.screamId === action.payload.screamId); // screamId same as payload
            state.screams[index] = action.payload; // replace it in the state
            return {
                ...state
            };
        default:
            return state;

    }
}

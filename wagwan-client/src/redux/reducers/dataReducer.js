import {
    SET_SCREAMS,
    LIKE_SCREAM,
    UNLIKE_SCREAM,
    LOADING_DATA,
    POST_SCREAM,
    DELETE_SCREAM,
    SET_SCREAM,
    SUBMIT_COMMENT
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
            // check scream stored in singular scream obj has same Id, liked the scream opened
            if (state.scream.screamId === action.payload.screamId) {
                state.scream = action.payload;
            }
            return {
                ...state
            };
        case DELETE_SCREAM:
            // find the index of scream and remove it from screams array
            index = state.screams.findIndex(scream => scream.screamId === action.payload);
            state.screams.splice(index, 1); // remove 1 element at array[index]
            return {
                ...state
            };
        case POST_SCREAM:
            // need to add it to screams array
            return {
                ...state,
                screams: [
                    action.payload, // add new screams to top
                    ...state.screams // spread the old screams
                ]
            };
        case SET_SCREAM:
            return {
                ...state,
                scream: action.payload
            };
        case SUBMIT_COMMENT:
            return {
                ...state,
                scream: { // Add to top
                    ...state.scream,
                    comments: [action.payload, ...state.scream.comments]
                }
            }
        default:
            return state;

    }
}

import { // Import all the reducers to combine em
    createStore,
    combineReducers,
    applyMiddleware,
    compose
 } from 'redux';
import thunk from 'redux-thunk';

import userReducer from './reducers/userReducer';
import dataReducer from './reducers/dataReducer';
import uiReducer from './reducers/uiReducer';


const initialState = {};

const middleWare = [thunk];

const reducer = combineReducers({
    user: userReducer,
    data: dataReducer,
    UI: uiReducer
});

const store = createStore(reducer, initialState,  compose(applyMiddleware(...middleWare)));

export default store;

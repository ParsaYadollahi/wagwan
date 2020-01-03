import {
    createStore,
    combineReducers,
    applyMiddleware,
    compose
 } from 'redux';
import thunk from 'redux-thunk';

import userReducer from './reducer/userReducer';
import dataReducer from './reducer/dataReducer';
import uiReducer from './reducer/uiReducer';


const initialState = {};

const middleWare = [thunk];

const reducer = combineReducers({ // actual State
    user: userReducer, // everything coming from userReducer, gets stored in this object
    data: dataReducer, // Same from dataReducer
    UI: uiReducer //...
});

const store = createStore(reducer, initialState,  compose(applyMiddleware(...middleWare),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));

export default store;

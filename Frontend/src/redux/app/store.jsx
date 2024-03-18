import {combineReducers, configureStore} from '@reduxjs/toolkit'
import userReducer  from '../features/userSlice'
import {thunk} from 'redux-thunk';


const rootReducer = combineReducers({
    user:userReducer
})

const store = configureStore({
    reducer:rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
})

export default store;
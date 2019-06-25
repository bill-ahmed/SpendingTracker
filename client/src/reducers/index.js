import {combineReducers} from 'redux';
import isAuthReducer from './isAuth';
import transactionDataReducer from './transactionData';

const allReducers = combineReducers({
    auth: isAuthReducer,
    transactionData: transactionDataReducer
})

export default allReducers;     
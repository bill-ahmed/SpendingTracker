import {combineReducers} from 'redux';
import transactionDataReducer from './transactionData';

const allReducers = combineReducers({
    transactionData: transactionDataReducer
})

export default allReducers;     
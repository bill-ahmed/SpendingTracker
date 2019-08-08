import {combineReducers} from 'redux';
import transactionDataReducer from './transactionData';
import UserInfoReducer from './GetUserInfo';

const allReducers = combineReducers({
    transactionData: transactionDataReducer,
    UserInfo: UserInfoReducer
});

export default allReducers;     
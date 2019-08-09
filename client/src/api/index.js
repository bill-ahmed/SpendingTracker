// Redux components
import {useSelector, useDispatch} from 'react-redux';
import {setTransactionData} from '../actions';

const fetch = require('node-fetch');
// const flaskEndpoint = "https://api.billahmed.com/";
const flaskEndpoint = "http://127.0.0.1:5000";

/**GET request to server.js API, store response in redux STORE
 * @param errFunc A function to execute when error occurs
 */
function FetchData(errFunc) {
    const dispatch = useDispatch();

    var endpoint = `${flaskEndpoint}/_api/fetchTransactions`;

    var options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "accessToken": localStorage.getItem("accessToken")
        },
    }

    fetch(endpoint, options)
    .then(res => {

        // If user is not given a type of error message, throw the appropriate status code
        if(res.status >= 400){
            throw res.status;
        }
        return res.json()})
    .then(resp => {

        // Update out STORE with this transaction data
        resp = mapDateToAmount(resp);
        dispatch(setTransactionData(resp));
    })
    .catch((error) => {errFunc()});
}

/**Given the raw data from firebase, map all the dates to the amount spent each day
 * @param rawData The data retrieved from server
 * @returns A modified response that includes a mapping of each data to the amount spent
 */
function mapDateToAmount(rawData){
    let dates = rawData.amountPerDay.dates;
    let amounts = rawData.amountPerDay.totalExpenses;

    // Add new field for amount spent per day
    let newAmountPerDay = {};

    for(let i=0; i < dates.length; i++){
        newAmountPerDay[formatDate(dates[i])] = amounts[i];
    }

    // Add a new field that maps each day to the amount spent on that day
    rawData.amountPerDay.newAmountPerDay = newAmountPerDay;
    return rawData;

}

/**Given a date, format and return it as a JS Date() object 
 * @param date The date to confirm, in string format. Must be like: "Fri, 15 Mar 2019 04:00:00 GMT"
 * @returns A Date() object representing the provided date
*/
function formatDate(date){
    // Split the date int [DD, MM, YYYY]
    let tempDate = date.substring(5, date.length - 13).split(" ");

    return new Date(tempDate);
}

const funcs = {FetchData, formatDate};

export default funcs;
// Redux components
import {useDispatch} from 'react-redux';
import {setTransactionData, setOfflineStatus} from '../actions';

const fetch = require('node-fetch');
// const flaskEndpoint = "https://api.billahmed.com/";
const flaskEndpoint = "http://127.0.0.1:5000";

/**GET request to server.js API, store response in redux STORE
 * @param successFunc The function to execute when data is successfully retrieved. Takes in parameters: 
 * (key, value), where value is response data
 * @param key The key to pass into the function
 */
function FetchData(successFunc, key) {
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
        // dispatch(setOfflineStatus(false));
        // Run success function
        successFunc(key, resp);
    })
    .catch((error) => {
        dispatch(setOfflineStatus(true));
    });
}

/**Given the raw data from firebase, map all the dates to the amount spent each day
 * @param rawData The data retrieved from server
 * @returns A modified response that includes a mapping of each data to the amount spent
 */
function mapDateToAmount(rawData){
    let dates = rawData.amountPerMetric.dates;
    let amounts = rawData.amountPerMetric.totalExpenses;

    // Add new field for amount spent per day
    let amountPerDay = {};

    for(let i=0; i < dates.length; i++){
        amountPerDay[formatDate(dates[i])] = amounts[i];
    }

    // Add a new field that maps each day to the amount spent on that day
    rawData.amountPerMetric.amountPerDay = amountPerDay;
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
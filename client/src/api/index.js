// Redux components
import {useSelector, useDispatch} from 'react-redux';
import {setTransactionData} from '../actions';

const fetch = require('node-fetch');
const flaskEndpoint = "https://192.168.0.48";

/**GET request to server.js API, store response in redux STORE */
function FetchData() {
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
        console.log(res);
        return res.json()})
    .then(resp => {
        // Update out STORE with this transaction data
        dispatch(setTransactionData(resp));
    })
    .catch((error) => console.log({"Error": error}));
}

export default FetchData;
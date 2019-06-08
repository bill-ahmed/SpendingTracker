export async function fetchData() {
    // Store the result of API request
    let resultData;

    var endpoint = "http://127.0.0.1:5000/_api/fetchTransactions";

    var options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "accessToken": localStorage.getItem("accessToken")
        },
    }

    await fetch(endpoint, options)
    .then(res => {
        console.log(res);
        // If the response returns okay, retrun json result
        if(res.ok){
            return res.json();
        }

        throw ["Invalid response! Try to sign-out and sing-in again.", res.json()]})
    .then(resp => {
        //console.log(resp);

        // Generate the graphs with the collected data
        resultData = resp;

        })
    // .catch((error) => {
        
    //     console.log({"Error": error})});
    
    return resultData;
}

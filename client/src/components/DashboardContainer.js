import React from 'react';
import Dashboard from './Dashboard';
import FetchData from '../api'; 
import firebase from 'firebase';
import UserInfo from '../api/GetUserInfo';


export function DashboardContainer() {
    FetchData.FetchData(setCache, "transactionData", handleLogOut); // Update transaction data in STORE
    UserInfo.GetUserInfo(); // Retrieve all user required information
    return(
        <Dashboard handleLogOut={handleLogOut}/>
    );
}

/**** Various helper functions for the app ****/

/**Given some data, add it to the cache with the specified key
 * @param key (str) The key to use when setting this value
 * @param value (object) The value to store for the given key
 */
function setCache(key, value){
    localStorage.setItem(key, value);   // Add to local storage
}

/**Given some key, retrieve the cached data
 * @param key (str) The key to use when getting a value
 * @returns An object that the provided key maps to in the cache
 */
function getCache(key){
    return localStorage.getItem(key);
}

/**Logout the current user via firebase.auth, and other house-keeping items */
function handleLogOut(){
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhoto");
    localStorage.removeItem("accessToken");
    firebase.auth().signOut()
    .then(() => {
        // Take user to home screen
        window.location.href = "/";

    })
    .catch((err) => {
        console.log(err);
        alert("Error when trying to logout. Check console log for details");
    });
    
}

export default DashboardContainer;
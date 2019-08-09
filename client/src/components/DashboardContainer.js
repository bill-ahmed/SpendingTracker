import React from 'react';
import Dashboard from './Dashboard';
import FetchData from '../api'; 
import firebase from 'firebase';
import UserInfo from '../api/GetUserInfo';

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

export function DashboardContainer() {
    FetchData.FetchData(handleLogOut); // Update transaction data in STORE
    UserInfo.GetUserInfo(); // Retrieve all user required information
    return(
        <Dashboard handleLogOut={handleLogOut}/>
    );
}

export default DashboardContainer;
import React from 'react';
import Dashboard from './Dashboard';
import FetchData from '../api'; 
import UserInfo from '../api/GetUserInfo';

export function DashboardContainer() {
    FetchData.FetchData(); // Update transaction data in STORE
    UserInfo.GetUserInfo(); // Retrieve all user required information
    return(
        <Dashboard/>
    );
}

export default DashboardContainer;
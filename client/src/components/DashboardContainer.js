import React from 'react';
import Dashboard from './Dashboard';
import FetchData from '../api'; 

export function DashboardContainer() {
    FetchData.FetchData(); // Update transaction data in STORE
    return(
        <Dashboard/>
    );
}

export default DashboardContainer;
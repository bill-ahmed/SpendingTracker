import React, { useState } from 'react';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import './Summary.css'

// Redux component
import {useSelector} from 'react-redux';

function Summary(props) {
    return(
        <Paper elevation={1} className="summary">
            <h2>Welcome!</h2>
            <Divider variant="fullWidth"/>
            <br/>
            <div className="summaryBody">
                <h4>
                You've spent $x this past week, and are y% below your monthly goal.
                </h4>

                <br/>

                <h4>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                culpa qui officia deserunt mollit anim id est laborum.
                </h4>

            </div>
        </Paper>
    );
}

export default Summary;
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import './AddTransaction.css';

class AddTransaction extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    render(){
        return(
            <Dialog open fullWidth>

                <DialogTitle>
                    Add a new Transaction
                </DialogTitle>
                <Divider/>

                <DialogContent>
                    <div className="addTransactionInfo">
                        <h4>All fields marked with '*' are required.</h4>

                        {/* Input textfields */}
                        <div className="inputFields">
                            <TextField className="singeLineInputField" required label="Title"/>
                            <TextField className="singeLineInputField" required label="Amount Spent" type="number"/>
                            <TextField className="singeLineInputField" required label="Date"/>
                            <TextField className="singeLineInputField" label="Location"/>
                            <TextField className="singeLineInputField" label="Category"/>
                        </div>
                        <TextField className="multiLineInputField" label="Additional Notes" variant="outlined" multiline rows="3" rowsMax="10" helperText="Maximum of 10 rows."/>
                        
                    </div>
                </DialogContent>

                {/*Add and Close buttons */}
                <DialogActions>
                    <Button variant="text" color="inherit" onClick={() => this.props.handleAddTransactionDialogModalClose()}>
                        Cancel
                    </Button>

                    <Button variant="text" color="primary">
                        Add
                    </Button>
                    
                </DialogActions>
            </Dialog>
        );
    }
}
export default AddTransaction;
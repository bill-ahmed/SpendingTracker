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

        this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
        this.handleDataSend = this.handleDataSend.bind(this);

        this.state = {
            title: '',
            amountSpent: 0.01,
            date: '',
            location: '',
            category: '',
            additionalNotes: '',
        }
    }

    /**Handle the input field information
     * @param fieldChanged The field that was changed (str)
     * @param event The new value of the textfield that was changed (int/str).
     */
    handleInputFieldChange(event, fieldChanged){
        if(fieldChanged === "title"){
            this.setState({title: event.target.value})

        } else if(fieldChanged === "amountSpent"){
            this.setState({amountSpent: event.target.value})

        } else if(fieldChanged === "date"){
            this.setState({date: event.target.value})

        } else if(fieldChanged === "location"){
            this.setState({location: event.target.value})

        } else if(fieldChanged === "category"){
            this.setState({category: event.target.value})

        } else if(fieldChanged === "additionalNotes"){
            this.setState({additionalNotes: event.target.value})

        }
        
        // console.log(event.target.value);
        // console.log(fieldChanged);
    }

    /**Verify all input data is valid and send it to back-end api */
    handleDataSend(){
        // Send post request and reload the page
        this.props.createTransaction(this.state);
        window.location.reload();
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
                            <TextField id="transactionTitle" className="singeLineInputField" 
                            required InputLabelProps={{shrink: true}} label="Title" error={this.state.title.trim() === ''} 
                            value={this.state.title} onChange={(event) => this.handleInputFieldChange(event, "title")}/>

                            <TextField id="amountSpent" className="singeLineInputField" 
                            required label="Amount Spent" type="number" error={this.state.amountSpent < 0} 
                            value={this.state.amountSpent} onChange={(event) => this.handleInputFieldChange(event, "amountSpent")}/>

                            <TextField id="dateOfTransaction" className="singeLineInputField" 
                            required InputLabelProps={{shrink: true}} label="Date" type="date" error={this.state.date.trim() === ''} 
                            value={this.state.date} onChange={(event) => this.handleInputFieldChange(event, "date")}
                            />

                            <TextField id="locationofTransaction" className="singeLineInputField" 
                            label="Location" value={this.state.location} onChange={(event) => this.handleInputFieldChange(event, "location")}/>

                            <TextField id="transactionCategory" className="singeLineInputField" 
                            label="Category" 
                            value={this.state.category} onChange={(event) => this.handleInputFieldChange(event, "category")}/>

                        </div>
                        <TextField fullWidth id="additionalNotes" className="multiLineInputField" 
                        label="Additional Notes" variant="outlined" multiline rows="3" rowsMax="10" helperText="Maximum of 10 lines." 
                        value={this.state.additionalNotes} onChange={(event) => this.handleInputFieldChange(event, "additionalNotes")}/>
                        
                    </div>
                </DialogContent>

                {/*Add and Close buttons */}
                <DialogActions>
                    <Button variant="text" color="inherit" onClick={() => this.props.handleAddTransactionDialogModalClose()}>
                        Cancel
                    </Button>

                    <Button variant="contained" color="primary" onClick={this.handleDataSend}>
                        Add
                    </Button>
                    
                </DialogActions>
            </Dialog>
        );
    }
}
export default AddTransaction;
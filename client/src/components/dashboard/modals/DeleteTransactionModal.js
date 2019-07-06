import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import './DeleteTransactionModal.css';

class DeleteTransactionModal extends Component{
    render() {
        let transactionInfo = this.props.transactionInfo;

        return(
            <Dialog open fullWidth>
                <DialogTitle>
                    Are you sure?
                </DialogTitle>
                <Divider/>
                <br/>
                
                <DialogContent>
                    <h4>You CANNOT undo this action. The following will be removed:</h4>
                    <br/>
                    <h4>{`"${transactionInfo[1]}" for ${transactionInfo[2]} at ${transactionInfo[4]}, on ${transactionInfo[3]}`}</h4>
                </DialogContent>

                <DialogActions>
                    <Button variant="text" color="inherit" onClick={() => this.props.handleDeleteModalClose()}>
                        Cancel
                    </Button>

                    <Button variant="text" color="secondary" onClick={() => {
                        this.props.deleteMethod();
                        }}>
                        DELETE
                    </Button>
                </DialogActions>

            </Dialog>
        );
    }
}

export default DeleteTransactionModal;
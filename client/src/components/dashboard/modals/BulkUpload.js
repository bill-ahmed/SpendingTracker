import React, {useState}  from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import { DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import './css/BulkUpload.css';

const steps = ["Choose file to upload", "Validate file", "Verify Data", "Upload"]

/**Given the index of the current step, return props that should be displayed */
function getStepContent(stepIndex){
    switch(stepIndex){
        case 0:
            return "step 1";
        case 1:
            return "step 2";
        case 2:
            return "step 3";
        case 3:
            return "step 4";
        default:
            return "Unknown step."
    }
}

function BulkUpload(props){
    const [currStep, setCurrStep] = useState(0);
    const [loading, setLoading] = useState(false);

    /**Handle going to the workflow step */
    const handleNext = () => {
        // If we've reached the end of the workflow, disable Upload button and indicate loading
        if(currStep === steps.length - 1){
            setUploadLoading();
        } else{
            setCurrStep(currStep + 1);
        }
    }

    /**Handle going to previous workflow step */
    const handleBack = () => {
        setCurrStep(currStep - 1);
    }

    /**Handle disabling and loading the upload button */
    const setUploadLoading = () => {
        setLoading(true);
    }

    return(
        <Dialog open fullWidth>
            <DialogTitle>
                    Bulk Upload
                </DialogTitle>
                <Divider/>

                <DialogContent>

                    <Stepper activeStep={currStep}alternativeLabel>
                        {steps.map(label => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/* If we've reached the last step, disable "next" button */}
                    <div>
                        {currStep === steps.length - 1 ? (
                            <div>
                                <h3>Completed all steps!</h3>
                            </div>
                        ) : (
                            <div>
                                {getStepContent(currStep)}
                            </div>
                        )}
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button disabled={loading} variant="text" onClick={props.handleBulkUploadDialogModalClose}>Cancel</Button>

                    <Button disabled={currStep === 0 || loading} onClick={handleBack} variant="text">Back</Button>

                    <Button disabled={loading} variant="contained" color="primary" onClick={handleNext}>
                        {loading && <CircularProgress size={30} id="loadingTransactionCreation"/>}

                        {currStep === steps.length - 1 ? 'Upload' : 'Next'}
                    </Button>
                </DialogActions>
        </Dialog>
    );
}

export default BulkUpload;
import React, {useState}  from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import { DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Papa from 'papaparse';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import './css/BulkUpload.css';

const steps = ["Choose file to upload", "Validate file", "Verify Data", "Upload"]

/**Given the index of the current step, return props that should be displayed 
 * @param stepIndex (int) The current step that the user is in
 * @param fileUploadChange (function) The function to run when a file has been uploaded
 * @param fileUploaded (File) The file currently uploaded by the user; can be null
 * @param parsingFile (bool) If the uploaded file is being processed or not
 * @returns DOM elements to render in the provided step
*/
function getStepContent(stepIndex, fileUploadChange, parsingFile, fileUploadedData){
    console.log("file uploaded:", fileUploadedData)
    switch(stepIndex){
        case 0:
            return (<div>
                        <input type="file" id="bulkFileUpload" onChange={() => fileUploadChange()}/>
                        <h4>Note: File must be in CSV format.</h4>
                    </div>);
        case 1:
            return (parsingFile ? <CircularProgress/> : 
                <div>
                    <h3>{"Completed parsing the file: " + fileUploadedData}</h3>
                </div>);
        case 2:
            return (<h4>If the following data is correct, click Next.</h4>);
        case 3:
            return (<h4>Click Upload to add transactions. It may take a while.</h4>);
        default:
            return "Unknown step."
    }
}

function BulkUpload(props){
    const [currStep, setCurrStep] = useState(0);        // Keep track of current workflow step
    const [loading, setLoading] = useState(false);      // File is being uploaded or not
    const [fileUploaded, setFileUploaded] = useState(); // If user has uploaded a file or not
    const [fileUploadedData, setFileUploadedData] = useState({})
    const [parsingFile, setParsingFile] = useState(true);   // If the CSV file is being processed or not

    /**Callback function for when parsing is completed. Add all the data into this.state
     * @param result The results of parsing
     * @param file The file the user uploaded
     */
    const onCompletedParsing = (result, file) => {
        setParsingFile(false);
        setFileUploadedData(result);
        console.log("Completed parsing CSV:", result);
    }

    // Papa parsing config options
    const csvParseConfig = {
        delimiter: "",  // auto-detect
        newline: "",	// auto-detect
        worker: true,    // dispatch worker so file can be parsed in the background
        dynamicTyping: false,   // dynamically determine int, float, strings, etc.
        complete: onCompletedParsing,         // Callback function for when parsing is completed

    }

    // If we are in the parsing step, parse the uploaded file
    if(currStep === 1 && parsingFile){
        Papa.parse(fileUploaded, csvParseConfig);
    }

    /**Handle going to the workflow step */
    const handleNext = () => {
        // If we've reached the end of the workflow, disable Upload button and indicate loading
        if(currStep === steps.length - 1){
            setUploadLoading();
        } else{
            setCurrStep(currStep + 1);
        }
    }

    /**Handle user-uploaded file via Papa library */
    const handleFileUploadChange = () => {
        setFileUploaded(true);
        var fileUploaded = document.getElementById("bulkFileUpload");
        setFileUploaded(fileUploaded.files[0])
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

                    <div className="stepContent">
                        {getStepContent(currStep, handleFileUploadChange, parsingFile, fileUploadedData)}
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button disabled={loading} variant="text" onClick={props.handleBulkUploadDialogModalClose}>Cancel</Button>

                    <Button disabled={currStep === 0 || loading} onClick={handleBack} variant="text">Back</Button>

                    <Button disabled={loading || (fileUploaded == null)} variant="contained" color="primary" onClick={handleNext}>
                        {loading && <CircularProgress size={30} id="loadingTransactionCreation"/>}

                        {currStep === steps.length - 1 ? 'Upload' : 'Next'}
                    </Button>
                </DialogActions>
        </Dialog>
    );
}

export default BulkUpload;
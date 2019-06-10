import React, { Component } from 'react';
import DeleteTransactionModal from './DeleteTransactionModal'
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import './DetailedActivity.css'

const fetch = require('node-fetch');

class DetailedActivity extends Component{

    constructor(props){
        super(props);

        // Bind all functions to "this"
        this.handleDeleteModalClose = this.handleDeleteModalClose.bind(this);
        this.handleDeleteModalOpen = this.handleDeleteModalOpen.bind(this);
        this.removeDate = this.removeDate.bind(this);

        this.state={
            transactionData: null,
            isLoading: true,
            deleteModalOpen: false,
            transactionToDelete: null,
        }
    }

    componentDidMount(){
        this.fetchData();
    }

    handleDeleteModalOpen(){
        this.setState({deleteModalOpen: true});
    }

    handleDeleteModalClose(){
        this.setState({deleteModalOpen: false});
    }

    /**GET request to server.js API, response is transaction data */
    fetchData(){

        // Trigger loading animation for graphs
        this.setState({isLoading:  true});

        var endpoint = "http://127.0.0.1:5000/_api/fetchTransactions";

        var options = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "accessToken": localStorage.getItem("accessToken")
            },
        }

        fetch(endpoint, options)
        .then(res => {
            console.log(res);
            // If the response returns okay, stop loading spinner and retrun json result
            if(res.ok){
                this.setState({isLoading: false})
                return res.json();
            }

            throw ["Invalid response! Try to sign-out and sing-in again.", res.json()]})
        .then(resp => {
            console.log(resp);

            this.setState({transactionData: resp})})
        .catch((error) => {
            
            console.log({"Error": error})});

    }

    /**Remove transaction that has ID transactionID
     * @param transactionInfo The unique transaction to remove
     */
    removeDate(transactionInfo){
        // Delete transaction with ID transactionID, then reload the page
        // this.props.deleteData(transactionID);
        // window.location.reload();
        this.setState({transactionToDelete: transactionInfo});
        this.setState({deleteModalOpen: true});
    }
    
    render(){
        // Column names of the table, in order
        let tableHeaders = ["Actions", "Title", "Amount Spent", "Date", "Location"];

        // All the rows to display
        let tableData = [];

        //If fetch request went through
        if(this.state.transactionData !== null){
            tableData = this.state.transactionData.raw_data;
        }

        return(
            <Paper elevation={1} className="detailedActivity">
                <h3>Detailed Activity</h3>
                
                <br/>
                <Table className="tableData">
                    <TableHead>
                        <TableRow key="columnHeaders">
                            {tableHeaders.map((elem) => {
                                return (<TableCell>{elem}</TableCell>)
                            })}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {tableData !==[] && tableData.map((elem) => {
                            return (
                                <TableRow hover key={elem.id}>
                                    <TableCell>
                                        <IconButton onClick={() => console.log("Clicked edit for " + elem.id)}><EditIcon/></IconButton>
                                        <IconButton onClick={() => this.removeDate(elem)}><DeleteIcon/></IconButton>
                                    </TableCell>
                                    <TableCell>{elem.data.Title}</TableCell>
                                    <TableCell align="right">{"$ "+elem.data.Amount}</TableCell>
                                    <TableCell>{elem.data.Date.slice(0, 16)}</TableCell>
                                    <TableCell>{elem.data.Location === '' ? "N/A": elem.data.Location}</TableCell>
                                </TableRow>
                            )
                        })}
                        {/* Display circular progress bar if loading*/
                        this.state.isLoading && <CircularProgress/>
                        }
                    </TableBody>

                    {/* <TableFooter>
                        <TableRow>
                            <TablePagination rowsPerPageOptions={[5, 10, 25]} colSpan={3} rowsPerPage={8} />
                        </TableRow>
                    </TableFooter> */}
                </Table>
                <br/>
                <br/>

                {this.state.deleteModalOpen && <DeleteTransactionModal handleDeleteModalClose={this.handleDeleteModalClose} 
                deleteMethod={() => this.props.deleteData(this.state.transactionToDelete.id)} transactionInfo={this.state.transactionToDelete}/>}
            </Paper>
        );
    }
}

export default DetailedActivity;
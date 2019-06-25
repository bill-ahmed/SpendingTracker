import React, { Component } from 'react';
import DeleteTransactionModal from './DeleteTransactionModal'
import CircularProgress from '@material-ui/core/CircularProgress';
import MUIDataTable from "mui-datatables";
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
            //console.log(res);
            // If the response returns okay, stop loading spinner and retrun json result
            if(res.ok){
                this.setState({isLoading: false})
                return res.json();
            }

            throw ["Invalid response! Try to sign-out and sing-in again.", res.json()]})
        .then(resp => {
            //console.log(resp);

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

    handleEditData(transaction){
        alert(`Editing: ${transaction.id}`);
    }

    rowPropsToRender(data, dataIndex, rowIndex){
        return(
            <TableRow hover key={data[0]}>
                <TableCell>
                    <IconButton onClick={() => console.log("Clicked edit for " + data[0])}><EditIcon/></IconButton>
                    <IconButton onClick={() => this.removeDate(data)}><DeleteIcon/></IconButton>
                </TableCell>
                    <TableCell>{data[1]}</TableCell>
                    <TableCell align="right">{data[2]}</TableCell>
                    <TableCell>{data[3]}</TableCell>
                    <TableCell>{data[4]}</TableCell>
            </TableRow>
        );
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

        /*Configure data table */
        const columns = ["Actions", "Title", "Amount Spent", "Date", "Location"];
        console.log({"table data": tableData});
        const data = tableData.map(elem => {
            return ([elem.id, elem.data.Title, "$"+elem.data.Amount, elem.data.Date.slice(0, 16), elem.data.Location === '' ? "N/A" : elem.data.Location])
        });

        const options = {
            viewColumns: false, // Show/hide different columns option in toolbar
            print: false, //Print option in toolbar
            selectableRows: 'none', // Disable allowing user to select rows
            elevation: 0,
            rowsPerPage: 8,
            rowsPerPageOptions: [8, 15, 20],
            customRowRender: ((data, dataIndex, rowIndex) => this.rowPropsToRender(data, dataIndex, rowIndex)), // Render custom props for each row
        };

        return(
            <Paper elevation={1} className="detailedActivity">
                <h3>Detailed Activity</h3>

                <MUIDataTable
                data={data}
                columns={columns}
                options={options}
                />

                {this.state.deleteModalOpen && <DeleteTransactionModal handleDeleteModalClose={this.handleDeleteModalClose} 
                deleteMethod={() => this.props.deleteData(this.state.transactionToDelete[0])} transactionInfo={this.state.transactionToDelete}/>}
            </Paper>
        );
    }
}

export default DetailedActivity;
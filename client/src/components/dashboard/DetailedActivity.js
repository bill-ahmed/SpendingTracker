import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
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

        this.state={
            transactionData: null,
            isLoading: true,
        }
    }

    componentDidMount(){
        this.fetchData();
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
    
    render(){
        // Column names of the table, in order
        let tableHeaders = ["Title", "Amount Spent", "Date", "Location"];

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
                                <TableRow key={elem.id}>
                                    <TableCell>{elem.data.Title}</TableCell>
                                    <TableCell align="right">{"$ "+elem.data.Amount}</TableCell>
                                    <TableCell>{elem.data.Date.slice(0, 16)}</TableCell>
                                    <TableCell>{elem.data.Location}</TableCell>
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
            </Paper>
        );
    }
}

export default DetailedActivity;
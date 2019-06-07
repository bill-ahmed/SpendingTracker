import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import './Trends.css'

const Chart = require('chart.js');
const fetch = require('node-fetch');

// Colours to allow in charts
const BACKGROUND_COLOURS = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
]

const BORDER_COLOURS = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
]

class Trends extends Component{

    constructor(props){
        super(props);

        this.state = {
            transactionData: {},
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

            throw "Invalid response!"})
        .then(resp => {
            console.log(resp);

            // Generate the graphs with the collected data
            this.createGraphs([["line", "trendsLineGraph", "You Spent:", resp.amountPerDay.dates, resp.amountPerDay.totalExpenses],
            ["pie", "trendsPieGraph", "Amount Spent Per Location",resp.amountPerLocation.locations, resp.amountPerLocation.amountSpent]])

            this.setState({transactionData: resp})})
        .catch((error) => console.log({"Error": error}));

    }

    /**Generate graphs based on the data given
     * @param data The array of data to display
     * Note: "array" is an array of arrays
     */
    createGraphs(data){
        data.map(elem => {
            this.generateGraph(elem[0], elem[1], elem[2], elem[3], elem[4]);
        })
    }

    /**Draw a given graph type to HTML cavas with id=elementID
     * (string, string, string, object, object) => null
     */
    generateGraph(graphType, elementID, chartTitle, labels, data){
        console.log({"GRAPH TYPE": graphType, "labels": labels, "data": data})
        var ctx = document.getElementById(elementID)
        var myChart = new Chart(ctx, {
            type: graphType,
            data: {
                labels: labels,
                datasets: [{
                    label: chartTitle,
                    data: data,
                    backgroundColor: BACKGROUND_COLOURS,
                    borderColor: BORDER_COLOURS,
                    borderWidth: 1.3
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    render(){

        return(
            <Paper elevation={1} className={this.props.className}>
                <h3>Trends</h3>
                <Divider/>
                <br/>

                <div className="graphsContainer">
                    {/* Only display graphs once they have been rendered and drawn to canvas */}
                    {!this.state.isLoading && <canvas className="graph" id="trendsLineGraph" width="200" height="100"/>}
                    {!this.state.isLoading && <canvas className="graph" id="trendsPieGraph" width="200" height="100"/>}
                    {this.state.isLoading && <CircularProgress/>}
                </div>
                <br/>
                <br/>
            </Paper>
        );
    }
}

export default Trends;
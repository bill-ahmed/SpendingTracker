import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { SnackbarProvider } from 'notistack';
import { Button } from '@material-ui/core';
/*Redux dependencies */
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import allReducers from './reducers';

const store = createStore(allReducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
<Router>
    <SnackbarProvider maxSnack={2} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Provider store={store}>
            <App />
        </Provider>
    </SnackbarProvider>
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

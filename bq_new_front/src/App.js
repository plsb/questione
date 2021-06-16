import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import './global.css';
import { ThemeProvider } from '@material-ui/styles';
import 'react-perfect-scrollbar/dist/css/styles.css';
import theme from './theme';
import Routes from './routes/routes.js';
import { createBrowserHistory } from 'history';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

const browserHistory = createBrowserHistory();

export default class App extends Component {
    render() {
        document.title = 'Questione - IFCE'
        return (
            <ThemeProvider theme={theme}>
                <ToastContainer autoClose={8000} position="bottom-center"/>
                <Router history={browserHistory}>
                    <Routes history={browserHistory}/>
                </Router>
            </ThemeProvider>
        );
    }
}

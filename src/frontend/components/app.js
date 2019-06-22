import React from 'react';
import logo from '../assets/logo.svg';
import '../styles/app.css';
import Account from './account';
import Followers from './followers';
import { BrowserRouter as Router, Route } from "react-router-dom";

export default function App() {
    return (
        <div className="app">
            <header className="app-header">
                <img src={logo} className="app-logo" alt="logo"/>
            </header>
            <div className="app-content">
                <Router>
                    <Route path="/" exact component={Account} />
                    <Route path="/followers/:id" component={Followers} />
                </Router>
            </div>
        </div>
    );
}

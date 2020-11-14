import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from 'react-redux'
import store from './redux/store'


if (!chrome) {
    console.log("This browser does not support notifications.");
} else {
    console.log('chrome passed')
    if (chrome.notifications !== 'granted') {
        chrome.notifications.getPermissionLevel((value) => {
            console.log(value)
        })
    }
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root"));

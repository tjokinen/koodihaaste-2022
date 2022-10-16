import React, { Component } from "react";
import "./App.css";
import Searchbar from "./Searchbar";

class App extends Component {
    render() {
        return (
            <>
                <div className="Title">
                    <h1>RuokaRähinä</h1>
                </div>
                <div className="Container">
                    <p>some text here</p>
                    <Searchbar/>
                </div>
            </>
        );
    }
}

export default App;
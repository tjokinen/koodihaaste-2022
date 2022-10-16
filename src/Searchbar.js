import React from 'react'

export default class Searchbar extends React.Component {
    state = {
        searchTerm: ""
    }

    filterBySearchTerm = (search) => {
        fetch("http://localhost:4000/name", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json"
            },
            body: JSON.stringify({
                query: search
            })
        })
            .then(r => r.json())
            .then(rJson => {
                console.log(rJson)
            })
    }

    doingASearch = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    submitSearch = (event) => {
        event.preventDefault();
        this.filterBySearchTerm(this.state.searchTerm)
        this.setState({
            searchTerm: ""
        })
    }
    render() {
        return (
            <form onSubmit={this.submitSearch}>
                <label htmlFor="searchTerm">
                    <strong>Search by name:</strong>
                    <input type="text" name="searchTerm" value={this.state.searchTerm} onChange={this.doingASearch} />
                    <input type="submit" value="submit" />
                </label>
            </form>
        )
    }
}
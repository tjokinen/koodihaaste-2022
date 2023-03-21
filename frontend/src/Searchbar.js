import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

const CustomMenu = ({ children, onChangeFunction }) => {
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(e.target.value)
        onChangeFunction(e)
    }

    return (
        <>
            <Form.Control
                autoFocus
                className="mx-3 my-2 w-auto"
                placeholder="Kirjoita hakusana..."
                onChange={(e) => handleChange(e)}
                value={value}
            />
            <ul className="list-unstyled">
                {React.Children.toArray(children)}
            </ul>
        </>
    );
}

export default function Searchbar({ setFoodCode }) {

    const [menuOptions, setMenuOptions] = useState([])
    const [selection, setSelection] = useState('Valitse ruoka')

    const handleSelect = (n) => {
        for (const i in menuOptions) {
            if (menuOptions[i][1] == n) {
                setSelection(menuOptions[i][0])
                setFoodCode(n)
                break;
            }
        }
    }

    const filterBySearchTerm = (search) => {
        fetch("/api/name", {
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
                setMenuOptions(rJson)
            })
    }

    const doingASearch = (event) => {
        filterBySearchTerm(event.target.value)
    }

    const listItems = menuOptions.map((n) =>
        <option eventKey={n[1]} key={n[1]}>
            {n[0]}
        </option>
    )

    return (
        <a onSelect={handleSelect}>
            {selection}

            <CustomMenu onChangeFunction={(e) => doingASearch(e)}>
                {listItems}
            </CustomMenu>
        </a>
    )
}
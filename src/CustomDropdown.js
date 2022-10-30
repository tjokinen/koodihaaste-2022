import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy, onChangeFunction }, ref) => {
    const [value, setValue] = useState('');

    const handleChange = (e) => {
      setValue(e.target.value)
      onChangeFunction(e)
    }

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
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
      </div>
    );
  },
);

export default function CustomDropdown({setFoodCode}) {

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
    fetch("/name", {
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
    <Dropdown.Item eventKey={n[1]} key={n[1]}>
      {n[0]}
    </Dropdown.Item>
  )

  return (
    <Dropdown onSelect={handleSelect}>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        {selection}
      </Dropdown.Toggle>

      <Dropdown.Menu as={CustomMenu} onChangeFunction={(e) => doingASearch(e)}>
        {listItems}
      </Dropdown.Menu>
    </Dropdown>
  )
}
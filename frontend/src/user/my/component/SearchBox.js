import React from 'react';
import { Form } from 'react-bootstrap';
const SearchBox = ({ label, value, onChange, options }) => {
    return (
      <Form.Group controlId={`formSelect${label}`}>
        <Form.Label>{label}</Form.Label>
        <Form.Select value={value} onChange={onChange}>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    );
  };
export default SearchBox;
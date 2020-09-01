import React, { useState } from 'react';
import Link from 'next/link';
import { Row, Col, Form, InputGroup, FormControl } from 'react-bootstrap';

import { getTranslatedText } from '../../utils/translationUtils';

const InputGroupUnits = ({
    InputGroupName,
    Input,
    Units,
    Label,
    values,
    errors,
    touched,
    readOnly=false,
    showUnits=true,
    handleChange,
    handleBlur,
    KeyValue
}) => {
    
    return(
        <Form.Group className={`document-box ${showUnits && 'group-block'}`}>
            <div className="group">
              <Form.Group>
                <Form.Label>{getTranslatedText(Label)}</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id={InputGroupName} className="form-control">{InputGroupName}</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl 
                        type="type" 
                        name={Input}
                        placeholder="Area"
                        className={errors[Input] && touched[Input] && 'has-error'}
                        onChange={handleChange}
                        onBlur={(e) => handleBlur(e, KeyValue)}
                        readOnly={readOnly}
                        value={values && values[Input]} 
                    />
                </InputGroup>
                {errors[Input] && touched[Input] && <p>{errors[Input]}</p>}
              </Form.Group>
              {showUnits &&
              <Form.Group className="qty-input">
                <Form.Label>{getTranslatedText('label.no_of_units')}</Form.Label>
                <FormControl 
                    type="type" 
                    name={Units}
                    placeholder="Qty"
                    className={`qty-box ${errors[Units] && touched[Units] && 'has-error'}`}
                    onChange={handleChange}
                    onBlur={(e) => handleBlur(e, KeyValue)}
                    readOnly={readOnly}
                    value={values && values[Units]} 
                />
                {errors[Input] && touched[Units] && <p>{errors[Units]}</p>}
              </Form.Group> }
            </div>
          </Form.Group>
    )
}


export default InputGroupUnits;
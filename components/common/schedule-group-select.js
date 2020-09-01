import React, { useState } from 'react';
import Link from 'next/link';
import { Row, Col, Form, InputGroup, FormControl } from 'react-bootstrap';
import { AngleBottom } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';

const ScheduleGroupSelect = ({
    List,
    Input,
    Label,
    values,
    errors,
    touched,
    readOnly=true,
    handleChange,
    handleBlur,
    customHandleChange
}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggle = () => {
        setIsOpen(!isOpen)
    }

    List = List.filter(function(item) {
        if([values.frontFacing, values.rearFacing, values.sideOneFacing, values.sideTwoFacing].includes(item)){
            return false
        }else{
            return true
        }
    })
    
    return(
        <Form.Group className={`document-box group-block`}>
            <div className="group">
                <Form.Group className="select-lable">
                    <Form.Label>{getTranslatedText(Label)}</Form.Label>
                </Form.Group>
                <Form.Group className="select-input">
                    <div className={`qty-box selected-box ${isOpen ? 'open' : ''}`}>
                        <div className="village-box" onClick={toggle}>
                            <Form.Control
                                type="type"
                                name={Input}
                                placeholder="Select"
                                autoComplete="off"
                                className={errors[Input] && touched[Input] && 'has-error'}
                                onChange={handleChange}
                                onBlur={(e) => {handleBlur(e), setIsOpen(false)} }
                                readOnly={readOnly}
                                value={values && values[Input]} 
                            />
                            <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
                        </div>
                        <div className="search-list-box">
                            <ul>
                                {List.map((item, i) =>
                                <li key={`schedule-${i}`} onClick={() => { setIsOpen(false), customHandleChange(Input, item)}}>{item}</li>
                                )}
                            </ul>
                        </div>
                        {errors[Input] && touched[Input] && <p>{errors[Input]}</p>}
                    </div>
                </Form.Group>
            </div>
          </Form.Group>
    )
}


export default ScheduleGroupSelect;
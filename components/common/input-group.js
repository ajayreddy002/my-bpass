import React, { useState } from 'react';
import Link from 'next/link';
import { Row, Col, Form, InputGroup, FormControl } from 'react-bootstrap';
import { AngleRight, AngleBottom } from '../../utils/icons';

import { convertToSqMeters } from '../../utils/convertionUtils'
import { getTranslatedText } from '../../utils/translationUtils';

import ContextApi from '../../context'

const InputGroupPrepend = ({
    List,
    readOnly=false,
    Dropdown=false,
    ConvertYards=false,
    Optional=false,
    defaultSelectedValue="",
    InputGroupName,
    PlaceHolder,
    Input,
    InputType='text',
    Label,
    values,
    errors,
    customError=false,
    customErrorMsg="",
    touched,
    handleChange,
    handleBlur,
    customHandleChange
}) => {
    const [type, setType] = useState('')
    const [meters, SetMeters] = useState(0)
    
    const convertedMeters = (sq, value) => {
        const meters = convertToSqMeters(sq);
        if(Input === 'plotAreaGround'){
            value.updatePlotArea(meters)
            localStorage.setItem('plot-area', meters);
        }
        SetMeters(meters)
    }
    const handleTypeChange = (Name, surveyType) => {
        if(Name === 'surveyType'){
            customHandleChange('surveyName', "")
            
            // if(surveyType === 'Survey No' || surveyType === 'Town Survey No'){
            //     customHandleChange('surveyName', "")
            // }
            // else{
            //     customHandleChange('surveyName', values.plotNo)
            // }
        }
    }
    
    return(
        <ContextApi.Consumer>
          {value =>
            <Form.Group className="document-box">
                <Form.Label htmlFor="inlineFormInputGroupUsername2">{getTranslatedText(Label)} {Optional && `(Optional)`}</Form.Label>
                <InputGroup>
                    <InputGroup.Prepend>
                        {Dropdown ?
                        <div className="selected-box">
                            <Form.Control as="select"
                                name={InputGroupName}
                                defaultValue={defaultSelectedValue}
                                onChange={(e) => {handleChange(e), handleTypeChange(e.target.name, e.target.value)}}
                            >
                                <option value="" >{Object.entries(List).length > 0 ? 'Select Type': 'Loading...'}</option>
                                {Object.entries(List).length > 0 &&
                                    Object.entries(List).map(([key, value], index) => 
                                    <option key={`plot-types-${index}`} value={key} >{value}</option>
                                )}
                            </Form.Control>
                            <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
                        </div>
                        :
                        <InputGroup.Text >{InputGroupName}</InputGroup.Text> }
                    </InputGroup.Prepend>
                    <div className="west-input">
                        <FormControl 
                            type={InputType} 
                            name={Input}
                            readOnly={readOnly}
                            placeHolder={PlaceHolder}
                            className={errors[Input] && touched[Input] && 'has-error'}
                            onChange={handleChange}
                            onBlur={(e) => {handleBlur(e), ConvertYards && convertedMeters(e.target.value, value) }}
                            value={values && values[Input]} 
                        />
                        {ConvertYards && <span>(Sq. mts {meters})</span> }
                    </div>
                </InputGroup>
                {errors[Input] && touched[Input] && <p>{errors[Input]}</p>}
                {customError && <p>{customErrorMsg}</p>}
            </Form.Group>
        }
        </ContextApi.Consumer>
    )
}


export default InputGroupPrepend;
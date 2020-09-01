import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Form, Button, Col, InputGroup, FormControl } from 'react-bootstrap';
import { AngleRight, AngleBottom, MapIcon, AngleLeft, UploadFile } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import InputGroupUnits from '../../components/common/input-group-units'

const MSBFloors = ({
    plotArea,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    customHandleChange
}) => {
    const [cellarOpen, setCellarOpen] = useState(false)
    const [cellar, setCellar] = useState(false)
    const [cellarData, setCellarData] = useState([0])
    const [stilitOpen, setStilitOpen] = useState(false)
    const [stilit, setStilit] = useState(false)

    
    if(plotArea > 750 && plotArea <= 1000){
        setCellarData([0, 1])
    }else if(plotArea > 1000 && plotArea <= 2500){
        setCellarData([0, 1, 2])
    }else if(plotArea > 2500){
        setCellarData([0, 1, 2, 3, 4, 5])
    }
    
  return (
    <>
        {plotArea > 2000 &&
        <>
          <h5 className="form-title">Proposed {getTranslatedText('title.builtup_area')}</h5>
          <Form.Group>
              <Form.Label>MSB Floors</Form.Label>
              <Form.Control 
                  type="number" 
                  name="msbFloors"
                  placeholder="Enter no of floors"
                  className={errors.msbFloors && touched.msbFloors && 'has-error'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values && values.msbFloors}
              />
          </Form.Group> 
        </>}

        {plotArea > 750 &&
        <Form.Group>
            <Form.Label>Cellar</Form.Label>
            <div className={`selected-box ${cellarOpen ? 'open' : ''}`}>
              <div className="village-box" onClick={setCellarOpen(!cellarOpen)}>
                <Form.Control type="type" value={cellar} readOnly placeholder="Select" autoComplete="off" />
                <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
              </div>
              <div className="search-list-box">
                <ul>
                  {cellarData.map((item, i) =>
                    <li key={i} onClick={() => { setCellar(item), setCellarOpen(false), customHandleChange('cellar', item) }}>{item}</li>
                  )}
                </ul>
              </div>
            </div>
        </Form.Group> }

        
        {plotArea > 2500 &&
        <Form.Group>
            <Form.Label>Additional Stilit</Form.Label>
            <div className={`selected-box ${stilitOpen ? 'open' : ''}`}>
              <div className="village-box" onClick={setStilitOpen(!stilitOpen)}>
                <Form.Control type="type" value={stilit} readOnly placeholder="Select" autoComplete="off" />
                <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
              </div>
              <div className="search-list-box">
                <ul>
                  {[0, 1, 2, 3, 4, 5].map((item, i) =>
                    <li key={i} onClick={() => { setStilit(item), setStilitOpen(false), customHandleChange('additionalStilts', item) }}>{item}</li>
                  )}
                </ul>
              </div>
            </div>
        </Form.Group> }

    </>
  )
}


export default MSBFloors;
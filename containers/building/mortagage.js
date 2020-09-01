import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import swal from 'sweetalert';
import { Form, Button, Col, InputGroup, FormControl } from 'react-bootstrap';
import { AngleRight, AngleBottom, MapIcon, AngleLeft, UploadFile } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import InputGroupPrepend from '../../components/common/input-group'
import FileUpload from '../../components/common/file-upload'
import { toast } from 'react-toastify';
import axios from 'axios'
import ContextApi from '../../context'

const Mortagage = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    customHandleChange
}) => {

  const [floorOpen, setFloorOpen] = useState(false);
  const [floors, setFloors] = useState([]);
  const [floorsData, setFloorsData] = useState([]);
  const [searchFive, setSearchFive] = useState(false);
  const [showStiltMsg, setShowStiltMsg] = useState(false)
  const [sroData, setSroData] = useState([])
  const [sroLocation, setSroLocation] = useState('')
  const ContextValue = useContext(ContextApi);

  const iconClick = () => {
    if(values.mortgageFloor.length === 0 && showStiltMsg && !floorOpen){
      popupMessage()
    }
    setFloorOpen(!floorOpen)
  }
  const iconClickFive = () => {
    setSearchFive(!searchFive)
  }
	
  const popupMessage = () => {
    swal({
      text: "Common Area and Stilt should not be part of Mortgage Floor",
      button: "Agree and Continue"
  })
  }
  //const floorsData = ['Floor1', 'Floor2', 'Floor3', 'Floor4']

  const handleFloorsSelection = async (item) => {
    const index = floors.indexOf(item);
    if (index > -1) {
      await setFloors(floors.filter((e)=>(e !== item)));
    }else{
      await setFloors(state => [...state, item]);
    }
    await customHandleChange('mortgageFloor', floors);
    iconClick()
  }

  useEffect( () => {
    async function getFloorsData () {
      if(floorsData.length > 0){
        await setFloorsData([])
        await customHandleChange('mortgageFloor', []);
        await setShowStiltMsg(false)
      }

      for(var i = 0; i < ContextValue.noOfFloors; i++){
        if(ContextValue.foolrsType === 'stilt' && i === 0){
            setShowStiltMsg(true)
        }else{
          await setFloorsData(state => [...state, i === 0? `${ContextValue.foolrsType}` : `Floor${i}`]);
        }
      }
    }
    getFloorsData();
  }, [ContextValue.noOfFloors])

  useEffect(() => {
    const data = {
      userid: 'IGRS@NIC',
      hashKey: '8043de91c4df595966b0b082b0cd3e8543e71bf5=',
      service_id: 'NIC10004',
      dist_code: ContextValue.distCode,
      mandal_code: ContextValue.mandalCode,
    }
    axios.post('http://igrs.telangana.gov.in/TSHMDA_RESTService/rest/Master/SroList', data, {
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      }
    })
    .then(function (response) {
      if(response.data.response_code === 200){
        setSroData(response.data.result)
      }
    })
    .catch(function (error) {
      console.log(error)
    });
  }, [])


  return (
    <>
        <div className="border-line-bottom"><span></span></div>
        <h5 className="form-title">{getTranslatedText('title.mortagage')}</h5>
        
        <Form.Group>
          <Form.Label>{getTranslatedText('label.mortagage_floors')} </Form.Label>
          <div className={`selected-box ${floorOpen ? 'open' : ''}`}>
            <div className="village-box" onClick={iconClick} >
              <Form.Control 
                type="type" 
                value={floors}
                readOnly 
                placeholder="Select" 
                autoComplete="off" />

              <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
            </div>
            <div className="search-list-box">
              <ul>
                {floorsData.length > 0 ? floorsData.map((item, i) =>
                  <li key={i}>
                    <Form.Check
                      custom 
                      label={item}
                      type={'checkbox'}
                      id={`custom-inline-${i}`}
                      onClick={() => handleFloorsSelection(item)}
                    />
                  </li>
                ): <li>No Floors Selected</li>}
              </ul>
            </div>
          </div>
            {showStiltMsg && <p>Common Area & Stilt should not be part of Mortgage Floor</p>}
        </Form.Group>
        
        <InputGroupPrepend
            InputGroupName={ContextValue.plotAreaType}
            Input="mortgageArea"
            Label="label.mortagage_area"
            placeholder="Enter Mortgage area"
            ConvertYards={false}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
          />
        <Form.Group controlId="ControlSelect5">
            <Form.Label>{getTranslatedText('label.sro_location')}</Form.Label>
            {/* <Form.Control 
              type="text" 
              placeholder="Enter SRO Location" 
              name="sroLocation"
              value={values.sroLocation}
              onChange={handleChange}
              onBlur={handleBlur}
            /> */}
            <div className={`selected-box ${searchFive ? 'open' : ''}`}>
              <div className="village-box" onClick={iconClickFive}>
                <Form.Control 
                  type="type" 
                  value={values.sroLocation} 
                  name="sroLocation" 
                  className={errors.sroLocation && touched.sroLocation && 'has-error'}
                  readOnly 
                  placeholder="Select" 
                  autoComplete="off" 
                />
                <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
              </div>
              <div className="search-list-box">
                <ul>
                  {sroData.length > 0? sroData.map((item, i) =>
                    <li key={i} onClick={() => { setSroLocation(item.sr_name), iconClickFive(), customHandleChange('sroLocation', item.sr_name) }}>{item.sr_name}</li>
                  ):
                    <li>No DATA</li>
                  }
                </ul>
              </div>
            </div>
          </Form.Group>
          
          <Form.Group>
            <Form.Label>{getTranslatedText('label.market_value_title')}</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="₹ 00"
              name="marketValue"
              value={values.marketValue}
              onChange={handleChange}
              onBlur={handleBlur}
            />
        </Form.Group>

        <Form.Group>
              <Form.Label>Upload Market Value Certificate</Form.Label>
              <FileUpload 
                  Label="Upload Market Value Certificate"
                  ID="Uploadfile1"
                  Filename="marketValue"
                  FileType="market_value_certificate"
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  customHandleChange={customHandleChange}
              />
          </Form.Group>

          <Form.Group>
            <Form.Label>Mortgage Registration number</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Register Number"
              name="mortgageRegNumber"
              value={values.mortgageRegNumber}
              onChange={handleChange}
              onBlur={handleBlur}
            />
        </Form.Group>
        
        <Form.Group>
            <Form.Label>Mortgage Date</Form.Label>
            <Form.Control 
              type="date" 
              name="mortgageDate"
              value={values.mortgageDate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
        </Form.Group>
    </>
  )
}


export default Mortagage;

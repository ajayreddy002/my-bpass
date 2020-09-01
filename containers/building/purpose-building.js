import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Form, Button, Col, InputGroup, FormControl } from 'react-bootstrap';
import { AngleRight, AngleBottom, MapIcon, AngleLeft, UploadFile } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import InputGroupUnits from '../../components/common/input-group-units'
import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;

import ContextApi from '../../context'
import CustomTooltip from '../../components/CustomTooltip';

const PurposeOfBuilding = ({
    floorData,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    customHandleChange,
    plotArea,
}) => {
  const [building, setBuilding] = useState(false);
  const [buildingCategories, setBuildingCategories] = useState([]);
  const [subBuilding, setSubBuilding] = useState(false);
  const [buildingSubCategories, setBuildingSubCategories] = useState([]);
  const [buildingtype, setBuildingtype] = useState('');
  const [subBuildingtype, setSubBuildingtype] = useState('');
  const [floors, setFloors] = useState(false);
  const [floorstype, setFloorstype] = useState({id: 0, name: ''});
  const [roof, setRoof] = useState(false);
  const [rooftype, setRooftype] = useState('');
  const [showTooltip, setShowTooltip] = useState({ 'purposeBuilding': false, 'numericFloors': false, });
  const [showUsage, setShowUsage] = useState(false)
  const [showSubUsage, setShowSubUsage] = useState(false)
  const ContextValue = useContext(ContextApi);
  
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);


  const iconClick = () => {
    setBuilding(!building)
    setSubBuilding(false)
    setFloors(false)
    setRoof(false)
  }
  const iconSubBuildingClick = () => {
    setSubBuilding(!subBuilding)
    setBuilding(false)
    setFloors(false)
    setRoof(false)
  }
  const iconClickTwo = () => {
    setFloors(!floors)
    setBuilding(false)
    setSubBuilding(false)
    setRoof(false)
  }
  const iconClickThree = () => {
    setRoof(!roof)
    setBuilding(false)
    setSubBuilding(false)
    setFloors(false)
  }

  const getCategories = async (Category) => {

    if(Category === "Residential"){
      ContextValue.updatePlotArea(ContextValue.plotArea) 
      customHandleChange('purposeBuilding', Category)
      if(ContextValue.plotArea > 200){
        setBuildingSubCategories(Category)
        showSubUsage(true)
      }else{
        setShowUsage(false)
        setShowSubUsage(false)
      }
    }else{
      if(ContextValue.applicationType !== 'SW'){
        const confirm = await ContextValue.handleAlertForSW();
        if(confirm){
          ContextValue.updateAppTypeToSW()
          customHandleChange('purposeBuilding', Category)
            getUsageBuilding(Category)
            setShowUsage(true)
            setShowSubUsage(true)
        }
      }
    } 
  }

  const getUsageBuilding = (Category) => {
    setSubBuildingtype('')
    setBuildingtype('')
    setBuilding(false)
    setSubBuilding(false)
    setBuildingCategories([])
    setBuildingSubCategories([])
    setCategoryLoading(true);

    const authToken = localStorage.getItem('auth-token');
    axios.get(apiURL + apiConstants.BUILDING_CATEGORY.URL, {
      headers: {
        'Authorization': 'Bearer ' + authToken,
        'Accept' : '*/*'
      },
      params: {
        purpose_of_building: Category
      }
    })
    .then(function (response) {
      setCategoryLoading(false)
      if(response.data.success){
        setBuildingCategories(response.data.data.building_category)
      }else{
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
    })
    .catch(function (error) {
      setCategoryLoading(false)
      if(error.response){
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
    });
  }

  const getSubCategories = (Category, subCat) => {
    setSubCategoryLoading(true)
    const authToken = localStorage.getItem('auth-token');
    axios.get(apiURL + apiConstants.BUILDING_SUB_CATEGORY.URL, {
      headers: {
        'Authorization': 'Bearer ' + authToken,
        'Accept' : '*/*'
      },
      params: {
        purpose_of_building: Category,
        building_category: subCat
      }
    })
    .then(function (response) {
      setSubCategoryLoading(false)
      if(response.data.success){
        setBuildingSubCategories(response.data.data.building_types)
      }else{
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
    })
    .catch(function (error) {
      setSubCategoryLoading(false)
      if(error.response){
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
    });
  }

  const roofData = ['RCC', 'ACC / Tin / Zinc', 'Mangalore Tile', 'Cuddapah Slab' ]
  // console.log('fdfsfsdf', errors);
  
  const handleSubCategory = (item, value) => { 
    setSubBuildingtype(item) 
    iconSubBuildingClick() 
    customHandleChange('buildingType', item.id) 
    if(item.application_type === "SW"){
      value.updateAppTypeToSW()
    }else{
      value.updatePlotArea(value.plotArea) 
    }
  }

  const handleFloorChange = async (item, value) => {
    // if(value.applicationType !== "SW"){
      await value.updateFloors(item.id, item.no_of_floors, item.floor_type, item.height_in_meters) 
    // }
    setFloorstype(item) 
    iconClickTwo()
    customHandleChange('proposedFloorId', item.id)
  }

  const toggleTooltip = (key) => {
    setShowTooltip({
      ...showTooltip,
      [key]: !showTooltip[key],
    });
  };

  return (
    <ContextApi.Consumer>
      {value =>
        <>
          {/* <h5 className="form-title">{getTranslatedText('heading.purpose_heading')}</h5> */}
          <Form.Group
           onMouseEnter={() => toggleTooltip('purposeBuilding')}
           onMouseLeave={() => toggleTooltip('purposeBuilding')}
          >
            <CustomTooltip
              title={getTranslatedText('heading.purpose_heading')}
              showTooltip={showTooltip['purposeBuilding']}
              subTitle={'Please select Residential and Non Residential based on the Building Permssion required. Your application process will be continued further based on your selection.'}
            />
            <Form.Label>{getTranslatedText('heading.purpose_heading')}</Form.Label>
            <div className="property-radio building-box">
              <Form.Check
                type="radio"
                label="Residential"
                name="purposeBuilding"
                id="building"
                value="Residential"
                checked={values.purposeBuilding === 'Residential'}
                onChange={(e) => getCategories(e.target.value)}
                onBlur={handleBlur}
              />
              <Form.Check
                type="radio"
                label="Non Residential"
                name="purposeBuilding"
                id="building1"
                value="Non Residential"
                checked={values.purposeBuilding === 'Non Residential'}
                onChange={(e) => getCategories(e.target.value)}
                onBlur={handleBlur}
              />
            </div>
            {errors.purposeBuilding && touched.purposeBuilding && <p>{errors.purposeBuilding}</p>}
          </Form.Group>
          {showUsage &&
          <Form.Group>
            <Form.Label>{getTranslatedText('label.building_usage')} </Form.Label>
            <div className={`selected-box ${building ? 'open' : ''}`}>
              <div className="village-box" onClick={iconClick} >
             
                <Form.Control 
                  type="type" 
                  value={buildingtype} 
                  readOnly 
                  placeholder={categoryLoading? `Loading...` :`Select`} 
                  autoComplete="off" />
                <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
                
              </div>
              <div className="search-list-box">
                <ul>
                  {buildingCategories.length > 0? buildingCategories.map((item, i) =>
                    <li key={i} 
                      onClick={() => { setBuildingtype(item), iconClick(), getSubCategories(values.purposeBuilding, item) }}
                    >{item}</li>
                  ): <li>No Records !</li>}
                </ul>
              </div>
            </div>
          </Form.Group> }
          {showSubUsage &&
          <Form.Group>
            <Form.Label>Sub {getTranslatedText('label.building_usage')} </Form.Label>
            <div className={`selected-box ${subBuilding ? 'open' : ''}`}>
              <div className="village-box" onClick={iconSubBuildingClick} >
                <Form.Control 
                    type="type" 
                    name="buildingType" 
                    className={errors.buildingType && touched.buildingType && 'has-error'}
                    value={subBuildingtype === ''? '' : subBuildingtype.building_subcategory} 
                    readOnly 
                    placeholder={subCategoryLoading? `Loading...` :`Select`} 
                    autoComplete="off" />
                <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
              </div>
              <div className="search-list-box">
                <ul>
                  {buildingSubCategories.length > 0? buildingSubCategories.map((item, i) =>
                    <li key={i} 
                      onClick={() => handleSubCategory(item, value)}
                    >{item.building_subcategory}</li>
                  ): <li>No Records !</li>}
                </ul>
              </div>
                {errors.buildingType && touched.buildingType && <p>{errors.buildingType}</p>}
            </div>
          </Form.Group> 
          } 
          <Form.Group>
            <Form.Label>Proposed {getTranslatedText('label.numeric_floors')}</Form.Label>
            <CustomTooltip
              title={getTranslatedText('label.numeric_floors')}
              showTooltip={showTooltip['numericFloors']}
              subTitle={'Please select the appropriate floor.'}
            />
            <div className={`selected-box ${floors ? 'open' : ''}`}>
              <div className="village-box" onClick={iconClickTwo}>
                <Form.Control 
                  type="type" 
                  name="proposedFloorId" 
                  className={errors.proposedFloorId && touched.proposedFloorId && 'has-error'}
                  value={floorstype.name} 
                  readOnly 
                  placeholder={floorData.length > 0? `Select`: `Loading...`} 
                  onFocus={() => toggleTooltip('numericFloors')}
                  onBlur={() => toggleTooltip('numericFloors')}
                  autoComplete="off" />
                <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
              </div>
              <div className="search-list-box">
                <ul>
                  {floorData.length > 0? floorData.map((item, i) => 
                      <li key={i} 
                        onClick={() => handleFloorChange(item, value)}>{item.name}</li>
                  ): <li>Loading...</li>}
                </ul>
              </div>
                {errors.proposedFloorId && touched.proposedFloorId && <p>{errors.proposedFloorId}</p>}
            </div>
          </Form.Group>

          {/* {(plotArea >= 75) &&
            <Form.Group>
              <Form.Label>{getTranslatedText('label.roof_type')}</Form.Label>
              <div className={`selected-box ${roof ? 'open' : ''}`}>
                <div className="village-box" onClick={iconClickThree}>
                  <Form.Control
                    type="type"
                    value={rooftype}
                    name="roofType"
                    className={errors.roofType && touched.roofType && 'has-error'}
                    readOnly
                    placeholder="Select"
                    autoComplete="off"
                  />
                  <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
                </div>
                <div className="search-list-box">
                  <ul>
                    {roofData.slice(0, floorstype.name === 'Ground Floor' ? roofData.length : 1).map((item, i) =>
                      <li key={`sro-${i}`} onClick={() => { setRooftype(item), iconClickThree(), customHandleChange('roofType', item) }}>{item}</li>
                    )}
                  </ul>
                </div>
                {errors.roofType && touched.roofType && <p>{errors.roofType}</p>}
              </div>
            </Form.Group>}   */}
        </>
      }
    </ContextApi.Consumer>
  )
}


export default PurposeOfBuilding;
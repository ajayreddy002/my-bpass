import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Form, Button, Col, InputGroup, FormControl } from 'react-bootstrap';
import { AngleRight, AngleBottom, MapIcon, AngleLeft, UploadFile } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import MapModal from '../../components/application/MapModal'
import useDebounce from '../../components/common/use-debounce';
import InputGroupPrepend from '../../components/common/input-group'
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
import CustomTooltip from '../../components/CustomTooltip';
import { toast } from 'react-toastify';
import FileUpload from '../../components/common/file-upload';
const apiURL = require('../../config/url-front').API_SERVER;

import ContextApi from '../../context'

const PlotInfo = ({
    houseType,
    localityType,
    surveyType,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    customHandleChange
}) => {
    const [modalShow, setModalShow] = useState(false);
    const [village, setVillage] = useState(false);
    // State and setter for search term
    const [villageTerm, setVillageTerm] = useState('');
    // State and setter for search results
    const [villages, setVillages] = useState([]);
    // State for search status (whether there is a pending API request)
    const [villageSearching, setVillageSearching] = useState(false);
    const [villageOpen, setVillageOpen] = useState(false);
    const [noRecords, setNoRecords] = useState(false);
    const [surveyInProhited, setSurveyInProhited] = useState(false);
    const [prohitedValue, setProhitedValue] = useState('');
    // const [municiPality, setMuniciPality] = useState();  
    const ContextValue = useContext(ContextApi);
 
    const [mandalZone, setMandalZone] = useState();
    const [municiPality, setMuniciPality] = useState();
    const [showTooltip, setShowTooltip] = useState(false);
    const [showTSLRDocument, setShowTSLRDocument] = useState(false);
    const [showNOCDocument, setShowNOCDocument] = useState(false);
  
    const debouncedVillageSearchTerm = useDebounce(villageTerm, 500);
    
  useEffect(() => {
    const authToken = localStorage.getItem('auth-token');

    if (debouncedVillageSearchTerm && !villageOpen) {
      // Set isSearching state
      setVillageSearching(true);
      setVillageOpen(true)
      // Fire off our API call
      axios.get(apiURL + apiConstants.SEARCH_VILLAGE.URL, {
        headers: { 'Authorization': 'Bearer ' + authToken },
        params: {
          query: debouncedVillageSearchTerm
        }
      })
        .then(function (response) {
          // console.log(response);
          setVillageSearching(false);
          // Set results state
          if(response.data.data.results.length > 0)
            setVillages(response.data.data.results);
          else
            setNoRecords('No Records found !!')
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setVillages([]);
      setNoRecords(false);
      setVillageOpen(false)
    }

    if (!debouncedVillageSearchTerm){
      customHandleChange('villageName', "");
      customHandleChange('mandalZone', "");
      customHandleChange('municiPality', "");
      customHandleChange('district', "");
      customHandleChange('circle', null);
      customHandleChange('zone', null);
      setVillageOpen(false)
    }

  }, [debouncedVillageSearchTerm])

  const selectVillage = (item) => {
    setVillage(item);
    customHandleChange('locationId', item.id);
    customHandleChange('villageName', item.village);
    customHandleChange('circle', item.circle);
    customHandleChange('zone', item.zone);
    customHandleChange('mandalZone', item.mandal);
    customHandleChange('municiPality', item.ulb_name);
    customHandleChange('district', item.district);
    ContextValue.handleDistMandal(item.sro_dist_code, item.sro_mandal_code)
    // customHandleChange('plotAddress', `${values.plotNo} ${values.streetName} ${values.localityName} ${values.surveyName} ${values.villageName} ${values.mandalZone} ${values.municiPality} ${values.district}`)
    setVillageTerm(item.village);
    setTimeout(() => {
      setVillageOpen(false)
    }, 1000)
  }

  const handleSurvey = (srNo) => {
    

    const authToken = localStorage.getItem('auth-token');
    if(values.surveyType === 'Survey No'){
      if(values.locationId !== 0){
        const data = {
          location_id: values.locationId,
          survey_number: srNo
        }
        axios.post(apiURL + apiConstants.PROHITED.URL, data, {
          headers: { 'Authorization': 'Bearer ' + authToken }
        })
        .then(function (response) {
          if(response.data.success){
            if(response.data.data.prohibited.length > 0){
              setSurveyInProhited(true)
              setProhitedValue(response.data.data.prohibited[0])
              ContextValue.handleDisablePlotSubmit(true)
            }else{
              setSurveyInProhited(false)
              setProhitedValue('')
              ContextValue.handleDisablePlotSubmit(false)
            }
          }else{
            setSurveyInProhited(false)
            setProhitedValue('')
            ContextValue.handleDisablePlotSubmit(false)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }else{
        toast.error('Please select Village first', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
        ContextValue.handleDisablePlotSubmit(false)
      }
    }else{
      setSurveyInProhited(false)
      setProhitedValue('')
      ContextValue.handleDisablePlotSubmit(false)
    }
  }

  const getGeoCoordinates = (values) => {
      customHandleChange('geoLocation', values);
  }

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  const handleSurveyUpload = (Name, Value) => {
    if (Name === 'surveyType') {
      if(Value === 'Town Survey No') {
        setShowTSLRDocument(true);
      } else {
        setShowTSLRDocument(false);
      };

      if(Value === 'Abadi' || Value === 'Gramakantam') {
        setShowNOCDocument(true);
      } else {
        setShowNOCDocument(false);
      };
    }

  }

  return (
    <>
        <h5 className="form-title">{getTranslatedText('heading.plot_address')}</h5>
        
        <InputGroupPrepend
            List={houseType}
            Dropdown={true}
            InputGroupName="plotType"
            Input="plotNo"
            Label="label.plot_no"
            PlaceHolder={`Enter ${values.plotType}`}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
        />
        
        <InputGroupPrepend
            List={{'Street': 'Street', 'Road': 'Road'}}
            Dropdown={true}
            Optional={true}
            InputGroupName="streetType"
            Input="streetName"
            Label="label.street"
            PlaceHolder={`Enter ${values.streetType}`}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
        />

        <InputGroupPrepend
            List={localityType}
            Dropdown={true}
            InputGroupName="localityType"
            Input="localityName"
            Label="label.locality"
            PlaceHolder={`Enter ${values.localityType}`}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
        />
             
        <Form.Group controlId="ControlSelect1">
        <Form.Label>{getTranslatedText('label.village_circle')}</Form.Label>
        <div className={`selected-box ${villageOpen ? 'open' : ''}`}>
            <div className="village-box">
            <Form.Control 
              type="type" 
              name="villageName"
              value={villageTerm} 
              onChange={(e) => setVillageTerm(e.target.value)} 
              placeholder="Select" 
              autoComplete="off" 
              className={errors.villageName && touched.villageName && !villageTerm && 'has-error'}
              onBlur={handleBlur}  />
              {errors.villageName && touched.villageName && !villageTerm && <p>{errors.villageName}</p>}
            <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
            </div>
            <div className="search-list-box">
            <ul>
                {villageSearching && <li>Searching...</li>}
                {noRecords && <li>{noRecords}</li>}
                {villages.length > 0 ?
                villages.map((item, i) =>
                    <li key={i} onClick={() => selectVillage(item)}>{item.village}, {item.mandal}, {item.ulb_name}</li>
                ) : ''}
            </ul>
            </div>
        </div>
        </Form.Group>
        {values.circle &&
        <Form.Group>
            <Form.Label>{getTranslatedText('label.circle')}</Form.Label>
            <Form.Control type="text" value={values.circle} readOnly />
        </Form.Group> }
        {values.zone &&
        <Form.Group>
            <Form.Label>{getTranslatedText('label.zone')}</Form.Label>
            <Form.Control type="text" value={values.zone} readOnly />
        </Form.Group> }
        <Form.Group>
            <Form.Label>{getTranslatedText('label.mandal_zone')}</Form.Label>
            <Form.Control type="text" value={values.mandalZone} readOnly />
        </Form.Group>
        <Form.Group>
            <Form.Label>{getTranslatedText('label.municipality_corporation')}</Form.Label>
            <Form.Control type="text" value={values.municiPality} readOnly />
        </Form.Group>
        <Form.Group>
            <Form.Label>District</Form.Label>
            <Form.Control type="text" value={values.district} readOnly />
        </Form.Group>

        <InputGroupPrepend
            List={surveyType}
            Dropdown={true}
            InputGroupName="surveyType"
            Input="surveyName"
            Label="label.survey_no"
            PlaceHolder={`Enter ${values.surveyType == 'Abadi' || values.surveyType == 'Gramakantam'  ? 'House Number' : values.surveyType}`}
            values={values}
            errors={errors}
            customError={surveyInProhited}
            customErrorMsg={`Your site is under prohibitory list ${prohitedValue}. So you should not make any construction here.`}
            touched={touched}
            handleChange={e => {
              handleChange(e),
              handleSurveyUpload(e.target.name, e.target.value)
            }}
            handleBlur={(e) => { handleBlur(e), handleSurvey(e.target.value)}}
            customHandleChange={customHandleChange}
        />
        {showTSLRDocument &&
          <Form.Group>
            <Form.Label>{getTranslatedText('label.tslr_document')} (Optional)</Form.Label>
            <FileUpload
              Label="Upload TSLR Document"
              ID="UploadTslrDocument"
              Filename="tslrDocument"
              FileType="tslr_document"
              errors={errors}
              touched={touched}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
            />
          </Form.Group>
        }
        {showNOCDocument &&
          <Form.Group>
            <Form.Label>Upload NOC Document (Optional)</Form.Label>
            <FileUpload
              Label="Upload NOC Document"
              ID="UploadNocDocument"
              Filename="nocDocument"
              FileType="noc_document"
              errors={errors}
              touched={touched}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
            />
          </Form.Group>
        }
        <Form.Group>
            <Form.Label>{getTranslatedText('heading.plot_address')}</Form.Label>
            <Form.Control 
              as="textarea" 
              rows="3"
              name="plotAddress"
              className={errors.plotAddress && touched.plotAddress && 'has-error'}
              placeholder="Enter Plot Address" 
              readOnly={true}
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
              value={values.surveyName && `${values.plotNo}, ${values.streetName}, ${values.localityName}, ${values.surveyName}, ${values.villageName}${values.villageName.includes('Circle')? `` : `(V)`}, ${values.circle? `${values.circle},` : ``} ${values.zone? `${values.zone},` : ``} ${values.mandalZone}${values.villageName.includes('Circle')? `` : `(M)`},  ${values.municiPality},  ${values.district}${values.villageName.includes('Circle')? `` : `(Dist)`}`} />
              {errors.plotAddress && touched.plotAddress && <p>{errors.plotAddress}</p>}
        </Form.Group>
        <Form.Group>
          <CustomTooltip
            title={getTranslatedText('label.geo_coordinates')}
            showTooltip={showTooltip}
            steps={[
              'Use the "Place map symbol used in the textbox" to open the map.',
              'Search for your plot location.',
              'Use the pointer to draw the plot outline.'
            ]}
          />
          <Form.Label>{getTranslatedText('label.geo_coordinates')} <span> (Click on the map icon and select the area)</span></Form.Label>
          <div className="coordinates-box">
              <Form.Control 
                type="text" 
                placeholder="123.234, 1224, 3354" 
                name="geoLocation"
                className={`geo-coordinates ${errors.geoLocation && touched.geoLocation && 'has-error'}`}
                onChange={handleChange}
                onFocus={toggleTooltip}
                onBlur={(e) => {
                  handleBlur(e);
                  toggleTooltip();
                }} 
                value={values.geoLocation} />
                {errors.geoLocation && touched.geoLocation && <p>{errors.geoLocation}</p>}
              <svg className="arrow-right" onClick={() => setModalShow(true)} dangerouslySetInnerHTML={{ __html: MapIcon }} />
              <span className="map-error-message">Please select the plot geo coordinates to continue</span>
          </div>
        </Form.Group>
        <MapModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            getCoordinates={getGeoCoordinates}
        /> 
    </>
  )
}


export default PlotInfo;
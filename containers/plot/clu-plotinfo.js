import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Form, Button, Col, InputGroup, FormControl, FormCheck } from 'react-bootstrap';
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

const CluPlotInfo = ({
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
        <h5 className="form-title">{'Proposal Information'}</h5>
        
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
            <Form.Label>{'Land Use From'}</Form.Label>
            <Form.Control 
              as="select"
              name="landUseFrom"
              className={errors.landUseFrom && touched.landUseFrom && 'has-error'}
              placeholder="Enter Land Use From" 
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
               >
                      <option >Select</option>
                      <option value="1">Residential</option>
                      <option value="2">Commercial</option>
                      <option value="3">Industrial/Manufacturing</option>
                      <option value="4">Agricultural/Conservational or Green Belt</option>
                      <option value="5">Recreational/ Open space</option>
                      <option value="6">Peri-urban</option>
                      <option value="7">Miscellaneous</option>
                      <option value="8">Public and Semi-Public(Includes Computer Software Units)</option>
                      <option value="9">Public Utilities</option>
                      <option value="10">Multiple Use Traffic</option>
                      <option value="11">Traffic and Transportation</option>
                      <option value="12">Water Body</option>
                      <option value="13">Water Body and Buffer Zone</option>
                      <option value="14">Buffer Zone</option>
                      <option value="15">Central Squares</option>
                      <option value="16">General Development Promotion</option>
                      <option value="17">Roads</option>
                      <option value="18">Defense/Military
                      </option>
                </Form.Control>
              {errors.landUseFrom && touched.landUseFrom && <p>{errors.landUseFrom}</p>}
        </Form.Group>
        <Form.Group>
            <Form.Label>{'Land Use To'}</Form.Label>
            <Form.Control 
              as="select"
              name="landUseTo"
              className={errors.landUseTo && touched.landUseTo && 'has-error'}
              placeholder="Enter Land Use To" 
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
               >
               <option >Select</option>
                      <option value="1">Residential</option>
                      <option value="2">Commercial</option>
                      <option value="3">Industrial/Manufacturing</option>
                      <option value="4">Agricultural/Conservational or Green Belt</option>
                      <option value="5">Recreational/ Open space</option>
                      <option value="6">Peri-urban</option>
                      <option value="7">Miscellaneous</option>
                      <option value="8">Public and Semi-Public(Includes Computer Software Units)</option>
                      <option value="9">Public Utilities</option>
                      <option value="10">Multiple Use Traffic</option>
                      <option value="11">Traffic and Transportation</option>
                      <option value="12">Central Squares</option>
                      <option value="13">General Development Promotion</option>
                      <option value="14">Roads</option>
                </Form.Control>
              {errors.landUseTo && touched.landUseTo && <p>{errors.landUseTo}</p>}
        </Form.Group>
        <Form.Group>
            <Form.Label>{'Site Abutting Road Width(Mtr.)'}</Form.Label>
            <Form.Control 
              type="text"
              name="abuttingRoadWidth"
              className={errors.abuttingRoadWidth && touched.abuttingRoadWidth && 'has-error'}
              placeholder="Enter Site Abutting Road Width" 
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
               />
              {errors.abuttingRoadWidth && touched.abuttingRoadWidth && <p>{errors.abuttingRoadWidth}</p>}
        </Form.Group>
        <Form.Group>
            <Form.Label>{'Nature of the Road'}</Form.Label>
            <Form.Control 
              as="select"
              name="roadNature"
              className={errors.roadNature && touched.roadNature && 'has-error'}
              placeholder="Enter Nature of the Road" 
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
               >
                  <option >Select</option>
                      <option value="1">Kutchha/Gravel</option>
                      <option value="2">WBM</option>
                      <option value="3">Blacktop</option>
                      <option value="4">Concrete</option>
                </Form.Control>
              {errors.roadNature && touched.roadNature && <p>{errors.roadNature}</p>}
        </Form.Group>
        <Form.Group>
            <Form.Label>{'Extent (Sq. Mtr.)'}</Form.Label>
            <Form.Control 
              type="text"
              name="extent"
              className={errors.extent && touched.extent && 'has-error'}
              placeholder="Enter Extent" 
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
               />
              {errors.extent && touched.extent && <p>{errors.extent}</p>}
        </Form.Group>
        <Form.Group>
            <Form.Label>{'Line of Activity'}</Form.Label>
            <Form.Control 
              as="textarea" 
              rows="3"
              name="lineofActivity"
              className={errors.lineofActivity && touched.lineofActivity && 'has-error'}
              placeholder="Enter Line of Activity"
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
              />
              {errors.lineofActivity && touched.lineofActivity && <p>{errors.lineofActivity}</p>}
        </Form.Group>
        <Form.Group>
            <Form.Label>{'Specific Remarks on Existing  Development in Site'}</Form.Label>
            <Form.Control 
              as="textarea" 
              rows="3"
              name="existingDev"
              className={errors.existingDev && touched.existingDev && 'has-error'}
              placeholder="Enter Remarks"
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
              />
              {errors.existingDev && touched.existingDev && <p>{errors.existingDev}</p>}
        </Form.Group>
        <Form.Group>
            <Form.Label>{' Specific Remarks on Development  around the Site'}</Form.Label>
            <Form.Control 
              as="textarea" 
              rows="3"
              name="DevAround"
              className={errors.DevAround && touched.DevAround && 'has-error'}
              placeholder="Enter Remarks" 
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
              />
              {errors.DevAround && touched.DevAround && <p>{errors.DevAround}</p>}
        </Form.Group>
        <Form.Group>
            <Form.Label>{' Project Brief'}</Form.Label>
            <Form.Control 
              as="textarea" 
              rows="3"
              name="projectBrief"
              className={errors.projectBrief && touched.projectBrief && 'has-error'}
              placeholder="Enter Project Brief" 
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
              />
              {errors.projectBrief && touched.projectBrief && <p>{errors.projectBrief}</p>}
        </Form.Group>
        <Form.Group>
            <Form.Label>{' Is site affecting under proposed master plan roads?'}</Form.Label>
            <Form.Check inline label="YES" id={`inline-2`} />
            <Form.Check inline label="NO" id={`inline-1`} />
              {errors.projectBrief && touched.projectBrief && <p>{errors.projectBrief}</p>}
        </Form.Group>
    </>
  )
}


export default CluPlotInfo;
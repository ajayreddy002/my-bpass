import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link';
import { Container, Form, Col, FormControl, Button, InputGroup, Spinner } from 'react-bootstrap';
import { AngleRight, AngleBottom, MapIcon, AngleLeft, UploadFile } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
import FileUpload from '../../components/common/file-upload';
import CustomTooltip from '../../components/CustomTooltip';
import MapModal from '../../components/application/MapModal'
import { _HttpServices } from '../../apiHelpers/_HttpSevices';


const apiURL = require('../../config/url-front').API_SERVER;



const NewLandUseApplicant = ({
  currentStep,
  changeStep
}) => {
    const [modalShow, setModalShow] = useState(false);
  const [relationTypes, setRelationTypes] = useState([]);
  const [applicantTypes, setApplicantTypes] = useState([]);
  const [panCardShow, setPanCardShow] = useState(false)
  const [passwordShown, setPasswordShown] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [getData, setData] = useState([]);
  const [searchValue, setSearchValue] = useState({value: ''})
  const router = useRouter()
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const [authToken, setAuthToken] = useState(null);
  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };
  const getGeoCoordinates = (values) => {
    customHandleChange('geoLocation', values);
}
const SignInSchema = Yup.object().shape({
  applicantName: Yup.string().required('Applicant Name is required'),
  relationType: Yup.string().required('Type is required'),
  relationName: Yup.string().required('Relation Name is required'),
  architectname: Yup.string().required('Name is required'),
  license: Yup.string().required('License number is required'),
  aadhaarNumber: Yup.string()
    .min(12, 'Aadhaar number min 12 digits')
    .max(12, 'Aadhaar number min 12 digits')
    .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/, 'not valid format (0000 0000 0000)')
    .required('Aadhaar Number is Required'),
  mobileNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, {message: "Please enter valid number.", excludeEmptyString: false})
    .required('Mobile Number is required'),
    architectmobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, {message: "Please enter valid number.", excludeEmptyString: false})
    .required('Mobile Number is required'),
    pinNumber: Yup.string()
    .matches(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/, {message: "Please enter valid number.", excludeEmptyString: false})
    .required('PIN Number is required'),
  email: Yup.string().required('Email is required').email(),
  contactAddress: Yup.string().required('Contact Address is required'),
  architectemail: Yup.string().email(),
  architectaddress: Yup.string().required('Contact Address is required'),
});

  useEffect(() => {
    if(currentStep === 2){
      // localStorage.removeItem("auth-token")
      // localStorage.removeItem("application-id")
      // localStorage.removeItem("property-id")
      // localStorage.removeItem("plot-area")  
      setAuthToken(localStorage.getItem('auth-token'))
      axios.get(apiURL + apiConstants.RELATIONSHIP_TYPE.URL)
        .then(function (response) {
          console.log(response);
          // Set results state
          setRelationTypes(response.data.data.relationship_types);
          setApplicantTypes(response.data.data.application_type);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [currentStep])
// useEffect(() => {
//   _HttpServices.getData('v1/villages/')
//   .then(
//     data => {
//       console.log(data.data)
//     }
//   ).catch(e => {
//     console.log(e)
//   })
// }, [getData])

const getVillagesBySearch = (event) => {
  setSearchValue({...searchValue, value: event.target.value})
  _HttpServices.getData(`v1/villages/search?query=${event.target.value}`)
  .then(
    data => {
      console.log(data.data)
    }
  ).catch(e => {
    console.log(e);
  })
}
  const relationTypeChange = (type) => {
    if(type === 'Represented by'){
      setPanCardShow(true)
    }else{
      setPanCardShow(false)
    }
    
  }
  return (
    <div className={`personal-details-from ${currentStep === 1 ? `` : `hide-form`}`}>
      <div className="main-title">
        <h3>{getTranslatedText('Applicant Information')}</h3>
      </div>
        <Formik
          initialValues={{ 
            applicantType: '',
            applicantName: '',
            relationType: '',
            relationName: '',
            industry: '',
            mobileNumber: '',
            email: '',
            contactAddress: '',
            city: '',
            state: '',
            pinNumber: '',
            architectname: '',
            consultant: '',
            license: '',
            architectaddress: '',
            architectmobile: '',
            architectemail: ''
          }}
          validationSchema={SignInSchema}
          onSubmit={async (values, { setSubmitting }) => {
            alert('hey')
              console.log(values, 'values')
              const data = {
                "completed_steps": 1,
                "applicant_type": values.applicantType,
                "first_name": values.applicantName,
                "mobile": "91"+values.mobileNumber,
                "email": values.email,
                "industry": values.industry,
                "relationship_type": values.relationType,
                "relationship_name": values.relationName,
                "contact_address": values.contactAddress,
                "city" : values.city,
                "state" : values.state,
                "pin_number": values.pinNumber,
                "architect_name": values.architectname,
                "consultant": values.consultant,
                "license_no": values.license,
                "architect_address": values.architectaddress,
                "architect_mobile": values.architectmobile,
                "architect_email": values.architectemail
                
              }

              if(window.confirm('Details once saved cannot be edited. Do you want to continue?')){
                if(authToken){
                  const config = {
                    headers: {
                      'Authorization': 'Bearer ' + authToken,
                      'Accept' : '*/*'
                    }
                  };
                  await axios.post(apiURL + apiConstants.CITIZEN_APPLICATION.URL, data, config)
                  .then(function (response) {
                      console.log('fsfsd', response)
                    if(response.data.success){
                      localStorage.setItem('application-id', response.data.data.application.id)
                      changeStep(2);
                      router.push(`/application/cluPlot`)
                    }else{
                      toast.error(response.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                      });
                    }
                    setTimeout(() => {
                      setSubmitting(false);
                    }, 5000)
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
                }else{
                  await axios.post(apiURL + apiConstants.APPLICATION.URL, data)
                  .then(function (response) {
                    if(response.data.success){
                      localStorage.setItem('auth-token', response.data.data.token)
                      localStorage.setItem('application-id', response.data.data.application.id)
                      // changeStep(2);
                      router.push(`/application/cluPlot`)
                    }else{
                      toast.error(response.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                      });
                    }
                    setTimeout(() => {
                      setSubmitting(false);
                    }, 2000)
                  })
                  .catch(function (error) {
                    console.log(error);
                    setSubmitting(false);
                  });
                }
              }else{
                setSubmitting(false);
              }
              
          }}
        >
          {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              /* and other goodies */
          }) => (
            <Form className="login-form-type" onSubmit={handleSubmit} autoComplete="off">
              <Form.Group  className="document-box" >
                  <Form.Label htmlFor="inlineFormInputGroupUsername2">{getTranslatedText('label.applicant_name')}</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <div className="selected-box">
                        <Form.Control as="select"
                          name="applicantType" 
                          // onChange={e => {
                          //   handleChange(e);
                          //   if (e.target.value.toLowerCase() === 'm/s') {
                          //     relationTypeChange('Represented by');
                          //     setFieldValue("relationType", 'Represented by');
                          //   } else {
                          //     relationTypeChange('');
                          //     setFieldValue("relationType", '');
                          //   }
                          // }} 
                          // onBlur={handleBlur}
                          // value={values.applicantType}
                          >
                          <option>{Object.entries(applicantTypes).length > 0 ? 'Select Type': 'Loading...'}</option>
                          {Object.entries(applicantTypes).length > 0 &&
                            Object.entries(applicantTypes).map(([key, value], index) => 
                            <option key={`applicant-types-${index}`} value={key} >{value}</option>
                           )
                          }
                        </Form.Control>
                        <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
                      </div>
                    </InputGroup.Prepend>
                    <Form.Control 
                      type="text"
                      name="applicantName" 
                      // className={errors.applicantName && touched.applicantName && 'has-error'}
                      placeholder="First Name" 
                       />
                  </InputGroup>
              </Form.Group>
              <Form.Group controlId="Contact">
                <Form.Label>{getTranslatedText('label.contact_address')}</Form.Label>
                <Form.Control 
                      as="textarea" 
                      rows="3" 
                      name="contactAddress"
                      placeholder="Type your address" 
                      // className={errors.contactAddress && touched.contactAddress && 'has-error'}
                      />
              </Form.Group>
              <Form.Group controlId="State">
                <Form.Label>{'State/Province/Region'}</Form.Label>
                <Form.Control 
                      type="text"
                      name="state"
                      placeholder="Type your State/Province/Region" 
                      // className={errors.state && touched.state && 'has-error'}
                       />
              </Form.Group> 
              <Form.Group controlId="pinnumber">
                <Form.Label>{'PIN'}</Form.Label>
                <Form.Control 
                  type="text" 
                  name="pinNumber" 
                  maxLength="6" 
                  // className={errors.pinNumber && touched.pinNumber && 'has-error'}
                  placeholder="Enter PIN Number"
                   />
              </Form.Group>
              <Form.Group controlId="phonenumber">
                <Form.Label>{getTranslatedText('label.mobile_number')}</Form.Label>
                <div className="mobile-number-block">
                  <span>+91</span>
                  <Form.Control
                    type="type"
                    maxLength="10" 
                    name="mobileNumber"
                    // className={errors.mobileNumber && touched.mobileNumber && 'has-error'}
                     />
                </div>
              </Form.Group>
              <Form.Group controlId="Email">
                <Form.Label>{getTranslatedText('label.email_id')}</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email"
                  // className={errors.email && touched.email && 'has-error'} 
                  placeholder="Your email id"  />
              </Form.Group>
               <div className="main-title">
              <h3>{getTranslatedText('Land Details')}</h3>
              </div>
            
        <Form.Group>
            <Form.Label>{getTranslatedText('label.village_circle')}</Form.Label>
            <Form.Control type="text"  onChange={(e) => getVillagesBySearch(e)} value={searchValue.value} />
        </Form.Group> 
        <Form.Group>
            <Form.Label>{getTranslatedText('label.mandal_zone')}</Form.Label>
            <Form.Control type="text"   />
        </Form.Group>
        <Form.Group>
            <Form.Label>{getTranslatedText('label.municipality_corporation')}</Form.Label>
            <Form.Control type="text"  />
        </Form.Group>
        <Form.Group>
            <Form.Label>District</Form.Label>
            <Form.Control type="text"  />
        </Form.Group>
        <Form.Group>
            <Form.Label>Location Type</Form.Label>
            <Form.Control type="text"  />
        </Form.Group>
        <Form.Group>
            <Form.Label>Building No</Form.Label>
            <Form.Control type="text"  />
        </Form.Group>
        <Form.Group>
            <Form.Label> Plot Area(Sq.Mt.)</Form.Label>
            <Form.Control type="text"  />
        </Form.Group>
        <Form.Group>
            <Form.Label> Survey No.</Form.Label>
            <Form.Control type="text"  />
        </Form.Group>
        <Form.Group>
            <Form.Label>Location Of Land</Form.Label>
            <Form.Control type="text"  />
       
        <Form.Group>
          <h6 style={{marginTop : '30px'}}>Techincal Aspects(Cond. Mandatory)</h6>
                <Form.Label>Sale deed</Form.Label>
                <FileUpload 
                    Label="Upload Sale deed file"
                    ID="Uploadfile1"
                    Filename="saledeed"
                    FileType="sale_deed"
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                />
        </Form.Group>
        <Form.Group>
                <Form.Label>Property Tax receipt (Applicable only for MCH area)</Form.Label>
                <FileUpload 
                    Label="Upload Property Tax receipt"
                    ID="Uploadfile2"
                    Filename="propertytax"
                    FileType="property_tax"
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                />
        </Form.Group>
        <Form.Group>
                <Form.Label>State or central government order copy on fee waiver</Form.Label>
                <FileUpload 
                    Label="Upload order copy"
                    ID="Uploadfile3"
                    Filename="ordercopy"
                    FileType="order_copy"
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                />
        </Form.Group>
        <Form.Group>
          <CustomTooltip
            title={getTranslatedText('label.geo_coordinates')}
            showTooltip={showTooltip}
            steps={[
              'Use the "Place map symbol used in the textbox" to open the map.',
              'Search for your plot location.',
              'Use the pointer to draw the plot outline.test'
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
        </Form.Group>
              {/* <Button type="submit" disabled={isSubmitting} onClick={event =>  window.location.href='/success'}> */}
              <Button type="submit" disabled={isSubmitting}>
                <span>{getTranslatedText('button.save_continue')} </span>
                {isSubmitting?
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                :
                <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleRight }} /> }
              </Button>
            </Form>
          )}
      </Formik>
    </div>
  )
}


export default NewLandUseApplicant;

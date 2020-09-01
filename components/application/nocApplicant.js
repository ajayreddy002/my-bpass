import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link';
import { Container, Form, Col, FormControl, Button, InputGroup, Spinner } from 'react-bootstrap';
import { AngleRight, AngleBottom, HideIcon } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
import InputGroupPrepend from '../../components/common/input-group'
const apiURL = require('../../config/url-front').API_SERVER;



const CluNoc = ({
  currentStep,
  changeStep
}) => {
  const [houseType, setHouseType] = useState([])
  const [localityType, setLocalityType] = useState([])
  const [surveyType, setSurveyType] = useState([])
  const [questions, setQuestions] = useState([]);
  const [relationTypes, setRelationTypes] = useState([]);
  const [applicantTypes, setApplicantTypes] = useState([]);
  const [panCardShow, setPanCardShow] = useState(false)
  const [passwordShown, setPasswordShown] = useState(false);
  const router = useRouter()
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const [authToken, setAuthToken] = useState(null);
  
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
  email: Yup.string().email(),
  contactAddress: Yup.string().required('Contact Address is required'),
  architectemail: Yup.string().email(),
  architectaddress: Yup.string().required('Contact Address is required'),
});

  useEffect(() => {
    if(currentStep === 1){
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
            aadhaarNumber: '',
            consultant: '',
            collectorname: '',
            license: '',
            validity: '',
            architectaddress: '',
            engineeraddress: '',
            architectmobile: '',
            architectemail: '',
            collectoraddress: '',
            collectoremail: '',
            collectormobile: '',
            engineername: ''
          }}
          validationSchema={SignInSchema}
          onSubmit={async (values, { setSubmitting }) => {
              
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
                "aadhaar_number": values.aadhaarNumber,
                "city" : values.city,
                "state" : values.state,
                "validity" : values.validity,
                "pin_number": values.pinNumber,
                "architect_name": values.architectname,
                "consultant": values.consultant,
                "license_no": values.license,
                "architect_address": values.architectaddress,
                "engineer_address": values.engineeraddress,
                "architect_mobile": values.architectmobile,
                "architect_email": values.architectemail,
                "collector_name" : values.collectorname,
                "collector_address": values.collectoraddress,
                "collector_email": values.collectoremail,
                "collector_mobile": values.collectormobile,
                "engineer_name": values.engineername
                
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
                  <Form.Label htmlFor="inlineFormInputGroupUsername2"> Owner name/Firm name(in Full)</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <div className="selected-box">
                        <Form.Control as="select"
                          name="applicantType" 
                          onChange={e => {
                            handleChange(e);
                            if (e.target.value.toLowerCase() === 'm/s') {
                              relationTypeChange('Represented by');
                              setFieldValue("relationType", 'Represented by');
                            } else {
                              relationTypeChange('');
                              setFieldValue("relationType", '');
                            }
                          }} 
                          onBlur={handleBlur}
                          value={values.applicantType}>
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
                      className={errors.applicantName && touched.applicantName && 'has-error'}
                      placeholder="First Name" 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.applicantName} />
                  </InputGroup>
                      {errors.applicantName && touched.applicantName && <p>{errors.applicantName}</p>}
              </Form.Group>
              <Form.Group className="document-box">
                  <Form.Label htmlFor="inlineFormInputGroupUsername2">{getTranslatedText('label.relationship')}</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <div className="selected-box">
                        <Form.Control as="select"
                          name="relationType" 
                          onChange={(e) => {handleChange(e), relationTypeChange(e.target.value)}} 
                          onBlur={handleBlur}
                          value={values.relationType}>
                          <option>{Object.entries(relationTypes).length > 0 ? 'Select Type': 'Loading...'}</option>
                          {Object.entries(relationTypes).length > 0 &&
                          Object.entries(relationTypes).map(([key, value], index) => 
                          <option key={`relation-types-${index}`} value={key} >{value}</option>
                            )
                          }
                        </Form.Control>
                        <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
                      </div>
                    </InputGroup.Prepend>
                    <FormControl 
                      type="text" 
                      name="relationName"
                      className={errors.relationName && touched.relationName && 'has-error'}
                      placeholder="Name" 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.relationName} />
                  </InputGroup>
                  {errors.relationName && touched.relationName && <p>{errors.relationName}</p>}
                </Form.Group>
              <Form.Group controlId="industry">
                <Form.Label>{'Retail Outlet Dealer'}</Form.Label>
                <Form.Control 
                      type="text"
                      name="industry"
                      placeholder="Type your Industry name" 
                      className={errors.industry && touched.industry && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.industry} />
                      {errors.industry && touched.industry && <p>{errors.industry}</p>}
              </Form.Group>
              <Form.Group controlId="aadharnumber">
                <Form.Label>{getTranslatedText('label.aadhaar_number')}</Form.Label>
                <Form.Control 
                  type="type" 
                  maxLength="12" 
                  name="aadhaarNumber" 
                  className={errors.aadhaarNumber && touched.aadhaarNumber && 'has-error'}
                  placeholder="0000 0000 0000"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.aadhaarNumber} />
                  {errors.aadhaarNumber && touched.aadhaarNumber && <p>{errors.aadhaarNumber}</p>}
              </Form.Group>
              <Form.Group controlId="Contact">
                <Form.Label>{getTranslatedText('label.contact_address')}</Form.Label>
                <Form.Control 
                      as="textarea" 
                      rows="3" 
                      name="contactAddress"
                      placeholder="Type your address" 
                      className={errors.contactAddress && touched.contactAddress && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.contactAddress} />
                      {errors.contactAddress && touched.contactAddress && <p>{errors.contactAddress}</p>}
              </Form.Group>
              <Form.Group controlId="city">
                <Form.Label>{'City'}</Form.Label>
                <Form.Control 
                      type="text"
                      name="city"
                      placeholder="Type your city" 
                      className={errors.city && touched.city && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.city} />
                      {errors.city && touched.city && <p>{errors.city}</p>}
              </Form.Group>
              <Form.Group controlId="State">
                <Form.Label>{'State/Province/Region'}</Form.Label>
                <Form.Control 
                      type="text"
                      name="state"
                      placeholder="Type your State/Province/Region" 
                      className={errors.state && touched.state && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.state} />
                      {errors.state && touched.state && <p>{errors.state}</p>}
              </Form.Group> 
              <Form.Group controlId="pinnumber">
                <Form.Label>{'PIN'}</Form.Label>
                <Form.Control 
                  type="text" 
                  name="pinNumber" 
                  maxLength="6" 
                  className={errors.pinNumber && touched.pinNumber && 'has-error'}
                  placeholder="Enter PIN Number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.pinNumber} />
                  {errors.pinNumber && touched.pinNumber && <p>{errors.pinNumber}</p>}
              </Form.Group>
              <Form.Group controlId="phonenumber">
                <Form.Label>{getTranslatedText('label.mobile_number')}</Form.Label>
                <div className="mobile-number-block">
                  <span>+91</span>
                  <Form.Control
                    type="type"
                    maxLength="10" 
                    name="mobileNumber"
                    className={errors.mobileNumber && touched.mobileNumber && 'has-error'} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.mobileNumber} />
                </div>
                {errors.mobileNumber && touched.mobileNumber && <p>{errors.mobileNumber}</p>}
              </Form.Group>
              <Form.Group controlId="Email">
                <Form.Label>{getTranslatedText('label.email_id')}</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email"
                  className={errors.email && touched.email && 'has-error'} 
                  placeholder="Your email id" 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email} />
                  {errors.email && touched.email && <p>{errors.email}</p>}
              </Form.Group>
               <div className="main-title">
              <h3>{getTranslatedText('Architect/ Engineer Information')}</h3>
              </div>
              <Form.Group controlId="consultant">
                <Form.Label>{'Consultant Type'}</Form.Label>
                <Form.Control 
                      as="select"
                      className={errors.consultant && touched.consultant && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}>
                      <option >Select</option>
                      <option value="1">Architect</option>
                      <option value="2">Engineer</option>
                </Form.Control>
                      {errors.consultant && touched.consultant && <p>{errors.consultant}</p>}
              </Form.Group>
              <Form.Group controlId="licenseno">
                <Form.Label>{'License No'}</Form.Label>
                <Form.Control 
                      type="text"
                      name="license"
                      placeholder="Type your License No" 
                      className={errors.license && touched.license && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.license} />
                      {errors.license && touched.license && <p>{errors.license}</p>}
              </Form.Group> 
              <Form.Group controlId="architectname">
                <Form.Label>{'Name'}</Form.Label>
                <Form.Control 
                  type="text" 
                  name="architectname" 
                  className={errors.architectname && touched.architectname && 'has-error'}
                  placeholder="Enter Name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.architectname} />
                  {errors.architectname && touched.architectname && <p>{errors.architectname}</p>}
              </Form.Group>
              <Form.Group controlId="architectaddress">
                <Form.Label>{getTranslatedText('label.contact_address')}</Form.Label>
                <Form.Control 
                      as="textarea" 
                      rows="3" 
                      name="architectaddress"
                      placeholder="Type your address" 
                      className={errors.architectaddress && touched.architectaddress && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.architectaddress} />
                      {errors.architectaddress && touched.architectaddress && <p>{errors.architectaddress}</p>}
              </Form.Group>
              <Form.Group controlId="architectmobile">
                <Form.Label>{getTranslatedText('label.mobile_number')}</Form.Label>
                <div className="mobile-number-block">
                  <span>+91</span>
                  <Form.Control
                    type="type"
                    maxLength="10" 
                    name="architectmobile"
                    className={errors.architectmobile && touched.architectmobile && 'has-error'} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.architectmobile} />
                </div>
                {errors.architectmobile && touched.architectmobile && <p>{errors.architectmobile}</p>}
              </Form.Group>
              <Form.Group controlId="architectemail">
                <Form.Label>{getTranslatedText('label.email_id')}</Form.Label>
                <Form.Control 
                  type="email" 
                  name="architectemail"
                  className={errors.architectemail && touched.architectemail && 'has-error'} 
                  placeholder="Your email id" 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.architectemail} />
                  {errors.architectemail && touched.architectemail && <p>{errors.architectemail}</p>}
              </Form.Group>
              <div className="main-title">
              <h3>{getTranslatedText('Structural Engineer Information')}</h3>
              </div>
              <Form.Group controlId="consultant">
                <Form.Label>{'Consultant Type'}</Form.Label>
                <Form.Control 
                      as="select"
                      className={errors.consultant && touched.consultant && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}>
                      value={"Structural Engineer"}
                      readOnly
                </Form.Control>
                      {errors.consultant && touched.consultant && <p>{errors.consultant}</p>}
              </Form.Group> 
              <Form.Group controlId="engineername">
                <Form.Label>{'Consultant Name'}</Form.Label>
                <Form.Control 
                  type="text" 
                  name="engineername" 
                  className={errors.engineername && touched.engineername && 'has-error'}
                  placeholder="Enter Name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.engineername} />
                  {errors.engineername && touched.engineername && <p>{errors.engineername}</p>}
              </Form.Group>
              <Form.Group controlId="engineeraddress">
                <Form.Label>{getTranslatedText('label.contact_address')}</Form.Label>
                <Form.Control 
                      as="textarea" 
                      rows="3" 
                      name="engineeraddress"
                      placeholder="Type your address" 
                      className={errors.engineeraddress && touched.engineeraddress && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.engineeraddress} />
                      {errors.engineeraddress && touched.engineeraddress && <p>{errors.engineeraddress}</p>}
              </Form.Group>
              <Form.Group controlId="validity">
                <Form.Label>{'Validity'}</Form.Label>
                <Form.Control 
                      type="text"
                      name="validity"
                      placeholder="Type your Validity" 
                      className={errors.validity && touched.validity && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.validity} />
                      {errors.validity && touched.validity && <p>{errors.validity}</p>}
              </Form.Group> 
              <div className="main-title">
              <h3>{getTranslatedText('District Collectorate Information')}</h3>
              </div>
              <Form.Group controlId="collectorname">
                <Form.Label>{'Name'}</Form.Label>
                <Form.Control 
                  type="text" 
                  name="collectorname" 
                  className={errors.collectorname && touched.collectorname && 'has-error'}
                  placeholder="Enter Name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.collectorname} />
                  {errors.collectorname && touched.collectorname && <p>{errors.collectorname}</p>}
              </Form.Group>
              <Form.Group controlId="collectoraddress">
                <Form.Label>{getTranslatedText('label.contact_address')}</Form.Label>
                <Form.Control 
                      as="textarea" 
                      rows="3" 
                      name="collectoraddress"
                      placeholder="Type your address" 
                      className={errors.collectoraddress && touched.collectoraddress && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.collectoraddress} />
                      {errors.collectoraddress && touched.collectoraddress && <p>{errors.collectoraddress}</p>}
              </Form.Group>
              <Form.Group controlId="collectormobile">
                <Form.Label>{getTranslatedText('label.mobile_number')}</Form.Label>
                <div className="mobile-number-block">
                  <span>+91</span>
                  <Form.Control
                    type="type"
                    maxLength="10" 
                    name="collectormobile"
                    className={errors.collectormobile && touched.collectormobile && 'has-error'} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.collectormobile} />
                </div>
                {errors.collectormobile && touched.collectormobile && <p>{errors.collectormobile}</p>}
              </Form.Group>
              <Form.Group controlId="collectoremail">
                <Form.Label>{getTranslatedText('label.email_id')}</Form.Label>
                <Form.Control 
                  type="email" 
                  name="collectoremail"
                  className={errors.collectoremail && touched.collectoremail && 'has-error'} 
                  placeholder="Your email id" 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.collectoremail} />
                  {errors.collectoremail && touched.collectoremail && <p>{errors.collectoremail}</p>}
              </Form.Group>
              <Button type="submit" disabled={isSubmitting} onClick={event =>  window.location.href='/success'}>
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


export default CluNoc;

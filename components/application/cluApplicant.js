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



const CluApplicant = ({
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
    applicant_type: Yup.string().required('Applicant Type is required'),
    applicant_name: Yup.string().required('Applicant Name is required'),
    relationship_type: Yup.string().required('Type is required'),
    relationship_name: Yup.string().required('Relation Name is required'),
    industry: Yup.string().required('Industry is required'),
    address: Yup.string().required('Contact Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pin: Yup.string().matches(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/, {
        message: "Please enter valid number.",
        excludeEmptyString: false
    }).required('PIN Number is required'),
    mobile: Yup.string().matches(/^[6-9]\d{9}$/, {
        message: "Please enter valid number.",
        excludeEmptyString: false
    }).required('Mobile Number is required'),
    email: Yup.string()
	  .email('Invalid email')
	  .required('Email is required'),
    consultant_type: Yup.string().required('Consultant Type is required'),
    license_number: Yup.string().required('License number is required'),
    arct_name: Yup.string().required('Architect Name is required'),
    arct_address: Yup.string().required('Contact Address is required'),

    arct_mobile: Yup.string().matches(/^[6-9]\d{9}$/, {
        message: "Please enter valid number.",
        excludeEmptyString: false
    }).required('Mobile Number is required'),
    arct_email: Yup.string()
	  .email('Invalid email')
	  .required('Email is required'),
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
          initialValues = {{ 
            applicant_type: '',
            applicant_name: '',
            relationship_type: '',
            relationship_name: '',
            industry: '',
            address: '',
            city: '',
            state: '',
            pin: '',
            mobile: '',
            email: '',
            consultant_type: '',
            license_number: '',
            arct_name: '',
            arct_address: '',
            arct_mobile: '',
            arct_email: '',
          }}

          validationSchema={SignInSchema}
          onSubmit={async (values, { setSubmitting }) => {
              
              // const data = {
              //   "completed_steps": 1,
              //   "applicant_type": values.applicant_type,
              //   "applicant_name": values.applicant_name,
              //   "relationship_type": values.relationship_type,
              //   "relationship_name": values.relationship_name,
              //   "industry": values.industry,
              //   "address": values.address,
              //   "city" : values.city,
              //   "state" : values.state,
              //   "pin": values.pin,
              //   "mobile": "91"+values.mobile,
              //   "email": values.email,
              //   "consultant_type": values.consultant_type,
              //   "license_number": values.license_number,
              //   "arct_name": values.arct_name,
              //   "arct_address": values.arct_address,
              //   "arct_mobile": values.arct_mobile,
              //   "arct_email": values.arct_email
                
              // }

              // if(window.confirm('Details once saved cannot be edited. Do you want to continue?')){
              //   if(authToken){
              //     const config = {
              //       headers: {
              //         'Authorization': 'Bearer ' + authToken,
              //         'Accept' : '*/*'
              //       }
              //     };
              //     await axios.post(apiURL + apiConstants.CITIZEN_APPLICATION.URL, data, config)
              //     .then(function (response) {
              //         console.log('fsfsd', response)
              //       if(response.data.success){
              //         localStorage.setItem('application-id', response.data.data.application.id)
              //         changeStep(2);
              //         router.push(`/application/cluPlot`)
              //       }else{
              //         toast.error(response.data.message, {
              //           position: "top-right",
              //           autoClose: 5000,
              //           hideProgressBar: false,
              //         });
              //       }
              //       setTimeout(() => {
              //         setSubmitting(false);
              //       }, 5000)
              //     })
              //     .catch(function (error) {
              //       console.log(error);
              //     });
              //   }else{
              //     await axios.post(apiURL + apiConstants.APPLICATION.URL, data)
              //     .then(function (response) {
              //       if(response.data.success){
              //         localStorage.setItem('auth-token', response.data.data.token)
              //         localStorage.setItem('application-id', response.data.data.application.id)
              //         // changeStep(2);
              //         router.push(`/application/cluPlot`)
              //       }else{
              //         toast.error(response.data.message, {
              //           position: "top-right",
              //           autoClose: 5000,
              //           hideProgressBar: false,
              //         });
              //       }
              //       setTimeout(() => {
              //         setSubmitting(false);
              //       }, 2000)
              //     })
              //     .catch(function (error) {
              //       console.log(error);
              //       setSubmitting(false);
              //     });
              //   }
              // }else{
              //   setSubmitting(false);
              // }
			swal({
				title: "Are you sure?",
				text: "Details once saved cannot be edited. Do you want to continue?",
				icon: "warning",
				buttons: true,
				dangerMode: true,
				closeOnClickOutside: false
			  })
			  .then((willDelete) => {
				if (willDelete) {
				  axios.post('http://localhost:3030/architect', values)
				  .then(
					  data => {
						  console.log(data.data)
						  if(data.data !== undefined && data.data.applicant_id){
							// swal("Poof! Your imaginary file has been deleted!", {
							// 	icon: "success",
							// 	closeOnClickOutside: false
							//   });
							router.push('/success')
						  } else{
							  toast.error('Enter valid details')
						  }
					  }
				  ).catch(e => {
					  console.log(e);
					  swal("Something went wrong ", {
						icon: "fail",
						closeOnClickOutside: false
					  });
				  })
				}
			  });
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
                          name="applicant_type" 
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
                          value={values.applicant_type}>
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
                      name="applicant_name" 
                      className={errors.applicant_name && touched.applicant_name && 'has-error'}
                      placeholder="First Name" 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.applicant_name} />
                  </InputGroup>
                      {errors.applicant_name && touched.applicant_name && <p>{errors.applicant_name}</p>}
              </Form.Group>
              <Form.Group className="document-box">
                  <Form.Label htmlFor="inlineFormInputGroupUsername2">{getTranslatedText('label.relationship')}</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <div className="selected-box">
                        <Form.Control as="select"
                          name="relationship_type" 
                          onChange={(e) => {handleChange(e), relationTypeChange(e.target.value)}} 
                          onBlur={handleBlur}
                          value={values.relationship_type}>
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
                      name="relationship_name"
                      className={errors.relationship_name && touched.relationship_name && 'has-error'}
                      placeholder="Name" 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.relationship_name} />
                  </InputGroup>
                  {errors.relationship_name && touched.relationship_name && <p>{errors.relationship_name}</p>}
                </Form.Group>
              <Form.Group controlId="industry">
                <Form.Label>{'Name of Industry'}</Form.Label>
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
              <Form.Group controlId="Contact">
                <Form.Label>{getTranslatedText('label.contact_address')}</Form.Label>
                <Form.Control 
                      as="textarea" 
                      rows="3" 
                      name="address"
                      placeholder="Type your address" 
                      className={errors.address && touched.address && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.address} />
                      {errors.address && touched.address && <p>{errors.address}</p>}
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
                  name="pin" 
                  maxLength="6" 
                  className={errors.pin && touched.pin && 'has-error'}
                  placeholder="Enter PIN Number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.pin} />
                  {errors.pin && touched.pin && <p>{errors.pin}</p>}
              </Form.Group>
              <Form.Group controlId="phonenumber">
                <Form.Label>{getTranslatedText('label.mobile_number')}</Form.Label>
                <div className="mobile-number-block">
                  <span>+91</span>
                  <Form.Control
                    type="type"
                    maxLength="10" 
                    name="mobile"
                    className={errors.mobile && touched.mobile && 'has-error'} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.mobile} />
                </div>
                {errors.mobile && touched.mobile && <p>{errors.mobile}</p>}
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
              <h3>{getTranslatedText('Architect/ Engineer/ Surveyor Information')}</h3>
              </div>
              <Form.Group controlId="consultant_type">
                <Form.Label>{'Consultant Type'}</Form.Label>
                <Form.Control 
                      as="select"
                      className={errors.consultant_type && touched.consultant_type && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}>
                      <option >Select</option>
                      <option value="1">Architect</option>
                      <option value="2">Engineer</option>
                      <option value="3">Structural Engineer</option>
                      <option value="4">Surveyor 1</option>
                      <option value="5">Surveyor 2</option>
                      <option value="6">Town Planner</option>
                </Form.Control>
                      {errors.consultant_type && touched.consultant_type && <p>{errors.consultant_type}</p>}
              </Form.Group>
              <Form.Group controlId="license_number">
                <Form.Label>{'License No'}</Form.Label>
                <Form.Control 
                      type="text"
                      name="license_number"
                      placeholder="Type your License No" 
                      className={errors.license_number && touched.license_number && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.license_number} />
                      {errors.license_number && touched.license_number && <p>{errors.license_number}</p>}
              </Form.Group> 
              <Form.Group controlId="arct_name">
                <Form.Label>{'Name'}</Form.Label>
                <Form.Control 
                  type="text" 
                  name="arct_name" 
                  className={errors.arct_name && touched.arct_name && 'has-error'}
                  placeholder="Enter Name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.arct_name} />
                  {errors.arct_name && touched.arct_name && <p>{errors.arct_name}</p>}
              </Form.Group>
              <Form.Group controlId="arct_address">
                <Form.Label>{getTranslatedText('label.contact_address')}</Form.Label>
                <Form.Control 
                      as="textarea" 
                      rows="3" 
                      name="arct_address"
                      placeholder="Type your address" 
                      className={errors.arct_address && touched.arct_address && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.arct_address} />
                      {errors.arct_address && touched.arct_address && <p>{errors.arct_address}</p>}
              </Form.Group>
              <Form.Group controlId="arct_mobile">
                <Form.Label>{getTranslatedText('label.mobile_number')}</Form.Label>
                <div className="mobile-number-block">
                  <span>+91</span>
                  <Form.Control
                    type="type"
                    maxLength="10" 
                    name="arct_mobile"
                    className={errors.arct_mobile && touched.arct_mobile && 'has-error'} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.arct_mobile} />
                </div>
                {errors.arct_mobile && touched.arct_mobile && <p>{errors.arct_mobile}</p>}
              </Form.Group>
              <Form.Group controlId="arct_email">
                <Form.Label>{getTranslatedText('label.email_id')}</Form.Label>
                <Form.Control 
                  type="email" 
                  name="arct_email"
                  className={errors.arct_email && touched.arct_email && 'has-error'} 
                  placeholder="Your email id" 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.arct_email} />
                  {errors.arct_email && touched.arct_email && <p>{errors.arct_email}</p>}
              </Form.Group> 
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


export default CluApplicant;

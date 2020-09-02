import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link';
import { Container, Form, Col, FormControl, Button, InputGroup, Spinner } from 'react-bootstrap';
import { AngleRight, AngleBottom, MapIcon, AngleLeft, UploadFile } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import { Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
import FileUpload from '../../components/common/file-upload';
import CustomTooltip from '../../components/CustomTooltip';
import MapModal from '../../components/application/MapModal';
import { _HttpServices } from '../../apiHelpers/_HttpSevices';

const apiURL = require('../../config/url-front').API_SERVER;
let coord;
let intialState = { 
    applicant_type:'',
    applicant_name: '',
    address: '',
    state: '',
    pin: '',
    mobile: '',
    email: '',
    village: '',
    mandal: '',
    muncipality: '',
    district: '',
    location_type: '',
    building_number: '',
    plot_area: '',
    survey_number: '',
    location_of: '',
    sale_deed: "sale deed",
    property_tax: 'property_tax',
    order_copy: 'order_copy',
    geo_coordinates: ''
  }
const LandUseApplicant = ({
  currentStep,
  changeStep
}) => {
    const [modalShow, setModalShow] = useState(false);
  const [relationTypes, setRelationTypes] = useState([]);
  const [applicantTypes, setApplicantTypes] = useState([]);
  const [panCardShow, setPanCardShow] = useState(false)
  const [passwordShown, setPasswordShown] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [villagesList, setVillagesList] = useState([]);
  const [coordinateValues, setCoordinateValues] = useState('');
  const router = useRouter()
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const [authToken, setAuthToken] = useState(null);
  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };
  const getGeoCoordinates = (values) => {
	  var arr = []
	  if(values !== undefined && values.length > 0){
		  values.map(item => {
			  if(item !== undefined && item.length > 0){
				  item.map(cord => {
					  arr.push(cord)
					})
				}
			})
			coord = arr.toString();
			setCoordinateValues(coord)
			console.log(coord, 'values1234')
	  }
    // customHandleChange('geoLocation', values);
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
  email: Yup.string().email(),
  contactAddress: Yup.string().required('Contact Address is required'),
  architectemail: Yup.string().email(),
  architectaddress: Yup.string().required('Contact Address is required'),
});
const validationSchema = Yup.object().shape({
	applicant_type: Yup.string()
	  .required('Type is required'),
	applicant_name: Yup.string()
	  .required('Name is required'),
	address: Yup.string().required('Contact Address is required'),
	state: Yup.string().required('State is required'),
	pin: Yup.string()
	.matches(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/, {message: "Please enter valid number.", excludeEmptyString: false})
    .required('PIN Code is required'),
	mobile: Yup.string()
	.matches(/^[6-9]\d{9}$/, {message: "Please enter valid number.", excludeEmptyString: false})
	.required('Mobile Number is required'),
	email: Yup.string()
	  .email('Invalid email')
	  .required('Email is required'),
	village: Yup.string()
	  .required('Village name is required'),
	mandal: Yup.string()
	  .required('Mandal name is required'),
	muncipality: Yup.string()
	  .required('Muncipality is required'),
	district: Yup.string()
	  .required('Ditrict is required'),
	location_type: Yup.string()
	  .required('Location Type is required'),
	building_number: Yup.string()
	// .matches(/[0-9]}$/, {message: "Please enter valid number.", excludeEmptyString: false})
	  .required('Building Number is required'),
	plot_area: Yup.string()
	  .required('Plot Area is required'),
	survey_number: Yup.string()
	  .required('Survey Number is required'),
	location_of: Yup.string()
	  .required('Location Of is required'),
	// geo_coordinates: Yup.string()
	//   .required('Required'),
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
  const getVillagesBySearch = (event) => {
	  if(event.target.value !== ''){
		  _HttpServices.getData(`v1/villages/search?query=${event.target.value}`)
			  .then(
				  data => {
				  if(data.data !== undefined && data.data.data.results)
				  setVillagesList(data.data.data.results)
				  }
			  ).catch(e => {
				  console.log(e);
		  });
	  } else{
		  setVillagesList([])
	  }
  }
  const getSelectedVillage = (village, setFieldValue) => {
	  if(village !== undefined){
		  setFieldValue('district', village.district);
		  setFieldValue('mandal', village.mandal);
		  setFieldValue('village', village.village);
		  setFieldValue('muncipality', village.ulb_name);
		  setVillagesList([]);
	  }
  }
  return (
    <div className={`personal-details-from ${currentStep === 1 ? `` : `hide-form`}`}>
      <div className="main-title">
        <h3>{getTranslatedText('Applicant Information')}</h3>
      </div>
	  <Formik
       initialValues={intialState}
       validationSchema={validationSchema}
       onSubmit={async (values, { setSubmitting, }) => {
		   let payLoad;
		   if(values.geo_coordinates === '' && coord !== undefined){
			 payLoad = {...values, geo_coordinates: coord}
		   } else {
			   payLoad = values
		   }
		   if(values.geo_coordinates !== ''){
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
				  axios.post('http://localhost:3030/land', payLoad)
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
		   } else{
			   toast.warn('Coordinates required');
		   }
       }}
     >
       {({ errors, touched, values, handleSubmit, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
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
					//    if (e.target.value.toLowerCase() === 'm/s') {
					// 	 relationTypeChange('Represented by');
					// 	 setFieldValue("relationType", 'Represented by');
					//    } else {
					// 	 relationTypeChange('');
					// 	 setFieldValue("relationType", '');
					//    }
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
				   {/* {errors.applicant_type && touched.applicant_type && <p>{errors.applicant_type}</p>} */}
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
		 <h3>{getTranslatedText('Land Details')}</h3>
		 </div>
	   
   <Form.Group>
	   <Form.Label>{getTranslatedText('label.village_circle')}</Form.Label>
	   <Form.Control type="text"  name="village" onChange={handleChange} onBlur={handleBlur}
	    onKeyUp={(e)=> getVillagesBySearch(e)} value={values.village}
		onKeyDown={(e)=> getVillagesBySearch(e)} value={values.village}
		/>
	   {villagesList.length > 0 &&
	   <div className="villages--dropdown">
		   {villagesList.map(item => 
			<p key={item .id} onClick={() => getSelectedVillage(item, setFieldValue)}>{item.village}</p>
			)}
	   </div>
	   }
	   {errors.village && touched.village && <p>{errors.village}</p>}
   </Form.Group> 
   <Form.Group>
	   <Form.Label>{getTranslatedText('label.mandal_zone')}</Form.Label>
	   <Form.Control type="text" onChange={handleChange} onBlur={handleBlur} name="mandal" value={values.mandal}   />
	   {errors.mandal && touched.mandal && <p>{errors.mandal}</p>}
   </Form.Group>
   <Form.Group>
	   <Form.Label>{getTranslatedText('label.municipality_corporation')}</Form.Label>
	   <Form.Control type="text" onChange={handleChange} onBlur={handleBlur} name="muncipality" value={values.muncipality}  />
	   {errors.muncipality && touched.muncipality && <p>{errors.muncipality}</p>}
   </Form.Group>
   <Form.Group>
	   <Form.Label>District</Form.Label>
	   <Form.Control type="text" onChange={handleChange} onBlur={handleBlur} name="district" value={values.district} />
	   {errors.district && touched.district && <p>{errors.district}</p>}
   </Form.Group>
   <Form.Group>
	   <Form.Label>Location Type</Form.Label>
	   <Form.Control type="text" onChange={handleChange} onBlur={handleBlur} name="location_type" value={values.location_type} />
	   {errors.location_type && touched.location_type && <p>{errors.location_type}</p>}
   </Form.Group>
   <Form.Group>
	   <Form.Label>Building No</Form.Label>
	   <Form.Control type="text" onChange={handleChange} onBlur={handleBlur} name="building_number" value={values.building_number} />
	   {errors.building_number && touched.building_number && <p>{errors.building_number}</p>}
   </Form.Group>
   <Form.Group>
	   <Form.Label> Plot Area(Sq.Mt.)</Form.Label>
	   <Form.Control type="text" onChange={handleChange} onBlur={handleBlur} name="plot_area" value={values.plot_area} />
	   {errors.plot_area && touched.plot_area && <p>{errors.plot_area}</p>}
   </Form.Group>
   <Form.Group>
	   <Form.Label> Survey No.</Form.Label>
	   <Form.Control type="text" onChange={handleChange} onBlur={handleBlur} name="survey_number" value={values.survey_number} />
	   {errors.survey_number && touched.survey_number && <p>{errors.survey_number}</p>}
   </Form.Group>
   <Form.Group>
	   <Form.Label>Location Of Land</Form.Label>
	   <Form.Control type="text" onChange={handleChange} onBlur={handleBlur} name="location_of" value={values.location_of} />
  {errors.location_of && touched.location_of && <p>{errors.location_of}</p>}
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
		 'Use the pointer to draw the plot outline.'
	   ]}
	 />
	 <Form.Label>{getTranslatedText('label.geo_coordinates')} <span> (Click on the map icon and select the area)</span></Form.Label>
	 <div className="coordinates-box">
		 <Form.Control 
		   type="text" 
		   placeholder="123.234, 1224, 3354" 
		   name="geo_coordinates"
		   className={`geo-coordinates ${errors.geo_coordinates && touched.geo_coordinates && 'has-error'}`}
		   onChange={handleChange}
		   onFocus={toggleTooltip}
		   onBlur={(e) => {
			 handleBlur(e);
			 toggleTooltip();
		   }} 
		   value={coordinateValues} />
		   {errors.geo_coordinates && touched.geo_coordinates && <p>{errors.geo_coordinates}</p>}
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


export default LandUseApplicant;

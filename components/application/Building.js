import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import MultiSelect from '../../components/multiselect';
import { Form, Button, Spinner } from 'react-bootstrap';
import { AngleRight, AngleBottom, MapIcon, AngleLeft } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';

import PurposeOfBuilding from '../../containers/building/purpose-building'
import BuiltupArea from '../../containers/building/builtup-area'
import ScheduleBoundaries from '../../containers/building/schedule-boundaries'
import AbuttingRoad from '../../containers/building/abutting-road'
import SetBackDetails from '../../containers/building/setback-details'
import Mortagage from '../../containers/building/mortagage'

import SWArchitect from '../../containers/building/sw-architect';
import SWStructural from '../../containers/building/sw-structural';
import SWBuilder from '../../containers/building/sw-builder';
import BuildingPlan from '../../containers/building/building-plan';
import MSBFloors from '../../containers/building/msb-floors';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;

import ContextApi from '../../context'
// const appType = 'SC';

const BuildingDetails = ({
  currentStep,
  changeStep
}) => {

  const [floorData, setFloorData] = useState([])
  const [plotArea, setPlotArea] = useState(0)
  const [appType, setAppType] = useState(false)
  
  const SignInSchema = Yup.object().shape({
    purposeBuilding: Yup.string().required('This field is required'),
    // buildingType: Yup.number().required('This field is required'),
    proposedFloorId: Yup.string().required('This field is required'),
    // roofType: Yup.string().required('This field is required'),
    // exGround: Yup.number().required('This field is required'),
    // exGroundUnits: Yup.number().min(1, 'This field is required'),
    // exFoor: Yup.number().min(1, 'This field is required'),
    // exFoorUnits: Yup.number().min(1, 'This field is required'),
    // exFoorTwo: Yup.number().min(1, 'This field is required'),
    // exFoorTwoUnits: Yup.number().min(1, 'This field is required'),
    // exBuiltup: Yup.number().min(1, 'This field is required'),
    // // exBuiltupUnits: Yup.number().min(1, 'This field is required'),
    // prGround: Yup.number().min(1, 'This field is required'),
    // prGroundUnits: Yup.number().min(1, 'This field is required'),
    // prFoor: Yup.number().min(1, 'This field is required'),
    // prFoorUnits: Yup.number().min(1, 'This field is required'),
    // prFoorTwo: Yup.number().min(1, 'This field is required'),
    // prFoorTwoUnits: Yup.number().min(1, 'This field is required'),
    prBuiltup: (appType === 'SC' || appType === 'SCMOR') &&  Yup.number().min(1, 'This field is required'),
    // prBuiltupUnits: (appType === 'SC' || appType === 'SCMOR') &&  Yup.number().min(1, 'This field is required'),
    // exRoadWidth: Yup.number().min(1, 'This field is required'),
    // prRoadWidth: Yup.number().min(1, 'This field is required'),
    // affectedRoad: Yup.number().min(1, 'This field is required'),
    // affectedArea: Yup.number().min(1, 'This field is required'),
    // affectedTotal: Yup.number().min(1, 'This field is required'),
    // netPlotArea: Yup.number().min(1, 'This field is required'),
    frontFacing: (appType === 'SC' || appType === 'SCMOR') && Yup.string().required('This field is required'),
    northRoadwidth: (appType === 'SC' || appType === 'SCMOR') && Yup.string()
    .matches(/^[0-9]+$/, {message: "Please enter only number.", excludeEmptyString: false})
    .required('This field is required'),
    southRoadWidth: Yup.string()
    .matches(/^[0-9]+$/, {message: "Please enter only number.", excludeEmptyString: false}),
    eastRoadWidth: Yup.string()
    .matches(/^[0-9]+$/, {message: "Please enter only number.", excludeEmptyString: false}),
    westRoadWidth: Yup.string()
    .matches(/^[0-9]+$/, {message: "Please enter only number.", excludeEmptyString: false}),
    
    frontSetbackManual: Yup.number()
    .min(Yup.ref('frontSetback'), "Rear Setback should not be less than Other Setback"),
    rearSetback: Yup.number()
    .min(Yup.ref('otherSetback'), "Rear Setback should not be less than Other Setback"),
    sideOneSetback: Yup.number()
    .min(Yup.ref('otherSetback'), "Side1 Setback should not be less than Other Setback"),
    sideTwoSetback: Yup.number()
    .min(Yup.ref('otherSetback'), "Side2 Setback should not be less than Other Setback"),

    // Single Window Validation
    // msbFloors: appType === 'SW' && Yup.number().min(1, 'This field is required').max(99, 'Enter below 99 floors'),
    
    architectName: appType === 'SW' &&  Yup.string().required('This field is required'),
    architectLicenseNo: appType === 'SW' &&  Yup.number().required('This field is required'),
    architectMobileNo: appType === 'SW' &&  Yup.string()
    .matches(/^[6-9]\d{9}$/, {message: "Please enter valid number.", excludeEmptyString: false})
    .required('Mobile Number is required'),
    architectEmail: appType === 'SW' &&  Yup.string().email(),
    
    builderName: appType === 'SW' &&  Yup.string().required('This field is required'),
    builderLicenseNo: appType === 'SW' &&  Yup.number().required('This field is required'),
    builderMobileNo: appType === 'SW' &&  Yup.string()
    .matches(/^[6-9]\d{9}$/, {message: "Please enter valid number.", excludeEmptyString: false})
    .required('Mobile Number is required'),
    builderEmail: appType === 'SW' &&  Yup.string().email(),
    
    structuralName: appType === 'SW' &&  Yup.string().required('This field is required'),
    structuralLicenseNo: appType === 'SW' &&  Yup.number().required('This field is required'),
    structuralMobileNo: appType === 'SW' &&  Yup.string()
    .matches(/^[6-9]\d{9}$/, {message: "Please enter valid number.", excludeEmptyString: false})
    .required('Mobile Number is required'),
    structuralEmail: appType === 'SW' &&  Yup.string().email(),
  });

  useEffect(() => {
    const authToken = localStorage.getItem('auth-token');
    const plotArea = localStorage.getItem('plot-area');
    setPlotArea(plotArea)

    if(currentStep === 3){
      if(authToken && plotArea){
        axios.get(apiURL + apiConstants.FLOORS.URL, {
          headers: {
            'Authorization': 'Bearer ' + authToken,
            'Accept' : '*/*'
          },
          params:{
            area: parseInt(plotArea)
          }
        })
        .then(function (response) {
          if(response.data.success){
            setFloorData(response.data.data.floors)
          }else{
            toast.error(response.data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
            });
          }
        })
        .catch(function (error) {
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
          });
        });
      }else{
        toast.error('Plot-Area OR Auth Token not Defined', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
    }
  }, [currentStep])
  

  const formik = useFormik({
    initialValues:{ 
      purposeBuilding: '',
      buildingType: 1,
      roofType: '',
      proposedFloorId: '',
      exGround: 0,
      exGroundUnits: 0,
      exFoor: 0,
      exFoorUnits: 0,
      exFoorTwo: 0,
      exFoorTwoUnits: 0,
      exBuiltup: 0,
      exBuiltupUnits: 0,
      prGround: 0,
      prGroundUnits: 0,
      prFoor: 0,
      prFoorUnits: 0,
      prFoorTwo: 0,
      prFoorTwoUnits: 0,
      prBuiltup: 0,
      prBuiltupUnits: 0,
      exRoadWidth: 0,
      prRoadWidth: 0,
      affectedRoad: 0,
      affectedArea: 0,
      
      northPlotOpen: true,
      northPlotWidth: 0,
      northRoadwidth: 0,
      southplotOpen: true,
      southplotWidth: 0,
      southRoadWidth: 0,
      eastRoadOpen: true,
      eastRoadWidth: 0,
      eastPlotWidth: 0,
      westRoadOpen: true,
      westRoadWidth: 0,
      westPlotWidth: 0,
      
      side1exRoadWidth: 0,
      side1prRoadWidth: 0,
      side1affectedRoad: 0,
      side1affectedArea: 0,
      
      side2exRoadWidth: 0,
      side2prRoadWidth: 0,
      side2affectedRoad: 0,
      side2affectedArea: 0,
      
      side3exRoadWidth: 0,
      side3prRoadWidth: 0,
      side3affectedRoad: 0,
      side3affectedArea: 0,

      affectedTotal: 0,
      netPlotArea: 0,
      frontSetback: 0,
      otherSetback: 0,
      mortgageArea: 0,
      mortgageFloor: [],

      additionalStilts: 0,
      cellar: 0,
      msbFloors: 0,

      architectName: '',
      architectLicenseNo: '',
      architectMobileNo: '',
      architectEmail: '',
      
      builderName: '',
      builderLicenseNo: '',
      builderMobileNo: '',
      builderEmail: '',
      
      structuralName: '',
      structuralLicenseNo: '',
      structuralMobileNo: '',
      structuralEmail: '',
    },
    validationSchema:SignInSchema,
    onSubmit:async (values, { setSubmitting }) => {

      const SWData = [
        {
          "name": values.architectName,
          "mobile": values.architectMobileNo,
          "license_number": values.architectLicenseNo,
          "email": values.architectEmail,
          "engineer_type": "Architect"
        },
        {
          "name": values.builderName,
          "mobile": values.builderMobileNo,
          "license_number": values.builderLicenseNo,
          "email": values.builderEmail,
          "engineer_type": "Builder"
        },
        {
          "name": values.structuralName,
          "mobile": values.structuralMobileNo,
          "license_number": values.structuralLicenseNo,
          "email": values.structuralEmail,
          "engineer_type": "Structural"
        }
      ]
        const data = {
          "completed_steps": plotArea >= 63 ? 3 : 4,
          "proposed_floor_id": values.proposedFloorId,
          "building_type_id": values.buildingType,
          "roof_type": 'RCC',
          "floor_builtup_areas": values.builtupArea,
          "total_built_up_area": values.prBuiltup,
          "units_number": values.prBuiltupUnits,
          "front_facing": values.frontFacing,
          "rear_facing": values.rearFacing,
          "side1_facing": values.sideOneFacing,
          "side2_facing": values.sideTwoFacing,
          "front_open_land": values.northPlotOpen,
          "front_plot_width": values.northPlotWidth,
          "front_road_width": values.northRoadwidth,
          "rear_open_land": values.southplotOpen,
          "rear_plot_width": values.southplotWidth,
          "rear_road_width": values.southRoadWidth,
          "side1_open_land": values.eastRoadOpen,
          "side1_road_width": values.eastRoadWidth,
          "side1_plot_width": values.eastPlotWidth,
          "side2_open_land": values.westRoadOpen,
          "side2_road_width": values.westRoadWidth,
          "side2_plot_width": values.westPlotWidth,
          "front_existing_road_width": values.exRoadWidth,
          "front_proposed_road_width": values.prRoadWidth,
          "front_depth_road_affected": values.affectedRoad,
          "front_road_affected_area": values.affectedArea,
          "side1_existing_road_width": values.side1exRoadWidth,
          "side1_proposed_road_width": values.side1prRoadWidth,
          "side1_depth_road_affected": values.side1affectedRoad,
          "side1_road_affected_area": values.side1affectedArea,
          "side2_existing_road_width": values.side2exRoadWidth,
          "side2_proposed_road_width": values.side2prRoadWidth,
          "side2_depth_road_affected": values.side2affectedRoad,
          "side2_road_affected_area": values.side2affectedArea,
          "side3_existing_road_width": values.side3exRoadWidth,
          "side3_proposed_road_width": values.side3prRoadWidth,
          "side3_depth_road_affected": values.side3affectedRoad,
          "side3_road_affected_area": values.side3affectedRoad,
          "total_road_affected_area": values.affectedTotal,
          "net_plot_area": values.netPlotArea,
          "front_setback": values.frontSetback,
          "other_setback": values.otherSetback,
          "front_setback_manual": values.frontSetbackManual,
          "rear_setback_manual": values.rearSetback,
          "side1_setback_manual": values.sideOneSetback,
          "side2_setback_manual": values.sideTwoSetback,
          "mortgage_area": values.mortgageArea,
          "mortgage_floor": values.mortgageFloor.toString(),
          "sro_location": values.sroLocation,
          "market_value": values.marketValue,
          "mortgage_reg_no": values.mortgageRegNumber,
          "mortgage_date": values.mortgageDate,
          "application_type": appType === 'SCMOR' ? 'SC' : appType,
          "additional_stilts": values.additionalStilts,
          "cellar": values.cellar,
          "msb_no_floors": values.msbFloors,
          "engineers": appType === 'SW' ? SWData : []
        }
        // console.log('data', data)
        // return false;

        const authToken = localStorage.getItem('auth-token');
        const applicationId = localStorage.getItem('property-id');
        const plotArea = localStorage.getItem('plot-area');
        if(authToken && applicationId && plotArea){
          const config = {
            headers: {
              'Authorization': 'Bearer ' + authToken,
              'Accept' : '*/*'
            }
          };
          if(window.confirm('Details once saved cannot be edited. Do you want to continue?')){
            await axios.put(apiURL + apiConstants.PLOT_POST.URL + `/${applicationId}`, data, config)
            .then(function (response) {
              // console.log('response', response);
              if(response.data.success){
                if(plotArea >= 63){
                  changeStep(4);
                }else{
                  changeStep(5);
                }
              }else{
                toast.error(response.data.message, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                });
              }
            })
            .catch(function (error) {
              toast.error(error.response.data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
              });
            });
          }
        }else{
          toast.error('Something went wrong', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
          });
        }
        setTimeout(() => {
          setSubmitting(false);
        }, 400);
    }
  });

  const customHandleChange = (name, value) => {
    formik.setFieldValue(name, value);
  }
  console.log('errors', formik.errors);
  return (
    <ContextApi.Consumer>
      {value =>
        <div className={`personal-details-from building-form ${currentStep === 3 ? `` : `hide-form`}`}>
          <div className="main-title">
            <h3>{getTranslatedText('heading.building_info')}</h3>
          </div>
          <Form className="login-form-type" onSubmit={formik.handleSubmit} autoComplete="off">
            
            <PurposeOfBuilding 
                floorData={floorData}
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur} 
                customHandleChange={customHandleChange}
                plotArea={plotArea}
            />
                
            {value.applicationType !== 'REG'  && plotArea < 2000 &&
                <BuiltupArea 
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur} 
                  customHandleChange={customHandleChange} />
            }
            
            {(value.applicationType === 'SC' || value.applicationType === 'SCMOR') &&
            <>
              <ScheduleBoundaries 
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur} 
                  customHandleChange={customHandleChange}
              />

              <AbuttingRoad 
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur} 
                customHandleChange={customHandleChange} />

              <SetBackDetails 
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur} 
                customHandleChange={customHandleChange} />
            </>
            }

            {value.applicationType === 'SCMOR' &&
              <Mortagage 
              values={formik.values}
              errors={formik.errors}
              touched={formik.touched}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur} 
              customHandleChange={customHandleChange} />
            }

            {value.applicationType === 'SW' &&
            <>
              <MSBFloors 
              plotArea={plotArea}
              values={formik.values}
              errors={formik.errors}
              touched={formik.touched}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur} 
              customHandleChange={customHandleChange} />

              <div className="border-line-bottom"><span></span></div>
              <div className="main-title">
                <h3>{getTranslatedText('heading.single_window_heading')}</h3>
              </div>
              <span className="Abutting-dec">To process the application using single window please provide the information below.</span>
              
              <SWArchitect 
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur} 
                customHandleChange={customHandleChange} />

              <SWStructural 
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur} 
                customHandleChange={customHandleChange} />
              
              <SWBuilder 
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur} 
                customHandleChange={customHandleChange} />
            </>
            }

            {value.applicationType !== 'REG' &&
              <BuildingPlan 
                appType={value.applicationType}
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur} 
                customHandleChange={customHandleChange} />
            }

            {/* <div className="personal-deatails-buttons">
              <div className="back-btn" onClick={() => changeStep(2)}>
                <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleLeft }} />
                <span>{getTranslatedText('button.back')}</span>
              </div> */}
              <Button type="submit" onClick={() => setAppType(value.applicationType)} disabled={formik.isSubmitting}>
                  <span>{getTranslatedText('button.save_continue')} </span>
                  {formik.isSubmitting?
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
            {/* </div> */}
          
          </Form>

        </div>
    }
    </ContextApi.Consumer>
  )
}


export default BuildingDetails;
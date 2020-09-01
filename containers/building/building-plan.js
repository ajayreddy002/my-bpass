import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Table, Form, Button, Spinner } from 'react-bootstrap';
import { AngleRight, AngleBottom, MapIcon, AngleLeft, UploadFile } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import InputGroupPrepend from '../../components/common/input-group'
import FileUpload from '../../components/common/file-upload'

import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;

const BuildingPlan = ({
    appType,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    customHandleChange
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [autoDcr, setAutoDcr] = useState(false)

  const handleAutoDCR = () => {
    const authToken = localStorage.getItem('auth-token');
    if(values.referenceNo && values.SecretKey && authToken){
      setIsLoading(true)
      const data = {
        "RefNo": values.referenceNo,
        "SecretKey": values.SecretKey
      }
      axios.post(apiURL + apiConstants.AUTO_DCR.URL, data, {
        headers: {
           'Authorization': 'Bearer ' + authToken,
           'Accept' : '*/*'
        }
     })
     .then(function (response) {
        console.log('fsdfsdfsdfs', response)
        if(response.status === 200){ 
          setAutoDcr(response.data.data.SANCTIONS_DETAILS)
        }else{
           toast.error(response.data.message, {
           position: "top-right",
           autoClose: 5000,
           hideProgressBar: false,
           });
        }
        setIsLoading(false)
     })
     .catch(function (error) {
        console.log('erroreee', error);
        setIsLoading(false)
        if(error.response){
           toast.error(error.response.data.message, {
           position: "top-right",
           autoClose: 5000,
           hideProgressBar: false,
           });
        }
     })
    }else{
      toast.error('Auth Token or Values Missing', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      });
   }
  }

  const confirmAUTODCR = (values) => {
    const authToken = localStorage.getItem('auth-token');
    const propertyId = localStorage.getItem('property-id');
    if(authToken){
      setIsConfirmLoading(true)
      const data = {
        "property_id": propertyId,
        "bua_with_parking_area": values.BUA_With_ParkingArea,
        "bua_without_parking_area": values.BUA_Without_ParkingArea,
        "built_up_area": values.BuiltUpArea,
        "net_plot_area": values.NetPlotArea,
        "no_of_blocks": values.NoOfBlocks,
        "no_of_floors": values.NoofFloors,
        "plot_width": values.PlotWidth,
        "plot_depth": values.Plotdepth,
        "road_area": values.RoadArea,
        "message": values.SMessage,
        "status": values.SStatus,
      }
      axios.post(apiURL + apiConstants.AUTO_DCR_CONFIRM.URL, data, {
        headers: {
           'Authorization': 'Bearer ' + authToken,
           'Accept' : '*/*'
        }
     })
     .then(function (response) {
        console.log('fsdfsdfsdfs', response)
        if(response.status === 200){ 
          toast.success('Confirmed Auto DCR fileds', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
           });
        }else{
           toast.error(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
           });
        }
        setIsConfirmLoading(false)
     })
     .catch(function (error) {
        console.log('erroreee', error);
        setIsConfirmLoading(false)
        if(error.response){
           toast.error(error.response.data.message, {
           position: "top-right",
           autoClose: 5000,
           hideProgressBar: false,
           });
        }
     })
    }else{
      toast.error('Auth Token or Values Missing', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
      });
   }
  }

  return (
    <>
        <div className="border-line-bottom"><span></span></div>
        {(appType === 'SC' || appType === 'SCMOR' ) &&
        <>
          <h5 className="form-title">Building Plan</h5>
          <Form.Group>
              <Form.Label>Building Plan</Form.Label>
              <FileUpload 
                  Label="Upload Building Plan (PDF Only)"
                  ID="Uploadfile1"
                  Filename="frontPhoto"
                  FileType="building_plan"
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  customHandleChange={customHandleChange}
              />
          </Form.Group>
        {/* <h5 className="form-title">(OR)</h5> */}
      </>
      }

      {appType === 'SW' && 
        <>
        <h5 className="form-title">{getTranslatedText('label.auto_dcr')}</h5>
        
        <Form.Group className="verify group-block">
            <div className="group">
              <Form.Group>
                <Form.Label>Reference No</Form.Label>
                <Form.Control 
                    type="text" 
                    name="referenceNo"
                    placeholder="Enter Reference No"
                    className={errors.referenceNo && touched.referenceNo && 'has-error'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values && values.referenceNo}
                />
                {errors.referenceNo && touched.referenceNo && <p>{errors.referenceNo}</p>}
              </Form.Group>
              <Form.Group>
                <Form.Label>Secret Key</Form.Label>
                <Form.Control 
                    type="text" 
                    name="SecretKey"
                    placeholder="Enter Secret Key"
                    className={errors.SecretKey && touched.SecretKey && 'has-error'}
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    value={values && values.SecretKey}
                />
                {errors.SecretKey && touched.SecretKey && <p>{errors.SecretKey}</p>}
              </Form.Group>
              <Form.Group className="verify-button">
                <Button onClick={handleAutoDCR} > 
                {isLoading?
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                : 'Verify'} 
              </Button>
              </Form.Group>
            </div>
        </Form.Group>
        </>
      }
        {autoDcr &&
        <div className="review-submit-box applicant">
          <h5>Auto DCR Details</h5>
          <Table responsive className="review-table">
            <tbody>
              <tr>
                  <td>BUA_With_ParkingArea</td>
                  <td>{autoDcr.BUA_With_ParkingArea}</td>
              </tr>
              <tr>
                  <td>BUA_Without_ParkingArea</td>
                  <td>{autoDcr.BUA_Without_ParkingArea}</td>
              </tr>
              <tr>
                  <td>BuiltUpArea</td>
                  <td>{autoDcr.BuiltUpArea}</td>
              </tr>
              <tr>
                  <td>NetPlotArea</td>
                  <td>{autoDcr.NetPlotArea}</td>
              </tr>
              <tr>
                  <td>NoOfBlocks</td>
                  <td>{autoDcr.NoOfBlocks}</td>
              </tr>
              <tr>
                  <td>NoofFloors</td>
                  <td>{autoDcr.NoofFloors}</td>
              </tr>
              <tr>
                  <td>PlotWidth</td>
                  <td>{autoDcr.PlotWidth}</td>
              </tr>
              <tr>
                  <td>Plotdepth</td>
                  <td>{autoDcr.Plotdepth}</td>
              </tr>
              <tr>
                  <td>RoadArea</td>
                  <td>{autoDcr.RoadArea}</td>
              </tr>
              <tr>
                  <td>sMessage</td>
                  <td>{autoDcr.sMessage}</td>
              </tr>
              <tr>
                  <td>sStatus</td>
                  <td>{autoDcr.sStatus}</td>
              </tr>
            </tbody>
        </Table>
          
          <Form.Group className="verify-button">
                <Button onClick={() => confirmAUTODCR(autoDcr)} > 
                {isConfirmLoading?
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                : 'Confirm'} 
              </Button>
            </Form.Group>

        </div> }
      <br />
    </>
  )
}


export default BuildingPlan;
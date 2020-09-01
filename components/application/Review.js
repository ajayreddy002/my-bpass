import React, { useState, useEffect } from 'react';
import Router , {useRouter}  from 'next/router';
import Link from 'next/link';
import { Table, Button, Form, FormControl, Accordion, Collapse, Card, Spinner } from 'react-bootstrap';
import { AngleRight, AngleBottom, AngleTop, MapIcon, AngleLeft } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import { convertToSqYards } from '../../utils/convertionUtils'
import ViewMap from '../../components/common/view-map'

import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;

const ReviewSubmit = ({
   currentStep,
   changeStep
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [applicantOpen, setApplicantOpen] = useState(true);
  const [plotOpen, setPlotOpen] = useState(true);
  const [mediaOpen, setMediaOpen] = useState(true);
  const [vicinityOpen, setVicinityOpen] = useState(true);
  const [buildingOpen, setBuildingOpen] = useState(true);
  const [swOpen, setSWOpen] = useState(true);
  const [selfOpen, setSelfOpen] = useState(true);
  const [applicantData, setApplicantData] = useState(false);
  const [plotData, setPlotData] = useState(false);
  const [buildingData, setBuildingData] = useState(false);
  const [vicinityData, setVicinityData] = useState(false);
  const [engineerData, setEngineerData] = useState(false);
  const [autoDcrData, setAutoDcrData] = useState(false);
  const [selfDeclaration, setSelfDeclaration] = useState(false)
  const [mediaData, setMediaData] = useState(false);
  const [geoCoordinates, setGeoCoordinates] = useState([])
  const [checkedValues, setCheckedValues] = useState([])
  const [modalShow, setModalShow] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
   const authToken = localStorage.getItem('auth-token');
   const ApplicationId = localStorage.getItem('application-id');
   
     if(authToken && ApplicationId && currentStep === 5){
         setIsLoading(true)
         axios.get(apiURL + apiConstants.APPLICATION.URL + `/${ApplicationId}`, {
            headers: {
               'Authorization': 'Bearer ' + authToken,
               'Accept' : '*/*'
            }
         })
         .then(function (response) {
            // console.log('response', response);
            if(response.data.success){
               setApplicantData(response.data.data.applicant)
               setPlotData(response.data.data.plot)
               setBuildingData(response.data.data.building)
               setVicinityData(response.data.data.vicinity)
               setMediaData(response.data.data.media.data)
               setEngineerData(response.data.data.engineers.data)
               setAutoDcrData(response.data.data.dcr)
               setSelfDeclaration(response.data.data.self_declaration)
               stringToGeoCoords(response.data.data.plot.geo_coordinates)
               localStorage.setItem('app-identifier', response.data.data.application_identifier)
               setIsLoading(false)
            }else{
              toast.error(response.data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
              });
            }
          })
          .catch(function (error) {
             console.log('erroreee', error);
             
            if(error.response){
               toast.error(error.response.data.message, {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
               });
            }
          })
     }
  }, [currentStep])

  const stringToGeoCoords = (geoCoords) => {
   var geoCoordValues = geoCoords.split(',');
   const rows = [...Array(Math.ceil(geoCoordValues.length / 2))];
   const devidedRows = rows.map((row, idx) => geoCoordValues.slice(idx * 2, idx * 2 + 2));

   const geoValues = []
   devidedRows.map((row, i) => {
      geoValues.push({
         lat:row[0],
         lng:row[1]
      })
   })
   setGeoCoordinates(geoValues)
   
  }

   const handleCheck = (index) => {
      if(checkedValues.includes(index)){
         const checked = checkedValues.filter(item => item !== index);
         setCheckedValues(checked)
      }else{
         setCheckedValues(prevState => ([...prevState, index]))
      }
   }

   const router = useRouter()

   const handleSubmit = async () => {
      if(selfDeclaration.length === checkedValues.length + 1){
         setIsSubmitting(true);
         const authToken = localStorage.getItem('auth-token');
         const ApplicationId = localStorage.getItem('application-id');
         const propertyId = localStorage.getItem('property-id');
         const config = {
            headers: {
               'Authorization': 'Bearer ' + authToken,
               'Accept' : '*/*'
            }
         };
         const data = {
            "completed_steps": 5
          }
    
          await axios.put(apiURL + apiConstants.PLOT_POST.URL + `/${propertyId}`, data, config)
          .then(function (response) {
            if(response.data.success){
               if(plotData && plotData.application_type === 'REG'){
                  setTimeout(() => {
                     router.push('/payment/reg')
                  }, 1500)
               }
               if(plotData && (plotData.application_type === 'SC' || plotData.application_type === 'SCMOR')){
                  setTimeout(() => {
                     router.push('/payment/sc')
                  }, 1500)
               }
               if(plotData && (plotData.application_type === 'SW' || plotData.application_type === 'SW')){
                  setTimeout(() => {
                     router.push(`/application-sw/${ApplicationId}`)
                  }, 1500)
               }
            }else{
              toast.error(response.data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
              });
            }
            setIsSubmitting(false);
          })
          .catch(function (error) {
            toast.error(error.response.data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
            });
            setIsSubmitting(false);
          });

         // console.log('typeee', plotData.application_type)
         
      }else{
         toast.error('Please Select all Checkboxes of Self Declaration', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
         });  
      }
   }

   const getFrontValue = () => {
      if(plotData.front_open_land === true){
         return 'Open Land'
      }else if(parseInt(plotData.front_plot_width) !== 0){
         return 'Plot No: ' + plotData.front_plot_width;
      }else if(parseInt(plotData.front_road_width) !== 0){
         return 'Road Width: ' + plotData.front_road_width + " Mtrs";
      }
   }
   
   const getRearValue = () => {
      if(plotData.rear_open_land === true){
         return 'Open Land'
      }else if(parseInt(plotData.rear_plot_width) !== 0){
         return 'Plot No: ' + plotData.rear_plot_width;
      }else if(parseInt(plotData.rear_road_width) !== 0){
         return 'Road Width: ' + plotData.rear_road_width + " Mtrs";
      }
   }
   
   const getSide1Value = () => {
      if(plotData.side1_open_land === true){
         return 'Open Land'
      }else if(parseInt(plotData.side1_plot_width) !== 0){
         return 'Plot No: ' + plotData.side1_plot_width;
      }else if(parseInt(plotData.side1_road_width) !== 0){
         return 'Road Width: ' + plotData.side1_road_width + " Mtrs";
      }
   }
   
   const getSide2Value = () => {
      if(plotData.side2_open_land === true){
         return 'Open Land'
      }else if(parseInt(plotData.side2_plot_width) !== 0){
         return 'Plot No: ' + plotData.side2_plot_width;
      }else if(parseInt(plotData.side2_road_width) !== 0){
         return 'Road Width: ' + plotData.side2_road_width + " Mtrs";
      }
   }

   return (
      <>
      <div className={`personal-details-from review-form ${currentStep === 5 ? `` : `hide-form`}`}>
         <div className="main-title">
            <h3>{getTranslatedText('heading.review')}</h3>
         </div>
         {isLoading?
            <div className="login-form-type">
               <span className="Abutting-dec">Please double check the information below before submitting the application</span>
               <div className="review-submit-loading">

                  <Spinner animation="border" size="xlg" />
               </div>
            </div>
         :
         <div className="login-form-type">
            <span className="Abutting-dec">Please double check the information below before submitting the application</span>
               <div className="review-submit-details">
                  <Accordion >
                     <Card className="details-form">
                        <div className="review-submit-title">
                           <Accordion.Toggle onClick={() => setApplicantOpen(!applicantOpen)}>
                              <h4>Applicant Details</h4>
                              <div className="review-submit-icon">
                              {applicantOpen?
                                 <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleTop }} />:
                              <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} /> }
                              </div>
                           </Accordion.Toggle>
                        </div>
                        <Collapse in={applicantOpen}>
                           <div className="review-submit-box applicant">
                              
                              {Object.keys(applicantData).length > 0?
                              <Table responsive className="review-table">
                                 <tbody>
                                    <tr>
                                       <td>Applicant Name</td>
                                       <td>{applicantData.applicant_name} {applicantData.relationship_type} {applicantData.relationship_name}</td>
                                    </tr>
                                    {applicantData.pan_number ?
                                    <tr>
                                       <td>PAN Number</td>
                                       <td>{applicantData.pan_number}</td>
                                    </tr>
                                    : null}
                                    <tr>
                                       <td>Aadhaar Number</td>
                                       <td>{applicantData.aadhaar_number}</td>
                                    </tr>
                                    <tr>
                                       <td>Mobile Number</td>
                                       <td>{applicantData.mobile}</td>
                                    </tr>
                                    <tr>
                                       <td>E-mail ID</td>
                                       <td style={{textTransform: 'lowercase'}}>{applicantData.email}</td>
                                    </tr>
                                    <tr>
                                       <td>Contact Address</td>
                                       <td>{applicantData.contact_address}</td>
                                    </tr>
                                 </tbody>
                              </Table>
                              : <h3>No Applicant Details found</h3> }
                           </div>
                        </Collapse>
                     </Card>
                     <Card className="details-form">
                        <div className="review-submit-title">
                           <Accordion.Toggle onClick={() => setPlotOpen(!plotOpen)}>
                              <h4>Plot Details</h4>
                              <div className="review-submit-icon">
                              {plotOpen?
                                 <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleTop }} />:
                              <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} /> }
                              </div>
                           </Accordion.Toggle>
                        </div>
                        <Collapse in={plotOpen}>
                           <div className="review-submit-box applicant">
                              <div className="plot-deatils-form">
                                 
                                 {Object.keys(plotData).length > 0?
                                 <Table responsive className="review-table">
                                    <tbody>
                                       <tr>
                                          <td>Plot Address</td>
                                          <td>{plotData.plot_address}</td>
                                       </tr>
                                       <tr>
                                          <td>Geo-Coordinates</td>
                                          <td>
                                             {plotData.geo_coordinates}
                                             {/* {geoCoordinates.length &&
                                                <ul>
                                                   {geoCoordinates.map((coordinates, index) => {
                                                      return (
                                                         <li style={{ listStyle: 'disc', }} key={index}>{`Latitude: ${coordinates.lat}, Longitude: ${coordinates.lng}`}</li>
                                                      );
                                                   })}
                                                </ul>
                                             } */}
                                             <Link href="#!"><a onClick={() => setModalShow(true)}>View Map</a></Link>
                                          </td>
                                       </tr>
                                    </tbody>
                                 </Table>
                                 : <h3>Plot Address Not found</h3> }
                              </div>
                              <div className="plot-deatils-form">
                                 <h5>Plot registration details</h5>
                                 <Table responsive className="review-table">
                                    <tbody>
                                       <tr>
                                          <td>Survey No</td>
                                          <td>{plotData.plot_land_value?plotData.plot_land_value: '---'}</td>
                                       </tr>
                                       <tr>
                                          <td>Plot Area As per document</td>
                                          <td>{plotData.plot_area_as_per_document? plotData.plot_area_type === 'Sq. Yards'? convertToSqYards(plotData.plot_area_as_per_document) + ' Sq. Yards' : plotData.plot_area_as_per_document + ' ' + plotData.plot_area_type:'---'}</td>
                                       </tr>
                                       <tr>
                                          <td>Plot Area as on Ground</td>
                                          <td>{plotData.plot_area_as_per_ground? plotData.plot_area_type === 'Sq. Yards'? convertToSqYards(plotData.plot_area_as_per_ground) + ' Sq. Yards' : plotData.plot_area_as_per_ground + ' ' + plotData.plot_area_type:'---'}</td>
                                       </tr>
                                    </tbody>
                                 </Table>
                              </div>
                              <div className="plot-deatils-form">
                                 <h5>Documents </h5>
                                 <Table responsive className="review-table">
                                    <tbody>
                                    {plotData.documents.length > 0 && 
                                       plotData.documents.map((document, i) => 
                                       <tr key={`plot-document-${i}`}>
                                          <td>{document.question}</td>
                                          <td>{document.answer === "FALSE"? 'NO': document.answer === "TRUE"? 'YES': document.answer.substr(0, 35)}</td>
                                       </tr>
                                    )}
                                    
                                    {plotData.is_plot_part_of.length > 0 && 
                                       plotData.is_plot_part_of.map((part, i) => 
                                       <tr key={`plot-part-of-${i}`}>
                                          <td>{part.question}</td>
                                          <td>{part.answer.length > 50? <a href={part.answer} target="_blank"><ul>{part.answer.substr(0, 35)}...</ul></a> : part.answer}</td>
                                       </tr>
                                    )}
                                    <tr>
                                       <td>Whether your plot falls under any of the notified slum areas ?</td>
                                       <td>{plotData.slum?plotData.slum: '---'}</td>
                                    </tr>
                                    {plotData.application_type !== 'REG' && plotData.application_type !== 'SW' &&
                                    <>
                                       <tr>
                                          <td>SRO at</td>
                                          <td>{plotData.sro_location?plotData.sro_location: '---'}</td>
                                       </tr>
                                       <tr>
                                          <td>Market Value</td>
                                          <td>{plotData.market_value?plotData.market_value: '---'}</td>
                                       </tr>
                                    </> }
                                    </tbody>
                                 </Table>
                              </div>
                              {plotData.application_type !== 'REG' && plotData.application_type !== 'SW' &&
                              <div className="plot-deatils-form">
                                 <h5>Schedule of Boundaries</h5>
                                 <Table responsive className="review-table">
                                    <tbody>
                                       <tr>
                                          <td>Front ({plotData.front_facing})</td>
                                          <td>{getFrontValue()}</td>
                                       </tr>
                                       <tr>
                                          <td>Rear ({plotData.rear_facing})</td>
                                          <td>{getRearValue()}</td>
                                       </tr>
                                       <tr>
                                          <td>Side 1 ({plotData.side1_facing})</td>
                                          <td>{getSide1Value()}</td>
                                       </tr>
                                       <tr>
                                          <td>Side 2 ({plotData.side2_facing})</td>
                                          <td>{getSide2Value()}</td>
                                       </tr>
                                    </tbody>
                                 </Table>
                              </div> }
                           </div>
                        </Collapse>
                     </Card>
                     <Card className="details-form">
                        <div className="review-submit-title">
                           <Accordion.Toggle onClick={() => setMediaOpen(!mediaOpen)}>
                              <h4>Uploaded Documents</h4>
                              <div className="review-submit-icon">
                              {mediaOpen?
                                 <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleTop }} />:
                              <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} /> }
                              </div>
                           </Accordion.Toggle>
                        </div>
                        <Collapse in={mediaOpen}>
                           <div className="plot-deatils-form">
                              <h5>Documents</h5>
                              <div className="review-submit-document">
                                 {mediaData && mediaData.length > 0?
                                 <ul>
                                    {mediaData.map((doc, index) => {
                                       if(doc.category){
                                       return (
                                          <a href={doc.download_url} target="_blank" key={`media-docs-${index}`} >
                                             <li >
                                                <img src={doc.download_url} />
                                                <span>{doc.category.substr(0, 18).replace(/_/g, ' ')}</span>
                                             </li>
                                          </a>
                                       )}
                                    })}
                                 </ul>:
                                 <h4>No Plot Documents Found</h4> }
                              </div>
                           </div>
                        </Collapse>
                     </Card>
                     {vicinityData && vicinityData.documents.length > 0 &&
                     <Card className="details-form">
                        <div className="review-submit-title">
                           <Accordion.Toggle onClick={() => setVicinityOpen(!vicinityOpen)}>
                              <h4>Vicinity Details</h4>
                              <div className="review-submit-icon">
                              {vicinityOpen?
                                 <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleTop }} />:
                              <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} /> }
                              </div>
                           </Accordion.Toggle>
                        </div>
                        <Collapse in={vicinityOpen}>
                           <div className="review-submit-box applicant">
                              <div className="plot-deatils-form">
                                 <h5>Building Information</h5>
                                 <Table responsive className="review-table">
                                    <tbody>
                                       {vicinityData.documents.map((document, index) =>
                                          <tr key={`vicinity-docs-${index}`}>
                                             <td>{document.question}</td>
                                             <td>{<td>{document.answer === "FALSE"? 'NO': document.answer === "TRUE"? 'YES': document.answer.substr(0, 35)}</td>}</td>
                                          </tr>
                                       )}
                                    </tbody>
                                 </Table>
                              </div>
                              {/* <div className="plot-deatils-form">
                                 <h5>NOC Document</h5>
                                 <div className="review-submit-document">
                                    <ul>
                                       <li>
                                          <img src='/html/images/review_submit/03.png' />
                                          <span>NOC .pdf</span>
                                       </li>
                                    </ul>
                                 </div>
                              </div> */}
                           </div>
                        </Collapse>
                     </Card> }
                     <Card className="details-form">
                        <div className="review-submit-title">
                           <Accordion.Toggle onClick={() => setBuildingOpen(!buildingOpen)}>
                              <h4>Building Details</h4>
                              <div className="review-submit-icon">
                              {buildingOpen?
                                 <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleTop }} />:
                              <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} /> }
                              </div>
                           </Accordion.Toggle>
                        </div>
                        <Collapse in={buildingOpen}>
                           <div className="review-submit-box applicant">
                              <div className="plot-deatils-form">
                                 <h5>Building Information</h5>
                                 {buildingData.building_info?
                                 <Table responsive className="review-table">
                                    <tbody>
                                       <tr>
                                          <td>Usage of building</td>
                                          <td>{buildingData.building_info.purpose_of_building?buildingData.building_info.purpose_of_building:'---'}</td>
                                       </tr>
                                       <tr>
                                          <td>Building type</td>
                                          <td>{buildingData.building_info.building_category?buildingData.building_info.building_category:'---'}</td>
                                       </tr>
                                       <tr>
                                          <td>Building sub type</td>
                                          <td>{buildingData.building_info.building_subcategory?buildingData.building_info.building_subcategory:'---'}</td>
                                       </tr>
                                       <tr>
                                          <td>Number of floors</td>
                                          <td>{buildingData.building_info.proposed_no_of_floors?buildingData.building_info.proposed_no_of_floors:'---'}</td>
                                       </tr>
                                       <tr>
                                          <td>Type Of Roof</td>
                                          <td>{buildingData.building_info.roof_type?buildingData.building_info.roof_type:'---'}</td>
                                       </tr>
                                    </tbody>
                                 </Table>
                                 : <h3>Building Info Not found</h3> }
                              </div>
                              {plotData.application_type !== 'REG' && plotData.application_type !== 'SW' &&
                              <>
                              <div className="plot-deatils-form">
                                 <h5>Floor wise built-up area</h5>
                                 {buildingData.floor_wise_built_up_area && buildingData.floor_wise_built_up_area.data.length > 0?
                                 <Table responsive className="review-table">
                                    <tbody>
                                       {buildingData.floor_wise_built_up_area.data.map((builtup, i) => 
                                          <tr key={`builtup-area-${i}`} >
                                             <td>{builtup.floor_type}</td>
                                             <td>{builtup.area} {plotData.plot_area_type}</td>
                                             <td>{builtup.units} Units</td>
                                          </tr>
                                       )}
                                       <tr>
                                          <td>Total Builtup area</td>
                                          <td>{buildingData.floor_wise_built_up_area.total_built_up_area} {plotData.plot_area_type}</td>
                                       </tr>
                                       <tr>
                                          <td>No. Of Units</td>
                                          <td>{buildingData.floor_wise_built_up_area.units_number}</td>
                                       </tr>
                                    </tbody>
                                 </Table>
                                 : <h3>Builtup Area Not found</h3> }
                              </div>
                              {buildingData.abutting_road_front &&
                              <div className="plot-deatils-form">
                                 <h5>Abutting Road Details (front)</h5>
                                 <Table responsive className="review-table">
                                    <tbody>
                                       <tr>
                                          <td>Existing Road Width</td>
                                          <td>{buildingData.abutting_road_front.front_existing_road_width} Meters</td>
                                       </tr>
                                       <tr>
                                          <td>Proposed Road Width</td>
                                          <td>{buildingData.abutting_road_front.front_proposed_road_width} Meters</td>
                                       </tr>
                                       <tr>
                                          <td>Depth of Road affected</td>
                                          <td>{buildingData.abutting_road_front.front_depth_road_affected} Meters</td>
                                       </tr>
                                       <tr>
                                          <td>Road affected area</td>
                                          <td>{buildingData.abutting_road_front.front_road_affected_area} {plotData.plot_area_type}</td>
                                       </tr>
                                    </tbody>
                                 </Table> 
                              </div> }
                              {buildingData.abutting_road_side1 &&
                              <div className="plot-deatils-form">
                                 <h5>Abutting Road Details (Side 1)</h5>
                                    <Table responsive className="review-table">
                                       <tbody>
                                          <tr>
                                             <td>Existing Road Width</td> 
                                             <td>{buildingData.abutting_road_side1.side1_existing_road_width} Meters</td>
                                          </tr>
                                          <tr>
                                             <td>Proposed Road Width</td>
                                             <td>{buildingData.abutting_road_side1.side1_proposed_road_width} Meters</td>
                                          </tr>
                                          <tr>
                                             <td>Depth of Road affected</td>
                                             <td>{buildingData.abutting_road_side1.side1_depth_road_affected} Meters</td>
                                          </tr>
                                          <tr>
                                             <td>Road affected area</td>
                                             <td>{buildingData.abutting_road_side1.side1_road_affected_area} {plotData.plot_area_type}</td>
                                          </tr>
                                       </tbody>
                                    </Table> 
                              </div> }
                              {buildingData.abutting_road_side2 &&
                              <div className="plot-deatils-form">
                                 <h5>Abutting Road Details (Side 2)</h5>
                                    <Table responsive className="review-table">
                                       <tbody>
                                          <tr>
                                             <td>Existing Road Width</td>
                                             <td>{buildingData.abutting_road_side2.side2_existing_road_width} Meters</td>
                                          </tr>
                                          <tr>
                                             <td>Proposed Road Width</td>
                                             <td>{buildingData.abutting_road_side2.side2_proposed_road_width} Meters</td>
                                          </tr>
                                          <tr>
                                             <td>Depth of Road affected</td>
                                             <td>{buildingData.abutting_road_side2.side2_depth_road_affected} Meters</td>
                                          </tr>
                                          <tr>
                                             <td>Road affected area</td>
                                             <td>{buildingData.abutting_road_side2.side2_road_affected_area} {plotData.plot_area_type}</td>
                                          </tr>
                                       </tbody>
                                    </Table> 
                              </div> }
                              {buildingData.abutting_road_side3 &&
                              <div className="plot-deatils-form">
                                 <h5>Abutting Road Details (Side 3)</h5>
                                    <Table responsive className="review-table">
                                       <tbody>
                                          <tr>
                                             <td>Existing Road Width</td>
                                             <td>{buildingData.abutting_road_side3.side3_existing_road_width} Meters</td>
                                          </tr>
                                          <tr>
                                             <td>Proposed Road Width</td>
                                             <td>{buildingData.abutting_road_side3.side3_proposed_road_width} Meters</td>
                                          </tr>
                                          <tr>
                                             <td>Depth of Road affected</td>
                                             <td>{buildingData.abutting_road_side3.side3_depth_road_affected} Meters</td>
                                          </tr>
                                          <tr>
                                             <td>Road affected area</td>
                                             <td>{buildingData.abutting_road_side3.side3_road_affected_area} {plotData.plot_area_type}</td>
                                          </tr>
                                       </tbody>
                                    </Table>
                              </div> }
                              <div className="plot-deatils-form">
                                 <h5>Abutting Road Details (Total)</h5>
                                    <Table responsive className="review-table">
                                       <tbody>
                                          <tr>
                                             <td>Total Road Affected</td>
                                             <td>{buildingData.total_road_affected_area} {plotData.plot_area_type}</td>
                                          </tr>
                                          <tr>
                                             <td>Net Plot Area</td>
                                             <td>{buildingData.net_plot_area} {plotData.plot_area_type}</td>
                                          </tr>
                                       </tbody>
                                    </Table>
                              </div>
                              <div className="plot-deatils-form">
                                 <h5>Setback Details</h5>
                                 {buildingData.setback_details?
                                 <Table responsive className="review-table">
                                    <tbody>
                                       <tr>
                                          <td>Setback Front</td>
                                          <td>{buildingData.setback_details.front_setback} Meters</td>
                                       </tr>
                                       <tr>
                                          <td>Setback Sides</td>
                                          <td>{buildingData.setback_details.other_setback} Meters</td>
                                       </tr>
                                    </tbody>
                                 </Table>
                                 : <h3>Setback Details Not found</h3> }
                              </div>
                              <div className="plot-deatils-form">
                                 <h5>Mortagage</h5>
                                 {buildingData.mortgage?
                                 <Table responsive className="review-table">
                                    <tbody>
                                       <tr>
                                          <td>Mortagage Area</td>
                                          <td>{buildingData.mortgage.mortgage_area} Sq. Yards</td>
                                       </tr>
                                       <tr>
                                          <td>Number of floors</td>
                                          <td>{buildingData.mortgage.mortgage_floor}</td>
                                       </tr>
                                       <tr>
                                          <td>Mortgage Registration number </td>
                                          <td>{buildingData.mortgage.mortgage_reg_no? buildingData.mortgage.mortgage_reg_no : '---'}</td>
                                       </tr>
                                       <tr>
                                          <td>Mortgage Date</td>
                                          <td>{buildingData.mortgage.mortgage_date?buildingData.mortgage.mortgage_date: '---'}</td>
                                       </tr>
                                    </tbody>
                                 </Table>
                                 : <h3>Setback Details Not found</h3> }
                              </div>
                              </> }
                           </div>
                        </Collapse>
                     </Card>
                     {engineerData && engineerData.length > 0 &&
                     <Card className="details-form">
                        <div className="review-submit-title">
                           <Accordion.Toggle onClick={() => setSWOpen(!swOpen)}>
                              <h4>Single Window</h4>
                              <div className="review-submit-icon">
                              {swOpen?
                                 <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleTop }} />:
                              <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} /> }
                              </div>
                           </Accordion.Toggle>
                        </div>
                        <Collapse in={swOpen}>
                           <div className="review-submit-box applicant">
                              <div className="plot-deatils-form">
                                 {engineerData?
                                 <Table responsive className="review-table">
                                    {engineerData.map((eng, index) => 
                                    <>
                                       <h5><b>{eng.engineer_type?eng.engineer_type:'---'}</b></h5>
                                       <tbody>
                                          <tr>
                                             <td>Name</td>
                                             <td>{eng.name?eng.name:'---'}</td>
                                          </tr>
                                          <tr>
                                             <td>Mobile</td>
                                             <td>{eng.name?eng.name:'---'}</td>
                                          </tr>
                                          <tr>
                                             <td>Licence Number</td>
                                             <td>{eng.licence_number?eng.licence_number:'---'}</td>
                                          </tr>
                                          <tr>
                                             <td>Email</td>
                                             <td>{eng.email?eng.email:'---'}</td>
                                          </tr>
                                       </tbody>
                                    </>
                                    )}
                                    <h5><b>Auto DRC</b></h5>
                                       <tbody>
                                          <tr>
                                             <td>Bua With Parking Area</td>
                                             <td>{autoDcrData.bua_with_parking_area?autoDcrData.bua_with_parking_area:'---'}</td>
                                          </tr>
                                          <tr>
                                             <td>Bua Without Parking Area</td>
                                             <td>{autoDcrData.bua_without_parking_area?autoDcrData.bua_without_parking_area:'---'}</td>
                                          </tr>
                                          <tr>
                                             <td>Builtup Area</td>
                                             <td>{autoDcrData.built_up_area?autoDcrData.built_up_area:'---'}</td>
                                          </tr>
                                          <tr>
                                             <td>Message</td>
                                             <td>{autoDcrData.message?autoDcrData.message:'---'}</td>
                                          </tr>
                                          <tr>
                                             <td>Net Plot Area</td>
                                             <td>{autoDcrData.net_plot_area?autoDcrData.net_plot_area:'---'}</td>
                                          </tr>
                                          <tr>
                                             <td>No Of Blocks</td>
                                             <td>{autoDcrData.no_of_blocks?autoDcrData.no_of_blocks:'---'}</td>
                                          </tr>
                                          <tr>
                                             <td>No Of Floors</td>
                                             <td>{autoDcrData.no_of_floors?autoDcrData.no_of_floors:'---'}</td>
                                          </tr>
                                          <tr>
                                             <td>Plot Depth</td>
                                             <td>{autoDcrData.plot_depth?autoDcrData.plot_depth:'---'}</td>
                                          </tr>
                                          <tr>
                                             <td>Plot Width</td>
                                             <td>{autoDcrData.plot_width?autoDcrData.plot_width:'---'}</td>
                                          </tr>
                                          <tr>
                                             <td>Road Area</td>
                                             <td>{autoDcrData.road_area?autoDcrData.road_area:'---'}</td>
                                          </tr>
                                          <tr>
                                             <td>Status</td>
                                             <td>{autoDcrData.status?autoDcrData.status:'---'}</td>
                                          </tr>
                                    </tbody>
                                 </Table>
                                 : <h3>Single Window Not found</h3> }
                              </div>
                           </div>
                        </Collapse>
                     </Card> }
                     {selfDeclaration &&
                     <Card className="details-form">
                        <div className="review-submit-title">
                           <Accordion.Toggle eventKey="4">
                              <h4>Self Declaration</h4>
                           </Accordion.Toggle>
                        </div>
                        <Collapse in={selfOpen}>
                           <div className="review-submit-box applicant">
                           {selfDeclaration.length > 0 && selfDeclaration.map((self, index) => 
                              <div className="plot-address" key={`plot-address-${index}`}>
                                 <span className="property-radio">
                                 {index !== 0 &&
                                    <>
                                    <FormControl 
                                       id={`plotcheck${index}`} 
                                       name={`plotcheck${index}`} 
                                       checked={checkedValues.includes(index)}
                                       type="checkbox"
                                       className="custom-checkbox"
                                       onChange={() => handleCheck(index)}
                                    /> 
                                    <Form.Label htmlFor={`plotcheck${index}`} className="custom-control-label"></Form.Label>
                                    </>}
                                 </span> 
                                 <p dangerouslySetInnerHTML={{ __html: self }} />
                              </div>
                           )}
                           </div>
                        </Collapse>
                     </Card>
                     }
                  </Accordion>
               </div>
               <br />
               {/* <div className="personal-deatails-buttons">
                  <div className="back-btn" >
                     <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleLeft }} />
                     <span>{getTranslatedText('button.back')}</span>
                  </div> */}
                  <Button type="submit" onClick={() => handleSubmit()} disabled={isSubmitting}>
                     <span>{getTranslatedText('button.agree_continue')} </span>
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
               {/* </div> */}
         </div> }
      </div>
      {geoCoordinates.length > 0 &&
      <ViewMap
         show={modalShow}
         onHide={() => setModalShow(false)}
         coordinates={geoCoordinates}
      /> }
      </>
   )
}


export default ReviewSubmit;

import React, { useState, useContext } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { AngleBottom, UploadFile } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import QuestionsInput from '../../components/common/question-input'
import FileUpload from '../../components/common/file-upload'
import InputGroupPrepend from '../../components/common/input-group'

import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;

import { plotPlanData } from '../../constants/data/plotPlanData'
import ContextApi from '../../context'
import CustomTooltip from '../../components/CustomTooltip';

const TaxDetails = ({
    questions,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    customHandleChange
}) => {
    
  const [searchFour, setSearchFour] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [plan, setPlan] = useState({id:0, name: ''});
  const [caseType, setCaseType] = useState("NEW");
  const [unilizeTDR, setUnilizeTDR] = useState(false)
  const [slumArea, setSlumArea] = useState(false)
  const [slumOpen, setSlumOpen] = useState(false)
  const [slumLoading, setSlumLoading] = useState(false)
  const [slumData, setSlumData] = useState([])
  const [otherSlumOpen, setOtherSlumOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false);
  const ContextValue = useContext(ContextApi);
  
  const iconClickFour = () => {
    setSearchFour(!searchFour)
  }
  const iconClickSlum = () => {
    setSlumOpen(!slumOpen)
  }

  const handleQuestionAns = (id, value) => {
    const data = values.questionAnswers;
    var index = 0;
    data.some(function(question, i) {
        if (question.question_id === id) {
            index = i + 1;
            return true;
        }
    });
    
    if(index === 0){
      data.push({
        "question_id": id,
        "answer": value
      })
    }else{
      data[index - 1].answer = value 
    }

    customHandleChange('questionAnswers', data)
  }

  const handleGetSlums = () => {
    const authToken = localStorage.getItem('auth-token');
    if(authToken && values.locationId){
      setSlumLoading(true);
      axios.get(apiURL + apiConstants.SLUM_AREA.URL, {
        headers: { 'Authorization': 'Bearer ' + authToken },
        params: {
          location_id: values.locationId
        }
      })
      .then(function (response) {
        console.log(response);
        setSlumLoading(false);
        // Set results state
        if(response.data.data.slum_areas.length > 0)
          setSlumData(response.data.data.slum_areas);
        else
          setNoRecords('No Records found !!')
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  const handleOtherSlum = (value) => {
    if(value === 'Other')
      setOtherSlumOpen(true)
    else
      setOtherSlumOpen(false)
  }

  const handleCaseType = async (value) => {
    if(value === 'ADDITIONAL'){
      if(ContextValue.applicationType !== 'SW'){
        const confirm = await ContextValue.handleAlertForSW();
        if(confirm){
          setCaseType(value) 
          ContextValue.updateAppTypeToSW()
        }
      }else{
        setCaseType(value) 
      }
    }else{
      setCaseType(value) 
      ContextValue.updatePlotArea(ContextValue.plotArea)
    }
  }

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <ContextApi.Consumer>
      {value =>
      <>
        <div className="border-line-bottom">
            <span></span>
          </div>
          <h5 className="form-title">{getTranslatedText('heading.documents_tax_details')}</h5>
          
          <Form.Group>
            <CustomTooltip
              title={getTranslatedText('heading.documents_tax_details')}
              showTooltip={showTooltip}
              subTitle={'Select New for "New Building Permission", Additional for "Change in Already Approved Building Permission"'}
            />
            <Form.Label
              onMouseEnter={toggleTooltip}
              onMouseLeave={toggleTooltip}
            >{getTranslatedText('heading.case_type')}</Form.Label>
            <div className="property-radio building-box">
              <Form.Check
                type="radio"
                label="New"
                name="casetype"
                id="buildingcase"
                value="NEW"
                checked={caseType === "NEW"}
                onChange={(e) => handleCaseType(e.target.value)}
              />
              <Form.Check
                type="radio"
                label="Additional"
                name="casetype"
                id="buildingtype"
                value="ADDITIONAL"
                checked={caseType === "ADDITIONAL"}
                onChange={(e) => handleCaseType(e.target.value)}
              />
            </div>
          </Form.Group>
          
        <Form.Group>
          <Form.Label>Legal Proof of ownership (Sale Deed/Link Documents)</Form.Label>
          <FileUpload 
            Label="Legal Proof of ownership (Sale Deed/Link Documents)"
            ID={`legalProof`}
            Filename={`legalProof`}
            FileType={`legal_proof_of_ownership`}
            errors={errors}
            required
            touched={touched}
            handleBlur={handleBlur}
            customHandleChange={(name, value) => customHandleChange('legalProof', value)}
          />
        </Form.Group>
          
          {questions.length > 0 &&
            questions.map((item, index) => {
              if(item.application_type.includes(value.applicationType === 'SCMOR' ? 'SC' : value.applicationType)){
                  return (<QuestionsInput 
                    key={`questions-${index}`} 
                    item={item}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    customHandleChange={(id, ans) => handleQuestionAns(id, ans)}
                  /> )
              }
            })
          }

            <Form.Group>
                <Form.Label>Whether your plot falls under any of the notified slum areas ?</Form.Label>
                <div className="property-radio">
                    <Form.Check
                      type="radio"
                      label={getTranslatedText('label.yes_label')}
                      name={`slum-area`}
                      id={`slum-area`}
                      onChange={() => { setSlumArea(true), handleGetSlums()}}
                    />
                    <Form.Check
                      type="radio"
                      label={getTranslatedText('label.no_label')}
                      name={`slum-area`}
                      id={`slum-area`}
                      onChange={() => setSlumArea(false)}
                    /> 
                </div> 
              </Form.Group>

        {slumArea && 
        <Form.Group controlId="ControlSelect1">
          <Form.Label>Slum Area</Form.Label>
          <div className={`selected-box ${slumOpen ? 'open' : ''}`}>
              <div className="village-box">
              <Form.Control as="select"
                  name={`slumID`}
                  onChange={(e) => {handleChange(e), handleOtherSlum(e.target.value)}}
                  handleBlur={handleBlur}
              >
                  <option>{slumLoading ? 'Loading...' : 'Select Type'}</option>
                  {slumData.length > 0 && slumData.map((item, index) => 
                      <option key={`slum-data-${index}`} value={item.id} >{item.slum_name}</option>
                  )}
                  <option value="Other" >Other</option>
              </Form.Control>
                {errors.slumName && touched.slumName && <p>{errors.villageName}</p>}
                <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
              </div>
          </div>
        </Form.Group> }
        {otherSlumOpen &&
        <Form.Group>
          <Form.Label>Others</Form.Label>
          <Form.Control 
              type="text" 
              name="slumOther"
              placeholder="Enter Slum"
              className={errors.slumOther && touched.slumOther && 'has-error'}
              onChange={handleChange} 
              onBlur={handleBlur}
              value={values && values.slumOther}
          />
          {errors.slumOther && touched.slumOther && <p>{errors.slumOther}</p>}
        </Form.Group> }
          
          {/* <Form.Group>
              <Form.Label>Do you wish to utilize TDR ?</Form.Label>
              <div className="property-radio">
                  <Form.Check
                  type="radio"
                  label={getTranslatedText('label.yes_label')}
                  name={`unilize-tdr`}
                  id={`unilize-tdr`}
                  onChange={() => setUnilizeTDR(true)}
                  />
                  <Form.Check
                  type="radio"
                  label={getTranslatedText('label.no_label')}
                  name={`unilize-tdr`}
                  id={`unilize-tdr`}
                  onChange={() => setUnilizeTDR(false)}
                  /> 
              </div> 
            </Form.Group> */}

          {unilizeTDR &&
          <>
            <Form.Group>
              <Form.Label>TDR Certificate ID</Form.Label>
              <Form.Control 
                  type="text" 
                  name="tdrCertID"
                  placeholder="Enter TDR Certificate ID"
                  className={errors.tdrCertID && touched.tdrCertID && 'has-error'}
                  onChange={handleChange} 
                  onBlur={handleBlur}
                  value={values && values.tdrCertID}
              />
              {errors.tdrCertID && touched.tdrCertID && <p>{errors.tdrCertID}</p>}
            </Form.Group>

            <InputGroupPrepend
                InputGroupName="in sq. yards"
                Input="tdrArea"
                Label="label.tdr_area"
                ConvertYards={true}
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                customHandleChange={customHandleChange}
            />

            <Form.Group>
              <Form.Label>Authentication Code</Form.Label>
              <Form.Control 
                  type="text" 
                  name="tdrAuthCode"
                  placeholder="Enter Authentication Code"
                  className={errors.tdrAuthCode && touched.tdrAuthCode && 'has-error'}
                  onChange={handleChange} 
                  onBlur={handleBlur}
                  value={values && values.tdrAuthCode}
              />
              {errors.tdrAuthCode && touched.tdrAuthCode && <p>{errors.tdrAuthCode}</p>}
            </Form.Group>
            <Form.Group className="verify-button">
              <Button  > 
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
          </> }
    </>
    }
    </ContextApi.Consumer>
  )
}


export default TaxDetails;
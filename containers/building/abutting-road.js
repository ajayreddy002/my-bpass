import React, { useState, useContext } from 'react';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import { AngleRight } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import InputGroupPrepend from '../../components/common/input-group'
import ContextApi from '../../context'

import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;

const AbuttingRoad = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    customHandleChange
}) => {

  const [exSideOne, setExSideOne] = useState(false)
  const [exSideTwo, setExSideTwo] = useState(false)
  const [exSideThree, setExSideThree] = useState(false)
  const [sideOne, setSideOne] = useState(false)
  const [sideTwo, setSideTwo] = useState(false)
  const [sideThree, setSideThree] = useState(false)
  const ContextValue = useContext(ContextApi);

  const [totalRoadAffectedArea, setTotalRoadAffectedArea] = useState(0)


  const getSetBackValues = (prRoadWidth) => {
    
      const authToken = localStorage.getItem('auth-token');
      const applicationID = localStorage.getItem('application-id');
      
    if(authToken){
      const data = {
        "proposed_floor_id": values.proposedFloorId,
        "application_id": applicationID,
        "front_proposed_road_width": prRoadWidth
      }
      axios.post(apiURL + apiConstants.GET_SETBACKS.URL, data, {
        headers: { 'Authorization': 'Bearer ' + authToken }
      })
      .then(function (response) {
        console.log('response aaaaaa', response);
        if(response.data.success){
          customHandleChange('frontSetback', response.data.data.front_setback)
          customHandleChange('otherSetback', response.data.data.other_setback)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  const handleDepthRoad = (prRoadWidth, exRoadWidth) => {
    if(prRoadWidth > 0){
      if(((parseInt(prRoadWidth) - parseInt(exRoadWidth))/2) > 0){
        return (parseInt(prRoadWidth) - parseInt(exRoadWidth))/2
      }else{
        return 0
      }
    }else{
      return 0
    }
  }

  const TotalAffectedNetPlot = () => {
    const TotalAffected = parseInt(values.affectedArea) + parseInt(values.side1affectedArea) + parseInt(values.side2affectedArea) + parseInt(values.side3affectedArea);
    const TotalAffectedRoad = TotalAffected < 0 ? 0 : TotalAffected
    customHandleChange('affectedTotal', parseInt(TotalAffectedRoad));

    const netPlot = ContextValue.plotAreaAsDoc - TotalAffectedRoad
    const netPlotArea = netPlot > 0 ? netPlot : 0
    customHandleChange('netPlotArea', netPlotArea);
  }

  return (
    <ContextApi.Consumer>
      {value =>
    <>
      <div className="border-line-bottom"><span></span></div>
      {value.bpCaseType === "ADDITIONAL" && 
      <>
      <h5 className="form-title">Existing {getTranslatedText('title.abutting')}(front)</h5>
        <InputGroupPrepend
            InputGroupName="Meters"
            Input="exist_exRoadWidth"
            Label="label.existing_road_width"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
        />
        <InputGroupPrepend
            InputGroupName="Meters"
            Input="exist_prRoadWidth"
            Label="label.proposed_road"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
        />
        <InputGroupPrepend
            InputGroupName="Meters"
            Input="exist_affectedRoad"
            Label="label.affected_road"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
        />
        <InputGroupPrepend
            InputGroupName="Meters"
            Input="exist_affectedArea"
            Label="label.affected_area"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
        />
      {!exSideOne && <>
        <div className="Abutting-side-block">
          <h5 className="form-title">{getTranslatedText('title.abutting_road_details')}(Side 1)</h5>
          <Button onClick={() => setExSideOne(true)}>
            <span>{getTranslatedText('button.add')}</span>
            <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleRight }} />
          </Button>
        </div>
        <span className="Abutting-dec">Click on (+) button to add new side if applicable</span>
      </>}

      {exSideOne &&
      <>
        <h5 className="form-title">Existing {getTranslatedText('title.abutting')} (side 1)</h5>
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="exist_side1exRoadWidth"
              Label="label.existing_road_width"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="exist_side1prRoadWidth"
              Label="label.proposed_road"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="exist_side1affectedRoad"
              Label="label.affected_road"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="exist_side1affectedArea"
              Label="label.affected_area"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />

        <div className="Abutting-side-block">
          <h5 className="form-title">{getTranslatedText('title.abutting_road_details')} (Side 2)</h5>
          <Button onClick={() => setExSideTwo(true)}>
            <span>{getTranslatedText('button.add')}</span>
            <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleRight }} />
          </Button>
        </div>
        <span className="Abutting-dec">Click on (+) button to add new side if applicable</span>
      </>
      }

    {exSideTwo &&
      <>
        <h5 className="form-title">Existing {getTranslatedText('title.abutting')} (side 2)</h5>
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="exist_side2exRoadWidth"
              Label="label.existing_road_width"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="exist_side2prRoadWidth"
              Label="label.proposed_road"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="exist_side2affectedRoad"
              Label="label.affected_road"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="exist_side2affectedArea"
              Label="label.affected_area"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />

        <div className="Abutting-side-block">
          <h5 className="form-title">{getTranslatedText('title.abutting_road_details')} (Side 3)</h5>
          <Button onClick={() => setExSideThree(true)}>
            <span>{getTranslatedText('button.add')}</span>
            <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleRight }} />
          </Button>
        </div>
        <span className="Abutting-dec">Click on (+) button to add new side if applicable</span>
      </>
      }
    
    {exSideThree &&
      <>
        <h5 className="form-title">Existing {getTranslatedText('title.abutting')} (side 3)</h5>
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="exist_side3exRoadWidth"
              Label="label.existing_road_width"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="exist_side3prRoadWidth"
              Label="label.proposed_road"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="exist_side3affectedRoad"
              Label="label.affected_road"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="exist_side3affectedArea"
              Label="label.affected_area"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
      </>
      }
        <InputGroupPrepend
            InputGroupName="Meters"
            Input="exist_affectedTotal"
            Label="label.affected_total"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
        />
        <InputGroupPrepend
            InputGroupName="Meters"
            Input="exist_netPlotArea"
            Label="label.net_plot_area"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
        />
      </>
    }
    
      <h5 className="form-title"> {getTranslatedText('title.abutting')}</h5>
      <InputGroupPrepend
            InputGroupName="Meters"
            Input="exRoadWidth"
            InputType={'number'}
            Label="label.existing_road_width"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
        />
        <InputGroupPrepend
            InputGroupName="Meters"
            Input="prRoadWidth"
            InputType={'number'}
            Label="label.proposed_road"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={(e) => { handleBlur(e), getSetBackValues(e.target.value)}}
            customHandleChange={customHandleChange}
        />
        <Form.Group className="document-box">
            <Form.Label htmlFor="inlineFormInputGroupUsername2">{getTranslatedText('label.affected_road')}</Form.Label>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text >Meters</InputGroup.Text>
                </InputGroup.Prepend>
                <div className="west-input">
                    <FormControl 
                        type="text" 
                        name="affectedRoad"
                        readOnly
                        value={ handleDepthRoad(values.prRoadWidth, values.exRoadWidth)} 
                    />
                </div>
            </InputGroup>
        </Form.Group>
        <InputGroupPrepend
            InputGroupName={ContextValue.plotAreaType}
            Input="affectedArea"
            InputType={'number'}
            Label="label.affected_area"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={(e) => { handleBlur(e), TotalAffectedNetPlot()}}
            customHandleChange={customHandleChange}
        />

      {values.southRoadWidth > 0 &&
      <>
        <h5 className="form-title">{getTranslatedText('title.abutting')} (Rear)</h5>
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="side1exRoadWidth"
            InputType={'number'}
              Label="label.existing_road_width"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="side1prRoadWidth"
            InputType={'number'}
              Label="label.proposed_road"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
          <Form.Group className="document-box">
              <Form.Label htmlFor="inlineFormInputGroupUsername2">{getTranslatedText('label.affected_road')}</Form.Label>
              <InputGroup>
                  <InputGroup.Prepend>
                      <InputGroup.Text >Meters</InputGroup.Text>
                  </InputGroup.Prepend>
                  <div className="west-input">
                      <FormControl 
                          type="text" 
                          name="side1affectedRoad"
                          readOnly
                          value={ handleDepthRoad(values.side1prRoadWidth, values.side1exRoadWidth)} 
                      />
                  </div>
              </InputGroup>
          </Form.Group>
          <InputGroupPrepend
              InputGroupName={ContextValue.plotAreaType}
              Input="side1affectedArea"
            InputType={'number'}
              Label="label.affected_area"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={(e) => { handleBlur(e), TotalAffectedNetPlot()}}
              customHandleChange={customHandleChange}
          />
      </>
      }

      {values.eastRoadWidth > 0 &&
      <>
        <h5 className="form-title"> {getTranslatedText('title.abutting')} (Side 1)</h5>
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="side2exRoadWidth"
            InputType={'number'}
              Label="label.existing_road_width"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="side2prRoadWidth"
            InputType={'number'}
              Label="label.proposed_road"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
          <Form.Group className="document-box">
              <Form.Label htmlFor="inlineFormInputGroupUsername2">{getTranslatedText('label.affected_road')}</Form.Label>
              <InputGroup>
                  <InputGroup.Prepend>
                      <InputGroup.Text >Meters</InputGroup.Text>
                  </InputGroup.Prepend>
                  <div className="west-input">
                      <FormControl 
                          type="text" 
                          name="side2affectedRoad"
                          readOnly
                          value={ handleDepthRoad(values.side2prRoadWidth, values.side2exRoadWidth)} 
                      />
                  </div>
              </InputGroup>
          </Form.Group>
          <InputGroupPrepend
              InputGroupName={ContextValue.plotAreaType}
              Input="side2affectedArea"
              InputType={'number'}
              Label="label.affected_area"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={(e) => { handleBlur(e), TotalAffectedNetPlot()}}
              customHandleChange={customHandleChange}
          />
      </>
      }
    
    {values.westRoadWidth > 0 &&
      <>
        <h5 className="form-title"> {getTranslatedText('title.abutting')} (Side 2)</h5>
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="side3exRoadWidth"
            InputType={'number'}
              Label="label.existing_road_width"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
              InputGroupName="Meters"
              Input="side3prRoadWidth"
            InputType={'number'}
              Label="label.proposed_road"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
          />
          <Form.Group className="document-box">
              <Form.Label htmlFor="inlineFormInputGroupUsername2">{getTranslatedText('label.affected_road')}</Form.Label>
              <InputGroup>
                  <InputGroup.Prepend>
                      <InputGroup.Text >Meters</InputGroup.Text>
                  </InputGroup.Prepend>
                  <div className="west-input">
                      <FormControl 
                          type="text" 
                          name="side3affectedRoad"
                          readOnly
                          value={ handleDepthRoad(values.side3prRoadWidth, values.side3exRoadWidth)} 
                      />
                  </div>
              </InputGroup>
          </Form.Group>
          <InputGroupPrepend
              InputGroupName={ContextValue.plotAreaType}
              Input="side3affectedArea"
            InputType={'number'}
              Label="label.affected_area"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={(e) => { handleBlur(e), TotalAffectedNetPlot()}}
              customHandleChange={customHandleChange}
          />
      </>
      }
      
        <InputGroupPrepend
            InputGroupName={ContextValue.plotAreaType}
            Input="affectedTotal"
            InputType={'number'}
            Label="label.affected_total"
            readOnly={true}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
              InputGroupName={ContextValue.plotAreaType}
              Input="netPlotArea"
              Label="label.net_plot_area"
              readOnly={true}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
            />
    </>
  }
  </ContextApi.Consumer>
  )
}


export default AbuttingRoad;

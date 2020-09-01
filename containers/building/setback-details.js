import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Form, Button, Col, InputGroup, FormControl } from 'react-bootstrap';
import { AngleRight, AngleBottom, MapIcon, AngleLeft, UploadFile } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import InputGroupPrepend from '../../components/common/input-group'

import ContextApi from '../../context'

const SetBackDetails = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    customHandleChange
}) => {

  return (
    <ContextApi.Consumer>
      {value =>
        <>
        <div className="border-line-bottom"><span></span></div>
        {value.bpCaseType === "ADDITIONAL" && 
        <>
          <h5 className="form-title">Existing {getTranslatedText('heading.setback_details')}</h5>
          <InputGroupPrepend
            InputGroupName="Feets"
            Input="exFrontSetback"
            Label="label.front_setback"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
            InputGroupName="Feets"
            Input="exSideSetback"
            Label="label.other_setback"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
          />
        </> }
        <h5 className="form-title"> {getTranslatedText('heading.setback_details')}</h5>
          <InputGroupPrepend
            InputGroupName="Meters"
            Input="frontSetback"
            Label="label.front_setback"
            values={values}
            readOnly={true}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
            InputGroupName="Meters"
            Input="otherSetback"
            Label="label.other_setback"
            values={values}
            readOnly={true}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
          />
          <h5 className="form-title"> Proposed Setbacks (Optional)</h5>
          <InputGroupPrepend
            InputGroupName="Meters"
            Input="frontSetbackManual"
            Label="label.front_setback"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
            InputGroupName="Meters"
            Input="rearSetback"
            Label="label.rear_setback"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
            InputGroupName="Meters"
            Input="sideOneSetback"
            Label="label.side_one_setback"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            customHandleChange={customHandleChange}
          />
          <InputGroupPrepend
            InputGroupName="Meters"
            Input="sideTwoSetback"
            Label="label.side_two_setback"
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


export default SetBackDetails;
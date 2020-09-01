import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Form, Button, Spinner, FormControl } from 'react-bootstrap';
import { AngleRight, AngleLeft, UploadFile } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;

import InputGroupUnits from '../../components/common/input-group-units'
import ContextApi from '../../context'

const SignInSchema = Yup.object().shape({
    plotNo: Yup.string(),
})

const FireSection = ({
  currentStep,
  changeStep
}) => {

    const formik = useFormik({
        initialValues:{ 
          plotType: 'Plot_no',
        },
        validationSchema:SignInSchema,
        onSubmit:async (values, {setSubmitting}) => {
            changeStep(2)
            console.log('submit')
        }
    });

    const customHandleChange = (name, value) => {
    formik.setFieldValue(name, value);
    }

  return (
    <ContextApi.Consumer>
      {value =>
      <>
        <div className={`vicinity-information personal-details-from ${currentStep === 1 ? `` : `hide-form`}`}>
            <div className="main-title">
                <h3>Fire Department</h3>
            </div>
            <Form className="login-form-type" onSubmit={formik.handleSubmit} autoComplete="off">
                <InputGroupUnits
                  InputGroupName={'In Meters'}
                  Input="prBuiltup"
                  Units="prBuiltupUnits"
                  Label="label.width_of_entry_gate"
                  showUnits={false}
                  readOnly={false}
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                />
                <InputGroupUnits
                  InputGroupName={'In Meters'}
                  Input="prBuiltup"
                  Units="prBuiltupUnits"
                  Label="label.width_of_exit_gate"
                  showUnits={false}
                  readOnly={false}
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                />
                <InputGroupUnits
                  InputGroupName={'In Meters'}
                  Input="prBuiltup"
                  Units="prBuiltupUnits"
                  Label="label.head_clearance"
                  showUnits={false}
                  readOnly={false}
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                />
                <InputGroupUnits
                  InputGroupName={'In Meters'}
                  Input="prBuiltup"
                  Units="prBuiltupUnits"
                  Label="label.head_exit"
                  showUnits={false}
                  readOnly={false}
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                />
                <InputGroupUnits
                  InputGroupName={'In Meters'}
                  Input="prBuiltup"
                  Units="prBuiltupUnits"
                  Label="label.corridor"
                  showUnits={false}
                  readOnly={false}
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                />
                <InputGroupUnits
                  InputGroupName={'In Meters'}
                  Input="prBuiltup"
                  Units="prBuiltupUnits"
                  Label="label.farthest"
                  showUnits={false}
                  readOnly={false}
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                />
                <InputGroupUnits
                  InputGroupName={'In Meters'}
                  Input="prBuiltup"
                  Units="prBuiltupUnits"
                  Label="label.transformer_safety"
                  showUnits={false}
                  readOnly={false}
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                />
                <InputGroupUnits
                  InputGroupName={'In Meters'}
                  Input="prBuiltup"
                  Units="prBuiltupUnits"
                  Label="label.no_of_fire_lifts"
                  showUnits={false}
                  readOnly={false}
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                />
                <InputGroupUnits
                  InputGroupName={'In Meters'}
                  Input="prBuiltup"
                  Units="prBuiltupUnits"
                  Label="label.car_parking"
                  showUnits={false}
                  readOnly={false}
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                />
                <InputGroupUnits
                  InputGroupName={'In Meters'}
                  Input="prBuiltup"
                  Units="prBuiltupUnits"
                  Label="label.ramps_provides"
                  showUnits={false}
                  readOnly={false}
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                />
                <InputGroupUnits
                  InputGroupName={'In Meters'}
                  Input="prBuiltup"
                  Units="prBuiltupUnits"
                  Label="label.generator_capacity"
                  showUnits={false}
                  readOnly={false}
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                />
                <InputGroupUnits
                  InputGroupName={'In Meters'}
                  Input="prBuiltup"
                  Units="prBuiltupUnits"
                  Label="label.air_conditioning_safety"
                  showUnits={false}
                  readOnly={false}
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                />
            
                <Button type="submit" disabled={formik.isSubmitting || value.disablePlotSubmit}>
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
            </Form>
        </div>
      </>
    }
    </ContextApi.Consumer>
  )
}


export default FireSection;
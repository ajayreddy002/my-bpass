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

const AirSection = ({
  currentStep,
  changeStep
}) => {

    const formik = useFormik({
        initialValues:{ 
          plotType: 'Plot_no',
        },
        validationSchema:SignInSchema,
        onSubmit:async (values, {setSubmitting}) => {
            changeStep(3)
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
        <div className={`vicinity-information personal-details-from ${currentStep === 2 ? `` : `hide-form`}`}>
            <div className="main-title">
                <h3>Airport Section</h3>
            </div>
            <Form className="login-form-type" onSubmit={formik.handleSubmit} autoComplete="off">
                <InputGroupUnits
                  InputGroupName={'In Meters'}
                  Input="prBuiltup"
                  Units="prBuiltupUnits"
                  Label="label.site_elevation"
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
                  Label="label.building_height"
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


export default AirSection;
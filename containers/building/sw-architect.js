import React from 'react';
import { Form } from 'react-bootstrap';
import { getTranslatedText } from '../../utils/translationUtils';

const SWArchitect = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur
}) => {

  return (
    <>
        <h5 className="form-title">{getTranslatedText('heading.architect_details')}</h5>
        <Form.Group>
          <Form.Label>{getTranslatedText('label.architect_name')}</Form.Label>
          <Form.Control 
            type="text" 
            name="architectName"
            placeholder="Name"
            className={errors.architectName && touched.architectName && 'has-error'}
            value={values.architectName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.architectName && touched.architectName && <p>{errors.architectName}</p>}
        </Form.Group>
        <Form.Group>
          <Form.Label>{getTranslatedText('label.architect_license_number')}</Form.Label>
          <Form.Control 
            type="Number" 
            placeholder="Number"
            name="architectLicenseNo"
            className={errors.architectLicenseNo && touched.architectLicenseNo && 'has-error'}
            value={values.architectLicenseNo}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.architectLicenseNo && touched.architectLicenseNo && <p>{errors.architectLicenseNo}</p>}
        </Form.Group>
        <Form.Group controlId="phonenumber">
          <Form.Label>{getTranslatedText('label.mobile_number')}</Form.Label>
          <div className="mobile-number-block">
            <span>+91</span>
            <Form.Control
              type="number"
              name="mobile"
              maxLength={10}
              name="architectMobileNo"
              className={errors.architectMobileNo && touched.architectMobileNo && 'has-error'}
              value={values.architectMobileNo}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {errors.architectMobileNo && touched.architectMobileNo && <p>{errors.architectMobileNo}</p>}
        </Form.Group>
        <Form.Group>
          <Form.Label>{getTranslatedText('label.builder_email')} <span> (optional) </span></Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Your email id"
            name="architectEmail"
            className={errors.architectEmail && touched.architectEmail && 'has-error'}
            value={values.architectEmail}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.architectEmail && touched.architectEmail && <p>{errors.architectEmail}</p>}
        </Form.Group>
    </>
  )
}


export default SWArchitect;
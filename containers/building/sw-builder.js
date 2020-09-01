import React from 'react';
import { Form } from 'react-bootstrap';
import { getTranslatedText } from '../../utils/translationUtils';

const SWBuilder = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur
}) => {

  return (
    <>
        <div className="border-line-bottom"><span></span></div>
        <h5 className="form-title">{getTranslatedText('heading.builder_details')}</h5>
        <Form.Group>
          <Form.Label>{getTranslatedText('label.builder_name')}</Form.Label>
          <Form.Control 
            type="text"
            name="builderName"
            placeholder="Name"
            className={errors.builderName && touched.builderName && 'has-error'}
            value={values.builderName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.builderName && touched.builderName && <p>{errors.builderName}</p>}
        </Form.Group>
        <Form.Group>
          <Form.Label>{getTranslatedText('label.builder_license_number')}</Form.Label>
          <Form.Control 
            type="Number" 
            placeholder="Number"
            name="builderLicenseNo"
            className={errors.builderLicenseNo && touched.builderLicenseNo && 'has-error'}
            value={values.builderLicenseNo}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.builderLicenseNo && touched.builderLicenseNo && <p>{errors.builderLicenseNo}</p>}
        </Form.Group>
        <Form.Group controlId="phonenumber">
          <Form.Label>{getTranslatedText('label.builder_mobile_number')}</Form.Label>
          <div className="mobile-number-block">
            <span>+91</span>
            <Form.Control
              type="number"
              name="mobile"
              maxLength={10}
              name="builderMobileNo"
              className={errors.builderMobileNo && touched.builderMobileNo && 'has-error'}
              value={values.builderMobileNo}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {errors.builderMobileNo && touched.builderMobileNo && <p>{errors.builderMobileNo}</p>}
        </Form.Group>
        <Form.Group>
          <Form.Label>{getTranslatedText('label.builder_email_id')} <span> (optional) </span></Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Your email id"
            name="builderEmail"
            className={errors.builderEmail && touched.builderEmail && 'has-error'}
            value={values.builderEmail}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.builderEmail && touched.builderEmail && <p>{errors.builderEmail}</p>}
        </Form.Group>
    </>
  )
}


export default SWBuilder;
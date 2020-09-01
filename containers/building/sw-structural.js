import React from 'react';
import { Form} from 'react-bootstrap';
import { getTranslatedText } from '../../utils/translationUtils';

const SWStructural = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur
}) => {

  return (
    <>
        <div className="border-line-bottom"><span></span></div>
        <h5 className="form-title">{getTranslatedText('title.structural_details')}</h5>
        <Form.Group>
          <Form.Label>{getTranslatedText('label.structural_name')}</Form.Label>
          <Form.Control 
            type="text"
            name="structuralName"
            placeholder="Name"
            className={errors.structuralName && touched.structuralName && 'has-error'}
            value={values.structuralName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.structuralName && touched.structuralName && <p>{errors.structuralName}</p>}
        </Form.Group>
        <Form.Group>
          <Form.Label>{getTranslatedText('label.structural_license_number')}</Form.Label>
          <Form.Control 
            type="Number" 
            placeholder="Number"
            name="structuralLicenseNo"
            className={errors.structuralLicenseNo && touched.structuralLicenseNo && 'has-error'}
            value={values.structuralLicenseNo}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.structuralLicenseNo && touched.structuralLicenseNo && <p>{errors.structuralLicenseNo}</p>}
        </Form.Group>
        <Form.Group controlId="phonenumber">
          <Form.Label>{getTranslatedText('label.structural_mobile_number')}</Form.Label>
          <div className="mobile-number-block">
            <span>+91</span>
            <Form.Control
              type="number"
              name="mobile"
              maxLength={10}
              name="structuralMobileNo"
              className={errors.structuralMobileNo && touched.structuralMobileNo && 'has-error'}
              value={values.structuralMobileNo}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {errors.structuralMobileNo && touched.structuralMobileNo && <p>{errors.structuralMobileNo}</p>}
        </Form.Group>
        <Form.Group>
          <Form.Label>{getTranslatedText('label.structural_email_address')} <span> (optional) </span></Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Your email id"
            name="structuralEmail"
            className={errors.structuralEmail && touched.structuralEmail && 'has-error'}
            value={values.structuralEmail}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.structuralEmail && touched.structuralEmail && <p>{errors.structuralEmail}</p>}
        </Form.Group>
    </>
  )
}


export default SWStructural;
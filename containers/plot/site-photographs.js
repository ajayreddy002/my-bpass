import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { getTranslatedText } from '../../utils/translationUtils';
import FileUpload from '../../components/common/file-upload'

const SitePhotoGraphs = ({
    errors,
    touched,
    handleBlur,
    customHandleChange
}) => {

  return (
        <>
            <div className="border-line-bottom">
                <span></span>
            </div>
            <h5 className="form-title">{getTranslatedText('heading.site-photographs')}</h5>
            <Form.Group>
                <Form.Label>{getTranslatedText('label.front')}</Form.Label>
                <FileUpload 
                    Label="Upload Front Photo"
                    ID="Uploadfile1"
                    Filename="frontPhoto"
                    FileType="front_photo"
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    customHandleChange={customHandleChange}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>{getTranslatedText('label.back')}</Form.Label>
                <FileUpload 
                    Label="Upload Back Photo"
                    ID="Uploadfile2"
                    Filename="backPhoto"
                    FileType="back_photo"
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    customHandleChange={customHandleChange}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>{getTranslatedText('label.side')} 1</Form.Label>
                <FileUpload 
                    Label="Upload Side 1 Photo"
                    ID="Uploadfile3"
                    Filename="sidePhoto"
                    FileType="side_photo"
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    customHandleChange={customHandleChange}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>{getTranslatedText('label.side')} 2</Form.Label>
                <FileUpload 
                    Label="Upload Side 2 Photo"
                    ID="Uploadfile4"
                    Filename="sideTwoPhoto"
                    FileType="sidetwo_photo"
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    customHandleChange={customHandleChange}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>{getTranslatedText('label.additional')} (Optional)</Form.Label>
                <FileUpload 
                    Label="Upload Additional Photo"
                    ID="Uploadfile5"
                    Filename="additionalPhoto"
                    FileType="additional_photo"
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    customHandleChange={customHandleChange}
                />
            </Form.Group>
        </>
    )
}


export default SitePhotoGraphs;
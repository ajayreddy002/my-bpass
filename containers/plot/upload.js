import React, { useState, useEffect } from 'react';
import { Form,} from 'react-bootstrap';
import { getTranslatedText } from '../../utils/translationUtils';
import FileUpload from '../../components/common/file-upload'

const Upload = ({
}) => {

  return (
        <>
            <h5 className="">{getTranslatedText('heading.upload_documents')}</h5>
            <Form.Group>
                <Form.Label>{getTranslatedText('label.legal_document')}</Form.Label>
                <FileUpload 
                    Label="UPLOAD DOCUMENT"
                    ID="Uploadfile1"
                    Filename="legal_document"
                    FileType="legal_document"
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>{getTranslatedText('label.encumbrance')}</Form.Label>
                <FileUpload 
                    Label="UPLOAD DOCUMENT"
                    ID="Uploadfile2"
                    Filename="encumbrance"
                    FileType="encumbrance"
                />
            </Form.Group>
        </>
    )
}


export default Upload;
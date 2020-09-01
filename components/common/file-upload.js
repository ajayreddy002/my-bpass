import React, { useState, useEffect, useContext } from 'react';
import {Form, ProgressBar } from 'react-bootstrap';
import {parseString} from 'xml2js'
import { UploadFile, FileIcon, CloseIcon } from '../../utils/icons'

import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
import ContextApi from '../../context'

const apiURL = require('../../config/url-front').API_SERVER;

const FileUpload = ({
    Label,
    ID,
    Filename,
    FileType,
    errors,
    touched,
    handleBlur,
    customHandleChange
}) => {
    const [uploadPercentage, setUploadPercentage] = useState(0)
    const [files, setFiles] = useState(false)
    const [awsUrl, setAwsUrl] = useState("")
    const [urlFields, setUrlFields] = useState(false)
    const [filePath, setFilePath] = useState("")
    const ContextValue = useContext(ContextApi);
    
    const handleFileUpload = async (event) => {
        // setIsLoading(true)
        ContextValue.updateDisableFileUpload(true)
        setUploadPercentage(25);
        setFiles(event.target.files[0]);
        const extension = event.target.files[0].name.split('.').pop();
        const authToken = localStorage.getItem('auth-token');
        
        axios.get(apiURL + apiConstants.FILE_UPLOAD.URL, {
            headers: {
                Authorization: 'Bearer ' + authToken
            },
            params: {
                content_type: extension
            }
        })
        .then((response) => {
            // console.log(response);
            setAwsUrl(response.data.url)
            setUrlFields(response.data.url_fields);
            setUploadPercentage(40);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const handleMedia = (filePath) => {
        setUploadPercentage(85);
        const authToken = localStorage.getItem('auth-token');
        const applicationId = localStorage.getItem('application-id');

        const data = {
            "application_id": applicationId,
            "s3_file_path": filePath,
            "category": FileType
        }

        const config = {
            headers: {
                Authorization: 'Bearer ' + authToken,
                'Accept' : '*/*'
            }
        }
        axios.post(apiURL + apiConstants.MEDIA.URL, data, config)
        .then((response) => {
            // console.log('response-media', response);
            setUploadPercentage(95);
            setUrlFields(false);
            customHandleChange(Filename, response.data.data.media.id);
            setFilePath(response.data.data.media.file_url)
            setTimeout(() => {
                setUploadPercentage(100);
                ContextValue.updateDisableFileUpload(false)
            }, 1000)
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    // console.log('fsdfsdfsd', isLoading)
    useEffect(() => {
        if(urlFields){
            setUploadPercentage(60);
            // Create an object of formData 
            const formData = new FormData(); 
            
            // Update the formData object 
            formData.append("key", urlFields['key'] ); 
            formData.append("success_action_status", urlFields['success_action_status'] ); 
            formData.append("Content-Type", urlFields['Content-Type'] ); 
            formData.append("Content-Disposition", urlFields['Content-Disposition'] ); 
            formData.append("policy", urlFields['policy']); 
            formData.append("x-amz-credential", urlFields['x-amz-credential'] ); 
            formData.append("x-amz-algorithm", urlFields['x-amz-algorithm'] ); 
            formData.append("x-amz-date", urlFields['x-amz-date'] ); 
            formData.append("x-amz-signature", urlFields['x-amz-signature'] ); 
            formData.append("file", files ); 

            const config = {
                headers: {
                    'Accept' : '*/*'
                }
            }
            try {
                axios.post(awsUrl, formData, config)
                .then(function (response) {
                    parseString(response.data, function (err, result) {
                        handleMedia(result.PostResponse.Key[0])
                        setUploadPercentage(80);
                    });
                });
            
            } catch (ex){
                console.log(ex);
            }
        }
    }, [urlFields]);
    
    const handleCloseUploading = () => {
        ContextValue.updateDisableFileUpload(false)
        setUploadPercentage(0);
        setUrlFields(false);
        setFilePath(false);
        setFiles(false);
        setAwsUrl("");
    }
    
    return(
        <ContextApi.Consumer>
          {value =>
            <>
                { uploadPercentage > 0 && files ?
                <Form.Group>
                    <div className="document-uplode">
                        <div className="document-content">
                            <div className="document-dec">
                            <svg className="arrow-left document-file-image" dangerouslySetInnerHTML={{ __html: FileIcon }} />
                            <div className="document-text">
                                <h6>{files && files.name }</h6>
                                <span>{files && files.size } KB</span>
                            </div>
                            </div>
                            <div className="document-progressBar">
                                <ProgressBar 
                                    now={uploadPercentage} 
                                    animated={uploadPercentage === 100 ? false : true} 
                                    variant={uploadPercentage === 100 && "success" }  
                                />
                            </div>
                        </div>
                        {uploadPercentage === 100 &&
                        <div className="document-close">
                            <a href={filePath} target="_blank">View</a> 
                        </div>
                        }
                        <div className="document-close">
                            <svg className="arrow-left" onClick={handleCloseUploading} dangerouslySetInnerHTML={{ __html: CloseIcon }} />
                        </div>
                    </div>
                </Form.Group>
                :
                <>
                    <div className={`upload-file-box m-top ${errors && errors[Filename] && touched[Filename] && 'has-error'}`}>
                        <Form.Control 
                            type="file" 
                            placeholder="Upload the document" 
                            onChange={(e) => handleFileUpload(e)} 
                            id={ID}
                            name={Filename}
                            onBlur={handleBlur}  
                            disabled={value.disableFileUpload}
                        />
                        <Form.Label className="upload-file-text" htmlFor={ID}>
                        <svg className="arrow-left" dangerouslySetInnerHTML={{ __html: UploadFile }} />
                        <p>{Label}</p>
                        </Form.Label> 
                    </div>
                    {errors && errors[Filename] && touched[Filename] && <p>{errors[Filename]}</p>}            
                </> }
            </>
        }
        </ContextApi.Consumer>
    )
}


export default FileUpload;
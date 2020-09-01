import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
  FormGroup,
  FormInput,
  FormSelect
} from 'shards-react';
import { Col, Row, Spinner } from 'react-bootstrap';
import { IoMdCheckmark, IoMdClose } from 'react-icons/io';
import { alterParamsForUrl, getURL } from '../../utils/urlUtils';
import {
  getLocalizationBundleForLanguage,
  getTextAlignmentForLanguage,
  getTranslatedText,
  validateSelectedLanguage
} from '../../utils/translationUtils';
import { inject, observer } from 'mobx-react';
import { intersection, isEmpty } from 'lodash';
import requiredDocs, {
  DOCUMENT_GROUP_FOR_BUILDINGS,
  sitePhotographDocs
} from '../../constants/data/requiredDocs';

import AutoDCRAttachment from '../../components/AutoDCRAttachment';
import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import React from 'react';
import { Router } from '../../routes';
import apiConstants from '../../constants/apiConstants';
import autoDcrFields from '../../constants/autoDcrFields';
import colorConstants from '../../constants/colorConstants';
import documentTypes from '../../constants/documentTypes';
import fetch from 'isomorphic-unfetch';
import { getTranslationLocale } from '../../utils/routeUtils';
import requiredDocsForLayout from '../../constants/data/requiredDocsForLayout';
import stringConstants from '../../constants/stringConstants';

@inject('applicationForm')
@inject('localization')
@observer
class Documents extends React.Component {
  static getInitialProps = async ({ mobxStore, query }) => {
    const { language, applicationId } = query;
    const translationLocale = getTranslationLocale(
      language,
      mobxStore.localization
    );

    if (applicationId) {
      const { applicationForm } = mobxStore;

      const applicationDetails = applicationForm.getApplicationData(),
        applicationType = applicationForm.getApplicationType(),
        approval_for = applicationForm.getApprovalFor(),
        applicationDocuments = applicationForm.getDocumentData(),
        docsToUpload = applicationForm.getDocsToUpload();

      let filesToBeUploaded = [],
        sitePhotographsToUpload = [];

      const redirect =
        !applicationDetails.applicationId ||
        applicationDetails.applicationId != applicationId;

      if (!redirect) {
        let docsRequired =
          approval_for === stringConstants.BUILDING
            ? requiredDocs
            : requiredDocsForLayout;
        console.log('******', docsRequired, '*****', docsToUpload);
        if (docsToUpload) {
          docsToUpload.map(fileItem => {
            if (sitePhotographDocs.includes(fileItem)) {
              sitePhotographsToUpload.push(fileItem);
            } else if (docsRequired.includes(fileItem)) {
              filesToBeUploaded.push(fileItem);
            }
          });
        }
      }
      return {
        redirect,
        filesToBeUploaded,
        sitePhotographsToUpload,
        applicationDetails,
        applicationDocuments,
        applicationId,
        applicationType,
        ...translationLocale
      };
    } else {
      return { error: true, applicationId, language };
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      otherDocuments: [],
      otherFilesEle: [],
      error: false,
      filesToBeUploaded: [],
      sitePhotographsToUpload: [],
      isAllFileUploaded: null,
      errorTextForPendingFiles: [],
      isUploading: false,
      isLoading: true,
      auto_dcr_id: null,
      uploadAllError: false,
      autoDcrUploadError: false,
      manualDcrFieldsVisible: false,
      autoDcrFieldsInvalid: false,
      auto_dcr_invalid: false,
      built_up_area: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      total_built_up_area: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      no_of_floors: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      numeric_floors: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },

      floors: []
    };
    this.applicationForm = this.props.applicationForm;
    this.localizationStore = this.props.localization;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.language != this.props.language) {
      const { localizationBundle, language, textAlign } = this.props;
      this.localizationStore.setLocalizationData({
        localizationBundle: JSON.stringify(localizationBundle),
        language,
        textAlignment: textAlign
      });
    }
  }

  componentDidMount = async () => {
    const {
      filesToBeUploaded,
      sitePhotographsToUpload,
      applicationDetails,
      applicationDocuments,
      error,
      localizationBundle,
      language,
      textAlign,
      applicationId,
      redirect
    } = this.props;
    if (redirect) Router.replaceRoute('redirect', { applicationId, language });

    if (error) {
      this.setState({ error });
      return;
    }
    this.localizationStore.setLocalizationData({
      localizationBundle: JSON.stringify(localizationBundle),
      language,
      textAlignment: textAlign
    });

    this.setState({
      filesToBeUploaded,
      sitePhotographsToUpload,
      application_identifier: applicationDetails.applicationId,
      auto_dcr_id: applicationDetails.auto_dcr
        ? applicationDetails.auto_dcr.unique_no
        : null,
      meseva_request: applicationDetails.meseva_request
    });

    filesToBeUploaded.map(file => {
      if (applicationDocuments[file]) {
        this.state[file] = null;
        this.state[file + '_name'] = applicationDocuments[file];
        this.state[file + '_uploaded'] = true;
        this.state[file + '_selected_for_upload'] = false;
        this.state[file + '_already_exist'] = true;
      } else {
        this.state[file] = null;
        this.state[file + '_name'] = '';
        this.state[file + '_uploaded'] = false;
        this.state[file + '_selected_for_upload'] = false;
        this.state[file + '_already_exist'] = false;
      }
    });
    await this.retrieveDropdownData();

    sitePhotographDocs.map(file => {
      if (applicationDocuments[file]) {
        this.state[file] = null;
        this.state[file + '_name'] = applicationDocuments[file];
        this.state[file + '_uploaded'] = true;
        this.state[file + '_selected_for_upload'] = false;
        this.state[file + '_already_exist'] = true;
      } else {
        this.state[file] = null;
        this.state[file + '_name'] = '';
        this.state[file + '_uploaded'] = false;
        this.state[file + '_selected_for_upload'] = false;
        this.state[file + '_already_exist'] = false;
      }
    });
    this.setState({ isLoading: false });
  };

  getDisplayName = file => {
    if (documentTypes[file]) {
      return documentTypes[file];
    }
    return file.split('_') ? file.split('_').join(' ') : file;
  };

  handleDocumentUpload = async application_identifier => {
    let url = getURL(apiConstants.VALIDATE_DOCUMENTS.USECASE);
    url = alterParamsForUrl(url, { identifier: application_identifier });
    let response = await fetch(url, { credentials: 'include' });

    if (response && response.status === 200) {
      response = await response.json();
      if (response.isValid) {
        this.applicationForm.setUploads(response.uploads);
        this.applicationForm.setStatus(response.application_status);
        return {
          isSuccess: true,
          isAllFileUploaded: true,
          errorTextForPendingFiles: []
        };
      } else {
        return {
          isSuccess: false,
          isAllFileUploaded: false,
          errorTextForPendingFiles: response['files_to_upload']
            ? response['files_to_upload']
            : response['message']
        };
      }
    } else if (response.status === 400) {
      return {
        isSuccess: false,
        isAllFileUploaded: false,
        errorTextForPendingFiles: response['files_to_upload']
          ? response['files_to_upload']
          : response['message']
      };
    }
    return false;
  };

  isAutoDcrFieldsInValid = () => {
    return autoDcrFields.some(item => {
      return this.state[item].visible && !this.state[item].valid;
    });
  };

  handleAutoDcrFieldsUpload = async () => {
    const { applicationType, applicationId } = this.props;
    const { manualDcrFieldsVisible, auto_dcr_id } = this.state;

    if (this.isAutoDcrVisible(applicationType)) {
      if (!manualDcrFieldsVisible && auto_dcr_id === null) {
        return false;
      } else if (!manualDcrFieldsVisible && auto_dcr_id !== null) {
        return true;
      } else {
        if (this.isAutoDcrFieldsInValid()) {
          this.setState({ autoDcrFieldsInvalid: true });
          return false;
        }
        let params = {
          identifier: applicationId,
          numeric_floors: !this.state.numeric_floors.visible
            ? null
            : this.state.numeric_floors.value,
          no_of_floors: this.state.no_of_floors.value,
          total_built_up_area: this.state.total_built_up_area.value,
          floor_area: this.state.built_up_area.visible
            ? {
                type: 'stilt',
                area: this.state.built_up_area.value
              }
            : null
        };

        let body = JSON.stringify(params);

        let url = getURL(apiConstants.ADD_AUTO_DCR_FIELDS.USECASE);

        let res = await fetch(url.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: body
        });

        if (res && res.status == 200) {
          this.props.applicationForm.setNoOfFloors(
            this.state.no_of_floors.value
          );
          return true;
        } else {
          this.setState({ autoDcrUploadFailed: true });
          return false;
        }
      }
    }
    return true;
  };

  handleFormSubmit = async event => {
    if (event) event.preventDefault();
    const { application_identifier, applicationType } = this.state;
    const { language } = this.props;
    this.setState({ isLoading: true });

    let autoDcrFieldsUploaded = await this.handleAutoDcrFieldsUpload();

    let documentsUploaded = await this.handleDocumentUpload(
      application_identifier
    );

    let autoDcrFieldsInvalid = this.isAutoDcrVisible(applicationType)
      ? this.isAutoDcrFieldsInValid()
      : false;
    if (documentsUploaded.isSuccess && autoDcrFieldsUploaded) {
      Router.replaceRoute('review', {
        language: language,
        applicationId: application_identifier
      });
    } else {
      this.setState({
        isLoading: false,
        isAllFileUploaded: documentsUploaded.isAllFileUploaded,
        errorTextForPendingFiles: documentsUploaded.errorTextForPendingFiles,
        message: documentsUploaded.message
      });
    }
  };

  isAutoDcrVisible = applicationType => {
    return applicationType && applicationType.category === 'SINGLE_WINDOW';
  };

  retrieveDropdownData = async () => {
    let url = getURL(apiConstants.FLOOR_DROPDOWN.USECASE);
    url = alterParamsForUrl(url, {
      dependant_value: 600
    });
    let response = await fetch(url);
    if (response && response.status === 200) {
      const models = await response.json();
      var floors = [];

      if (models && models.length) {
        models.map(floor => {
          const obj_ = (({ type, display_name }) => ({ type, display_name }))(
            floor
          );
          floors.push(obj_);

          this.setState({
            floors: floors
          });
        });
        return;
      }
      this.setState({
        floors: []
      });
    }
  };

  validateInput = (inputValue, validationType, inputLength, inputLimit) => {
    switch (validationType) {
      case 'pure_text':
        if (isEmpty(inputValue)) return false;
        return true;
      case 'text':
        return !isEmpty(inputValue);
      //return !inputValue.split('').every(letter => !isNaN(parseInt(letter)));
      case 'number': {
        let isValidNumber = inputValue
          .split('')
          .every(letter => !isNaN(parseInt(letter)) && letter !== '-');
        isValidNumber = isValidNumber && inputValue.length;
        if (isValidNumber) {
          if (inputLength) return inputValue.length === inputLength;
          else if (inputLimit) {
            return inputValue >= inputLimit[0] && inputValue <= inputLimit[1];
          } else return true;
        } else return false;
      }
      case 'float':
        let isValidNumber = !isNaN(parseFloat(inputValue));
        if (isValidNumber) {
          if (inputLength) return inputValue.length === inputLength;
          else if (inputLimit) {
            return inputValue >= inputLimit[0] && inputValue <= inputLimit[1];
          } else if (inputValue > 1) return true;
          else return false;
        } else return false;
      case 'email':
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(inputValue).toLowerCase());
      case 'select':
        if (isEmpty(inputValue)) return false;
        return true;
      case 'select_with_validation':
        if (isEmpty(inputValue)) return false;
        return true;
      case 'sale_deed_registration_date':
        let isSaleDeedInputValid =
          new Date(inputValue).getTime() < new Date('2018-03-31').getTime();
        if (!isSaleDeedInputValid)
          alert(
            'Your application will not be eligible for building permission approvals as the plot is part of un-authorized layout and not eligible for LRS.'
          );
        return isSaleDeedInputValid;
      case 'mortgage_date':
        return new Date(inputValue).getTime() < new Date().getTime();
      default:
        return false;
    }
  };

  validateAndSetInput = (
    event,
    inputField,
    validationType,
    inputLength,
    inputLimit,
    index
  ) => {
    let inputValue = event.target.value;
    let isInputValid = this.validateInput(
      inputValue,
      validationType,
      inputLength,
      inputLimit
    );

    if (inputField == 'land_type' && inputValue == 'AGRICULTURE') {
      isInputValid = false;
      alert('Agriculture land cannot be processed');
    }

    if (isInputValid) {
      let currentState = { ...this.state };
      let inputFieldState = {
        ...(index !== undefined
          ? this.state[inputField][index]
          : this.state[inputField])
      };

      inputFieldState.value = inputValue;
      // if (validationType === 'number') {
      //   inputFieldState.value = parseInt(inputValue);
      // } else if (validationType === 'float') {
      //   inputFieldState.value = parseFloat(inputValue).toFixed(2);
      // } else {
      //   inputFieldState.value = inputValue;
      // }
      inputFieldState.valid = true;
      inputFieldState.empty = false;
      if (index !== undefined)
        currentState[inputField][index] = inputFieldState;
      else currentState[inputField] = inputFieldState;
      this.setState({ ...currentState });
    } else {
      let currentState = { ...this.state };
      let inputFieldState = {
        ...(index !== undefined
          ? this.state[inputField][index]
          : this.state[inputField])
      };
      inputFieldState.value =
        validationType === 'number' ? parseInt(inputValue) : inputValue;

      inputFieldState.valid = false;
      inputFieldState.empty = inputValue.length === 0;
      if (index !== undefined)
        currentState[inputField][index] = inputFieldState;
      else currentState[inputField] = inputFieldState;
      this.setState({ ...currentState });
    }
    // }
  };


  uploadOtherFiles = async (file) => {
    const { application_identifier } = this.state;
    let formData = new FormData();
    formData.append('file', file.file);
    formData.append('file_type', 'other_documents');
    formData.append('identifier', application_identifier);

    const url = getURL(apiConstants.UPLOAD_DOCUMENTS.USECASE);
    let response = await fetch(url.toString(), {
      method: 'POST',
      body: formData
    });
    if (response && response.status === 200) { 
    } else { 
    }
  }

  uploadFile = async (fileType, file) => {
    const { application_identifier } = this.state;
    let formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType);
    formData.append('identifier', application_identifier);

    const url = getURL(apiConstants.UPLOAD_DOCUMENTS.USECASE);
    let response = await fetch(url.toString(), {
      method: 'POST',
      body: formData
    });
    if (response && response.status === 200) {
      this.setState({
        [fileType + '_uploaded']: true,
        [fileType + '_selected_for_upload']: false,
        [fileType + '_already_exist']: false
      });
    } else {
      this.setState({
        [fileType + '_uploaded']: false,
        [fileType + '_selected_for_upload']: false,
        [fileType + '_error']: true
      });
    }
  };

  getLabelTextAlignment = () => {
    if (this.props.textAlign) {
      return this.props.textAlign;
    }
  };

  setLoading = param => {
    this.setState({
      isLoading: param
    });
  };

  setValidAutoDCR = auto_dcr_id => {
    this.setLoading(false);
    this.setState({ auto_dcr_id });
  };

  setAutoDcrFailure = didAttachmentFail => {
    this.setLoading(false);
    this.setState({
      manualDcrFieldsVisible: didAttachmentFail,
      auto_dcr_id: null
    });
    this.updateVisibilityForAutoDcrFields(didAttachmentFail);
  };

  setAutoDcrInvalid = auto_dcr_invalid => {
    this.setState({ auto_dcr_invalid: true });
  };

  updateVisibilityForAutoDcrFields = attachmentFailed => {
    if (attachmentFailed) {
      this.setState(prevState => ({
        no_of_floors: {
          ...prevState.no_of_floors,
          visible: true
        },
        total_built_up_area: {
          ...prevState.total_built_up_area,
          visible: true
        }
      }));
    }
  };

  performUploadAll = async () => {
    const {
      filesToBeUploaded,
      isAllFileUploaded,
      sitePhotographsToUpload
    } = this.state;
    this.setState({ isLoading: true, isUploading: true });

    let selected = false,
      alreadyUploadedFile = 0;
    var p = Promise.resolve();
    filesToBeUploaded.forEach(file => {
      p = p.then(async () => {
        const isAlreadyUploaded = this.state[file + '_uploaded'];
        const isSelectedForUpload = this.state[file + '_selected_for_upload'];
        if (!isAlreadyUploaded && isSelectedForUpload) {
          selected = true;
          await this.uploadFile(file, this.state[file]);
        } else if (isAlreadyUploaded) alreadyUploadedFile += 1;
      });
    });
    p.then(_ => {
      sitePhotographsToUpload.forEach(file => {
        p = p.then(async () => {
          const isAlreadyUploaded = this.state[file + '_uploaded'];
          const isSelectedForUpload = this.state[file + '_selected_for_upload'];
          if (!isAlreadyUploaded && isSelectedForUpload) {
            selected = true;
            await this.uploadFile(file, this.state[file]);
          } else if (isAlreadyUploaded) alreadyUploadedFile += 1;
        });
      });
      p.then(_=> {
          this.state.otherDocuments.forEach(file => {
            p = p.then(async () => {
              await this.uploadOtherFiles(file);
              // const isAlreadyUploaded = this.state[file + '_uploaded'];
              // const isSelectedForUpload = this.state[file + '_selected_for_upload'];
              // if (!isAlreadyUploaded && isSelectedForUpload) {
              //   selected = true;
              //   await this.uploadFile(file, this.state[file]);
              // } else if (isAlreadyUploaded) alreadyUploadedFile += 1;
            });

          })
      });
      p.then(_ => {
        this.handleFormSubmit();
        this.setState({ isLoading: false, isUploading: false });
      });
    });
    if (alreadyUploadedFile === filesToBeUploaded.length) {
    this.handleFormSubmit();
    return;
    }

    /* if (!selected)
      this.setState({
        uploadAllError: true,
        isLoading: false,
        isUploading: false
      });
    else
      this.setState({
        isLoading: false,
        isUploading: false,
        uploadAllError: false
      });
    this.handleFormSubmit();
    */
  };

  updateVisibilityForNumericFloors = event => {
    if (event.target.value === 'OTHERS') {
      this.state.numeric_floors.visible = true;
      this.state.built_up_area.visible = true;
    } else if (event.target.value === 'GROUNDFLOOR') {
      this.state.built_up_area.visible = false;
    } else {
      this.state.numeric_floors.visible = false;
      this.state.built_up_area.visible = true;
    }
  };

  renderBuildingDocs() {
    const { filesToBeUploaded, isUploading } = this.state;
    return Object.keys(DOCUMENT_GROUP_FOR_BUILDINGS).map((value, index) => {
      console.log(
        value,
        intersection(DOCUMENT_GROUP_FOR_BUILDINGS[value], filesToBeUploaded)
      );
      return (
        intersection(DOCUMENT_GROUP_FOR_BUILDINGS[value], filesToBeUploaded)
          .length > 0 && (
          <div className='mt-3' key={index}>
            <h4
              style={{ color: '#1d9a5b', marginTop: 5 }}
              className={this.getLabelTextAlignment()}
            >
              {value}
            </h4>
            {intersection(
              DOCUMENT_GROUP_FOR_BUILDINGS[value],
              filesToBeUploaded
            ).map(file => {
              return (
                <FormGroup key={file} className={this.getLabelTextAlignment()}>
                  <label htmlFor='file' style={{ marginBottom: 0 }}>
                    <strong>{this.getDisplayName(file)}</strong>
                  </label>
                  <Row className='align-items-center justify-content-center justify-content-md-start'>
                    <Col xs='12' md='9'>
                      <FormInput
                        id={file}
                        type='file'
                        accept='.pdf'
                        name={file}
                        // disabled={this.state[file + '_uploaded']}
                        style={{ marginTop: 10 }}
                        onChange={event => {
                          if (
                            event.target.value &&
                            event.target.value.length > 0
                          )
                            this.setState({
                              ...this.state,
                              [file + '_name']: event.target.value,
                              [file]: event.target.files[0],
                              [file + '_uploaded']: false,
                              [file + '_selected_for_upload']: true,

                              isAllFileUploaded: null
                            });
                        }}
                      />
                    </Col>
                    {this.state[file + '_uploaded'] ? (
                      <Col xs='12' md='3' className='text-left mt-10'>
                        <IoMdCheckmark
                          style={{
                            color: 'green',
                            fontSize: 30,
                            paddingRight: 10
                          }}
                        />
                        <span>
                          {getTranslatedText('label.file_upload_success')}{' '}
                          {this.state[file + '_already_exist'] &&
                            '(' + this.state[file + '_name'] + ')'}
                        </span>
                      </Col>
                    ) : this.state[file + '_error'] ? (
                      <Col xs='12' md='3' className='text-left mt-10'>
                        <IoMdClose style={{ color: 'red', fontSize: 24 }} />
                        <span>
                          {getTranslatedText('label.file_upload_failed')}
                        </span>
                      </Col>
                    ) : null}
                    {this.state[file + '_selected_for_upload'] && (
                      <>
                        <Col
                          xs='5'
                          md='auto'
                          style={{
                            textAlign: 'center',
                            marginTop: 5,
                            marginBottom: 5
                          }}
                        >
                          <Button
                            theme='danger'
                            onClick={() =>
                              this.setState({
                                [file]: null,
                                [file + '_selected_for_upload']: false,
                                [file + '_uploaded']: false
                              })
                            }
                            style={{ padding: 10, marginTop: 10 }}
                          >
                            {getTranslatedText('button.remove')}
                          </Button>
                        </Col>
                        <Col
                          xs='5'
                          md='auto'
                          style={{
                            textAlign: 'center',
                            marginTop: 5,
                            marginBottom: 5
                          }}
                        >
                          <Button
                            theme='success'
                            disabled={isUploading}
                            onClick={async () => {
                              this.setState({ isUploading: true });
                              await this.uploadFile(file, this.state[file]);
                              this.setState({ isUploading: false });
                            }}
                            style={{ padding: 10, marginTop: 10 }}
                          >
                            {isUploading ? (
                              <Spinner
                                as='span'
                                animation='grow'
                                size='sm'
                                role='status'
                                aria-hidden='true'
                              />
                            ) : null}
                            {isUploading
                              ? getTranslatedText('button.uploading')
                              : getTranslatedText('button.upload')}
                          </Button>
                        </Col>
                      </>
                    )}
                  </Row>
                </FormGroup>
              );
            })}
          </div>
        )
      );
    });
  }

  renderLayoutDocs() {
    const { filesToBeUploaded, isUploading } = this.state;
    return (
      <>
        <h4
          style={{ color: '#1d9a5b', marginTop: 5 }}
          className={this.getLabelTextAlignment()}
        >
          {getTranslatedText('heading.upload_documents')}
        </h4>
        {filesToBeUploaded.map(file => {
          return (
            <FormGroup key={file} className={this.getLabelTextAlignment()}>
              <label htmlFor='file' style={{ marginBottom: 0 }}>
                <strong>{this.getDisplayName(file)}</strong>
              </label>
              <Row className='align-items-center justify-content-center justify-content-md-start'>
                <Col xs='12' md='9'>
                  <FormInput
                    id={file}
                    type='file'
                    accept='.pdf'
                    name={file}
                    // disabled={this.state[file + '_uploaded']}
                    style={{ marginTop: 10 }}
                    onChange={event => {
                      if (event.target.value && event.target.value.length > 0)
                        this.setState({
                          ...this.state,
                          [file + '_name']: event.target.value,
                          [file]: event.target.files[0],
                          [file + '_uploaded']: false,
                          [file + '_selected_for_upload']: true,

                          isAllFileUploaded: null
                        });
                    }}
                  />
                </Col>
                {this.state[file + '_uploaded'] ? (
                  <Col xs='12' md='3' className='text-left mt-10'>
                    <IoMdCheckmark
                      style={{
                        color: 'green',
                        fontSize: 30,
                        paddingRight: 10
                      }}
                    />
                    <span>
                      {getTranslatedText('label.file_upload_success')}{' '}
                      {this.state[file + '_already_exist'] &&
                        '(' + this.state[file + '_name'] + ')'}
                    </span>
                  </Col>
                ) : this.state[file + '_error'] ? (
                  <Col xs='12' md='3' className='text-left mt-10'>
                    <IoMdClose style={{ color: 'red', fontSize: 24 }} />
                    <span>{getTranslatedText('label.file_upload_failed')}</span>
                  </Col>
                ) : null}
                {this.state[file + '_selected_for_upload'] && (
                  <>
                    <Col
                      xs='5'
                      md='auto'
                      style={{
                        textAlign: 'center',
                        marginTop: 5,
                        marginBottom: 5
                      }}
                    >
                      <Button
                        theme='danger'
                        onClick={() =>
                          this.setState({
                            [file]: null,
                            [file + '_selected_for_upload']: false,
                            [file + '_uploaded']: false
                          })
                        }
                        style={{ padding: 10, marginTop: 10 }}
                      >
                        {getTranslatedText('button.remove')}
                      </Button>
                    </Col>
                    <Col
                      xs='5'
                      md='auto'
                      style={{
                        textAlign: 'center',
                        marginTop: 5,
                        marginBottom: 5
                      }}
                    >
                      <Button
                        theme='success'
                        disabled={isUploading}
                        onClick={async () => {
                          this.setState({ isUploading: true });
                          await this.uploadFile(file, this.state[file]);
                          this.setState({ isUploading: false });
                        }}
                        style={{ padding: 10, marginTop: 10 }}
                      >
                        {isUploading ? (
                          <Spinner
                            as='span'
                            animation='grow'
                            size='sm'
                            role='status'
                            aria-hidden='true'
                          />
                        ) : null}
                        {isUploading
                          ? getTranslatedText('button.uploading')
                          : getTranslatedText('button.upload')}
                      </Button>
                    </Col>
                  </>
                )}
              </Row>
            </FormGroup>
          );
        })}
      </>
    );
  }

  onOtherFilesChange = (e) =>{
    const {otherDocuments} = this.state;
    const newFile = [...otherDocuments];
    const fileInfo = {
      name: 'Other',
      file: e.target.files[0],
      uploaded: false,
      selected_for_upload: true,
    }
    newFile.push(fileInfo)
    this.setState({ otherDocuments: newFile })
  }

  addNewOtherFile = () => {
    const newOtherFile = [...this.state.otherFilesEle];
    const fileEle = (
      <Row>
        <Col xs='12' md='4'>
          <FormInput
            id='customFile'
            type='file'
            accept='.pdf,image/*'
            onChange={this.onOtherFilesChange}
          />
        </Col>
      </Row>
    )
    newOtherFile.push(fileEle);
    this.setState({otherFilesEle: newOtherFile});
  }

  render() {
    const {
      sitePhotographsToUpload,
      isAllFileUploaded,
      isLoading,
      isUploading,
      error,
      errorTextForPendingFiles,
      meseva_request,
      auto_dcr_id,
      uploadAllError,
      autoDcrUploadError,
      manualDcrFieldsVisible,
      autoDcrFieldsInvalid
    } = this.state;
    const {
      applicationType,
      applicationDetails,
      language,
      applicationId
    } = this.props;
    const localizationBundle = this.localizationStore.getLocalizationBundle()
      ? this.localizationStore.getLocalizationBundle()
      : {};
    const goBackRoute =
      applicationDetails.approval_for === stringConstants.BUILDING
        ? 'application'
        : 'layout';

    return error ? (
      <LocalizationProvider messages={localizationBundle}>
        <React.Fragment>
          <Header
            route='documents'
            params={{ language, applicationId }}
            meseva_request={meseva_request}
          />
          <Container className='mt-5'>
            <Card>
              <CardHeader>Failed</CardHeader>
              <CardBody className='text-center'>
                Unable to fetch the details of this application
              </CardBody>
            </Card>
          </Container>
        </React.Fragment>
      </LocalizationProvider>
    ) : (
      <LocalizationProvider messages={localizationBundle}>
        <div>
          <Header
            params={{ language, applicationId }}
            route='documents'
            meseva_request={meseva_request}
          />
          <LoadingOverlay
            active={isUploading || isLoading}
            spinner
            text={
              isLoading
                ? 'Loading...'
                : isUploading
                ? 'Uploading document...'
                : 'Submitting'
            }
            styles={{
              overlay: base => ({
                ...base,
                background: colorConstants.overlayBackground
              })
            }}
          >
            <div style={{ padding: 48 }}>
              <Card>
                <CardHeader className={this.getLabelTextAlignment()}>
                  {getTranslatedText('heading.documentation')}
                </CardHeader>
                <CardBody>
                  {uploadAllError && (
                    <Alert
                      theme='warning'
                      dismissible={() => {
                        this.setState({ uploadAllError: false });
                      }}
                    >
                      Please select atleast one file to upload
                    </Alert>
                  )}

                  <Form onSubmit={event => this.handleFormSubmit(event)}>
                    {applicationDetails.approval_for ===
                    stringConstants.BUILDING
                      ? this.renderBuildingDocs()
                      : this.renderLayoutDocs()}

                    {/* Site photos for all cases > 63 */}
                    {sitePhotographsToUpload.length > 0 && (
                      <div className='mt-3'>
                        <h4
                          style={{ color: '#1d9a5b', marginTop: 5 }}
                          className={this.getLabelTextAlignment()}
                        >
                          {getTranslatedText('heading.upload_site_photographs')}
                        </h4>
                        {sitePhotographsToUpload.map(file => {
                          return (
                            <FormGroup
                              key={file}
                              className={this.getLabelTextAlignment()}
                            >
                              <label htmlFor='file' style={{ marginBottom: 0 }}>
                                <strong>{this.getDisplayName(file)}</strong>
                              </label>
                              <Row className='align-items-center justify-content-center justify-content-md-start'>
                                <Col xs='12' md='9'>
                                  <FormInput
                                    id={file}
                                    type='file'
                                    accept='.pdf,image/*'
                                    name={file}
                                    // disabled={this.state[file + '_uploaded']}
                                    style={{ marginTop: 10 }}
                                    onChange={event => {
                                      if (
                                        event.target.value &&
                                        event.target.value.length > 0
                                      )
                                        this.setState({
                                          ...this.state,
                                          [file + '_name']: event.target.value,
                                          [file]: event.target.files[0],
                                          [file + '_uploaded']: false,
                                          [file + '_selected_for_upload']: true,

                                          isAllFileUploaded: null
                                        });
                                    }}
                                  />
                                </Col>
                                {this.state[file + '_uploaded'] ? (
                                  <Col
                                    xs='12'
                                    md='3'
                                    className='text-left mt-10'
                                  >
                                    <IoMdCheckmark
                                      style={{
                                        color: 'green',
                                        fontSize: 30,
                                        paddingRight: 10
                                      }}
                                    />
                                    <span>
                                      {getTranslatedText(
                                        'label.file_upload_success'
                                      )}{' '}
                                      {this.state[file + '_already_exist'] &&
                                        '(' + this.state[file + '_name'] + ')'}
                                    </span>
                                  </Col>
                                ) : this.state[file + '_error'] ? (
                                  <Col
                                    xs='12'
                                    md='3'
                                    className='text-left mt-10'
                                  >
                                    <IoMdClose
                                      style={{ color: 'red', fontSize: 24 }}
                                    />
                                    <span>
                                      {getTranslatedText(
                                        'label.file_upload_failed'
                                      )}
                                    </span>
                                  </Col>
                                ) : null}
                                {this.state[file + '_selected_for_upload'] && (
                                  <>
                                    <Col
                                      xs='5'
                                      md='auto'
                                      style={{
                                        textAlign: 'center',
                                        marginTop: 5,
                                        marginBottom: 5
                                      }}
                                    >
                                      <Button
                                        theme='danger'
                                        onClick={() =>
                                          this.setState({
                                            [file]: null,
                                            [file +
                                            '_selected_for_upload']: false,
                                            [file + '_uploaded']: false
                                          })
                                        }
                                        style={{ padding: 10, marginTop: 10 }}
                                      >
                                        {getTranslatedText('button.remove')}
                                      </Button>
                                    </Col>
                                    <Col
                                      xs='5'
                                      md='auto'
                                      style={{
                                        textAlign: 'center',
                                        marginTop: 5,
                                        marginBottom: 5
                                      }}
                                    >
                                      <Button
                                        theme='success'
                                        disabled={isUploading}
                                        onClick={async () => {
                                          this.setState({ isUploading: true });
                                          await this.uploadFile(
                                            file,
                                            this.state[file]
                                          );
                                          this.setState({ isUploading: false });
                                        }}
                                        style={{ padding: 10, marginTop: 10 }}
                                      >
                                        {isUploading ? (
                                          <Spinner
                                            as='span'
                                            animation='grow'
                                            size='sm'
                                            role='status'
                                            aria-hidden='true'
                                          />
                                        ) : null}
                                        {isUploading
                                          ? getTranslatedText(
                                              'button.uploading'
                                            )
                                          : getTranslatedText('button.upload')}
                                      </Button>
                                    </Col>
                                  </>
                                )}
                              </Row>
                            </FormGroup>
                          );
                        })}
                      </div>
                    )}

                    {applicationType &&
                    applicationType.category === 'SINGLE_WINDOW' &&
                    !manualDcrFieldsVisible ? (
                      <AutoDCRAttachment
                        applicationDetails={applicationDetails}
                        setLoading={this.setLoading}
                        setValidAutoDCR={this.setValidAutoDCR}
                        setAutoDcrFailure={this.setAutoDcrFailure}
                      />
                    ) : null}

                    {/*if auto dcr fails display fields to be added by the citizen.*/}
                    {this.state.no_of_floors.visible ? (
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{ color: '#1d9a5b', marginTop: 5 }}
                            className={this.getLabelTextAlignment()}
                          >
                            {getTranslatedText('heading.auto_dcr_details')}
                          </h4>
                        </Col>
                      </Row>
                    ) : null}
                    <Row>
                      {this.state.no_of_floors.visible ? (
                        <Col xs='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='no_of_floors'>
                              <strong>
                                {getTranslatedText('label.no_of_floors')}
                              </strong>
                            </label>
                            <FormSelect
                              id='#no_of_floors'
                              name='no_of_floors'
                              min={1}
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'no_of_floors',
                                  'select_with_validation'
                                );
                                this.updateVisibilityForNumericFloors(event);
                              }}
                              value={
                                this.state.no_of_floors.value
                                  ? this.state.no_of_floors.value
                                  : ''
                              }
                              valid={this.state['no_of_floors'].valid}
                              invalid={
                                !this.state['no_of_floors'].empty &&
                                !this.state['no_of_floors'].valid
                              }
                            >
                              <option value=''>Select</option>
                              {this.state.floors.map((floor, index) => {
                                return (
                                  <option value={floor.type} key={index}>
                                    {floor.display_name}
                                  </option>
                                );
                              })}
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.state.numeric_floors.visible ? (
                        <Col xs='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='numeric_floors'>
                              <strong>
                                {getTranslatedText('label.numeric_floors')}
                              </strong>
                            </label>
                            <FormInput
                              id='#numeric_floors'
                              placeholder='Numeric Floors'
                              name='numeric_floors'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'numeric_floors',
                                  'number'
                                )
                              }
                              valid={this.state['numeric_floors'].valid}
                              invalid={
                                !this.state['numeric_floors'].empty &&
                                !this.state['numeric_floors'].valid
                              }
                              value={
                                this.state['numeric_floors'].value
                                  ? this.state['numeric_floors'].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      {this.state.total_built_up_area.visible ? (
                        <Col xs='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='total_built_up_area'>
                              <strong>
                                {getTranslatedText('label.total_built_up_area')}
                              </strong>
                            </label>
                            <FormInput
                              id='#total_built_up_area'
                              placeholder='Total Built Up Area'
                              name='total_built_up_area'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'total_built_up_area',
                                  'number'
                                )
                              }
                              valid={this.state.total_built_up_area.valid}
                              invalid={
                                !this.state.total_built_up_area.empty &&
                                !this.state.total_built_up_area.valid
                              }
                              value={
                                this.state.total_built_up_area.value
                                  ? this.state.total_built_up_area.value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.state.built_up_area.visible ? (
                        <Col xs='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='built_up_area'>
                              <strong>
                                {getTranslatedText('label.built_up_area')}
                              </strong>
                            </label>
                            <FormInput
                              id='#built_up_area'
                              placeholder='Built Up Area'
                              name='built_up_area'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'built_up_area',
                                  'text'
                                )
                              }
                              valid={this.state.built_up_area.valid}
                              invalid={
                                !this.state.built_up_area.empty &&
                                !this.state.built_up_area.valid
                              }
                              value={
                                this.state.built_up_area.value
                                  ? this.state.built_up_area.value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <h4
                      style={{ color: '#1d9a5b', marginTop: 5 }}
                      className={this.getLabelTextAlignment()}
                    >
                      {getTranslatedText('heading.other_documents')}
                    </h4>
                    <Row>

                    <Col xs='12' md='4'>
                          <FormInput
                            id='customFile'
                            type='file'
                            accept='.pdf,image/*'
                             onChange={this.onOtherFilesChange}
                             style={{ marginTop: 10 }}
                           />
                     </Col>
                     <Col xs='12' md='4'>
                     <Button
                          theme='success'
                          onClick={this.addNewOtherFile}
                          disabled={isLoading}
                        >
                          {getTranslatedText('button.add')}
                        </Button>
                     </Col>
                    </Row>
                    {this.state.otherFilesEle}
                    <Row className='align-items-center justify-content-center'>
                      <Col xs='auto' style={{ marginTop: 5, marginBottom: 5 }}>
                        <Button
                          theme='danger'
                          onClick={() => {
                            this.setState({ isLoading: true });
                            Router.replaceRoute(goBackRoute, {
                              language: language
                            });
                          }}
                          disabled={isLoading}
                        >
                          {getTranslatedText('button.goBack')}
                        </Button>
                      </Col>
                      <Col xs='auto' style={{ marginTop: 5, marginBottom: 5 }}>
                        <Button
                          theme='success'
                          onClick={this.performUploadAll}
                          disabled={isLoading}
                        >
                          {getTranslatedText('button.uploadAll')}
                        </Button>
                      </Col>
                      {/* <Col xs='auto' style={{ marginTop: 5, marginBottom: 5 }}>
                        <Button
                          type='submit'
                          theme='success'
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Spinner
                              as='span'
                              animation='grow'
                              size='sm'
                              role='status'
                              aria-hidden='true'
                            />
                          ) : null}
                          {isLoading
                            ? 'Loading'
                            : getTranslatedText('button.proceed')}
                        </Button>
                      </Col> */}
                    </Row>
                    {isAllFileUploaded !== null &&
                      isAllFileUploaded == false &&
                      errorTextForPendingFiles && (
                        <>
                          <p
                            style={{
                              marginTop: 20
                            }}
                            className='text-danger text-center'
                          >
                            <strong>
                              {getTranslatedText('error.upload_all_files')}
                            </strong>
                          </p>
                          <div className='text-center'>
                            {getTranslatedText('error.pending_files')} :{' '}
                            {Array.isArray(errorTextForPendingFiles)
                              ? errorTextForPendingFiles.map(
                                  (fileToUpload, index) => {
                                    return (
                                      <span key={index}>
                                        <b>
                                          {this.getDisplayName(fileToUpload) +
                                            (index !==
                                            errorTextForPendingFiles.length - 1
                                              ? ', '
                                              : '')}
                                        </b>
                                      </span>
                                    );
                                  }
                                )
                              : errorTextForPendingFiles}
                          </div>
                        </>
                      )}

                    {this.isAutoDcrVisible(applicationType) &&
                    autoDcrUploadError ? (
                      <p
                        style={{
                          marginTop: 30
                        }}
                        className='text-danger text-center'
                      >
                        <strong>
                          {getTranslatedText('error.auto_dcr_upload_failed')}
                        </strong>
                      </p>
                    ) : null}
                    {applicationType &&
                    applicationType.category === 'SINGLE_WINDOW' &&
                    auto_dcr_id == '' ? (
                      <p
                        style={{
                          marginTop: 20
                        }}
                        className='text-danger text-center'
                      >
                        <strong>
                          {getTranslatedText('error.auto_dcr_invaild')}
                        </strong>
                      </p>
                    ) : null}
                    {applicationType &&
                    applicationType.category === 'SINGLE_WINDOW' &&
                    autoDcrFieldsInvalid ? (
                      <p
                        style={{
                          marginTop: 30
                        }}
                        className='text-danger text-center'
                      >
                        <strong>
                          {getTranslatedText(
                            'error.auto_dcr_fields_incomplete'
                          )}
                        </strong>
                      </p>
                    ) : null}
                  </Form>
                </CardBody>
              </Card>
            </div>
          </LoadingOverlay>
        </div>
      </LocalizationProvider>
    );
  }
}

export default Documents;

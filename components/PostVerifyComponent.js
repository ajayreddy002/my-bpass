import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap';
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  FormInput,
  FormRadio,
  FormSelect
} from 'shards-react';
import { IoMdCheckmark, IoMdClose } from 'react-icons/io';
import React, { Component, Fragment } from 'react';
import { alterParamsForUrl, getURL } from '../utils/urlUtils';

import apiConstants from '../constants/apiConstants';
import { isEmpty } from 'lodash';

const SIFiles = [
  {
    name: 'Site inspector review image 1',
    key: 'SITE_INSPECTOR_REVIEW_IMAGE_ONE'
  },
  {
    name: 'Site inspector review image 2',
    key: 'SITE_INSPECTOR_REVIEW_IMAGE_TWO'
  }
];

export default class PostVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      otpScreen: 'get',
      otp: '',
      attempt: 3,
      isValid: false,
      error: false
    };
    SIFiles.forEach(({ key }) => {
      this.state = {
        ...this.state,
        [`${key}_name`]: '',
        [key]: null,
        [`${key}_uploaded`]: false,
        [`${key}_selected_for_upload`]: false
      };
    });
    this.nonVerificationFields = [status];
    this.config = [];
  }

  transformVerificationFields = () => {
    return this.config.reduce((acc, val) => {
      const { name, remark_needed } = val;
      acc[name] = this.state[name].value;
      if (
        remark_needed === 'CONDITIONALLY_REQUIRED' &&
        this.state[name].value === 'Incorrect'
      ) {
        acc[name + '_remark'] = this.state[name + '_remark'].value;
      }
      return acc;
    }, {});
  };

  submitReview = async role => {
    this.props.onLoading();
    const { status } = this.state;
    const { application_identifier, taskId, taskType } = this.props;
    let url = getURL(apiConstants.ADD_REVIEW.USECASE);
    let comment = this.transformVerificationFields();
    const request_body = {
      status,
      role,
      taskId,
      applicationIdentifier: application_identifier,
      comments: JSON.stringify(comment)
    };
    if (taskType != 'APPLICATION_REVIEW')
      request_body.taskType = 'POST_PROCESSING_APPLICATION_REVIEW';

    let res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(request_body)
    });
    if (res && res.status === 200) {
      this.props.onSuccess();
      this.props.refreshList();
      return;
    }
    this.props.onError();
  };

  renderRadioBtn = () => {
    return (
      <div style={{ marginLeft: 15 }}>
        <strong>Action:</strong>
        <Row>
          <Col xs='3'>
            <FormRadio
              name='status'
              checked={this.state.status === 'COMPLETED'}
              onChange={() => {
                this.setState({ status: 'COMPLETED' });
              }}
            >
              Approve
            </FormRadio>
          </Col>
          <Col xs='3'>
            <FormRadio
              name='status'
              checked={this.state.status === 'REJECTED'}
              onChange={() => {
                this.setState({ status: 'REJECTED' });
              }}
            >
              Reject
            </FormRadio>
          </Col>
        </Row>
      </div>
    );
  };

  getValidationField = async () => {
    let { role, application_identifier } = this.props;
    let url = getURL(apiConstants.GET_VALIDATION_FIELDS.USECASE);
    url = alterParamsForUrl(url, {
      admin_role_name: role,
      application_id: application_identifier
    });
    let res = await fetch(url);
    if (res && res.status === 200) {
      let data = (await res.json()) || [];
      return data;
    }
    return [];
  };

  renderFileUpload = ({ name, key }) => {
    const { isUploading } = this.state;
    return (
      <Col xs='12' key={key}>
        <FormGroup>
          <label htmlFor={key} style={{ marginBottom: 0 }}>
            <strong>{name}</strong>
          </label>
          <Row className='align-items-center justify-content-center justify-content-md-start'>
            <Col xs='12' md='9'>
              <FormInput
                id={key}
                type='file'
                name={key}
                // disabled={this.state[file + '_uploaded']}
                style={{ marginTop: 10 }}
                onChange={event => {
                  if (event.target.value && event.target.value.length > 0)
                    this.setState({
                      ...this.state,
                      [`${key}_name`]: event.target.value,
                      [key]: event.target.files[0],
                      [`${key}_uploaded`]: false,
                      [`${key}_selected_for_upload`]: false
                    });
                }}
              />
            </Col>
            {this.state[`${key}_selected_for_upload`] ? (
              this.state[`${key}_uploaded`] ? (
                <Col xs='12' md='3' className='text-left mt-10'>
                  <IoMdCheckmark
                    style={{
                      color: 'green',
                      fontSize: 30,
                      paddingRight: 10
                    }}
                  />
                  <span>File Uploaded Successfully</span>
                </Col>
              ) : (
                <Col xs='12' md='3' className='text-left mt-10'>
                  <IoMdClose style={{ color: 'red', fontSize: 24 }} />
                  <span>Failed to upload file</span>
                </Col>
              )
            ) : this.state[key] ? (
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
                    onClick={() => this.setState({ review: null })}
                    style={{ padding: 10, marginTop: 10 }}
                  >
                    Remove
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
                      await this.uploadFile(key, this.state[key]);
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
                    {isUploading ? 'Uploading' : 'Upload'}
                  </Button>
                </Col>
              </>
            ) : null}
          </Row>
        </FormGroup>
      </Col>
    );
  };

  componentDidMount = async () => {
    this.config = await this.getValidationField();
    this.config.forEach(i => this.setStateObj(i));
    this.setState({ loaded: true });
  };
  setStateObj = i => {
    const { field_type } = i;
    switch (field_type) {
      case 'BOOLEAN':
        this.state[i.name] = {
          value: 'Correct',
          valid: true,
          empty: true,
          required: true,
          visible: true
        };
        if (i.remark_needed === 'CONDITIONALLY_REQUIRED') {
          this.state[`${i.name}_remark`] = {
            value: null,
            valid: false,
            empty: true,
            required: false,
            visible: true
          };
        }
        break;
      case 'TEXT':
      case 'DECIMAL':
        this.state[i.name] = {
          value: null,
          valid: false,
          empty: true,
          required: true,
          visible: true
        };
        break;
    }
  };
  validateInput = (inputValue, validationType, inputLength, inputLimit) => {
    switch (validationType) {
      case 'text':
      case 'TEXT':
        return !isEmpty(inputValue);
      //return !inputValue.split('').every(letter => !isNaN(parseInt(letter)));
      case 'float':
      case 'DECIMAL':
        let isValidNumber = !isNaN(parseFloat(inputValue));
        if (isValidNumber) {
          if (inputLength) return inputValue.length === inputLength;
          else if (inputLimit) {
            return inputValue >= inputLimit[0] && inputValue <= inputLimit[1];
          } else return true;
        } else return false;
      case 'select':
      case 'BOOLEAN':
        if (isEmpty(inputValue)) return false;
        return true;
      default:
        return false;
    }
  };

  uploadFile = async (fileType, file) => {
    const { application_identifier } = this.props;
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
      response = await response.json();
      this.setState({
        file: response.file_url,
        [`${fileType}_uploaded`]: true,
        [`${fileType}_selected_for_upload`]: true
      });
    } else {
      this.setState({
        [`${fileType}_uploaded`]: false,
        [`${fileType}_selected_for_upload`]: true
      });
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

    if (isInputValid) {
      let currentState = { ...this.state };
      let inputFieldState = {
        ...(index !== undefined
          ? this.state[inputField][index]
          : this.state[inputField])
      };

      inputFieldState.value = inputValue;
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

  renderRadioRemark = (i, index) => {
    return (
      <Row style={{ marginTop: 15 }}>
        <Col xs='12' md='4'>
          {i.name}
        </Col>
        <Col xs='12' md='4'>
          <FormSelect
            name={i.name}
            onChange={event =>
              this.validateAndSetInput(event, i.name, 'select')
            }
            valid={this.state[i.name].valid}
            invalid={!this.state[i.name].empty && !this.state[i.name].valid}
            value={this.state[i.name].value ? this.state[i.name].value : ''}
          >
            <option value='Correct'>Correct</option>
            <option value='Incorrect'>Incorrect</option>
            <option value='N/A'>N/A</option>
          </FormSelect>
        </Col>
        {this.state[i.name].value === 'Incorrect' &&
        i.remark_needed === 'CONDITIONALLY_REQUIRED' ? (
          <Col xs='12' md='4'>
            <FormInput
              type='text'
              id={`${i.name}_remark`}
              placeholder='Enter Remark'
              name={`${i.name}_remark`}
              onChange={event =>
                this.validateAndSetInput(event, `${i.name}_remark`, 'text')
              }
              valid={this.state[`${i.name}_remark`].valid}
              invalid={
                !this.state[`${i.name}_remark`].empty &&
                !this.state[`${i.name}_remark`].valid
              }
              value={
                this.state[`${i.name}_remark`].value
                  ? this.state[`${i.name}_remark`].value
                  : ''
              }
            />
          </Col>
        ) : null}
      </Row>
    );
  };

  renderTextBox = (i, index) => {
    return (
      <Row style={{ marginTop: 15 }}>
        <Col xs='4'>{i.name}</Col>
        <Col xs='7'>
          <FormGroup>
            <FormInput
              type={i.type}
              id={i.name}
              name={i.name}
              onChange={event =>
                this.validateAndSetInput(event, i.name, i.field_type)
              }
              valid={this.state[i.name].valid}
              invalid={!this.state[i.name].empty && !this.state[i.name].valid}
              value={this.state[i.name].value ? this.state[i.name].value : ''}
            />
          </FormGroup>
        </Col>
      </Row>
    );
  };

  renderTypeBased = (i, index) => {
    switch (i.field_type) {
      case 'BOOLEAN':
        return this.renderRadioRemark(i, index);
      case 'TEXT':
      case 'DECIMAL':
        return this.renderTextBox(i, index);
    }
    return null;
  };

  disableSubmit = () => {
    if (this.state.status === '') return true;
    if (this.props.role === 'SITE_INSPECTOR' && !this.state.isValid)
      return true;
    return this.config.some((val, index) => {
      const { name, remark_needed } = val;
      if (!this.state[name].valid) return true;
      else if (
        remark_needed === 'CONDITIONALLY_REQUIRED' &&
        this.state[name].value === 'Incorrect'
      )
        return !this.state[`${name}_remark`].valid;
      else return false;
    });
  };

  getOtp = async () => {
    const { userDetails: { phone_number } = {} } = this.props;
    let url = getURL(apiConstants.GET_OTP.USECASE);
    url = alterParamsForUrl(url, { phone_number });
    let res = await fetch(url);
    if (res && res.status === 200) {
      res = await res.json();
      if (res.isSuccess) {
        alert('OTP Successfully sent to registered mobile number');
        this.setState({ otpScreen: 'verify', attempt: res.attempts_left });
      }
    }
  };

  verifyOtp = async () => {
    const { userDetails: { phone_number } = {} } = this.props;
    let url = getURL(apiConstants.VERIFY_OTP.USECASE);
    let res = await fetch(url.toString(), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone_number, otp: this.state.otp })
    });
    if (res && res.status === 200) {
      res = await res.json();
      if (res.isValid) {
        const otpScreen = res.attempts_left > 0 ? otpScreen : 'get';
        return this.setState({
          isValid: true,
          error: false,
          attempt: res.attempts_left,
          otpScreen
        });
      }
    }
    return this.setState({ error: true });
  };

  renderSIFields = role => {
    if (role !== 'SITE_INSPECTOR') return null;
    const { error } = this.state;
    return (
      <Fragment>{SIFiles.map(val => this.renderFileUpload(val))}</Fragment>
    );
  };

  renderButtons = role => {
    if (role !== 'SITE_INSPECTOR')
      return (
        <Row className='align-items-center justify-content-center'>
          <Col xs='6' md='2'>
            <Button
              theme='success'
              disabled={this.disableSubmit()}
              onClick={this.submitReview.bind(this, role)}
              style={{ padding: 10, marginTop: 10 }}
            >
              Submit
            </Button>
          </Col>
        </Row>
      );
    const { error } = this.state;
    return (
      <Fragment>
        {this.state.otpScreen === 'verify' && (
          <Row>
            <Col xs='12' md='4'>
              <FormInput
                id='#otp'
                name='otp'
                placeholder='Enter OTP'
                onChange={event => this.setState({ otp: event.target.value })}
                value={this.state.otp}
              />
            </Col>
          </Row>
        )}

        {error ? (
          <Alert
            variant='danger'
            onClose={() =>
              this.setState({
                error: false
              })
            }
            dismissible
          >
            Please enter correct otp or exceeded max retries
          </Alert>
        ) : null}

        {this.state.otpScreen === 'get' ? (
          <Row className='align-items-center justify-content-center'>
            <Col xs='6' md='2'>
              <Button
                theme='success'
                onClick={this.getOtp}
                style={{ padding: 10, marginTop: 10 }}
              >
                Request OTP
              </Button>
            </Col>
            <Col xs='6' md='2'>
              <Button
                theme='success'
                disabled={this.disableSubmit()}
                onClick={this.submitReview.bind(this, role)}
                style={{ padding: 10, marginTop: 10 }}
              >
                Submit
              </Button>
            </Col>
          </Row>
        ) : (
          <Row className='align-items-center justify-content-center'>
            <Col xs='6' md='2'>
              <Button
                theme='success'
                onClick={this.verifyOtp}
                style={{ padding: 10, marginTop: 10 }}
              >
                Verify OTP
              </Button>
              {this.state.attempt === 1 ? <div>1 more attempt</div> : null}
            </Col>
            <Col xs='6' md='2'>
              <Button
                theme='success'
                disabled={this.state.attempt <= 0}
                onClick={this.getOtp}
                style={{ padding: 10, marginTop: 10 }}
              >
                Resend OTP
              </Button>
            </Col>
            <Col xs='6' md='2'>
              <Button
                theme='success'
                disabled={this.disableSubmit()}
                onClick={this.submitReview.bind(this, role)}
                style={{ padding: 10, marginTop: 10 }}
              >
                Submit
              </Button>
            </Col>
          </Row>
        )}
      </Fragment>
    );
  };

  render() {
    const { role } = this.props;
    return (
      <Fragment>
        {this.config.map((i, index) => this.renderTypeBased(i, index))}
        {this.renderSIFields(role)}
        {this.renderRadioBtn()}
        {this.renderButtons(role)}
      </Fragment>
    );
  }
}

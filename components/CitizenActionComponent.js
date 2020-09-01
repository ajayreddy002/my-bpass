import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  FormInput,
  FormRadio,
  FormTextarea
} from 'shards-react';
import { IoMdCheckmark, IoMdClose } from 'react-icons/io';
import React, { Component, Fragment } from 'react';

import LoadingOverlay from 'react-loading-overlay';
import { Router } from '../routes';
import apiConstants from '../constants/apiConstants';
import colorConstants from '../constants/colorConstants';
import fetch from 'isomorphic-unfetch';
import { getTranslatedText } from '../utils/translationUtils';
import { getURL } from '../utils/urlUtils';

class CitizenActionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      additional: null,
      additional_name: '',
      additional_uploaded: false,
      additional_selected_for_upload: false,
      isUploading: false,
      status: '',
      isLoading: true,
      submitted: false,
      failed: false,
      file: null
    };
    this.timeout = null;
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  componentDidMount() {
    const { applicationData: { workflow } = {} } = this.props;
    const tasks = (workflow && workflow.tasks) || [];
    let tks = tasks.filter(
      i =>
        i.status == 'COMPLETED' &&
        i.task_type === 'REQUEST_ADDITIONAL_DOCUMENTS'
    );
    if (tks.length === 1) {
      this.setState({ reviewTask: tks[0], isLoading: false });
    }
  }

  uploadFile = async (fileType, file) => {
    const { applicationId } = this.props;
    let formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType);
    formData.append('identifier', applicationId);
    const url = getURL(apiConstants.UPLOAD_DOCUMENTS.USECASE);
    let response = await fetch(url.toString(), {
      method: 'POST',
      body: formData
    });
    if (response && response.status === 200) {
      response = await response.json();
      this.setState({
        file: response.file_url,
        additional_uploaded: true,
        additional_selected_for_upload: true
      });
    } else {
      this.setState({
        additional_uploaded: false,
        additional_selected_for_upload: true
      });
    }
  };

  submit = async role => {
    this.setState({ isLoading: true });
    const { applicationId, language } = this.props;
    const { file } = this.state;
    let url = getURL(apiConstants.SUBMIT_ADDITIONAL_DOCUMENT.USECASE);

    let res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        application_id: applicationId,
        fileLocation: file
      })
    });

    if (res && res.status === 200) {
      this.setState({ isLoading: false, submitted: true });
      this.timeout = setTimeout(() => {
        Router.replaceRoute('redirect', { applicationId, language });
      }, 1000);
      return;
    }
    this.setState({ isLoading: false, failed: true });
  };

  renderFileUpload = role => {
    const { isUploading, reviewTask } = this.state;
    return (
      <Col xs='12'>
        <FormGroup>
          <label htmlFor='file' style={{ marginBottom: 0 }}>
            <strong>Additional documents requested</strong>
          </label>
          <Row className='align-items-center justify-content-center justify-content-md-start'>
            {reviewTask && (
              <Col xs='auto'>
                <p>
                  Technical Scrutiny officer ({reviewTask.assigned_to_user_id})
                  has requested you to upload the following additional docs
                </p>
                <p>
                  <strong>{reviewTask.task_review.feedback}</strong>
                </p>
              </Col>
            )}
            <Col xs='12' md='9'>
              <FormInput
                id='file'
                type='file'
                accept='.pdf'
                name='additional'
                // disabled={this.state[file + '_uploaded']}
                style={{ marginTop: 10 }}
                onChange={event => {
                  if (event.target.value && event.target.value.length > 0)
                    this.setState({
                      ...this.state,
                      additional_name: event.target.value,
                      additional: event.target.files[0],
                      additional_uploaded: false,
                      additional_selected_for_upload: false
                    });
                }}
              />
            </Col>
            {this.state['additional_selected_for_upload'] ? (
              this.state['additional_uploaded'] ? (
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
            ) : this.state['additional'] ? (
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
                    onClick={() => this.setState({ additional: null })}
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
                      await this.uploadFile(
                        'ADDITIONAL_DOCUMENT',
                        this.state['additional']
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

  render() {
    const { isLoading, isUploading, submitted, failed } = this.state;
    return (
      <Container className='mt-5'>
        <LoadingOverlay
          active={isUploading || isLoading}
          spinner
          text={'Submitting'}
          styles={{
            overlay: base => ({
              ...base,
              background: colorConstants.overlayBackground
            })
          }}
        >
          {submitted ? (
            <Alert
              variant='success'
              onClose={() =>
                this.setState({
                  submitted: false,
                  failed: false
                })
              }
              dismissible
            >
              Document Successfully submitted
            </Alert>
          ) : null}
          {failed ? (
            <Alert
              variant='danger'
              onClose={() =>
                this.setState({
                  submitted: false,
                  failed: false
                })
              }
              dismissible
            >
              Failed to submit document
            </Alert>
          ) : null}
          <Row>
            <Col style={{ padding: 0 }}>
              <Card>
                <CardHeader>
                  {getTranslatedText('heading.citizenAction')}
                </CardHeader>
                <CardBody>
                  {this.renderFileUpload()}
                  <Row
                    className='align-items-center justify-content-center'
                    style={{ marginTop: 15 }}
                  >
                    <Col xs='auto'>
                      <Button
                        theme='success'
                        disabled={!this.state.additional_uploaded}
                        onClick={this.submit}
                        style={{ padding: 10, marginTop: 10 }}
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </LoadingOverlay>
      </Container>
    );
  }
}

export default CitizenActionComponent;

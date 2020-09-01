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
import { alterParamsForUrl, getURL } from '../utils/urlUtils';

import LoadingOverlay from 'react-loading-overlay';
import PostVerification from './PostVerifyComponent';
import TaskReassign from './TaskReassign';
import apiConstants from '../constants/apiConstants';
import colorConstants from '../constants/colorConstants';
import fetch from 'isomorphic-unfetch';

class AdminActionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      review: null,
      review_name: '',
      review_uploaded: false,
      review_selected_for_upload: false,
      comment: '',
      isUploading: false,
      status: '',
      isLoading: false,
      submitted: false,
      failed: false,
      file: null
    };
  }

  resetState = () => {
    this.setState({
      review: null,
      review_name: '',
      review_uploaded: false,
      review_selected_for_upload: false,
      comment: '',
      isUploading: false,
      status: '',
      isLoading: false,
      submitted: false,
      failed: false,
      file: null
    });
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
        review_uploaded: true,
        review_selected_for_upload: true
      });
    } else {
      this.setState({
        review_uploaded: false,
        review_selected_for_upload: true
      });
    }
  };

  addComment = e => this.setState({ comment: e.target.value });

  submitReview = async (role, taskId) => {
    this.setState({ isLoading: true });
    const { comment, review, status, file } = this.state;
    const { application_identifier } = this.props;
    let url = getURL(apiConstants.ADD_REVIEW.USECASE);
    let res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        comments: comment,
        fileLocation: file,
        status,
        role,
        taskId,
        applicationIdentifier: application_identifier
      })
    });
    if (res && res.status === 200) {
      this.setState({ isLoading: false, submitted: true });
      this.resetState();
      this.props.refreshList();
      return;
    }
    this.setState({ isLoading: false, failed: true });
  };

  submitComment = async role => {
    this.setState({ isLoading: true });
    const { comment, review, status, file } = this.state;
    const { application_identifier } = this.props;
    let url = getURL(apiConstants.ADD_COMMENT.USECASE);
    let res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        comment,
        role,
        applicationIdentifier: application_identifier
      })
    });
    if (res && res.status === 200) {
      this.setState({ isLoading: false, submitted: true });

      return;
    }
    this.setState({ isLoading: false, failed: true });
  };

  submitPreProceedingConditions = async taskId => {
    this.setState({ isLoading: true });
    const { comment, review, file } = this.state;
    const { application_identifier, role } = this.props;
    let url = getURL(apiConstants.ADMIN_PRE_PROCEEDING_CONDITIONS.USECASE);
    let res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        applicationIdentifier: application_identifier,
        comments: comment,
        fileLocation: file,
        role,
        taskId
      })
    });
    if (res && res.status === 200) {
      this.setState({ isLoading: false, submitted: true });
      this.resetState();
      this.props.refreshList();
      return;
    }
    this.setState({ isLoading: false, failed: true });
  };

  approveApplication = async taskId => {
    this.setState({ isLoading: true });
    const { comment, review, file } = this.state;
    const { application_identifier, role } = this.props;
    let url = getURL(apiConstants.APPROVE_APPLICATION.USECASE);
    let res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        applicationIdentifier: application_identifier,
        comments: comment,
        fileLocation: file,
        role,
        taskId
      })
    });
    if (res && res.status === 200) {
      this.setState({ isLoading: false, submitted: true });
      this.resetState();
      this.props.refreshList();
      return;
    }
    this.setState({ isLoading: false, failed: true });
  };

  rejectApplication = async (isShortfall, taskId) => {
    this.setState({ isLoading: true });
    const { comment, review } = this.state;
    const { application_identifier, role } = this.props;
    let url = getURL(
      isShortfall
        ? apiConstants.SHORTFALL.USECASE
        : apiConstants.REJECT_APPLICATION.USECASE
    );
    let res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        comments: comment,
        isShortfall,
        applicationIdentifier: application_identifier,
        taskId,
        role
      })
    });
    if (res && res.status === 200) {
      this.setState({ isLoading: false, submitted: true });
      this.resetState();
      this.props.refreshList();
      return;
    }
    this.setState({ isLoading: false, failed: true });
  };

  requestAdditionDocument = async taskId => {
    this.setState({ isLoading: true });
    const { application_identifier, role } = this.props;
    const { comment } = this.state;
    let url = getURL(apiConstants.REQ_DOCUMENT.USECASE);
    let res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        applicationIdentifier: application_identifier,
        role,
        taskId,
        comments: comment
      })
    });
    if (res && res.status === 200) {
      this.setState({ isLoading: false, submitted: true });
      this.resetState();
      this.props.refreshList();
      return;
    }
    this.setState({ isLoading: false, failed: true });
  };

  noDocsRequired = async taskId => {
    this.setState({ isLoading: true });
    const { application_identifier, role } = this.props;
    const { comment } = this.state;
    let url = getURL(apiConstants.NO_DOC_REQUIRED.USECASE);
    let res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        applicationIdentifier: application_identifier,
        role,
        taskId,
        comments: comment
      })
    });
    if (res && res.status === 200) {
      this.setState({ isLoading: false, submitted: true });
      this.resetState();
      this.props.refreshList();
      return;
    }
    this.setState({ isLoading: false, failed: true });
  };

  certifyFee = async taskId => {
    this.setState({ isLoading: true });
    const { application_identifier, role } = this.props;
    let url = getURL(apiConstants.CERTIFY_FEE.USECASE);
    let res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        applicationIdentifier: application_identifier,
        role,
        taskId
      })
    });
    if (res && res.status === 200) {
      this.setState({ isLoading: false, submitted: true });
      this.resetState();
      this.props.refreshList();
      return;
    }
    this.setState({ isLoading: false, failed: true });
  };

  approveApplicationPP = async taskId => {
    this.setState({ isLoading: true });
    const { application_identifier, role } = this.props;
    const { comment } = this.state;
    let url = getURL(apiConstants.APPROVE_POST_PROCESSING.USECASE);
    let res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        applicationIdentifier: application_identifier,
        comments: comment,
        role,
        taskId
      })
    });
    if (res && res.status === 200) {
      this.setState({ isLoading: false, submitted: true });
      this.resetState();
      this.props.refreshList();
      return;
    }
    this.setState({ isLoading: false, failed: true });
  };

  rejectApplicationPP = async taskId => {
    this.setState({ isLoading: true });
    const { application_identifier, role } = this.props;
    const { comment } = this.state;
    let url = getURL(apiConstants.REJECT_POST_PROCESSING.USECASE);
    let res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        applicationIdentifier: application_identifier,
        comments: comment,
        role,
        taskId
      })
    });
    if (res && res.status === 200) {
      this.setState({ isLoading: false, submitted: true });
      this.resetState();
      this.props.refreshList();
      return;
    }
    this.setState({ isLoading: false, failed: true });
  };

  renderFileUpload = role => {
    const { isUploading } = this.state;
    return (
      <Col xs='12'>
        <FormGroup>
          <label htmlFor='file' style={{ marginBottom: 0 }}>
            <strong>Review Document</strong>
          </label>
          <Row className='align-items-center justify-content-center justify-content-md-start'>
            <Col xs='12' md='9'>
              <FormInput
                id='file'
                type='file'
                accept='.pdf'
                name='review'
                // disabled={this.state[file + '_uploaded']}
                style={{ marginTop: 10 }}
                onChange={event => {
                  if (event.target.value && event.target.value.length > 0)
                    this.setState({
                      ...this.state,
                      review_name: event.target.value,
                      review: event.target.files[0],
                      review_uploaded: false,
                      review_selected_for_upload: false
                    });
                }}
              />
            </Col>
            {this.state['review_selected_for_upload'] ? (
              this.state['review_uploaded'] ? (
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
            ) : this.state['review'] ? (
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
                      await this.uploadFile(
                        role + '_review',
                        this.state['review']
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

  renderComment = () => (
    <Col xs='12'>
      <FormGroup>
        <label htmlFor='comment'>
          <strong>Comments</strong>
        </label>
        <FormTextarea
          id='#comment'
          placeholder='Enter Comment'
          name='comment'
          onChange={this.addComment}
        />
      </FormGroup>
    </Col>
  );

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

  renderNocAdmin = (role, taskId) => {
    return (
      <Fragment>
        {this.renderComment()}
        {this.renderFileUpload(role)}
        {this.renderRadioBtn()}
        <Col xs='12'>
          <Button
            theme='success'
            disabled={!(this.state.comment && this.state.status !== '')}
            onClick={this.submitReview.bind(this, role, taskId)}
            style={{ padding: 10, marginTop: 10 }}
          >
            Submit
          </Button>
        </Col>
      </Fragment>
    );
  };

  renderDCAndMCAdmin = role => {
    return (
      <Fragment>
        {this.renderComment()}
        {this.renderFileUpload(role)}
        <Col xs='12'>
          <Button
            theme='success'
            disabled={!this.state.comment}
            onClick={this.submitComment.bind(this, role)}
            style={{ padding: 10, marginTop: 10 }}
          >
            Submit
          </Button>
        </Col>
      </Fragment>
    );
  };

  renderPPTISI = (role, taskId, task_type) => {
    return (
      <PostVerification
        key={this.props.application_identifier}
        role={role}
        taskId={taskId}
        taskType={task_type}
        userDetails={this.props.userDetails}
        application_identifier={this.props.application_identifier}
        onSuccess={() => {
          this.setState({ isLoading: false, submitted: true });
          this.resetState();
        }}
        onError={() => this.setState({ isLoading: false, failed: true })}
        onLoading={() => this.setState({ isLoading: true })}
        refreshList={this.props.refreshList}
      />
    );
  };

  renderScrutinityApplicationReview = (role, isShortfall, taskId) => {
    return (
      <Fragment>
        {this.renderComment()}
        {this.renderFileUpload(role)}
        <Row
          className='align-items-center justify-content-center'
          style={{ marginTop: 15 }}
        >
          <Col xs='auto'>
            <Button
              theme='success'
              disabled={!this.state.comment}
              onClick={this.approveApplication.bind(this, taskId)}
              style={{ padding: 10, marginTop: 10 }}
            >
              Approve
            </Button>
          </Col>
          {isShortfall ? (
            <Col xs='auto'>
              <Button
                theme='warning'
                disabled={!this.state.comment}
                onClick={this.rejectApplication.bind(this, true, taskId)}
                style={{ padding: 10, marginTop: 10 }}
              >
                Shortfall
              </Button>
            </Col>
          ) : null}
          <Col xs='auto'>
            <Button
              theme='danger'
              disabled={!this.state.comment}
              onClick={this.rejectApplication.bind(this, false, taskId)}
              style={{ padding: 10, marginTop: 10 }}
            >
              Reject
            </Button>
          </Col>
        </Row>
      </Fragment>
    );
  };

  renderScrutinyRPPC = (role, taskId) => {
    return (
      <Fragment>
        {this.renderComment()}
        {this.renderFileUpload(role)}
        <Row
          className='align-items-center justify-content-center'
          style={{ marginTop: 15 }}
        >
          <Col xs='auto'>
            <Button
              theme='success'
              disabled={!this.state.comment}
              onClick={this.submitPreProceedingConditions.bind(this, taskId)}
              style={{ padding: 10, marginTop: 10 }}
            >
              Submit
            </Button>
          </Col>
          <Col xs='auto'>
            <Button
              theme='danger'
              disabled={!this.state.comment}
              onClick={this.rejectApplication.bind(this, false, taskId)}
              style={{ padding: 10, marginTop: 10 }}
            >
              Reject
            </Button>
          </Col>
        </Row>
      </Fragment>
    );
  };

  renderScrutinityRADS = taskId => {
    return (
      <Fragment>
        {this.renderComment()}
        <Row>
          <Col xs='auto'>
            <Button
              theme='success'
              style={{ padding: 10, marginTop: 10 }}
              onClick={this.noDocsRequired.bind(this, taskId)}
            >
              No Additional Documets Reqd.
            </Button>
          </Col>
          <Col xs='auto'>
            <Button
              theme='danger'
              style={{ padding: 10, marginTop: 10 }}
              onClick={this.requestAdditionDocument.bind(this, taskId)}
            >
              Request Additional Document
            </Button>
          </Col>
        </Row>
      </Fragment>
    );
  };

  renderScrutinityFC = taskId => {
    return (
      <Fragment>
        <Row>
          <Col xs='auto'>
            <Button
              theme='success'
              style={{ padding: 10, marginTop: 10 }}
              onClick={this.certifyFee.bind(this, taskId)}
            >
              Approve
            </Button>
          </Col>
          <Col>
            <Col xs='auto'>
              <Button
                theme='danger'
                onClick={this.rejectApplication.bind(this, false, taskId)}
                style={{ padding: 10, marginTop: 10 }}
              >
                Reject
              </Button>
            </Col>
          </Col>
        </Row>
      </Fragment>
    );
  };

  renderPostProcessingApproveTSO = taskId => {
    return (
      <Fragment>
        <Row>
          <Col xs='auto'>
            <Button
              theme='success'
              style={{ padding: 10, marginTop: 10 }}
              onClick={this.approveApplicationPP.bind(this, taskId)}
            >
              Approve Post Processing
            </Button>
          </Col>
          <Col>
            <Col xs='auto'>
              <Button
                theme='danger'
                onClick={this.rejectApplicationPP.bind(this, taskId)}
                style={{ padding: 10, marginTop: 10 }}
              >
                Reject Application
              </Button>
            </Col>
          </Col>
        </Row>
      </Fragment>
    );
  };

  renderSSAdmin = tasks => {
    return (
      <Fragment>
        {tasks.map(i => (
          <TaskReassign
            key={i.id}
            task={i}
            application_identifier={this.props.application_identifier}
            onSuccess={() =>
              this.setState({ isLoading: false, submitted: true })
            }
            onError={() => this.setState({ isLoading: false, failed: true })}
            onLoading={() => this.setState({ isLoading: true })}
            refreshList={this.props.refreshList}
          />
        ))}
      </Fragment>
    );
  };

  renderAction = () => {
    const {
      userDetails: { user_id } = {},
      workflow: { tasks = [] } = {}
    } = this.props;
    const role = this.props.role;
    let tksDetails = tasks.filter(
        i => i.assigned_to === role && i.status == 'IN_PROGRESS'
      ),
      tks = tksDetails.map(i => i.task_type);
    let ind = 0;
    if (role === 'DISTRICT_COLLECTOR' || role === 'MUNICIPAL_COMMISSIONER') {
      return this.renderDCAndMCAdmin(role);
    } else if (role === 'APPLICATION_AND_TASK_MANAGER') {
      tksDetails = tasks.filter(i => i.assigned_to_user_id === user_id);
      if (tksDetails.length === 0) return null;
      return this.renderSSAdmin(tksDetails);
    } else if (tksDetails[0]) {
      if (role === 'TECHNICAL_SCRUTINY_OFFICER') {
        if (tks.length > 0) {
          if ((ind = tks.indexOf('FEE_CERTIFICATION')) > -1)
            return this.renderScrutinityFC(tksDetails[ind].id);
          else if (
            (ind = tks.indexOf('REQUEST_PRE_PROCEEDING_CONDITIONS')) > -1
          )
            return this.renderScrutinyRPPC(role, tksDetails[ind].id);
          else if ((ind = tks.indexOf('REQUEST_ADDITIONAL_DOCUMENTS')) > -1)
            return this.renderScrutinityRADS(tksDetails[ind].id);
          else if ((ind = tks.indexOf('SHORTFALL_REVIEW')) > -1)
            return this.renderScrutinityApplicationReview(
              role,
              false,
              tksDetails[ind].id
            );
          else if (
            (ind = tks.indexOf('POST_PROCESSING_APPLICATION_REVIEW')) > -1
          )
            return this.renderPPTISI(
              role,
              tksDetails[ind].id,
              tksDetails[ind].task_type
            );
          else if ((ind = tks.indexOf('POST_PROCESSING_FINAL_REVIEW')) > -1)
            return this.renderPostProcessingApproveTSO(
              role,
              tksDetails[ind].id
            );
          else
            return this.renderScrutinityApplicationReview(
              role,
              true,
              tksDetails[0].id
            );
        }
      } else if (role === 'TITLE_INSPECTOR' || role === 'SITE_INSPECTOR') {
        return this.renderPPTISI(
          role,
          tksDetails[0].id,
          tksDetails[0].task_type
        );
      } else {
        return this.renderNocAdmin(role, tksDetails[0].id);
      }
    }
  };

  render() {
    const { isUploading, isLoading, submitted, failed } = this.state;
    return (
      <Fragment>
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
                Review Successfully submitted
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
                Failed to submit review
              </Alert>
            ) : null}
            <Row>
              <Col style={{ padding: 0 }}>
                <Card>
                  <CardBody>{this.renderAction()}</CardBody>
                </Card>
              </Col>
            </Row>
          </LoadingOverlay>
        </Container>
      </Fragment>
    );
  }
}

export default AdminActionComponent;

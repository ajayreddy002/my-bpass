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
import { Router } from '../routes';
import apiConstants from '../constants/apiConstants';
import colorConstants from '../constants/colorConstants';
import fetch from 'isomorphic-unfetch';
import { getTranslatedText } from '../utils/translationUtils';

class CitizenPreProceedingTaskAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      isLoading: true,
      submitted: false,
      failed: false,
      reviewTask: null
    };
    this.timeout = null;
  }

  componentDidMount() {
    const { applicationData: { workflow } = {} } = this.props;
    const tasks = (workflow && workflow.tasks) || [];
    let tks = tasks.filter(
      i =>
        i.status == 'COMPLETED' &&
        i.task_type === 'REQUEST_PRE_PROCEEDING_CONDITIONS'
    );
    if (tks.length === 1) {
      this.setState({ reviewTask: tks[0], isLoading: false });
    } else {
      //TODO: Sort by time to take the latest
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  submit = async role => {
    this.setState({ isLoading: true });
    const { applicationId, language } = this.props;
    const { file } = this.state;
    let url = getURL(apiConstants.APPLICANT_PRE_PROCEEDING_ACCEPT.USECASE);
    url = alterParamsForUrl(url, { application_id: applicationId });
    let res = await fetch(url);

    if (res && res.status === 200) {
      this.setState({ isLoading: false, submitted: true });
      this.timeout = setTimeout(() => {
        Router.replaceRoute('redirect', { applicationId, language });
      }, 1000);
      return;
    }
    this.setState({ isLoading: false, failed: true });
  };

  render() {
    const { isLoading, submitted, failed, reviewTask } = this.state;
    return (
      <Container className='mt-5'>
        <LoadingOverlay
          active={isLoading}
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
              Pre-proceeding conditions accepted successfully
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
              Error occured ! Please try after sometime
            </Alert>
          ) : null}
          {reviewTask && (
            <Row>
              <Col style={{ padding: 0 }}>
                <Card>
                  <CardHeader>
                    {getTranslatedText('heading.citizenAction')}
                  </CardHeader>
                  <CardBody>
                    <Row
                      className='align-items-center justify-content-center'
                      style={{ marginTop: 15 }}
                    >
                      <Col xs='auto'>
                        <p>
                          Technical Scrutiny officer (
                          {reviewTask.assigned_to_user_id}) has requested you to
                          accept the following conditions
                        </p>
                        <p>
                          <strong>{reviewTask.task_review.feedback}</strong>
                        </p>
                      </Col>
                      {/* TODO: Render uploaded doc */}
                    </Row>
                    <Row
                      className='align-items-center justify-content-center'
                      style={{ marginTop: 15 }}
                    >
                      <Col xs='auto'>
                        <Button
                          theme='success'
                          onClick={this.submit}
                          style={{ padding: 10, marginTop: 10 }}
                        >
                          Accept conditions
                        </Button>
                      </Col>
                    </Row>
                    <Row
                      className='align-items-center justify-content-center'
                      style={{ marginTop: 15 }}
                    >
                      <Col xs='auto'>
                        <p className='text-danger'>
                          You can choose to not accept this condition, the
                          application will auto reject after assigned time
                        </p>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </LoadingOverlay>
      </Container>
    );
  }
}

export default CitizenPreProceedingTaskAction;

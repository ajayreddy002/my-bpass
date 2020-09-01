import { Card, CardBody, CardHeader } from 'shards-react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import React, { Component, Fragment } from 'react';
import { alterParamsForUrl, getURL } from '../utils/urlUtils';

import { FiDownload } from 'react-icons/fi';
import apiConstants from '../constants/apiConstants';
import moment from 'moment';

const SIUploads = [
  'SITE_INSPECTOR_REVIEW_IMAGE_ONE',
  'SITE_INSPECTOR_REVIEW_IMAGE_ONE'
];
class AdminFeedbackCard extends Component {
  renderTask = (task, uploads) => {
    const {
      task_review,
      task_type,
      assigned_to,
      status,
      ulb_name,
      expires_on
    } = task;
    const { application_identifier } = this.props;
    let ppObj = null;
    let url = getURL(apiConstants.DOWNLOAD_DOCUMENTS.USECASE);
    const link = file_type =>
      alterParamsForUrl(url, {
        identifier: application_identifier,
        file_type
      });

    uploads = uploads.filter(i => SIUploads.indexOf(i.file_type) > -1);
    try {
      ppObj =
        task_review && task_review.feedback && JSON.parse(task_review.feedback);
    } catch (e) {
      ppObj = null;
    }
    return (
      <Fragment key={task.id}>
        <Row className='align-items-center justify-content-start mt-2'>
          <Col xs='12'>
            <h5
              style={{
                color: '#1d9a5b',
                fontSize: '16px',
                paddingLeft: '1.875rem',
                paddingRight: '1.875rem'
              }}
            >
              {`${task_type.replace(/_/g, ' ')}: (${assigned_to.replace(
                /_/g,
                ' '
              )})`}
            </h5>
          </Col>
        </Row>
        <Row className='align-items-center justify-content-start'>
          <Col>
            <ListGroup>
              <Row className='align-items-center justify-content-between'>
                <Col xs='12' md='6' className='text-left'>
                  <ListGroup.Item style={{ border: 'none' }}>
                    <span>
                      <b>Status: </b>
                      {status}
                    </span>
                  </ListGroup.Item>
                </Col>
                <Col xs='12' md='6' className='text-left'>
                  {status == 'IN_PROGRESS' && (
                    <ListGroup.Item style={{ border: 'none' }}>
                      <span>
                        <b>Auto closes at: </b>
                        {moment(expires_on).format('ll h:mm a')}
                      </span>
                    </ListGroup.Item>
                  )}
                </Col>
                {task_review ? (
                  <Fragment>
                    {ppObj ? (
                      Object.keys(ppObj).map((i, index) => (
                        <Col key={i} xs='12' md='6' className='text-left'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='6'>
                                <b>{i}:</b>
                              </Col>
                              <Col>{ppObj[i]}</Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>
                      ))
                    ) : (
                      <Col xs='12' md='6' className='text-left'>
                        <ListGroup.Item style={{ border: 'none' }}>
                          <span>
                            <b>Feedback: </b>
                            {task_review.feedback}
                          </span>
                        </ListGroup.Item>
                      </Col>
                    )}
                    {// assigned_to === 'SITE_INSPECTOR' && uploads.length ? uploads.map((file) => {
                    uploads.length
                      ? uploads.map(file => {
                          const { file_url, file_type } = file;
                          return (
                            <Col
                              xs='12'
                              md='6'
                              key={file_url}
                              className='text-left'
                            >
                              <ListGroup.Item style={{ border: 'none' }}>
                                <span>
                                  <b>Review Document: </b>
                                </span>
                                <div className='uploaded-item'>
                                  <a href={link(file_type)} target='_blank'>
                                    Download
                                    <FiDownload
                                      style={{
                                        fontSize: 20,
                                        marginLeft: 10,
                                        color: 'blue'
                                      }}
                                    />
                                  </a>
                                </div>
                              </ListGroup.Item>
                            </Col>
                          );
                        })
                      : null}
                    {task_review.fileLocation ? (
                      <Col xs='12' md='6' className='text-left'>
                        <ListGroup.Item style={{ border: 'none' }}>
                          <span>
                            <b>Review Document: </b>
                          </span>
                          <div className='uploaded-item'>
                            <a
                              href={link(assigned_to + '_review')}
                              target='_blank'
                            >
                              Download
                              <FiDownload
                                style={{
                                  fontSize: 20,
                                  marginLeft: 10,
                                  color: 'blue'
                                }}
                              />
                            </a>
                          </div>
                        </ListGroup.Item>
                      </Col>
                    ) : null}
                  </Fragment>
                ) : null}
              </Row>
            </ListGroup>
          </Col>
        </Row>
        <hr />
      </Fragment>
    );
  };
  render() {
    let {
      userDetails: { entitlements = [] } = {},
      workflow: { tasks = [] } = {},
      uploads = [],
      role
    } = this.props;
    if (role !== 'TECHNICAL_SCRUTINY_OFFICER') {
      return null;
    }
    tasks = _.sortBy(tasks, [
      function(o) {
        return o.id;
      }
    ]);
    return (
      <Container className='mt-5' style={{ padding: 0 }}>
        <Card>
          <CardHeader>Officer's Tasks</CardHeader>
          <CardBody>
            {tasks.map(task => this.renderTask(task, uploads))}
          </CardBody>
        </Card>
      </Container>
    );
  }
}

export default AdminFeedbackCard;

import { Card, CardBody, CardHeader } from 'shards-react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import React, { Component, Fragment } from 'react';
import { alterParamsForUrl, getURL } from '../utils/urlUtils';

import { FiDownload } from 'react-icons/fi';
import apiConstants from '../constants/apiConstants';
import moment from 'moment';

class CitizenFeedbackCard extends Component {
  renderTask = task => {
    const {
      task_review,
      task_type,
      assigned_to,
      status,
      ulb_name,
      expires_on
    } = task;
    const { application_identifier } = this.props;
    if (!task_review) return null;
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
              {`${task_type.replace(/_/g, ' ')}`}
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
                      <b>Feedback: </b>
                      {task_review.feedback}
                    </span>
                  </ListGroup.Item>
                </Col>
              </Row>
            </ListGroup>
          </Col>
        </Row>
        <hr />
      </Fragment>
    );
  };
  render() {
    let { workflow: { tasks = [] } = {} } = this.props;
    tasks = tasks.filter(
      i =>
        i.status === 'COMPLETED' &&
        i.assigned_to === 'TECHNICAL_SCRUTINY_OFFICER'
    );
    if (tasks.length === 0) return null;
    return (
      <Container className='mt-5' style={{ padding: 0 }}>
        <Card>
          <CardHeader>Officer's Feedback</CardHeader>
          <CardBody>{tasks.map(task => this.renderTask(task))}</CardBody>
        </Card>
      </Container>
    );
  }
}

export default CitizenFeedbackCard;

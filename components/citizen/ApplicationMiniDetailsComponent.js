import { Card, CardBody } from 'shards-react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import React, { Component } from 'react';

import { DISPLAY_STATUS } from '../../constants/applicationStatusConstants';
import { getTranslatedText } from '../../utils/translationUtils';

class ApplicationMiniDetailsComponents extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { applicationDetails } = this.props;
    return (
      <Card style={{ margin: 'auto' }}>
        <CardBody>
          <Row>
            <Col xs='12' className='text-center'>
              <h4
                style={{
                  color: '#1d9a5b',
                  paddingLeft: '1.875rem',
                  paddingRight: '1.875rem'
                }}
              >
                {getTranslatedText('heading.application')}
              </h4>
            </Col>
          </Row>
          <Row className='align-items-center justify-content-around'>
            <Col xs='12'>
              <ListGroup>
                <Row>
                  <Col xs='12'>
                    <ListGroup.Item style={{ border: 'none' }}>
                      <Row>
                        <Col xs='12' md='6'>
                          <span>
                            <b> {getTranslatedText('label.status')}: </b>
                          </span>
                        </Col>
                        <Col xs='12' md='6'>
                          <span>
                            {DISPLAY_STATUS[applicationDetails.status]}
                          </span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </Col>
                  <Col xs='12'>
                    <ListGroup.Item style={{ border: 'none' }}>
                      <Row>
                        <Col xs='12' md='6'>
                          <span>
                            <b>
                              {' '}
                              {getTranslatedText('label.application_id')}:{' '}
                            </b>
                          </span>
                        </Col>
                        <Col xs='12' md='6'>
                          <span>
                            {applicationDetails.application_identifier}
                          </span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </Col>
                </Row>
              </ListGroup>
            </Col>
          </Row>
          <Row>
            {/* Applicant name */}
            <Col xs='12'>
              <ListGroup.Item style={{ border: 'none' }}>
                <Row>
                  <Col xs='12' md='6'>
                    <span>
                      <b> {getTranslatedText('label.applicant_name')}: </b>
                    </span>
                  </Col>
                  <Col xs='12' md='6'>
                    <span>{applicationDetails.name}</span>
                  </Col>
                </Row>
              </ListGroup.Item>
            </Col>

            {/* Mobile  number */}
            <Col xs='12'>
              <ListGroup.Item style={{ border: 'none' }}>
                <Row>
                  <Col xs='12' md='6'>
                    <span>
                      <b> {getTranslatedText('label.mobile_number')}: </b>
                    </span>
                  </Col>
                  <Col xs='12' md='6'>
                    <span>{applicationDetails.phone_number}</span>
                  </Col>
                </Row>
              </ListGroup.Item>
            </Col>

            {/* Plot area as per registered document */}
            <Col xs='12' md='12'>
              <ListGroup.Item style={{ border: 'none' }}>
                <Row>
                  <Col xs='12' md='6'>
                    <span>
                      <b>
                        {getTranslatedText('label.plot_area_as_per_document')}:
                      </b>
                    </span>
                  </Col>
                  <Col xs='12' md='6'>
                    <span>
                      {applicationDetails.plot_area_as_per_document + ' sq.m'}
                    </span>
                  </Col>
                </Row>
              </ListGroup.Item>
            </Col>

            {/* Plot area as on ground */}
            <Col xs='12' md='12'>
              <ListGroup.Item style={{ border: 'none' }}>
                <Row>
                  <Col xs='12' md='6'>
                    <span>
                      <b>{getTranslatedText('label.actual_plot_area')}:</b>
                    </span>
                  </Col>
                  <Col xs='12' md='6'>
                    <span>{applicationDetails.actual_plot_area + ' sq.m'}</span>
                  </Col>
                </Row>
              </ListGroup.Item>
            </Col>

            {/* Plot Number */}
            <Col xs='12' md='12'>
              <ListGroup.Item style={{ border: 'none' }}>
                <Row>
                  <Col xs='12' md='6'>
                    <span>
                      <b>{getTranslatedText('label.plot_no')}:</b>
                    </span>
                  </Col>
                  <Col xs='12' md='6'>
                    <span>{applicationDetails.plot_no}</span>
                  </Col>
                </Row>
              </ListGroup.Item>
            </Col>

            {/* Locality */}
            <Col xs='12'>
              <ListGroup.Item style={{ border: 'none' }}>
                <Row>
                  <Col xs='12' md='6'>
                    <span>
                      <b>{getTranslatedText('label.locality')}:</b>
                    </span>
                  </Col>
                  <Col xs='12' md='6'>
                    <span>{applicationDetails.locality}</span>
                  </Col>
                </Row>
              </ListGroup.Item>
            </Col>
            {/* Address */}
            <Col xs='12'>
              <ListGroup.Item style={{ border: 'none' }}>
                <Row>
                  <Col xs='12' md='6'>
                    <span>
                      <b>{getTranslatedText('label.address')}:</b>
                    </span>
                  </Col>
                  <Col xs='12' md='6'>
                    <span>{applicationDetails.address}</span>
                  </Col>
                </Row>
              </ListGroup.Item>
            </Col>

            {/* Municipality */}
            <Col xs='12'>
              <ListGroup.Item style={{ border: 'none' }}>
                <Row>
                  <Col xs='12' md='6'>
                    <span>
                      <b>{getTranslatedText('label.ulb_name')}:</b>
                    </span>
                  </Col>
                  <Col xs='12' md='6'>
                    <span>{applicationDetails.ulb_name}</span>
                  </Col>
                </Row>
              </ListGroup.Item>
            </Col>

            {/* Mandal */}
            <Col xs='12'>
              <ListGroup.Item style={{ border: 'none' }}>
                <Row>
                  <Col xs='12' md='6'>
                    <span>
                      <b>{getTranslatedText('label.mandal')}:</b>
                    </span>
                  </Col>
                  <Col xs='12' md='6'>
                    <span>{applicationDetails.mandal}</span>
                  </Col>
                </Row>
              </ListGroup.Item>
            </Col>

            {/* Village */}
            {applicationDetails.village && (
              <Col xs='12'>
                <ListGroup.Item style={{ border: 'none' }}>
                  <Row>
                    <Col xs='12' md='6'>
                      <span>
                        <b>{getTranslatedText('label.village')}:</b>
                      </span>
                    </Col>
                    <Col xs='12' md='6'>
                      <span>{applicationDetails.village}</span>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </Col>
            )}
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default ApplicationMiniDetailsComponents;

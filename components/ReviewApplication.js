import { Button, Card, CardBody, CardHeader } from 'shards-react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import floorDisplayNameConstants, {
  FLOOR_ORDER
} from '../constants/floorDisplayNameConstants';

import { DISPLAY_STATUS } from '../constants/applicationStatusConstants';
import React from 'react';
import { Router } from '../routes';
import architect_detail_fields from '../constants/layout/architect_detail_fields';
import builder_detail_fields from '../constants/layout/builder_detail_fields';
import { filter } from 'lodash';
import fire_department_fields from '../constants/fire_department_fields';
import { getTranslatedText } from '../utils/translationUtils';
import layout_property_fields from '../constants/layout/layout_property_fields';
import noc_processing_fields from '../constants/layout/noc_processing_fields';
import stringConstants from '../constants/stringConstants';
import structural_engineer_fields from '../constants/layout/structural_engineer_fields';
import surveyor_detail_fields from '../constants/layout/surveyor_detail_fields';
import town_planner_detail_fields from '../constants/layout/town_planner_detail_fields';

export default class ReviewApplication extends React.Component {
  getLabelTextAlignment = () => {
    if (this.props.textAlign) {
      return this.props.textAlign;
    }
  };

  edit = () => {
    const { applicationData, language } = this.props;
    Router.replaceRoute('review', {
      applicationId: applicationData.applicationId,
      language
    });
  };

  renderLayoutReview = applicationData => {
    return (
      <Container>
        <Row>
          <Col style={{ padding: 0 }}>
            <Card>
              <CardHeader>
                {getTranslatedText('heading.review_your_details')}
                {applicationData.status == 'SHORTFALL' && this.props.language && (
                  <Button
                    theme='success'
                    onClick={this.edit}
                    style={{ marginLeft: 10 }}
                  >
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs='12'>
                    <h4
                      style={{
                        color: '#1d9a5b',
                        paddingLeft: '1.875rem',
                        paddingRight: '1.875rem'
                      }}
                      className={this.getLabelTextAlignment()}
                    >
                      {getTranslatedText('heading.application')}
                    </h4>
                  </Col>
                </Row>
                <Row className='align-items-center justify-content-around'>
                  <Col xs='12'>
                    <ListGroup>
                      <Row>
                        <Col xs='12' md='6' className='text-left'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <span>
                              <b>{getTranslatedText('label.status')}: </b>
                              {DISPLAY_STATUS[applicationData.status]}
                            </span>
                          </ListGroup.Item>
                        </Col>

                        <Col xs='12' md='6'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <span>
                              <b>
                                {getTranslatedText('label.application_id')}:
                              </b>{' '}
                              {applicationData.applicationId}
                            </span>
                          </ListGroup.Item>
                        </Col>
                      </Row>
                    </ListGroup>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs='12'>
                    <h4
                      style={{
                        color: '#1d9a5b',
                        paddingLeft: '1.875rem',
                        paddingRight: '1.875rem'
                      }}
                      className={this.getLabelTextAlignment()}
                    >
                      {getTranslatedText('heading.applicant_details')}
                    </h4>
                  </Col>
                </Row>
                <Row className='align-items-center justify-content-start'>
                  <Col xs='12'>
                    <ListGroup>
                      <Row className='align-items-center justify-content-between'>
                        <Col xs='12' md='12'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {getTranslatedText('label.applicant_name')}:
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>
                                  {applicationData.name + ' '}
                                  {applicationData['relationship_type']
                                    .toLowerCase()
                                    .charAt(0) + '/o '}
                                  {applicationData.relationship_name}
                                </span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Aadhar number */}
                        <Col xs='12' md='6'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {getTranslatedText('label.aadhaar_number')}:
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>{applicationData.aadhaar_number}</span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Mobile  number */}
                        <Col xs='12' md='6'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {' '}
                                    {getTranslatedText(
                                      'label.mobile_number'
                                    )}:{' '}
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>{applicationData.phone_number}</span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Email address */}
                        {applicationData.email && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='4'>
                                  <span>
                                    <b>
                                      {getTranslatedText('label.email_id')}:
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='8'>
                                  <span>{applicationData.email}</span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}

                        {/* Contact address */}
                        <Col xs='12' md='6'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {getTranslatedText('label.contact_address')}
                                    :
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>{applicationData.contact_address}</span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>
                      </Row>
                    </ListGroup>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs='12'>
                    <h4
                      style={{
                        color: '#1d9a5b',
                        paddingLeft: '1.875rem',
                        paddingRight: '1.875rem'
                      }}
                      className={this.getLabelTextAlignment()}
                    >
                      {getTranslatedText('heading.co_applicant_details')}
                    </h4>
                  </Col>
                </Row>

                <Row className='align-items-center justify-content-start'>
                  <Col xs='12'>
                    <ListGroup>
                      <Row className='align-items-center justify-content-between'>
                        <Col xs='12' md='6'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {getTranslatedText(
                                      'label.co_applicant_name'
                                    )}
                                    :
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>
                                  {applicationData.co_applicant_name + ' '}
                                  {applicationData[
                                    'co_applicant_relationship_type'
                                  ]
                                    .toLowerCase()
                                    .charAt(0) + '/o '}
                                  {
                                    applicationData.co_applicant_relationship_name
                                  }
                                </span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>
                        <Col xs='12' md='6'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {getTranslatedText(
                                      'label.co_applicant_aadhaar_number'
                                    )}
                                    :
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>
                                  {applicationData.co_applicant_aadhaar_number}
                                </span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>
                      </Row>
                      <Row className='align-items-center justify-content-between'>
                        {applicationData.co_applicant_email ? (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='4'>
                                  <span>
                                    <b>
                                      {getTranslatedText(
                                        'label.co_applicant_email'
                                      )}
                                      :
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='8'>
                                  <span>
                                    {applicationData.co_applicant_email}
                                  </span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        ) : null}
                        <Col xs='12' md='6'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {getTranslatedText(
                                      'label.co_applicant_phone_number'
                                    )}
                                    :
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>
                                  {applicationData.co_applicant_phone_number}
                                </span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>
                      </Row>
                    </ListGroup>
                  </Col>
                </Row>
                <hr />
                <Row className='align-items-center justify-content-start'>
                  <Col xs='12'>
                    <ListGroup>
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{
                              color: '#1d9a5b',
                              paddingLeft: '1.875rem',
                              paddingRight: '1.875rem'
                            }}
                            className={this.getLabelTextAlignment()}
                          >
                            {getTranslatedText('heading.layout_details')}
                          </h4>
                        </Col>
                      </Row>
                      <Row className='align-items-center justify-content-between'>
                        {Object.keys(applicationData).map((data, index) => {
                          if (
                            data in layout_property_fields &&
                            applicationData[data] !== null
                          ) {
                            return (
                              <Col xs='12' md='6' key={index}>
                                <ListGroup.Item style={{ border: 'none' }}>
                                  <Row>
                                    <Col xs='12' md='7'>
                                      <span>
                                        <b>
                                          {getTranslatedText('label.' + data)}:
                                        </b>
                                      </span>
                                    </Col>
                                    <Col xs='12' md='5'>
                                      <span>
                                        {applicationData[data] === true ||
                                        applicationData[data] === false
                                          ? applicationData[data] === true
                                            ? 'Yes'
                                            : 'No'
                                          : applicationData[data]}
                                      </span>
                                    </Col>
                                  </Row>
                                </ListGroup.Item>
                              </Col>
                            );
                          }
                        })}
                      </Row>
                    </ListGroup>
                  </Col>
                </Row>
                <hr />
                <Row className='align-items-center justify-content-start'>
                  <Col xs='12'>
                    <ListGroup>
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{
                              color: '#1d9a5b',
                              paddingLeft: '1.875rem',
                              paddingRight: '1.875rem'
                            }}
                            className={this.getLabelTextAlignment()}
                          >
                            {getTranslatedText('heading.town_planner_details')}
                          </h4>
                        </Col>
                      </Row>
                      <Row className='align-items-center justify-content-between'>
                        {Object.keys(applicationData).map((data, index) => {
                          if (data in town_planner_detail_fields) {
                            return (
                              <Col xs='12' md='6' key={index}>
                                <ListGroup.Item style={{ border: 'none' }}>
                                  <Row>
                                    <Col xs='12' md='4'>
                                      <span>
                                        <b>
                                          {getTranslatedText('label.' + data)}:
                                        </b>
                                      </span>
                                    </Col>
                                    <Col xs='12' md='8'>
                                      <span>{applicationData[data]}</span>
                                    </Col>
                                  </Row>
                                </ListGroup.Item>
                              </Col>
                            );
                          }
                        })}
                      </Row>
                    </ListGroup>
                  </Col>
                </Row>
                <hr />
                <Row className='align-items-center justify-content-start'>
                  <Col xs='12'>
                    <ListGroup>
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{
                              color: '#1d9a5b',
                              paddingLeft: '1.875rem',
                              paddingRight: '1.875rem'
                            }}
                            className={this.getLabelTextAlignment()}
                          >
                            {getTranslatedText('heading.surveyor_details')}
                          </h4>
                        </Col>
                      </Row>
                      <Row className='align-items-center justify-content-between'>
                        {Object.keys(applicationData).map((data, index) => {
                          if (data in surveyor_detail_fields) {
                            return (
                              <Col xs='12' md='6' key={index}>
                                <ListGroup.Item style={{ border: 'none' }}>
                                  <Row>
                                    <Col xs='12' md='4'>
                                      <span>
                                        <b>
                                          {getTranslatedText('label.' + data)}:
                                        </b>
                                      </span>
                                    </Col>
                                    <Col xs='12' md='8'>
                                      <span>{applicationData[data]}</span>
                                    </Col>
                                  </Row>
                                </ListGroup.Item>
                              </Col>
                            );
                          }
                        })}
                      </Row>
                    </ListGroup>
                  </Col>
                </Row>
                <hr />
                <Row className='align-items-center justify-content-start'>
                  <Col xs='12'>
                    <ListGroup>
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{
                              color: '#1d9a5b',
                              paddingLeft: '1.875rem',
                              paddingRight: '1.875rem'
                            }}
                            className={this.getLabelTextAlignment()}
                          >
                            {getTranslatedText(
                              'heading.structural_engineer_details'
                            )}
                          </h4>
                        </Col>
                      </Row>
                      <Row>
                        {Object.keys(applicationData).map((data, index) => {
                          if (data in structural_engineer_fields) {
                            return (
                              <Col xs='12' md='6' key={index}>
                                <ListGroup.Item style={{ border: 'none' }}>
                                  <Row>
                                    <Col xs='12' md='4'>
                                      <span>
                                        <b>
                                          {getTranslatedText('label.' + data)}:
                                        </b>
                                      </span>
                                    </Col>
                                    <Col xs='12' md='8'>
                                      <span>{applicationData[data]}</span>
                                    </Col>
                                  </Row>
                                </ListGroup.Item>
                              </Col>
                            );
                          }
                        })}
                      </Row>
                    </ListGroup>
                  </Col>
                </Row>
                <hr />
                <Row className='align-items-center justify-content-start'>
                  <Col xs='12'>
                    <ListGroup>
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{
                              color: '#1d9a5b',
                              paddingLeft: '1.875rem',
                              paddingRight: '1.875rem'
                            }}
                            className={this.getLabelTextAlignment()}
                          >
                            {getTranslatedText('heading.architect_details')}
                          </h4>
                        </Col>
                      </Row>
                      <Row>
                        {Object.keys(applicationData).map((data, index) => {
                          if (data in architect_detail_fields) {
                            return (
                              <Col xs='12' md='6' key={index}>
                                <ListGroup.Item style={{ border: 'none' }}>
                                  <Row>
                                    <Col xs='12' md='4'>
                                      <span>
                                        <b>
                                          {getTranslatedText('label.' + data)}:
                                        </b>
                                      </span>
                                    </Col>
                                    <Col xs='12' md='8'>
                                      <span>{applicationData[data]}</span>
                                    </Col>
                                  </Row>
                                </ListGroup.Item>
                              </Col>
                            );
                          }
                        })}
                      </Row>
                    </ListGroup>
                  </Col>
                </Row>
                <hr />
                <Row className='align-items-center justify-content-start'>
                  <Col xs='12'>
                    <ListGroup>
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{
                              color: '#1d9a5b',
                              paddingLeft: '1.875rem',
                              paddingRight: '1.875rem'
                            }}
                            className={this.getLabelTextAlignment()}
                          >
                            {getTranslatedText('heading.builder_details')}
                          </h4>
                        </Col>
                      </Row>
                      <Row>
                        {Object.keys(applicationData).map((data, index) => {
                          if (data in builder_detail_fields) {
                            return (
                              <Col xs='12' md='6' key={index}>
                                <ListGroup.Item style={{ border: 'none' }}>
                                  <Row>
                                    <Col xs='12' md='4'>
                                      <span>
                                        <b>
                                          {getTranslatedText('label.' + data)}:
                                        </b>
                                      </span>
                                    </Col>
                                    <Col xs='12' md='8'>
                                      <span>{applicationData[data]}</span>
                                    </Col>
                                  </Row>
                                </ListGroup.Item>
                              </Col>
                            );
                          }
                        })}
                      </Row>
                    </ListGroup>
                  </Col>
                </Row>
                <hr />
                <Row className='align-items-center justify-content-start'>
                  <Col xs='12'>
                    <ListGroup>
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{
                              color: '#1d9a5b',
                              paddingLeft: '1.875rem',
                              paddingRight: '1.875rem'
                            }}
                            className={this.getLabelTextAlignment()}
                          >
                            {getTranslatedText(
                              'heading.noc_processing_details'
                            )}
                          </h4>
                        </Col>
                      </Row>
                      <Row>
                        {Object.keys(applicationData).map((data, index) => {
                          if (data in noc_processing_fields) {
                            return (
                              <Col xs='12' key={index}>
                                <ListGroup.Item style={{ border: 'none' }}>
                                  <Row>
                                    <Col xs='12' md='8'>
                                      <span>
                                        <b>
                                          {getTranslatedText('label.' + data)}:
                                        </b>
                                      </span>
                                    </Col>
                                    <Col xs='12' md='4'>
                                      <span>{applicationData[data]}</span>
                                    </Col>
                                  </Row>
                                </ListGroup.Item>
                              </Col>
                            );
                          }
                        })}
                      </Row>
                    </ListGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  };

  renderBuildingReview = applicationData => {
    var is_ground_floor_parking = 'NO',
      parking_built_up_area = 0;

    const parkingArea = filter(applicationData.floor_areas, { type: 'stilt' });
    if (parkingArea.length > 0) {
      is_ground_floor_parking = 'YES';
      parking_built_up_area = parkingArea[0].area;
    }
    return (
      <Container>
        <Row>
          <Col style={{ padding: 0 }}>
            <Card>
              <CardHeader>
                {getTranslatedText('heading.review_your_details')}
                {applicationData.status == 'SHORTFALL' && this.props.language && (
                  <Button
                    theme='success'
                    onClick={this.edit}
                    style={{ marginLeft: 10 }}
                  >
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs='12'>
                    <h4
                      style={{
                        color: '#1d9a5b',
                        paddingLeft: '1.875rem',
                        paddingRight: '1.875rem'
                      }}
                      className={this.getLabelTextAlignment()}
                    >
                      {getTranslatedText('heading.application')}
                    </h4>
                  </Col>
                </Row>
                <Row className='align-items-center justify-content-around'>
                  <Col xs='12'>
                    <ListGroup>
                      <Row>
                        <Col xs='12' md='6' className='text-left'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <span>
                              <b>{getTranslatedText('label.status')}: </b>
                              {DISPLAY_STATUS[applicationData.status]}
                            </span>
                          </ListGroup.Item>
                        </Col>

                        <Col xs='12' md='6'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <span>
                              <b>
                                {getTranslatedText('label.application_id')}:
                              </b>{' '}
                              {applicationData.applicationId}
                            </span>
                          </ListGroup.Item>
                        </Col>
                      </Row>
                    </ListGroup>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs='12'>
                    <h4
                      style={{
                        color: '#1d9a5b',
                        paddingLeft: '1.875rem',
                        paddingRight: '1.875rem'
                      }}
                      className={this.getLabelTextAlignment()}
                    >
                      {getTranslatedText('heading.applicant_details')}
                    </h4>
                  </Col>
                </Row>
                <Row className='align-items-center justify-content-start'>
                  <Col xs='12'>
                    <ListGroup>
                      <Row className='align-items-center justify-content-between'>
                        {/* Applicant name */}
                        <Col xs='12'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {getTranslatedText('label.applicant_name')}:
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>
                                  {applicationData.name + ' '}
                                  {applicationData['relationship_type']
                                    .toLowerCase()
                                    .charAt(0) + '/o '}
                                  {applicationData.relationship_name}
                                </span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Aadhar number */}
                        <Col xs='12'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {getTranslatedText('label.aadhaar_number')}:
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>{applicationData.aadhaar_number}</span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Mobile number */}
                        <Col xs='12'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {' '}
                                    {getTranslatedText(
                                      'label.mobile_number'
                                    )}:{' '}
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>{applicationData.phone_number}</span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* e-mail ID */}
                        {applicationData.email && (
                          <Col xs='12'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='4'>
                                  <span>
                                    <b>
                                      {getTranslatedText('label.email_id')}:
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='8'>
                                  <span>{applicationData.email}</span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}

                        {/* Contact address */}
                        <Col xs='12'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {getTranslatedText('label.contact_address')}
                                    :{' '}
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>{applicationData.contact_address}</span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>
                      </Row>
                      <ListGroup.Item style={{ border: 'none' }}>
                        <hr />
                      </ListGroup.Item>

                      {/* Plot details section */}
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{
                              color: '#1d9a5b',
                              paddingLeft: '1.875rem',
                              paddingRight: '1.875rem'
                            }}
                            className={this.getLabelTextAlignment()}
                          >
                            {getTranslatedText('heading.plot')}
                          </h4>
                        </Col>

                        {/* Plot area as per registered document */}
                        <Col xs='12' md='12'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {getTranslatedText(
                                      'label.plot_area_as_per_document'
                                    )}
                                    :
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>
                                  {applicationData.plot_area_as_per_document +
                                    ' sq.m'}
                                </span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Plot area as on ground */}
                        <Col xs='12' md='12'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {getTranslatedText(
                                      'label.actual_plot_area'
                                    )}
                                    :
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>
                                  {applicationData.actual_plot_area + ' sq.m'}
                                </span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Plot Number */}
                        <Col xs='12' md='12'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>{getTranslatedText('label.plot_no')}:</b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>{applicationData.plot_no}</span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Survey Number */}
                        <Col xs='12' md='12'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>{getTranslatedText('label.survey_no')}:</b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>{applicationData.survey_no}</span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Locality */}
                        <Col xs='12'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>{getTranslatedText('label.locality')}:</b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>{applicationData.locality}</span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Geo-link  coordinates */}
                        <Col xs='12'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {getTranslatedText(
                                      'label.geo_coordinate_url'
                                    )}
                                    :
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <a
                                  href={applicationData.geo_coordinate_url}
                                  target='_blank'
                                >
                                  {applicationData.geo_coordinate_url}
                                </a>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>
                        {/* Address */}
                        <Col xs='12'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>{getTranslatedText('label.address')}:</b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>{applicationData.address}</span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Municipality */}
                        <Col xs='12'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>{getTranslatedText('label.ulb_name')}:</b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>{applicationData.ulb_name}</span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Mandal */}
                        <Col xs='12' md='6'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>{getTranslatedText('label.mandal')}:</b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>{applicationData.mandal}</span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Village */}
                        {applicationData.village && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='4'>
                                  <span>
                                    <b>{getTranslatedText('label.village')}:</b>
                                  </span>
                                </Col>
                                <Col xs='12' md='8'>
                                  <span>{applicationData.village}</span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}

                        {/* Construction Type */}
                        <Col xs='12' md='6'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='8'>
                                <span>
                                  <b>
                                    {getTranslatedText(
                                      'label.construction_type'
                                    )}
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='4'>
                                <span>{applicationData.construction_type}</span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Building Usage */}
                        <Col xs='12' md='6'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {getTranslatedText('label.building_usage')}
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>{applicationData.building_usage}</span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Number of floors */}
                        <Col xs='12' md='6'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='4'>
                                <span>
                                  <b>
                                    {getTranslatedText('label.no_of_floors')}:
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='8'>
                                <span>
                                  {
                                    floorDisplayNameConstants[
                                      applicationData.no_of_floors
                                    ]
                                  }
                                </span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/* Roof Type */}
                        {applicationData.roof_type && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='4'>
                                  <span>
                                    <b>
                                      {getTranslatedText('label.roof_type')}:
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='8'>
                                  <span>{applicationData.roof_type}</span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}

                        {/* Is Ground floor parking */}
                        <Col xs='12' md='6'>
                          <ListGroup.Item style={{ border: 'none' }}>
                            <Row>
                              <Col xs='12' md='8'>
                                <span>
                                  <b>
                                    {getTranslatedText(
                                      'label.ground_floor_as_parking'
                                    )}
                                    :
                                  </b>
                                </span>
                              </Col>
                              <Col xs='12' md='4'>
                                <span>{is_ground_floor_parking}</span>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Col>

                        {/*Ground floor parking Area*/}
                        {parking_built_up_area > 0 && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='8'>
                                  <span>
                                    <b>
                                      {getTranslatedText('label.stiltInput')}:
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='4'>
                                  <span>{parking_built_up_area}</span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}
                      </Row>
                      <Row>
                        {/*Total Built up area*/}
                        {applicationData.total_built_up_area && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='8'>
                                  <span>
                                    <b>
                                      {getTranslatedText(
                                        'label.total_built_up_area'
                                      )}
                                      :
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='4'>
                                  <span>
                                    {applicationData.total_built_up_area}
                                  </span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}
                      </Row>
                      <Row>
                        {/* Plot status */}
                        {applicationData.plot_status && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='8'>
                                  <span>
                                    <b>
                                      {getTranslatedText('label.plot_status')}:
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='4'>
                                  <span>
                                    {applicationData.plot_status == 'Approved'
                                      ? 'Yes'
                                      : 'No'}
                                  </span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}
                        {/* LRS LP Input */}
                        {applicationData.lrs_lp_input && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='8'>
                                  <span>
                                    <b>
                                      {getTranslatedText('label.lrs_lp_input')}:
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='4'>
                                  <span>
                                    {applicationData.lrs_lp_input.toUpperCase()}
                                  </span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}
                        {/* LRS Number */}
                        {applicationData.lrs_no && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='4'>
                                  <span>
                                    <b>
                                      {getTranslatedText('label.lrs_number')}:
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='8'>
                                  <span>{applicationData.lrs_no}</span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}

                        {/* LP Number */}
                        {applicationData.lp_no && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='4'>
                                  <span>
                                    <b>
                                      {getTranslatedText('label.lp_number')}:
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='8'>
                                  <span>{applicationData.lp_no}</span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}

                        {/* Sale deed registration date */}
                        {applicationData.sale_deed_registration_date && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='8'>
                                  <span>
                                    <b>
                                      {getTranslatedText(
                                        'label.sale_deed_registration_date'
                                      )}
                                      :
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='4'>
                                  <span>
                                    {
                                      applicationData.sale_deed_registration_date
                                    }
                                  </span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}
                      </Row>

                      <ListGroup.Item style={{ border: 'none' }}>
                        <hr />
                      </ListGroup.Item>

                      {/* Road Width Details */}
                      <Row>
                        {/* Front Existing road detail */}
                        {applicationData.front_existing_road_width && (
                          <>
                            <Col xs='12'>
                              <h4
                                style={{
                                  color: '#1d9a5b',
                                  paddingLeft: '1.875rem',
                                  paddingRight: '1.875rem'
                                }}
                                className={this.getLabelTextAlignment()}
                              >
                                {getTranslatedText('heading.road_details')}
                              </h4>
                            </Col>
                            <Col xs='12' md='6'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='8'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.front_existing_road_width'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='4'>
                                    <span>
                                      {
                                        applicationData.front_existing_road_width
                                      }
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                          </>
                        )}
                      </Row>
                      <Row>
                        {/* Front Proposed road detail */}
                        {applicationData.front_proposed_road_width && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='8'>
                                  <span>
                                    <b>
                                      {getTranslatedText(
                                        'label.front_proposed_road_width'
                                      )}
                                      :
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='4'>
                                  <span>
                                    {applicationData.front_proposed_road_width}
                                  </span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}
                        {/* Front road affected area */}
                        {applicationData.front_road_affected_area && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='8'>
                                  <span>
                                    <b>
                                      {getTranslatedText(
                                        'label.front_road_affected_area'
                                      )}
                                      :
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='4'>
                                  <span>
                                    {applicationData.front_road_affected_area}
                                  </span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}
                      </Row>
                      <Row>
                        {/* Side 1 road details */}
                        {applicationData.is_side1_road_affected == 'true' && (
                          <>
                            <Col xs='12' md='6'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='8'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.side1_existing_road_width'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='4'>
                                    <span>
                                      {
                                        applicationData.side1_existing_road_width
                                      }
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                            <Col xs='12' md='6'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='8'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.side1_proposed_road_width'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='4'>
                                    <span>
                                      {
                                        applicationData.side1_proposed_road_width
                                      }
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                            <Col xs='12' md='6'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='8'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.side1_road_affected_area'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='4'>
                                    <span>
                                      {applicationData.side1_road_affected_area}
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                          </>
                        )}

                        {/* Side 2 road details */}
                        {applicationData.is_side2_road_affected == 'true' && (
                          <>
                            <Col xs='12' md='6'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='8'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.side2_existing_road_width'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='4'>
                                    <span>
                                      {
                                        applicationData.side2_existing_road_width
                                      }
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                            <Col xs='12' md='6'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='8'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.side2_proposed_road_width'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='4'>
                                    <span>
                                      {
                                        applicationData.side2_proposed_road_width
                                      }
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                            <Col xs='12' md='6'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='8'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.side2_road_affected_area'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='4'>
                                    <span>
                                      {applicationData.side2_road_affected_area}
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                          </>
                        )}

                        {/* Rear/Side 3 road details */}
                        {applicationData.is_rear_road_affected == 'true' && (
                          <>
                            <Col xs='12' md='6'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='8'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.rear_existing_road_width'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='4'>
                                    <span>
                                      {applicationData.rear_existing_road_width}
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                            <Col xs='12' md='6'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='8'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.rear_proposed_road_width'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='4'>
                                    <span>
                                      {applicationData.rear_proposed_road_width}
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                            <Col xs='12' md='6'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='8'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.rear_road_affected_area'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='4'>
                                    <span>
                                      {applicationData.rear_road_affected_area}
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                          </>
                        )}
                      </Row>

                      {(applicationData.front_setback > 0 ||
                        applicationData.other_setback > 0) && (
                        <ListGroup.Item style={{ border: 'none' }}>
                          <hr />
                        </ListGroup.Item>
                      )}

                      {/* Set back */}
                      <Row>
                        {(applicationData.front_setback > 0 ||
                          applicationData.other_setback > 0) && (
                          <>
                            <Col xs='12'>
                              <h4
                                style={{
                                  color: '#1d9a5b',
                                  paddingLeft: '1.875rem',
                                  paddingRight: '1.875rem'
                                }}
                                className={this.getLabelTextAlignment()}
                              >
                                {getTranslatedText('heading.setback_details')}
                              </h4>
                            </Col>
                            {/* Front setback */}
                            <Col xs='12' md='6'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='8'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.front_setback'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='4'>
                                    <span>{applicationData.front_setback}</span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                            {/* Other setback */}
                            <Col xs='12' md='6'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='8'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.other_setback'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='4'>
                                    <span>{applicationData.other_setback}</span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                          </>
                        )}
                      </Row>

                      <Row>
                        {/* Market Value */}
                        {applicationData.market_value && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='8'>
                                  <span>
                                    <b>
                                      {getTranslatedText('label.market_value')}:
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='4'>
                                  <span>{applicationData.market_value}</span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}

                        {/* Slum area */}
                        {applicationData.is_under_slum_area && (
                          <Col xs='12' md='12'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='8'>
                                  <span>
                                    <b>
                                      {getTranslatedText('label.slum_area')}:
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='4'>
                                  <span>
                                    {applicationData.is_under_slum_area ==
                                    'true'
                                      ? 'Yes'
                                      : 'No'}
                                  </span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}

                        {/* Slum name */}
                        {applicationData.slum_name && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='8'>
                                  <span>
                                    <b>
                                      {getTranslatedText('label.slum_name')}:
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='4'>
                                  <span>{applicationData.slum_name}</span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}

                        {/* Other Slum name */}
                        {applicationData.other_slum_name && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='6'>
                                  <span>
                                    <b>
                                      {getTranslatedText(
                                        'label.other_slum_name'
                                      )}
                                      :
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='6'>
                                  <span>{applicationData.other_slum_name}</span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}
                      </Row>

                      {/* Mortgage Details */}
                      <Row>
                        {applicationData.mortgage_area &&
                          applicationData.mortgage_area >= 0 && (
                            <>
                              <Col xs='12'>
                                <h4
                                  style={{
                                    color: '#1d9a5b',
                                    paddingLeft: '1.875rem',
                                    paddingRight: '1.875rem'
                                  }}
                                  className={this.getLabelTextAlignment()}
                                >
                                  {getTranslatedText(
                                    'heading.mortgage_details'
                                  )}
                                </h4>
                              </Col>

                              {/* Mortgage area */}
                              <Col xs='12' md='6'>
                                <ListGroup.Item style={{ border: 'none' }}>
                                  <Row>
                                    <Col xs='12' md='6'>
                                      <span>
                                        <b>
                                          {getTranslatedText(
                                            'label.mortgage_area'
                                          )}
                                          :
                                        </b>
                                      </span>
                                    </Col>
                                    <Col xs='12' md='6'>
                                      <span>
                                        {applicationData.mortgage_area}
                                      </span>
                                    </Col>
                                  </Row>
                                </ListGroup.Item>
                              </Col>

                              {/* Mortgage floor */}
                              {applicationData.mortgage_floor && (
                                <Col xs='12' md='6'>
                                  <ListGroup.Item style={{ border: 'none' }}>
                                    <Row>
                                      <Col xs='12' md='6'>
                                        <span>
                                          <b>
                                            {getTranslatedText(
                                              'label.mortgage_floor'
                                            )}
                                            :
                                          </b>
                                        </span>
                                      </Col>
                                      <Col xs='12' md='6'>
                                        <span>
                                          {
                                            FLOOR_ORDER[
                                              applicationData.mortgage_floor
                                            ]
                                          }
                                        </span>
                                      </Col>
                                    </Row>
                                  </ListGroup.Item>
                                </Col>
                              )}

                              {/* Mortgage document number */}
                              {applicationData.mortgage_document_number && (
                                <Col xs='12' md='6'>
                                  <ListGroup.Item style={{ border: 'none' }}>
                                    <Row>
                                      <Col xs='12' md='6'>
                                        <span>
                                          <b>
                                            {getTranslatedText(
                                              'label.mortgage_document_number'
                                            )}
                                            :
                                          </b>
                                        </span>
                                      </Col>
                                      <Col xs='12' md='6'>
                                        <span>
                                          {
                                            applicationData.mortgage_document_number
                                          }
                                        </span>
                                      </Col>
                                    </Row>
                                  </ListGroup.Item>
                                </Col>
                              )}

                              {/* Mortgage Date */}
                              {applicationData.mortgage_date && (
                                <Col xs='12' md='6'>
                                  <ListGroup.Item style={{ border: 'none' }}>
                                    <Row>
                                      <Col xs='12' md='6'>
                                        <span>
                                          <b>
                                            {getTranslatedText(
                                              'label.mortgage_date'
                                            )}
                                            :
                                          </b>
                                        </span>
                                      </Col>
                                      <Col xs='12' md='6'>
                                        <span>
                                          {applicationData.mortgage_date}
                                        </span>
                                      </Col>
                                    </Row>
                                  </ListGroup.Item>
                                </Col>
                              )}
                            </>
                          )}

                        {/* SRO at */}
                        {applicationData.sro_location && (
                          <Col xs='12' md='6'>
                            <ListGroup.Item style={{ border: 'none' }}>
                              <Row>
                                <Col xs='12' md='4'>
                                  <span>
                                    <b>
                                      {getTranslatedText('label.sro_location')}:
                                    </b>
                                  </span>
                                </Col>
                                <Col xs='12' md='8'>
                                  <span>{applicationData.sro_location}</span>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </Col>
                        )}
                      </Row>

                      <ListGroup.Item style={{ border: 'none' }}>
                        <hr />
                      </ListGroup.Item>

                      {/* Architect details */}
                      <Row>
                        {applicationData.architect_name && (
                          <>
                            <Col xs='12'>
                              <h4
                                style={{
                                  color: '#1d9a5b',
                                  paddingLeft: '1.875rem',
                                  paddingRight: '1.875rem'
                                }}
                                className={this.getLabelTextAlignment()}
                              >
                                {getTranslatedText('heading.architect_details')}
                              </h4>
                            </Col>
                            <Col xs='12'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='4'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.architect_name'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='8'>
                                    <span>
                                      {applicationData.architect_name}
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                            <Col xs='12'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='4'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.architect_license_number'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='8'>
                                    <span>
                                      {applicationData.architect_license_number}
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                            <Col xs='12'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='4'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.architect_mobile_number'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='8'>
                                    <span>
                                      {applicationData.architect_mobile_number}
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                            <Col xs='12'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='4'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.architect_email_id'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='8'>
                                    <span>
                                      {applicationData.architect_email_id}
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                          </>
                        )}
                      </Row>

                      {applicationData.architect_name && (
                        <ListGroup.Item style={{ border: 'none' }}>
                          <hr />
                        </ListGroup.Item>
                      )}

                      {/* Structural Engineer details */}
                      <Row>
                        {applicationData.structural_engineer_name && (
                          <>
                            <Col xs='12'>
                              <h4
                                style={{
                                  color: '#1d9a5b',
                                  paddingLeft: '1.875rem',
                                  paddingRight: '1.875rem'
                                }}
                                className={this.getLabelTextAlignment()}
                              >
                                {getTranslatedText(
                                  'heading.structural_engineer_details'
                                )}
                              </h4>
                            </Col>
                            <Col xs='12'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='4'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.structural_engineer_name'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='8'>
                                    <span>
                                      {applicationData.structural_engineer_name}
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                            <Col xs='12'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='4'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.structural_engineer_license_number'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='8'>
                                    <span>
                                      {
                                        applicationData.structural_engineer_license_number
                                      }
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                            <Col xs='12'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='4'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.structural_engineer_mobile_number'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='8'>
                                    <span>
                                      {
                                        applicationData.structural_engineer_mobile_number
                                      }
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                            <Col xs='12'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='4'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.structural_engineer_email_id'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='8'>
                                    <span>
                                      {
                                        applicationData.structural_engineer_email_id
                                      }
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                          </>
                        )}
                      </Row>

                      {applicationData.structural_engineer_name && (
                        <ListGroup.Item style={{ border: 'none' }}>
                          <hr />
                        </ListGroup.Item>
                      )}

                      {/* Builder details */}
                      <Row>
                        {applicationData.builder_name && (
                          <>
                            <Col xs='12'>
                              <h4
                                style={{
                                  color: '#1d9a5b',
                                  paddingLeft: '1.875rem',
                                  paddingRight: '1.875rem'
                                }}
                                className={this.getLabelTextAlignment()}
                              >
                                {getTranslatedText('heading.builder_details')}
                              </h4>
                            </Col>
                            <Col xs='12'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='4'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.builder_name'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='8'>
                                    <span>{applicationData.builder_name}</span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                            <Col xs='12'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='4'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.builder_license_number'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='8'>
                                    <span>
                                      {applicationData.builder_license_number}
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>

                            <Col xs='12'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='4'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.builder_mobile_number'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='8'>
                                    <span>
                                      {applicationData.builder_mobile_number}
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                            <Col xs='12'>
                              <ListGroup.Item style={{ border: 'none' }}>
                                <Row>
                                  <Col xs='12' md='4'>
                                    <span>
                                      <b>
                                        {getTranslatedText(
                                          'label.builder_email_id'
                                        )}
                                        :
                                      </b>
                                    </span>
                                  </Col>
                                  <Col xs='12' md='8'>
                                    <span>
                                      {applicationData.builder_email_id}
                                    </span>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </Col>
                          </>
                        )}
                      </Row>

                      {applicationData.architect_name && (
                        <ListGroup.Item style={{ border: 'none' }}>
                          <hr />
                        </ListGroup.Item>
                      )}

                      {applicationData.fire_department_fields ? (
                        <Row>
                          <Col xs='12'>
                            <h4
                              style={{
                                color: '#1d9a5b',
                                paddingLeft: '1.875rem',
                                paddingRight: '1.875rem'
                              }}
                              className={this.getLabelTextAlignment()}
                            >
                              {getTranslatedText(
                                'heading.fire_department_details'
                              )}
                            </h4>
                          </Col>
                        </Row>
                      ) : null}

                      {applicationData.fire_department_fields
                        ? fire_department_fields.map((field, index) => {
                            return (
                              <Row key={index}>
                                <Col xs='12' md='6'>
                                  <ListGroup.Item style={{ border: 'none' }}>
                                    <Row>
                                      <Col xs='12' md='4'>
                                        <span>
                                          <b>
                                            {getTranslatedText(
                                              'label.' + field
                                            )}
                                            :
                                          </b>
                                        </span>
                                      </Col>
                                      <Col xs='12' md='8'>
                                        <span>
                                          {
                                            applicationData
                                              .fire_department_fields[field]
                                          }
                                        </span>
                                      </Col>
                                    </Row>
                                  </ListGroup.Item>
                                </Col>
                              </Row>
                            );
                          })
                        : null}
                    </ListGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  };

  render() {
    const { applicationData } = this.props;
    if (applicationData.approval_for === stringConstants.BUILDING) {
      return this.renderBuildingReview(applicationData);
    } else {
      return this.renderLayoutReview(applicationData);
    }
  }
}

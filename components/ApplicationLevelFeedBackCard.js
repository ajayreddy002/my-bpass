import { Card, CardBody, CardHeader } from 'shards-react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import React, { Component, Fragment } from 'react';
import { alterParamsForUrl, getURL } from '../utils/urlUtils';

import { FiDownload } from 'react-icons/fi';
import apiConstants from '../constants/apiConstants';
import moment from 'moment';

const AccessedRoles = ['DISTRICT_COLLECTOR', 'MUNICIPAL_COMMISSIONER','CHASING_CELL_HEAD'];
class ApplicationLevelFeedBackCard extends Component {
    renderComments = (data) => {
        const comments = data.comments, role = data.comments[0].added_by;
        let url = getURL(apiConstants.DOWNLOAD_DOCUMENTS.USECASE);
        const link = (file_type) => alterParamsForUrl(url, {
            identifier: this.props.application_identifier,
            file_type
        });
        return (
            <Fragment key={role}>
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
                            {role}
                        </h5>
                    </Col>
                </Row>
                <Row className='align-items-center justify-content-start'>
                    <Col>
                        <ListGroup>
                            <Row className='align-items-center justify-content-between'>
                            { comments.map((val, index) => <Col key={val.added_by+index} xs='12' className='text-left'>
                                    <ListGroup.Item style={{ border: 'none' }}>
                                        <span>
                                            <b>Comment at {moment(val.createdAt).format('ll h:mm a')} : </b>
                                            {val.comment}
                                        </span>
                                    </ListGroup.Item>
                                </Col>)
                                }

                                {data.upload ? (
                                    <Col xs='12' md='6' className='text-left'>
                                        <ListGroup.Item style={{ border: 'none' }}>
                                            <span>
                                                <b>Review Document: </b>
                                            </span>
                                            <div className='uploaded-item'>
                                                <a href={link(role + '_review')} target='_blank'>
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
                            </Row>
                        </ListGroup>
                    </Col>
                </Row>
                <hr />
            </Fragment>
        );
    };
    render() {
        const { uploads = [], comments = [] } = this.props;
        if (comments.length === 0) return null;
        const dataObj = AccessedRoles.map(role => ({
            comments: comments.filter(i => i.added_by === role),
            upload: uploads.filter(i => i.file_type === `${role}_review`)[0]
        })).filter(val => val.comments.length)
        return (
            <Container className='mt-5' style={{ padding: 0 }}>
                <Card>
                    <CardHeader>Officer's Comments</CardHeader>
                    <CardBody>{dataObj.map((val, ind) => this.renderComments(val))}</CardBody>
                </Card>
            </Container>
        );
    }
}

export default ApplicationLevelFeedBackCard;

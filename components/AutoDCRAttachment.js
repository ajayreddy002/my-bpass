import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  FormInput
} from 'shards-react';
import { Col, Row, Spinner } from 'react-bootstrap';
import React, { Fragment } from 'react';

import LoadingOverlay from 'react-loading-overlay';
import { Router } from '../routes';
import apiConstants from '../constants/apiConstants';
import colorConstants from '../constants/colorConstants';
import { getTranslatedText } from '../utils/translationUtils';
import { getURL } from '../utils/urlUtils';
import { isEmpty } from 'lodash';

export default class AutoDCRAttachment extends React.Component {
  constructor(params) {
    super(params);
    this.state = {
      applicationId: null,
      auto_dcr_id: null,
      auto_dcr_secret_key: null,
      auto_dcr_failed: false,
      editBtn: false,
      change: false,
      isLoading: false
    };
  }

  componentDidMount() {
    const { applicationDetails } = this.props;
    const applicationId = applicationDetails.applicationId;
    if (applicationDetails.auto_dcr) {
      const { unique_no, secret_key } = applicationDetails.auto_dcr;
      this.setState({
        auto_dcr_id: unique_no,
        auto_dcr_secret_key: secret_key,
        editBtn: true
      });
    }
  }

  attach = async event => {
    event.preventDefault();
    this.props.setLoading(true);
    const { auto_dcr_id, auto_dcr_secret_key, applicationId } = this.state;
    const data = {
      unique_no: auto_dcr_id,
      secret_key: auto_dcr_secret_key,
      identifier: this.props.applicationDetails.applicationId
    };
    const url = getURL(apiConstants.UPDATE_AUTO_DCR.USECASE);
    try {
      let response = await fetch(url.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response && response.status === 200) {
        response = await response.json();
        this.props.setValidAutoDCR(auto_dcr_id);
        return;
      }
      this.setState({auto_dcr_failed : true});
      alert('Unable to attach AutoDCR,Try again or manually enter fields');
      this.props.setLoading(false);
    } catch (e) {
      this.setState({auto_dcr_failed : true});
      this.props.setLoading(false);
      alert('Unable to attach AutoDCR, please try again in later');
    }
  };

  render() {
    const {
      isLoading,
      auto_dcr_id,
      auto_dcr_secret_key,
      editBtn,
      change,
      auto_dcr_failed
    } = this.state;
    return (
      <Fragment>
        <Row>
          <Col xs='12' md='5'>
            <FormGroup className={this.props.textAlign}>
              <label htmlFor='auto_dcr_id'>
                <strong>{getTranslatedText('label.auto_dcr_id')}</strong>
              </label>
              <FormInput
                id='#auto_dcr_id'
                placeholder='Auto DCR Application ID'
                onChange={event =>
                  this.setState({
                    auto_dcr_id: event.target.value,
                    change: true
                  })
                }
                value={auto_dcr_id ? auto_dcr_id : ''}
                name='auto_dcr_id'
                valid={!isEmpty(auto_dcr_id)}
                invalid={auto_dcr_id === ''}
                disabled={editBtn}
              />
            </FormGroup>
          </Col>
          <Col xs='12' md='5'>
            <FormGroup>
              <label htmlFor='auto_dcr_secret_key'>
                <strong>
                  {getTranslatedText('label.auto_dcr_secret_key')}
                </strong>
              </label>
              <FormInput
                type='text'
                id='#auto_dcr_secret_key'
                placeholder='Secret Key'
                name='auto_dcr_secret_key'
                value={auto_dcr_secret_key ? auto_dcr_secret_key : ''}
                onChange={event =>
                  this.setState({
                    auto_dcr_secret_key: event.target.value,
                    change: true
                  })
                }
                valid={!isEmpty(auto_dcr_secret_key)}
                invalid={auto_dcr_secret_key === ''}
                disabled={editBtn}
              />
            </FormGroup>
          </Col>
          <Col>
            {editBtn ? (
              <Button
                theme='success'
                style={{ marginTop: '30px' }}
                onClick={event => {
                  this.setState({ editBtn: false });
                }}
              >
                Edit
              </Button>
            ) : (
              <Button
                theme='success'
                style={{ marginTop: '30px' }}
                disabled={
                  isEmpty(auto_dcr_secret_key) ||
                  isEmpty(auto_dcr_id) ||
                  isLoading ||
                  !change
                }
                onClick={event => {
                  this.attach(event);
                }}
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
                {isLoading ? 'Attaching' : 'Attach'}
              </Button>
            )}
            </Col>
        </Row>
        <Row className='align-items-center justify-content-center'>
            <Col xs='auto' style={{marginBottom: 10 }}>
            {auto_dcr_failed ?
              <Button
                theme='success'
                style={{ marginTop: '30px' }}
                disabled={
                  !auto_dcr_failed
                }
                onClick={event => {
                  this.props.setAutoDcrFailure(true);
                }}
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
                {isLoading ? 'Attaching' : 'Manually Enter Fields'}
              </Button> : null}
          </Col>
            </Row>{' '}
      </Fragment>
    );
  }
}

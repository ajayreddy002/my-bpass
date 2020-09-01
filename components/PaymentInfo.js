import { Button, Card, CardBody, CardHeader } from 'shards-react';
import {
  Col,
  Container,
  ListGroup,
  Overlay,
  Row,
  Tooltip
} from 'react-bootstrap';
import React, { Component, Fragment } from 'react';

import { PAY_OPTION_ENABLED } from '../constants/data/paymentType';
import PaymentSummary from './PaymentSummary';
import { Router } from '../routes';
import { formatFixed } from 'indian-number-format';
import { getTranslatedText } from '../utils/translationUtils';

class PaymentInfoCard extends Component {
  constructor(props) {
    super(props);
    this.excludedField = [
      'id',
      'application_id',
      'status',
      'summary',
      'payment_method',
      'is_advance_payment'
    ];
  }

  renderFields = () => {
    const { info } = this.props;
    const fieldNames = Object.keys(info).filter(
      name => info[name] && this.excludedField.indexOf(name) === -1
    );
    return (
      <Row>
        {fieldNames.map(val => (
          <Col xs='12' md='6' key={val}>
            <Row style={{ padding: '13px 30px' }}>
              <Col xs='12' md='4' className='text-left'>
                <b>{getTranslatedText('payment.' + val)}:</b>
              </Col>
              <Col xs='12' md='8'>
                {val == 'amount' ? 'Rs ' + formatFixed(info[val]) : info[val]}
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    );
  };

  pay = () => {
    const { applicationId, language } = this.props;
    Router.replaceRoute('payment', { applicationId, language });
  };
  renderPayBtn = () => {
    const { appStatus, info } = this.props;
    if (
      ['REJECTED', 'SHORTFALL', 'PAID_ACK_SENT'].indexOf(appStatus) == -1 &&
      PAY_OPTION_ENABLED.indexOf(info.status) !== -1
    )
      return (
        <Row>
          <Col style={{ padding: '1rem 1.875rem' }}>
            <Button theme='success' onClick={this.pay}>
              {getTranslatedText('heading.pay_now')}
            </Button>
          </Col>
        </Row>
      );
  };

  render() {
    const { info } = this.props;
    return (
      <Container className='mt-5'>
        <Row>
          <Col style={{ padding: 0 }}>
            <Card>
              <CardHeader>
                {getTranslatedText('heading.paymentInfo')}
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs='12'>
                    <h6
                      style={{
                        color: '#1d9a5b',
                        paddingLeft: '1.875rem',
                        paddingRight: '1.875rem'
                      }}
                      className={this.props.textAlign}
                    >
                      {getTranslatedText('heading.payment_status')} :{' '}
                      {`${info.status}`}
                    </h6>
                  </Col>
                </Row>
                {this.renderFields()}
                <PaymentSummary summary={info.summary} paymentPage={false} />
                {this.renderPayBtn()}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default PaymentInfoCard;

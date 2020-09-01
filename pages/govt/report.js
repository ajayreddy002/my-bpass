import {
  Card,
  CardBody,
  CardHeader,
  Collapse,
  ListGroup,
  ListGroupItem
} from 'shards-react';
import { Col, Container, Row } from 'react-bootstrap';
import React, { Component, Fragment } from 'react';
import { alterParamsForUrl, getURL } from '../../utils/urlUtils';

import { DISPLAY_STATUS } from '../../constants/applicationStatusConstants';
import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import apiConstants from '../../constants/apiConstants';
import colorConstants from '../../constants/colorConstants';
import fetch from 'isomorphic-unfetch';
import { getLocalizationBundleForLanguage } from '../../utils/translationUtils';

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      reportsPerUlb: {},
      collapse: props.reports.map(i => false)
    };
  }
  static getInitialProps = async ctx => {
    let url = getURL(apiConstants.GET_REPORT.USECASE);
    let res = await fetch(url.toString());
    if (res && res.status === 200) {
      res = await res.json();
      return {
        reports: res
      };
    }
    return {
      reports: []
    };
  };

  getReportForUlb = async index => {
    this.setState({ isLoading: true });
    let { reportsPerUlb, collapse = [] } = this.state;
    let { ulb_name } = this.props.reports[index];
    if (!reportsPerUlb[ulb_name]) {
      let url = getURL(apiConstants.GET_REPORT_FOR_ULB.USECASE);
      url = alterParamsForUrl(url, { ulb_name });
      let res = await fetch(url);
      if (res && res.status === 200) {
        res = await res.json();
        reportsPerUlb[ulb_name] = res;
      }
    }
    collapse[index] = !collapse[index];
    return this.setState({ reportsPerUlb, collapse, isLoading: false });
  };

  render() {
    const { isLoading, reportsPerUlb } = this.state;
    const totalCount = this.props.reports.reduce((acc, { count }, index) => {
      return acc + (typeof count === 'number' ? count : parseInt(count));
    }, 0);
    const totalUlb = this.props.reports.length;
    const localizationProvider = getLocalizationBundleForLanguage('en');
    return (
      <LocalizationProvider messages={localizationProvider}>
        <Fragment>
          <Header />
          <LoadingOverlay
            active={isLoading}
            spinner
            text={'Fetching...'}
            styles={{
              overlay: base => ({
                ...base,
                background: colorConstants.overlayBackground
              })
            }}
          >
            <Container>
              <Card className='mt-5'>
                <CardHeader>Report</CardHeader>
                <CardBody>
                  {totalUlb ? (
                    <Fragment>
                      <Row>
                        <Col xs='6' className='my-1 font-weight-bold'>
                          Total number of municipality that uses TS-bPASS:
                        </Col>
                        <Col xs='6' className='my-1'>
                          {totalUlb}
                        </Col>
                        <Col xs='6' className='my-1 font-weight-bold'>
                          Total number of applications created:
                        </Col>
                        <Col xs='6' className='my-1'>
                          {totalCount}
                        </Col>
                      </Row>
                      <h5
                        className='text-center text-uppercase mt-5'
                        style={{ width: '100%' }}
                      >
                        Municipality wise application count
                      </h5>
                      <ListGroup>
                        <ListGroupItem className='border p-0'>
                          <Row className='p-2 font-weight-bold'>
                            <Col xs='6'>Municipality</Col>
                            <Col xs='6' className='border-left'>
                              Count
                            </Col>
                          </Row>
                        </ListGroupItem>
                        {this.props.reports.map((val, index) => (
                          <ListGroupItem
                            key={'ulb_' + index}
                            className='border p-0'
                            onClick={this.getReportForUlb.bind(this, index)}
                            style={{ cursor: 'pointer' }}
                          >
                            <Row className='p-2'>
                              <Col xs='6'>{val.ulb_name}</Col>
                              <Col xs='6' className='border-left'>
                                {val.count}
                              </Col>
                            </Row>
                            <Collapse
                              open={this.state.collapse[index]}
                              className='my-3'
                            >
                              {reportsPerUlb[val.ulb_name] &&
                              reportsPerUlb[val.ulb_name].length ? (
                                <Card
                                  style={{ width: '60%', margin: '0 auto' }}
                                >
                                  <CardBody>
                                    <h5
                                      className='text-center text-uppercase'
                                      style={{ width: '100%' }}
                                    >
                                      {/* Status wise application count */}
                                    </h5>
                                    <ListGroup>
                                      <ListGroupItem className='border p-0'>
                                        <Row className='p-2 font-weight-bold'>
                                          <Col xs='6'>Status</Col>
                                          <Col xs='6' className='border-left'>
                                            Count
                                          </Col>
                                        </Row>
                                      </ListGroupItem>
                                      {reportsPerUlb[val.ulb_name].map(
                                        ({ status, count }, ind) => (
                                          <ListGroupItem
                                            key={'status_' + ind}
                                            className='border p-0'
                                          >
                                            <Row className='p-2'>
                                              <Col xs='6'>
                                                {DISPLAY_STATUS[status]}
                                              </Col>
                                              <Col
                                                xs='6'
                                                className='border-left'
                                              >
                                                {count}
                                              </Col>
                                            </Row>
                                          </ListGroupItem>
                                        )
                                      )}
                                    </ListGroup>
                                  </CardBody>
                                </Card>
                              ) : (
                                <div
                                  className='text-center'
                                  style={{ width: '80%', margin: '0 auto' }}
                                >
                                  {reportsPerUlb[val.ulb_name]
                                    ? `Failed to fetch data for ${val.ulb_name}`
                                    : 'No data to display'}
                                </div>
                              )}
                            </Collapse>
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    </Fragment>
                  ) : (
                    <div
                      className='text-center'
                      style={{ width: '80%', margin: '0 auto' }}
                    >
                      Failed to fetch data, Please try again after sometime
                    </div>
                  )}
                </CardBody>
              </Card>
            </Container>
          </LoadingOverlay>
        </Fragment>
      </LocalizationProvider>
    );
  }
}

export default Report;

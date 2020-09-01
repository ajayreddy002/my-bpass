import {
    ListGroup,
    ListGroupItem,
    FormInput
  } from 'shards-react';
  import { Col, Row } from 'react-bootstrap';
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
  
  class Stats extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        searchText: ''
      };
    }
    static getInitialProps = async ctx => {
      let url = getURL(apiConstants.GET_STATS.USECASE);
      let res = await fetch(url.toString());
      if (res && res.status === 200) {
        res = await res.json();
        res = Object.keys(res).reduce((acc, val, index) => {
           acc[val] = res[val].reduce((countObj, data) => {
                countObj[data.status] = data.count;
                countObj['total'] += parseInt(data.count)
                return countObj;
           }, {total: 0})
           return acc; 
        }, {})
        return {
          reports: res
        };
      }
      return {
        reports: null
      };
    };
  
    render() {
      const { isLoading, searchText } = this.state;
      const reports = this.props.reports;
      const localizationProvider = getLocalizationBundleForLanguage('en');
      const sortStatuses = Object.keys(DISPLAY_STATUS);
      const defaultStatus = [{count: 0}];
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
                    {reports ? (
                      <Fragment>
                        <h5
                          className='text-center text-uppercase mt-5'
                          style={{ width: '100%' }}
                        >
                          Municipality wise application count
                        </h5>
                        <FormInput
                            className="stats_searchBox"
                            id='#search'
                            name='search'
                            placeholder='Search by ulb name'
                            onChange={event =>
                              this.setState({searchText: event.target.value})
                            }
                            value={
                              searchText
                            }
                          />
                        <div className="pb-2" style={{margin: '0 auto', width: '95%', overflowX:'scroll'}}>
                        <ListGroup style={{width: '4250px'}}>
                          <ListGroupItem className='border p-0'>
                            <Row className='p-2 font-weight-bold'>
                              <Col xs='auto' style={{width: '250px'}} className="border-right">Municipality</Col>
                              <Col xs='auto' style={{width: '250px'}} className="border-right">Total</Col>
                              {
                                  sortStatuses.map((val, index) => <Col key={"col_header_"+index} xs='auto' style={{width: '250px'}} className={index + 1 === sortStatuses.length ? "" : "border-right"}>{DISPLAY_STATUS[val]}</Col>)
                              }
                            </Row>
                          </ListGroupItem>
                          {Object.keys(reports).filter(val => searchText==="" || val.toLowerCase().indexOf(searchText.toLowerCase()) > -1).map((val, index) => {
                              const data = reports[val];
                              return (
                                <ListGroupItem
                                  key={'ulb_' + index}
                                  className='border p-0'
                                  style={{ cursor: 'pointer' }}
                                >
                                  <Row className='p-2'>
                                    <Col xs='auto' className="border-right" style={{width: '250px', wordBreak: 'break-all'}}>{val}</Col>
                                    <Col xs='auto' className="border-right" style={{width: '250px'}}>{data['total']}</Col>
                                    {
                                        sortStatuses.map((status, index) => {
                                          // if(!['DRAFT'].includes(status) ){
                                            return (
                                              <Col 
                                                key={"col_header_"+index} 
                                                xs='auto' 
                                                className={index + 1 === sortStatuses.length ? "" : "border-right"} 
                                                style={{width: '250px'}}
                                              ><a href={`/chasing_stats?ulb_name=${val}&status=${status}`} >
                                                {data[status] || ''}
                                                </a>
                                              </Col> 
                                            )
                                          // }
                                        })
                                    }
                                  </Row>
                                </ListGroupItem>
                              )
                          })}
                        </ListGroup>
                        </div>
                      </Fragment>
                    ) : (
                      <div
                        className='text-center'
                        style={{ width: '80%', margin: '0 auto' }}
                      >
                        Failed to fetch data, Please try again after sometime
                      </div>
                    )}
            </LoadingOverlay>
          </Fragment>
        </LocalizationProvider>
      );
    }
  }
  
  export default Stats;
  
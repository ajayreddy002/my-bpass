import {
  Card,
  CardBody,
  CardHeader,
  FormSelect,
  Nav,
  NavItem,
  NavLink
} from 'shards-react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import React, { Component, Fragment } from 'react';
import { cloneDeep, forEach } from 'lodash';
import {
  getApplicationDetails,
  getApplicationIdList,
  getApplicationIdListForSingleWindow,
  getApplicationIdListForTaskManager
} from '../../apiHelpers/applicationDetails';

import AcknowledgmentCard from '../../components/Acknowledgment';
import AdminActionComponent from '../../components/AdminActionComponent';
import AdminFeedbackCard from '../../components/AdminFeedbackCard';
import AdminSubHeader from '../../components/AdminSubHeaderComponent';
import ApplicationLevelFeedBackCard from '../../components/ApplicationLevelFeedBackCard';
import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import ReviewApplication from '../../components/ReviewApplication';
import UploadCard from '../../components/UploadCard';
import colorConstants from '../../constants/colorConstants';
import { getLocalizationBundleForLanguage } from '../../utils/translationUtils';
import { isEmpty } from 'lodash';
import moment from 'moment';
import taskTypes from '../../constants/taskTypes';
import withValidation from './withValidation';

const ALLOWED_PP_USERS = [
  'TECHNICAL_SCRUTINY_OFFICER',
  'TITLE_INSPECTOR',
  'SITE_INSPECTOR'];

const AcknowledgmentCardUsers = [
  'DISTRICT_COLLECTOR',
  'MUNICIPAL_COMMISSIONER',
  'CHASING_CELL_HEAD'

];

class ApplicationList extends Component {
  static getInitialProps = async ({ mobxStore, query }) => {
    const localization = getLocalizationBundleForLanguage();
    const { type } = query;

    return {
      isSingleWindow: type != 'pp',
      isReadOnly: type != 'read',
      localization
    };
  };

  constructor(props) {
    super(props);
    this.roles = props.userDetails.entitlements
      .map(i => i.role)
      .filter((val, index, self) => self.indexOf(val) === index);
    this.state = {
      selected: 0,
      currentApplicationId: '',
      loading: false,
      appIdList: null,
      isSingleWindow: props.isSingleWindow,
      isReadOnly: props.isReadOnly,
      showPostProcessing:
        ALLOWED_PP_USERS.indexOf(props.userDetails.entitlements[0].role) > -1,
      taskType: '',
      role: props.userDetails.entitlements[0].role
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isSingleWindow != this.props.isSingleWindow) {
      this.refreshList();
      this.setState({
        refresh: true
      });
    }
  }

  async componentDidMount() {
    this.refreshList();
  }

  refreshList = async () => {
    this.setState({ loading: true });
    let appIdList = null,
      role = this.state.role;
    if (role === 'APPLICATION_AND_TASK_MANAGER') {
      const response = await getApplicationIdListForTaskManager(
        role,
        this.state.isSingleWindow
      );
      appIdList = response.appIdList;
    } else if (this.state.isSingleWindow) {
      const response = await getApplicationIdListForSingleWindow(role);
      appIdList = response.appIdList;
    } else {
      const response = await getApplicationIdList(role);
      appIdList = response.appIdList;
    }

    if (isEmpty(appIdList)) appIdList = null;
    let currentApplicationId = appIdList
      ? appIdList[0].application_identifier
      : '';

    this.setState({ appIdList, currentApplicationId });
    if (currentApplicationId) {
      let data = await this.getApplicationData(currentApplicationId);
      this.setState({ currentApplicationData: data, loading: false });
    } else {
      this.setState({ loading: false });
    }
  };

  setLoading = loadingState => {
    this.setState({ isLoading: loadingState });
    this.props.setLoading(loadingState);
  };

  selectApplication = async (index, application_identifier) => {
    this.setState({
      selected: index,
      currentApplicationId: application_identifier,
      loading: true
    });
    let data = await this.getApplicationData(application_identifier);
    this.setState({ currentApplicationData: data, loading: false });
  };

  getApplicationData = async function(application_identifier) {
    const data = await getApplicationDetails(application_identifier);

    if (data) {
      return data.applicationDetails;
    } else {
      console.log('Unable to fetch data for ' + application_identifier);
      return { error: true, localization: this.props.localization };
    }
  };

  renderUploads = () => {
    const { currentApplicationData: { uploads } = {} } = this.state || {};
    if (uploads)
      return (
        <div className='mt-5'>
          <UploadCard
            uploads={uploads}
            applicationId={this.state.currentApplicationId}
          />
        </div>
      );
  };

  getDataForTable = data => {
    let newData = cloneDeep(data);
    forEach(newData, function(e) {
      delete e.id;
      delete e.workflow_id;
    });
    return newData;
  };

  selectFilter = async (field, value) => {
    this.setState({ [field]: value }, () => {
      this.refreshList();
    });
  };

  filters = () => {
    return (
      <Row
        className='align-items-center'
        style={{ width: '90%', margin: '15px auto 20px auto' }}
      >
        <Col xs='1'>
          <b>Role:</b>
        </Col>
        <Col xs='3'>
          <FormSelect
            name='role'
            onChange={event => this.selectFilter('role', event.target.value)}
            value={this.state.role}
          >
            <option value=''>Select</option>
            {this.roles.map((i, index) => (
              <option key={i + index} value={i}>
                {i.replace(/_/g, ' ')}
              </option>
            ))}
          </FormSelect>
        </Col>
        <Col xs='1' className='d-none'>
          <b>Task type:</b>
        </Col>
        <Col xs='3' className='d-none'>
          <FormSelect
            name='taskType'
            onChange={event =>
              this.selectFilter('taskType', event.target.value)
            }
            value={this.state.taskType}
          >
            <option value=''>Select</option>
            {taskTypes.map((i, index) => (
              <option key={i + index} value={i}>
                {i.replace(/_/g, ' ')}
              </option>
            ))}
          </FormSelect>
        </Col>
      </Row>
    );
  };

  changeTab = val => {
    this.setState({ isSingleWindow: val }, this.refreshList);
  };

  renderAcknowledgment = () => {
    const { userDetails: { entitlements = [] } = {} } = this.props || {};
    const {
      currentApplicationId,
      currentApplicationData: { acknowledegment_document_url } = {}
    } = this.state;
    const isValid = entitlements.reduce((acc, val) => {
      return acc || AcknowledgmentCardUsers.indexOf(val.role) > -1;
    }, false);
    if (acknowledegment_document_url && currentApplicationId && isValid) {
      return <AcknowledgmentCard applicationId={currentApplicationId} />;
    }
  };

  render() {
    const {
      currentApplicationData,
      currentApplicationId,
      loading,
      isSingleWindow,
      appIdList,
      isReadOnly
    } = this.state;
    const { localization } = this.props;
    return (
      <LocalizationProvider messages={localization}>
        <Header />
        <AdminSubHeader isSingleWindow={isSingleWindow} />
        <LoadingOverlay
          active={loading}
          spinner
          text='Loading...'
          styles={{
            overlay: base => ({
              ...base,
              background: colorConstants.overlayBackground
            })
          }}
        >
          <Nav tabs className='mt-5' style={{ width: '98%', margin: '0 auto' }}>
            <NavItem>
              <NavLink
                active={isSingleWindow}
                onClick={this.changeTab.bind(this, true)}
              >
                Single Window
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={!isSingleWindow}
                onClick={this.changeTab.bind(this, false)}
              >
                Post Processing Application
              </NavLink>
            </NavItem>
            <Container className='admin-list-container'>
              {this.filters()}
              {appIdList && appIdList.length ? (
                <Row style={{ margin: 0 }}>
                  <Col xs='3' style={{ padding: 0 }}>
                    <ListGroup className='app-lists'>
                      <ListGroup.Item>APPLICATIONS</ListGroup.Item>
                      {appIdList.map((application, index) => (
                        <ListGroup.Item
                          active={
                            currentApplicationId &&
                            application.application_identifier ==
                              currentApplicationId
                          }
                          key={index}
                          variant={index % 2 === 0 ? 'light' : 'secondary'}
                          onClick={() =>
                            this.selectApplication(
                              index,
                              application.application_identifier
                            )
                          }
                        >
                          {application.application_identifier}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Col>
                  <Col xs='9' style={{ padding: 0 }}>
                    {!currentApplicationData ? (
                      <span>Unable to fetch data</span>
                    ) : (
                      <>
                        <ReviewApplication
                          applicationData={currentApplicationData}
                          textAlign={this.props.textAlign}
                        />
                        {this.renderUploads()}
                        {this.renderAcknowledgment()}
                        <div className='mt-5'></div>
                        {currentApplicationData.workflow && (
                          <div>
                            <AdminFeedbackCard
                              application_identifier={currentApplicationId}
                              userDetails={this.props.userDetails}
                              workflow={currentApplicationData.workflow}
                              uploads={currentApplicationData.uploads}
                              role={this.state.role}
                            />
                            <ApplicationLevelFeedBackCard
                              comments={
                                currentApplicationData.application_comments
                              }
                              uploads={currentApplicationData.uploads}
                              application_identifier={currentApplicationId}
                            />
                            <AdminActionComponent
                              key={currentApplicationId}
                              application_identifier={currentApplicationId}
                              userDetails={this.props.userDetails}
                              workflow={currentApplicationData.workflow}
                              refreshList={this.refreshList}
                              role={this.state.role}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </Col>
                </Row>
              ) : null}

              {!(appIdList && appIdList.length) && (
                <Row style={{ marginTop: 40, marginBottom: 40 }}>
                  <Col className='text-center'>
                    <span>No Open Applications Found</span>
                  </Col>
                </Row>
              )}
            </Container>
          </Nav>
        </LoadingOverlay>
      </LocalizationProvider>
    );
  }
}

export default withValidation(ApplicationList);

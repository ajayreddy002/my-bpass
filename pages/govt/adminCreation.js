import { Alert, Col, Row, Spinner } from 'react-bootstrap';
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  Modal,
  ModalBody,
  ModalHeader
} from 'shards-react';
import { InputGroup, InputGroupAddon, InputGroupText } from 'shards-react';
import React, { Component, Fragment } from 'react';
import { alterParamsForUrl, getURL } from '../../utils/urlUtils';
import { clone, forEach, isEmpty } from 'lodash';

import AdminSubHeader from '../../components/AdminSubHeaderComponent';
import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import apiConstants from '../../constants/apiConstants';
import colorConstants from '../../constants/colorConstants';
import fetch from 'isomorphic-unfetch';
import { getLocalizationBundleForLanguage } from '../../utils/translationUtils';
import stringConstants from '../../constants/stringConstants';
import withValidation from './withValidation';

class AdminCreation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.getInitialStateObj(),
      ulbs: [],
      roleNames: [],
      teams: [[]],
      isLoading: false,
      error: false,
      success: false,
      errMsg: '',
      teamError: false,
      teamSuccess: false,
      teamErrMsg: '',
      teamsToCreate: [],
      isUserIdUnique: false,
      isValidating: false,
      teamModal: false,
      teamUlb: {
        value: null,
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      team_name: {
        value: null,
        valid: false,
        empty: true,
        required: true,
        visible: true
      }
    };
    this.timeout = null;
    this.fields = [
      'first_name',
      'last_name',
      'user_id',
      'password',
      'email_id',
      'phone_number',
      'confirm_password',
      'roles'
    ];
  }

  getInitialStateObj = () => ({
    first_name: {
      value: null,
      valid: false,
      empty: true,
      required: true,
      visible: true
    },
    last_name: {
      value: null,
      valid: false,
      empty: true,
      required: true,
      visible: true
    },
    user_id: {
      value: null,
      valid: false,
      empty: true,
      required: true,
      visible: true
    },
    password: {
      value: null,
      valid: false,
      empty: true,
      required: true,
      visible: true
    },
    confirm_password: {
      value: null,
      valid: false,
      empty: true,
      required: true,
      visible: true
    },
    email_id: {
      value: null,
      valid: false,
      empty: true,
      required: true,
      visible: true
    },
    phone_number: {
      value: null,
      valid: false,
      empty: true,
      required: true,
      visible: true
    },
    roles: [
      {
        ulb_name: {
          value: null,
          valid: false,
          empty: true,
          required: true,
          visible: true
        },
        role: {
          value: null,
          valid: false,
          empty: true,
          required: true,
          visible: true
        },
        team_name: {
          value: null,
          valid: false,
          empty: true,
          required: true,
          visible: true
        }
      }
    ]
  });

  async componentDidMount() {
    let url = getURL(apiConstants.LOCATION_DROPDOWN.USECASE);
    url = alterParamsForUrl(url, { type: stringConstants.ULB });
    let ulbs = await fetch(url);

    if (ulbs && ulbs.status === 200) {
      ulbs = await ulbs.json();
    } else {
      ulbs = [];
    }

    url = getURL(apiConstants.ADMIN_ROLES.USECASE);
    url = alterParamsForUrl(url, { type: stringConstants.ULB });
    let roleNames = await fetch(url);

    if (roleNames && roleNames.status === 200) {
      let roleData = await roleNames.json();
      roleNames = roleData;
    } else {
      roleNames = [];
    }

    this.setState({ ulbs, roleNames });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  getTeams = async (ulb_name, index) => {
    let { teams, teamsToCreate = [] } = this.state;
    this.setState({ isLoading: true });
    let url = getURL(apiConstants.GET_ADMIN_TEAMS.USECASE);
    url = alterParamsForUrl(url, { ulb_name });
    let res = await fetch(url);
    if (res && res.status === 200) {
      let data = await res.json();
      if (index || index === 0) {
        teams[index] = data;
        return this.setState({ teams, isLoading: false });
      } else {
        return this.setState({ teamsToCreate: data, isLoading: false });
      }
    }
    return this.setState({ teams, teamsToCreate, isLoading: false });
  };

  createTeam = async () => {
    this.setState({ isLoading: true });
    let {
      teamUlb: { value: ulb_name },
      team_name: { value: team_name }
    } = this.state;
    let url = getURL(apiConstants.CREATE_TEAM.USECASE);
    let res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ ulb_name, team_name })
    });
    if (res && res.status === 200) {
      let teams = await res.json();
      return this.setState({
        isLoading: false,
        teamSuccess: true,
        teamErrMsg: 'Admin Created Successfully'
      });
    }
    return this.setState({
      isLoading: false,
      teamError: true,
      teamErrMsg: 'Unable to create Team, Please try again later'
    });
  };

  validateStateItem = (state, stateItem) => {
    if (state[stateItem].required && state[stateItem].visible)
      return !state[stateItem].valid || state[stateItem].empty;
    else if (
      !state[stateItem].required &&
      !state[stateItem].empty &&
      state[stateItem].visible
    ) {
      return !state[stateItem].valid;
    } else return false;
  };

  isSubmitBtnDisabled = () => {
    if (this.state.isLoading) return true;
    if (!this.state.isUserIdUnique) return true;
    return Object.keys(this.state).some(stateItem => {
      if (this.fields.indexOf(stateItem) > -1) {
        if (Array.isArray(this.state[stateItem])) {
          if (this.state[stateItem].length === 0) return true;
          return this.state[stateItem].some(arrItem => {
            return Object.keys(arrItem).some(item =>
              this.validateStateItem(arrItem, item)
            );
          });
        } else {
          return this.validateStateItem(this.state, stateItem);
        }
      } else return false;
    });
  };

  validateAndSetRoleInputDropdowns = async (
    event,
    inputName,
    inputType,
    index
  ) => {
    let inputValue = event.target.value;
    let isInputValid = this.validateInput(inputValue, inputType);

    if (isInputValid) {
      let currentState = { ...this.state };
      let inputFieldState = {
        ...this.state['roles'][index][inputName]
      };

      inputFieldState.value = inputValue;
      inputFieldState.valid = true;
      inputFieldState.empty = false;
      currentState['roles'][index][inputName] = inputFieldState;
      this.setState({ ...currentState });
    } else {
      let currentState = { ...this.state };
      let inputFieldState = {
        ...this.state['roles'][index][inputName]
      };
      inputFieldState.value = inputValue;

      inputFieldState.valid = false;
      inputFieldState.empty = inputValue.length === 0;
      currentState['roles'][index][inputName] = inputFieldState;
      this.setState({ ...currentState });
    }
  };

  validateInput = (inputValue, validationType, inputLength, inputLimit) => {
    switch (validationType) {
      case 'pure_text':
        if (isEmpty(inputValue)) return false;
        return true;
      case 'text':
        return !isEmpty(inputValue);
      //return !inputValue.split('').every(letter => !isNaN(parseInt(letter)));
      case 'number': {
        let isValidNumber = inputValue
          .split('')
          .every(letter => !isNaN(parseInt(letter)) && letter !== '-');
        isValidNumber = isValidNumber && inputValue.length;
        if (isValidNumber) {
          if (inputLength) return inputValue.length === inputLength;
          else if (inputLimit) {
            return inputValue >= inputLimit[0] && inputValue <= inputLimit[1];
          } else return true;
        } else return false;
      }
      case 'float':
        let isValidNumber = !isNaN(parseFloat(inputValue));
        if (isValidNumber) {
          if (inputLength) return inputValue.length === inputLength;
          else if (inputLimit) {
            return inputValue >= inputLimit[0] && inputValue <= inputLimit[1];
          } else return true;
        } else return false;
      case 'email':
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(inputValue).toLowerCase());
      case 'select':
        if (isEmpty(inputValue)) return false;
        return true;
      case 'select_with_validation':
        if (isEmpty(inputValue)) return false;
        return true;
      case 'confirm_password':
        return inputValue === this.state.password.value;
      default:
        return false;
    }
  };

  validateAndSetInput = (
    event,
    inputField,
    validationType,
    inputLength,
    inputLimit,
    index
  ) => {
    let inputValue = event.target.value;
    let isInputValid = this.validateInput(
      inputValue,
      validationType,
      inputLength,
      inputLimit
    );

    if (isInputValid) {
      let currentState = { ...this.state };
      let inputFieldState = {
        ...(index !== undefined
          ? this.state[inputField][index]
          : this.state[inputField])
      };

      inputFieldState.value = inputValue;
      inputFieldState.valid = true;
      inputFieldState.empty = false;
      if (index !== undefined)
        currentState[inputField][index] = inputFieldState;
      else currentState[inputField] = inputFieldState;
      this.setState({ ...currentState });
    } else {
      let currentState = { ...this.state };
      let inputFieldState = {
        ...(index !== undefined
          ? this.state[inputField][index]
          : this.state[inputField])
      };
      inputFieldState.value =
        validationType === 'number' ? parseInt(inputValue) : inputValue;

      inputFieldState.valid = false;
      inputFieldState.empty = inputValue.length === 0;
      if (index !== undefined)
        currentState[inputField][index] = inputFieldState;
      else currentState[inputField] = inputFieldState;
      this.setState({ ...currentState });
    }
  };

  renderRolesCard = index => {
    const { roles, teams } = this.state;
    return (
      <Row className='align-items-center justify-content-center' key={index}>
        <Col xs='12' md='3'>
          <FormGroup>
            <label htmlFor={'ulb_' + index}>
              <strong>ULB</strong>
            </label>
            <FormSelect
              id={'#ulb_' + index}
              name={'ulb_' + index}
              onChange={event => {
                this.getTeams(event.target.value, index);
                this.validateAndSetRoleInputDropdowns(
                  event,
                  'ulb_name',
                  'select',
                  index
                );
              }}
              valid={roles[index]['ulb_name'].valid}
              invalid={
                !roles[index]['ulb_name'].empty &&
                !roles[index]['ulb_name'].valid
              }
              value={
                roles[index]['ulb_name'].value
                  ? roles[index]['ulb_name'].value
                  : ''
              }
            >
              <option value=''>Select</option>
              {this.state.ulbs.map(ulb => {
                return (
                  <option value={ulb.ulb_name} key={ulb.ulb_name}>
                    {ulb.ulb_name}
                  </option>
                );
              })}
            </FormSelect>
          </FormGroup>
        </Col>
        <Col xs='12' md='3'>
          <FormGroup>
            <label htmlFor={'role_' + index}>
              <strong>Designation</strong>
            </label>
            <FormSelect
              id={'#role_' + index}
              name={'role_' + index}
              onChange={event => {
                this.validateAndSetRoleInputDropdowns(
                  event,
                  'role',
                  'select',
                  index
                );
              }}
              valid={roles[index]['role'].valid}
              invalid={
                !roles[index]['role'].empty && !roles[index]['role'].valid
              }
              value={
                roles[index]['role'].value ? roles[index]['role'].value : ''
              }
            >
              <option value=''>Select</option>
              {this.state.roleNames.map(
                role =>
                  role.role_name != 'APPLICATION_AND_TASK_MANAGER' && (
                    <option value={role.role_name} key={role.role_name}>
                      {role.display_name}
                    </option>
                  )
              )}
            </FormSelect>
          </FormGroup>
        </Col>
        <Col xs='12' md='3'>
          <FormGroup>
            <label htmlFor={'team_' + index}>
              <strong>Team</strong>
            </label>
            <FormSelect
              id={'#team_' + index}
              name={'team_' + index}
              onChange={event => {
                this.validateAndSetRoleInputDropdowns(
                  event,
                  'team_name',
                  'select',
                  index
                );
              }}
              valid={this.state.roles[index]['team_name'].valid}
              invalid={
                !this.state.roles[index]['team_name'].empty &&
                !this.state.roles[index]['team_name'].valid
              }
              value={
                this.state.roles[index]['team_name'].value
                  ? this.state.roles[index]['team_name'].value
                  : ''
              }
            >
              <option value=''>Select</option>
              {teams[index].map(team => (
                <option value={team.team_name} key={team.team_name}>
                  {team.team_name}
                </option>
              ))}
            </FormSelect>
          </FormGroup>
        </Col>
        <Col xs='12' md='3' style={{ marginTop: 12 }}>
          <Button theme='danger' onClick={this.deleteRole.bind(this, index)}>
            Delete Role
          </Button>
        </Col>
      </Row>
    );
  };

  deleteRole = index => {
    let { roles = [], teams = [] } = this.state;
    roles.splice(index, 1);
    teams.splice(index, 1);
    this.setState({ roles });
  };

  addRole = () => {
    let { roles = [], teams = [] } = this.state;
    roles.push({
      ulb_name: {
        value: null,
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      role: {
        value: null,
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      team_name: {
        value: null,
        valid: false,
        empty: true,
        required: true,
        visible: true
      }
    });
    teams.push([]);
    this.setState({ roles, teams });
  };

  processFormData = async event => {
    event.preventDefault();
    let postObj = {
      first_name: '',
      last_name: '',
      email_id: null,
      user_id: '',
      password: '',
      phone_number: null,
      roles: []
    };
    Object.keys(postObj).forEach((val, index) => {
      if (Array.isArray(postObj[val])) {
        this.state[val].forEach(roleAttr => {
          let rolesObj = {};
          Object.keys(roleAttr).forEach(roleAttrName => {
            rolesObj[roleAttrName] = roleAttr[roleAttrName].value;
          });
          postObj[val].push(rolesObj);
        });
      } else {
        postObj[val] = this.state[val].value;
      }
    });

    const url = getURL(apiConstants.CREATE_ADMIN.USECASE);
    let res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ admin_type: 'ULB_ADMIN', ...postObj })
    });
    if (res && res.status === 200) {
      const data = await res.json();
      if (data.isSuccess) {
        return this.setState(
          {
            isLoading: false,
            success: true,
            errMsg: 'Admin Created Successfully'
          },
          () => {
            this.timeout = setTimeout(() => {
              this.setState({ ...this.getInitialStateObj() });
            }, 3000);
          }
        );
      }
    }
    this.setState({
      isLoading: false,
      error: true,
      errMsg: 'Unable to create admin, please try again later'
    });
  };

  checkUserIdUnique = async () => {
    this.setState({ isValidating: true });
    const { user_id } = this.state;
    let isUnique = false;
    let url = getURL(apiConstants.UNIQUE_USER.USECASE);
    url = alterParamsForUrl(url, { user_id: user_id.value });
    let response = await fetch(url);
    if (response && response.status === 200) {
      let admins = await response.json();
      if (admins.length === 0) {
        isUnique = true;
      }
    }
    this.setState({
      user_id: { ...user_id, valid: isUnique },
      isUserIdUnique: isUnique,
      isValidating: false
    });
  };

  toggleTeamModal = () => this.setState({ teamModal: !this.state.teamModal });

  disableCreateTeam = () => {
    let { teamUlb, team_name, teamsToCreate } = this.state;
    if (!teamUlb.value || !team_name.value) {
      return true;
    } else if (!teamUlb.valid || !team_name.valid) {
      return true;
    }
    return teamsToCreate.reduce((acc, val, index) => {
      if (val.team_name.toLowerCase() === team_name.value.toLowerCase())
        return true;
      else return acc;
    }, false);
  };

  renderTeamModal() {
    let { teamSuccess, teamError, teamErrMsg } = this.state;
    return (
      <Modal
        centered
        open={this.state.teamModal}
        toggle={this.toggleTeamModal}
        className='col-12'
      >
        <ModalHeader toggle={this.toggleTeamModal}>Create Team</ModalHeader>
        <ModalBody className='row'>
          {teamSuccess || teamError ? (
            <Alert
              className='col-12'
              variant={teamSuccess ? 'success' : 'danger'}
              onClose={() =>
                this.setState({
                  teamSuccess: false,
                  teamError: false,
                  teamErrMsg: ''
                })
              }
              dismissible
            >
              {teamErrMsg}
            </Alert>
          ) : null}
          <Row>
            <Col xs='12'>
              <FormGroup>
                <label htmlFor={'ulb_team'}>
                  <strong>ULB:</strong>
                </label>
                <FormSelect
                  id='#ulb_team'
                  name='ulb_team'
                  onChange={event => {
                    this.getTeams(event.target.value);
                    this.validateAndSetInput(event, 'teamUlb', 'select');
                  }}
                  valid={this.state.teamUlb.valid}
                  invalid={
                    !this.state.teamUlb.empty && !this.state.teamUlb.valid
                  }
                  value={
                    this.state.teamUlb.value ? this.state.teamUlb.value : ''
                  }
                >
                  <option value=''>Select</option>
                  {this.state.ulbs.map(ulb => {
                    return (
                      <option value={ulb.ulb_name} key={ulb.ulb_name}>
                        {ulb.ulb_name}
                      </option>
                    );
                  })}
                </FormSelect>
              </FormGroup>
            </Col>
            <Col xs='12'>
              <FormGroup>
                <label htmlFor={'team_name'}>
                  <strong>Team Name:</strong>
                  {this.disableCreateTeam() && this.state['team_name'].value ? (
                    <div style={{ display: 'inline' }}>
                      (<span style={{ color: 'red' }}>Team already exists</span>
                      )
                    </div>
                  ) : null}
                </label>

                <FormInput
                  id='#team_name'
                  name='team_name'
                  placeholder='Enter Team name'
                  onChange={event =>
                    this.validateAndSetInput(event, 'team_name', 'text')
                  }
                  value={
                    this.state['team_name'].value
                      ? this.state['team_name'].value
                      : ''
                  }
                  valid={this.state['team_name'].valid}
                  invalid={
                    !this.state['team_name'].empty &&
                    !this.state['team_name'].valid
                  }
                />
              </FormGroup>
            </Col>
          </Row>
          <div className='text-center' style={{ width: '100%' }}>
            <Button
              theme='success'
              onClick={this.createTeam}
              disabled={this.disableCreateTeam()}
            >
              Create Team
            </Button>
          </div>
        </ModalBody>
      </Modal>
    );
  }

  render() {
    const {
      isLoading,
      errMsg,
      success,
      error,
      isUserIdUnique,
      isValidating
    } = this.state;
    const localizationProvider = getLocalizationBundleForLanguage('en');
    return (
      <LocalizationProvider messages={localizationProvider}>
        <Fragment>
          <Header route='admin-create' />
          {this.renderTeamModal()}
          <AdminSubHeader />
          <LoadingOverlay
            active={isLoading || isValidating}
            spinner
            text={isLoading ? 'Submitting' : 'Validating...'}
            styles={{
              overlay: base => ({
                ...base,
                background: colorConstants.overlayBackground
              })
            }}
          >
            <div style={{ padding: 48 }}>
              <Card>
                <CardBody>
                  {success || error ? (
                    <Alert
                      variant={success ? 'success' : 'danger'}
                      onClose={() =>
                        this.setState({
                          success: false,
                          error: false,
                          errMsg: ''
                        })
                      }
                      dismissible
                    >
                      {errMsg}
                    </Alert>
                  ) : null}
                  <Form
                    style={{ width: '100%' }}
                    onSubmit={event => this.processFormData(event)}
                  >
                    <Row>
                      <Col xs='12'>
                        <h4 style={{ color: '#1d9a5b', marginTop: 5 }}>
                          Admin Details
                        </h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12' md='6'>
                        <FormGroup>
                          <label htmlFor='first_name'>
                            <strong>First Name</strong>
                          </label>
                          <FormInput
                            id='#first_name'
                            name='first_name'
                            placeholder='Enter First name'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'first_name',
                                'text'
                              )
                            }
                            value={
                              this.state['first_name'].value
                                ? this.state['first_name'].value
                                : ''
                            }
                            valid={this.state['first_name'].valid}
                            invalid={
                              !this.state['first_name'].empty &&
                              !this.state['first_name'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup>
                          <label htmlFor='last_name'>
                            <strong>Last Name</strong>
                          </label>
                          <FormInput
                            id='#last_name'
                            name='last_name'
                            placeholder='Enter Last name'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'last_name',
                                'text'
                              )
                            }
                            value={
                              this.state['last_name'].value
                                ? this.state['last_name'].value
                                : ''
                            }
                            valid={this.state['last_name'].valid}
                            invalid={
                              !this.state['last_name'].empty &&
                              !this.state['last_name'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className='align-items-center justify-content-center'>
                      <Col xs='12' md='6'>
                        <FormGroup>
                          <label htmlFor='user_id'>
                            <strong>User Name </strong>
                            {!isUserIdUnique &&
                            !this.state['user_id'].empty &&
                            !this.state['user_id'].valid ? (
                              <div style={{ display: 'inline' }}>
                                (
                                <span style={{ color: 'red' }}>
                                  Username already exists
                                </span>
                                )
                              </div>
                            ) : null}
                          </label>
                          <FormInput
                            id='#user_id'
                            name='user_id'
                            placeholder='Enter User name'
                            onChange={event =>
                              this.validateAndSetInput(event, 'user_id', 'text')
                            }
                            onBlur={this.checkUserIdUnique}
                            value={
                              this.state['user_id'].value
                                ? this.state['user_id'].value
                                : ''
                            }
                            valid={this.state['user_id'].valid}
                            invalid={
                              !this.state['user_id'].empty &&
                              !this.state['user_id'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col></Col>
                    </Row>
                    <Row>
                      <Col xs='12' md='6'>
                        <FormGroup>
                          <label htmlFor='password'>
                            <strong>Password</strong>
                          </label>
                          <FormInput
                            id='#password'
                            name='password'
                            type='password'
                            placeholder='Enter Password'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'password',
                                'text'
                              )
                            }
                            value={
                              this.state['password'].value
                                ? this.state['password'].value
                                : ''
                            }
                            valid={this.state['password'].valid}
                            invalid={
                              !this.state['password'].empty &&
                              !this.state['password'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup>
                          <label htmlFor='confirm_password'>
                            <strong>Confirm Password</strong>
                          </label>
                          <FormInput
                            id='#confirm_password'
                            name='confirm_password'
                            type='password'
                            placeholder='Enter Password'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'confirm_password',
                                'confirm_password'
                              )
                            }
                            value={
                              this.state['confirm_password'].value
                                ? this.state['confirm_password'].value
                                : ''
                            }
                            valid={this.state['confirm_password'].valid}
                            invalid={
                              !this.state['confirm_password'].empty &&
                              !this.state['confirm_password'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup>
                          <label htmlFor='email_id'>
                            <strong>Email</strong>
                          </label>
                          <FormInput
                            type='email'
                            id='#email_id'
                            placeholder='Enter Email ID'
                            name='email_id'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'email_id',
                                'email'
                              )
                            }
                            valid={this.state['email_id'].valid}
                            invalid={
                              !this.state['email_id'].empty &&
                              !this.state['email_id'].valid
                            }
                            value={
                              this.state['email_id'].value
                                ? this.state['email_id'].value
                                : ''
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup>
                          <label htmlFor='phone_number'>
                            <strong>Phone Number</strong>
                          </label>
                          <FormInput
                            type='number'
                            id='#phone_number'
                            placeholder='Enter Phone Number'
                            name='phone_number'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'phone_number',
                                'number',
                                10
                              )
                            }
                            valid={this.state['phone_number'].valid}
                            invalid={
                              !this.state['phone_number'].empty &&
                              !this.state['phone_number'].valid
                            }
                            value={
                              this.state['phone_number'].value
                                ? this.state['phone_number'].value
                                : ''
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {this.state.roles.map((val, index) =>
                      this.renderRolesCard(index)
                    )}
                    <Row
                      className='align-items-center justify-content-center'
                      style={{ marginTop: 15 }}
                    >
                      <Col xs='auto' style={{ marginTop: 5, marginBottom: 5 }}>
                        <Button theme='success' onClick={this.toggleTeamModal}>
                          Create Team
                        </Button>
                      </Col>
                      <Col xs='auto' style={{ marginTop: 5, marginBottom: 5 }}>
                        <Button theme='success' onClick={this.addRole}>
                          Add Role
                        </Button>
                      </Col>
                      <Col xs='auto' style={{ marginTop: 5, marginBottom: 5 }}>
                        <Button
                          theme='success'
                          type='submit'
                          disabled={this.isSubmitBtnDisabled()}
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
                          {isLoading ? ' Submitting' : 'Submit'}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </div>
          </LoadingOverlay>
        </Fragment>
      </LocalizationProvider>
    );
  }
}

export default withValidation(AdminCreation, true);

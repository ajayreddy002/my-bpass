import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'shards-react';
import { Col, Row, Spinner } from 'react-bootstrap';
import React, { Component } from 'react';
import { alterParamsForUrl, getURL } from '../../../utils/urlUtils';
import { inject, observer } from 'mobx-react';

import Header from '../../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import { Router } from '../../../routes';
import apiConstants from '../../../constants/apiConstants';
import colorConstants from '../../../constants/colorConstants';
import cryptoUtils from '../../../utils/cryptoUtils';
import fetch from 'isomorphic-unfetch';
import { getTranslatedText } from '../../../utils/translationUtils';
import { getTranslationLocale } from '../../../utils/routeUtils';
import { isEmpty } from 'lodash';
import layoutFormFields from '../../../constants/layoutFormFields';
import stringConstants from '../../../constants/stringConstants';

@inject('applicationForm')
@inject('localization')
@observer
class LayoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isAPILoading: true,
      dataObj: null,
      name: {
        value: null,
        infoType: 'applicant',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      email: {
        value: null,
        infoType: 'applicant',
        valid: false,
        empty: true,
        required: false,
        visible: true
      },
      aadhaar_number: {
        value: null,
        infoType: 'applicant',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      phone_number: {
        value: null,
        infoType: 'applicant',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      relationship_type: {
        value: 'SON',
        infoType: 'applicant',
        valid: true,
        empty: false,
        required: true,
        visible: true
      },
      relationship_name: {
        value: null,
        infoType: 'applicant',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      contact_address: {
        value: null,
        infoType: 'applicant',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      co_applicant_name: {
        value: null,
        infoType: 'applicant',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      co_applicant_email: {
        value: null,
        infoType: 'applicant',
        valid: false,
        empty: true,
        required: false,
        visible: true
      },
      co_applicant_aadhaar_number: {
        value: null,
        infoType: 'applicant',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      co_applicant_phone_number: {
        value: null,
        infoType: 'applicant',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      co_applicant_relationship_type: {
        value: 'SON',
        infoType: 'applicant',
        valid: true,
        empty: false,
        required: true,
        visible: true
      },
      co_applicant_relationship_name: {
        value: null,
        infoType: 'applicant',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      layout_type: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      layout_category: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: false,
        visible: false
      },
      address: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      plot_area: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      proposed_site_area_for_approval: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      construction_type: {
        value: 'RESIDENTIAL',
        infoType: 'property',
        valid: true,
        empty: false,
        required: true,
        visible: true
      },
      land_type: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      survey_no: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      ulb_name: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      mandal: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      village: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      revenue_village: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      if_site_area_more_than_proposed_reason: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      is_site_under_sanctioned_master_plan: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      land_use_as_per_master_plan: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: false,
        visible: false
      },
      land_allotment_by_govt: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      market_value: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      airport_vicinity: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      national_monument_vicinity: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      heritage_structure_vicinity: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      oil_gas_pipeline_vicinity: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      religious_structure_vicinity: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      is_approach_road_existing: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      road_width: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: false,
        visible: false
      },
      approach_road_connect_with_public_road: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: false,
        visible: false
      },
      status_of_road: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: false,
        visible: false
      },
      commencement_of_work_onsite: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: false,
        visible: false
      },
      boundary_schedule_north: {
        value: '',
        infoType: 'boundary_schedule',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      boundary_schedule_east: {
        value: '',
        infoType: 'boundary_schedule',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      boundary_schedule_west: {
        value: '',
        infoType: 'boundary_schedule',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      boundary_schedule_south: {
        value: '',
        infoType: 'boundary_schedule',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      town_planner_name: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      town_planner_license_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      town_planner_mobile_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      town_planner_email_id: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      town_planner_address: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      builder_name: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      builder_license_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      builder_mobile_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      builder_email_id: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      builder_address: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      surveyor_name: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      surveyor_license_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      surveyor_mobile_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      surveyor_email_id: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      surveyor_address: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      architect_name: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      architect_license_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      architect_mobile_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      architect_email_id: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      architect_address: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      structural_engineer_name: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      structural_engineer_license_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      structural_engineer_mobile_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      structural_engineer_email_id: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      structural_engineer_address: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      revenue_noc: {
        value: '',
        infoType: 'noc_processing_info',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      river_boundary: {
        value: '',
        infoType: 'noc_processing_info',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      water_body_gt_10ha_boundary: {
        value: '',
        infoType: 'noc_processing_info',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      water_body_lt_10ha_boundary: {
        value: '',
        infoType: 'noc_processing_info',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      canal_gt_10m_boundary: {
        value: '',
        infoType: 'noc_processing_info',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      canal_lt_10m_boundary: {
        value: '',
        infoType: 'noc_processing_info',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      aai_land_layout_mapping: {
        value: '',
        infoType: 'noc_processing_info',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      land_dev_gt_500000_or_area_gt_200000: {
        value: '',
        infoType: 'noc_processing_info',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      national_monument_authority: {
        value: '',
        infoType: 'noc_processing_info',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      heritage_structure: {
        value: '',
        infoType: 'noc_processing_info',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      oil_gas_authority: {
        value: '',
        infoType: 'noc_processing_info',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      religious_structures: {
        value: '',
        infoType: 'noc_processing_info',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      ulbs: [],
      mandals: [],
      villages: [],
      plotarea_unit_open: false,
      plotarea_unit: 'sq.m'
    };
    this.applicationForm = this.props.applicationForm;
    this.localizationStore = this.props.localization;
  }

  static getRequestBody = req => {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('readable', function () {
        body += req.read();
      });
      req.on('end', function () {
        resolve(body);
      });
    });
  };

  static getInitialProps = async ({mobxStore, query, req}) => {
    let meseva_requestid = null;

    if (req && req.method === 'POST') {
      let requestBody = await this.getRequestBody(req);
      let { msg, encmsg } = queryString.parse(requestBody);
      let meseva_data = await cryptoUtils.base64Decode(msg);
      let requestid = JSON.parse(meseva_data);
      meseva_requestid = requestid;
    }

    const { language } = query;
    const translationLocale = getTranslationLocale(
      language,
      mobxStore.localization
    );

    let url = getURL(apiConstants.LOCATION_DROPDOWN.USECASE);
    url = alterParamsForUrl(url, { type: stringConstants.ULB });
    let response = await fetch(url);
    if (response && response.status === 200) {
      response = await response.json();
      return {
        meseva_request: meseva_requestid,
        ulbs: response,
        ...translationLocale
      };
    }
    return {
      meseva_request: meseva_requestid,
      ulbs: [],
      ...translationLocale
    };
  };

  processFormData = async event => {
    event.preventDefault();
    const data = new FormData(event.target);
    const language = this.localizationStore.getLanguage();

    if (this.validateMinPlotArea()) {
      let dataObj = {};
      Object.keys(this.state).map(stateItem => {
        if (stateItem in layoutFormFields) {
          if (this.state[stateItem].valid && !this.state[stateItem].empty) {
            let paramType = this.state[stateItem].infoType;
            let elt = {[stateItem]: this.state[stateItem].value};
            dataObj[paramType] = {...dataObj[paramType], ...elt};
          }
        }
      });

      if (this.applicationForm.getApplicationId())
        dataObj.identifier = this.applicationForm.getApplicationId();

      dataObj.approval_for = stringConstants.LAYOUT;

      if (dataObj.noc_processing_info) {
        dataObj.property['noc_processing_info'] = dataObj.noc_processing_info;
        delete dataObj.noc_processing_info;
      }

      if (dataObj.boundary_schedule) {
        dataObj.property['boundary_schedule'] = dataObj.boundary_schedule;
        delete dataObj.boundary_schedule;
      }

      let params = { params: dataObj };
      if (this.state['meseva_request']) {
        params.params.meseva_request = this.state['meseva_request'];
      }
      params = JSON.stringify(params);

      this.setState({ isLoading: true });
      const url = getURL(apiConstants.CREATE_APPLICATION.USECASE);
      let res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: params
      });
      if (res && res.status === 200) {
        const data = await res.json();
        if (data.isSuccess) {
          const { application_identifier, password } = data;
          return Router.replaceRoute('redirect', {
            language: language,
            applicationId: application_identifier
          });
        }
      }
      this.setState({ isLoading: false }, () => {
        alert('Unable to process application now, please try again in later');
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.language != this.props.language) {
      const { localizationBundle, language, textAlign } = this.props;
      this.localizationStore.setLocalizationData({
        localizationBundle: JSON.stringify(localizationBundle),
        language,
        textAlignment: textAlign
      });
    }
  }

  componentDidMount = async () => {
    const {
      meseva_request,
      ulbs,
      localizationBundle,
      language,
      textAlign
    } = this.props;
    this.setState({
      meseva_request,
      ulbs
    });
    this.localizationStore.setLocalizationData({
      localizationBundle: JSON.stringify(localizationBundle),
      language,
      textAlignment: textAlign
    });

    if (this.applicationForm.getApplicationId()) {
      const data = this.applicationForm.getApplicationData();
      await this.retrieveDataForDropdowns(
        stringConstants.MANDAL,
        data.ulb_name
      );

      await this.retrieveDataForDropdowns(stringConstants.VILLAGE, data.mandal);
      this.updateVisibility(
        'is_site_under_sanctioned_master_plan',
        data.is_site_under_sanctioned_master_plan
      );
      this.updateVisibility(
        'is_approach_road_existing',
        data.is_approach_road_existing
      );
      this.updateVisibility('road_width', data.road_width);
      this.calculateNetLayoutAndMortgageArea();

      Object.keys(this.state).map(stateItem => {
        if (stateItem in layoutFormFields) {
          this.state[stateItem].value = data[stateItem];
          if (this.state[stateItem].required && data[stateItem] != null)
            this.state[stateItem].valid = true;
          else this.state[stateItem].valid = false;
          if (this.state[stateItem].required && data[stateItem] != null)
            this.state[stateItem].empty = false;
          else this.state[stateItem].empty = true;
        }
      });

      this.setState({ isAPILoading: false, refresh: !this.state.refresh });
    } else {
      this.setState({ isAPILoading: false });
    }
  };

  resetMandalsAndVillages() {
    this.state.village.value = '';
    this.state.village.valid = false;
    this.state.mandal.value = '';
    this.state.mandal.valid = false;
    this.setState({ villages: [], mandals: [] });
  }

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
      case 'sale_deed_registration_date':
        return (
          new Date(inputValue).getTime() < new Date('2018-03-31').getTime()
        );
      case 'mortgage_date':
        return new Date(inputValue).getTime() < new Date().getTime();
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

    if (inputField == 'land_type' && inputValue == 'AGRICULTURE') {
      isInputValid = false;
      alert('Agriculture land cannot be processed');
    }

    if (isInputValid) {
      let currentState = { ...this.state };
      let inputFieldState = {
        ...(index !== undefined
          ? this.state[inputField][index]
          : this.state[inputField])
      };

      inputFieldState.value = inputValue;
      // if (validationType === 'number') {
      //   inputFieldState.value = parseInt(inputValue);
      // } else if (validationType === 'float') {
      //   inputFieldState.value = parseFloat(inputValue).toFixed(2);
      // } else {
      //   inputFieldState.value = inputValue;
      // }
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
    // }
  };

  validateAndSetInputDropdowns = async (event, inputName, inputType) => {
    await this.validateAndSetInput(event, inputName, inputType);
    if (this.state[inputName].valid) {
      const isParamInput = inputName === 'ulb_name';
      const param = isParamInput
        ? stringConstants.MANDAL
        : stringConstants.VILLAGE;
      if (isParamInput) this.resetMandalsAndVillages();

      this.retrieveDataForDropdowns(param, this.state[inputName].value);
    } else {
      const isParamInput = inputName === 'ulb_name';
      if (isParamInput) {
        this.resetMandalsAndVillages();
      } else {
        this.state.village.value = '';
        this.state.village.valid = false;
        this.state['villages'] = [];
      }
    }
  };

  retrieveDataForDropdowns = async (type, value) => {
    this.setState({ isAPILoading: true });
    if (type == stringConstants.VILLAGE || type == stringConstants.MANDAL) {
      let url = getURL(apiConstants.LOCATION_DROPDOWN.USECASE);
      url = alterParamsForUrl(url, {
        type: type,
        dependant_value: value
      });
      let response = await fetch(url);
      if (response && response.status === 200) {
        const models = await response.json();
        if (type == stringConstants.MANDAL) {
          this.setState({ mandals: models, isAPILoading: false });
        } else if (type == stringConstants.VILLAGE) {
          if (isEmpty(models)) {
            this.state.village.visible = false;
            this.state.village.valid = true;
            this.state.village.value = '';
            this.setState({ isAPILoading: false });
          } else {
            this.state.village.visible = true;
            this.state.village.valid = false;
            this.state.village.value = '';
            this.setState({ villages: models, isAPILoading: false });
          }
        }
      } else {
        alert('Unable to retrieve information, please try again later');
      }
    }
  };

  processVisibilityForLayout = event => {
    let layout_type = event.target.value;
    if (layout_type === 'group_development_scheme') {
      this.state.layout_category.visible = true;
      this.state.layout_category.required = true;
    } else {
      this.state.layout_category.visible = false;
      this.validateAndSetInput(event, 'layout_category', 'text');
    }
  };

  validateMinPlotArea = () => {
    let min_area = 1000.0;
    let plot_area = this.state.plot_area.value;
    if (this.state.layout_category.value === 'gated_community_with_compound_wall')
      min_area = 4000.0;
    if (plot_area < min_area) {
      alert('minimum area should be ' + min_area + ' square meters');
      this.state.plot_area.valid = false;
      return false;
    }
    return true;
  };

  updateVisibility = (fieldName, fieldValue) => {
    if (fieldName == 'is_site_under_sanctioned_master_plan') {
      if (fieldValue == 'yes') {
        this.state.land_use_as_per_master_plan.visible = true;
      } else {
        this.state.land_use_as_per_master_plan.visible = false;
        this.state.land_use_as_per_master_plan.valid = false;
        this.state.land_use_as_per_master_plan.empty = true;
      }
    }
    if (fieldName == 'is_approach_road_existing') {
      if (fieldValue == 'yes') {
        this.state.road_width.visible = true;
      } else {
        this.state.road_width.visible = false;
        this.state.road_width.empty = true;
        this.state.road_width.valid = false;
        this.state.road_width.value = '';

        this.state.approach_road_connect_with_public_road.visible = false;
        this.state.approach_road_connect_with_public_road.valid = false;
        this.state.approach_road_connect_with_public_road.empty = true;
        this.state.status_of_road.visible = false;
        this.state.status_of_road.valid = false;
        this.state.status_of_road.empty = true;
        this.state.commencement_of_work_onsite.visible = false;
        this.state.commencement_of_work_onsite.valid = false;
        this.state.commencement_of_work_onsite.empty = true;
      }
    }
    if (fieldName == 'road_width') {
      if (fieldValue >= 12) {
        this.state.approach_road_connect_with_public_road.visible = true;
        this.state.status_of_road.visible = true;
        this.state.commencement_of_work_onsite.visible = true;
      } else {
        this.state.approach_road_connect_with_public_road.visible = false;
        this.state.approach_road_connect_with_public_road.valid = false;
        this.state.approach_road_connect_with_public_road.empty = true;
        this.state.status_of_road.visible = false;
        this.state.status_of_road.valid = false;
        this.state.status_of_road.empty = true;
        this.state.commencement_of_work_onsite.visible = false;
        this.state.commencement_of_work_onsite.valid = false;
        this.state.commencement_of_work_onsite.empty = true;
      }
    }
  };

  getLabelTextAlignment = () => {
    if (this.props.textAlign) {
      return this.props.textAlign;
    }
  };

  isSubmitButtonDisabled = () => {
    if (this.state.isLoading) return true;
    return Object.keys(this.state).some(stateItem => {
      if (stateItem in layoutFormFields) {
        if (this.state[stateItem].required && this.state[stateItem].visible)
          return (!this.state[stateItem].valid || this.state[stateItem].empty);
        else if (
          !this.state[stateItem].required &&
          !this.state[stateItem].empty &&
          this.state[stateItem].visible
        ) {
          return !this.state[stateItem].valid;
        } else return false;
      } else return false;
    });
  };

  showChangePlotAreaUnitModal = () => {
    this.setState({ plotarea_unit_open: !this.state.plotarea_unit_open });
  };

  changePlotAreaUnit = value => {
    const { plotarea_unit } = this.state;
    if (plotarea_unit != value) {
      if (value == 'sq.yards' && !this.state.plot_area.empty) {
        this.state.plot_area.value = parseFloat(
          this.state.plot_area.value * 1.196
        ).toFixed(2);
      } else if (value == 'sq.m' && !this.state.plot_area.empty) {
        this.state.plot_area.value = parseFloat(
          this.state.plot_area.value / 1.196
        ).toFixed(2);
      }
    }
    this.setState({ plotarea_unit: value });
  };

  calculateNetLayoutAndMortgageArea = () => {
    if (
      !this.state.proposed_site_area_for_approval.empty &&
      this.state.proposed_site_area_for_approval &&
      !this.state.master_plan_road_affected_area.empty &&
      this.state.master_plan_road_affected_area.valid
    ) {
      this.state.net_layout_area.value =
        this.state.proposed_site_area_for_approval.value -
        this.state.master_plan_road_affected_area.value;
    }

    if (!this.state.plot_area.empty && this.state.plot_area.valid) {
      this.state.mortgage_area = this.state.plot_area * 0.15;
    }
  };

  render() {
    const {
      ulbs,
      isLoading,
      isAPILoading,
      mandals,
      villages,
      plotarea_unit,
      plotarea_unit_open
    } = this.state;
    const { language } = this.props;
    const localizationBundle = this.localizationStore.getLocalizationBundle()
      ? this.localizationStore.getLocalizationBundle()
      : {};
    return (
      <LocalizationProvider messages={localizationBundle}>
        <Header
          route='layout'
          params={{ language }}
          meseva_request={this.state.meseva_request}
        />
        <div>
          <LoadingOverlay
            active={isAPILoading || isLoading}
            spinner
            text={isLoading ? 'Submitting' : 'Loading...'}
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
                  <Form
                    style={{ width: '100%' }}
                    onSubmit={event => this.processFormData(event)}
                  >
                    <Row>
                      <Col xs='12'>
                        <h4
                          style={{ color: '#1d9a5b', marginTop: 5 }}
                          className={this.getLabelTextAlignment()}
                        >
                          {getTranslatedText('heading.applicant_details')}
                        </h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='applicant_name'>
                            <strong>
                              {getTranslatedText('label.applicant_name')}
                            </strong>
                          </label>
                          <FormInput
                            id='#applicant_name'
                            name='name'
                            placeholder='Enter Applicant name'
                            onChange={event =>
                              this.validateAndSetInput(event, 'name', 'text')
                            }
                            value={
                              this.state['name'].value
                                ? this.state['name'].value
                                : ''
                            }
                            valid={this.state['name'].valid}
                            invalid={
                              !this.state['name'].empty &&
                              !this.state['name'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <Row className='d-flex'>
                            <Col
                              xs='12'
                              md='2'
                              style={{ marginTop: 5, marginBottom: 5 }}
                            >
                              <FormSelect
                                name='relationship_type'
                                onChange={event =>
                                  this.validateAndSetInput(
                                    event,
                                    'relationship_type',
                                    'select'
                                  )
                                }
                                valid={this.state['relationship_type'].valid}
                                invalid={
                                  !this.state['relationship_type'].empty &&
                                  !this.state['relationship_type'].valid
                                }
                                value={
                                  this.state['relationship_type'].value
                                    ? this.state['relationship_type'].value
                                    : ''
                                }
                              >
                                <option value='SON'>Son of</option>
                                <option value='DAUGHTER'>Daugther of</option>
                                <option value='FATHER'>Father of</option>
                                <option value='WIFE'>Wife of</option>
                              </FormSelect>
                            </Col>
                            <Col
                              xs='12'
                              md='10'
                              style={{ marginTop: 5, marginBottom: 5 }}
                            >
                              <FormInput
                                id='#related_to'
                                name='relationship_name'
                                placeholder='Enter name'
                                onChange={event =>
                                  this.validateAndSetInput(
                                    event,
                                    'relationship_name',
                                    'text'
                                  )
                                }
                                value={
                                  this.state['relationship_name'].value
                                    ? this.state['relationship_name'].value
                                    : ''
                                }
                                valid={this.state['relationship_name'].valid}
                                invalid={
                                  !this.state['relationship_name'].empty &&
                                  !this.state['relationship_name'].valid
                                }
                              />
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12' md='12'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='aadhaar_number'>
                            <strong>
                              {getTranslatedText('label.aadhaar_number')}
                            </strong>
                          </label>
                          <FormInput
                            id='#aadhaar_number'
                            type='number'
                            placeholder='Enter Aadhaar Number'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'aadhaar_number',
                                'number',
                                12
                              )
                            }
                            value={
                              this.state['aadhaar_number'].value
                                ? this.state['aadhaar_number'].value
                                : ''
                            }
                            name='aadhaar_number'
                            valid={this.state['aadhaar_number'].valid}
                            invalid={
                              !this.state['aadhaar_number'].empty &&
                              !this.state['aadhaar_number'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='mobile_number'>
                            <strong>
                              {getTranslatedText('label.mobile_number')}
                            </strong>
                          </label>
                          <InputGroup className='mb-2'>
                            <InputGroupAddon type='prepend'>
                              <InputGroupText>+91</InputGroupText>
                            </InputGroupAddon>
                            <FormInput
                              id='#mobile_number'
                              type='number'
                              placeholder='Enter Mobile Number'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'phone_number',
                                  'number',
                                  10
                                )
                              }
                              value={
                                this.state['phone_number'].value
                                  ? this.state['phone_number'].value
                                  : ''
                              }
                              name='phone_number'
                              valid={this.state['phone_number'].valid}
                              invalid={
                                !this.state['phone_number'].empty &&
                                !this.state['phone_number'].valid
                              }
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='email_id'>
                            <strong>
                              {getTranslatedText('label.email_id')}
                            </strong>{' '}
                            ({getTranslatedText('label.optional')})
                          </label>
                          <FormInput
                            type='email'
                            id='#email_id'
                            placeholder='Enter Email ID'
                            name='email'
                            onChange={event =>
                              this.validateAndSetInput(event, 'email', 'email')
                            }
                            valid={this.state['email'].valid}
                            invalid={
                              !this.state['email'].empty &&
                              !this.state['email'].valid
                            }
                            value={
                              this.state['email'].value
                                ? this.state['email'].value
                                : ''
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='12'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='contact_address'>
                            <strong>
                              {getTranslatedText('label.address')}
                            </strong>
                          </label>
                          <FormTextarea
                            id='#contact_address'
                            placeholder='Enter address'
                            name='contact_address'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'contact_address',
                                'text'
                              )
                            }
                            valid={this.state['contact_address'].valid}
                            invalid={
                              !this.state['contact_address'].empty &&
                              !this.state['contact_address'].valid
                            }
                            value={
                              this.state['contact_address'].value
                                ? this.state['contact_address'].value
                                : ''
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <h4
                          style={{ color: '#1d9a5b', marginTop: 5 }}
                          className={this.getLabelTextAlignment()}
                        >
                          {getTranslatedText('heading.co_applicant_details')}
                        </h4>
                      </Col>
                      <Col xs='12'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='co_applicant_name'>
                            <strong>
                              {getTranslatedText('label.co_applicant_name')}
                            </strong>
                          </label>
                          <FormInput
                            id='#co_applicant_name'
                            name='name'
                            placeholder='Enter Co-Applicant name'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'co_applicant_name',
                                'text'
                              )
                            }
                            value={
                              this.state['co_applicant_name'].value
                                ? this.state['co_applicant_name'].value
                                : ''
                            }
                            valid={this.state['co_applicant_name'].valid}
                            invalid={
                              !this.state['co_applicant_name'].empty &&
                              !this.state['co_applicant_name'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <Row className='d-flex'>
                            <Col
                              xs='12'
                              md='2'
                              style={{ marginTop: 5, marginBottom: 5 }}
                            >
                              <FormSelect
                                name='co_applicant_relationship_type'
                                onChange={event =>
                                  this.validateAndSetInput(
                                    event,
                                    'co_applicant_relationship_type',
                                    'select'
                                  )
                                }
                                valid={
                                  this.state['co_applicant_relationship_type']
                                    .valid
                                }
                                invalid={
                                  !this.state['co_applicant_relationship_type']
                                    .empty &&
                                  !this.state['co_applicant_relationship_type']
                                    .valid
                                }
                                value={
                                  this.state['co_applicant_relationship_type']
                                    .value
                                    ? this.state[
                                        'co_applicant_relationship_type'
                                      ].value
                                    : ''
                                }
                              >
                                <option value='SON'>Son of</option>
                                <option value='DAUGHTER'>Daugther of</option>
                                <option value='FATHER'>Father of</option>
                                <option value='WIFE'>Wife of</option>
                              </FormSelect>
                            </Col>
                            <Col
                              xs='12'
                              md='10'
                              style={{ marginTop: 5, marginBottom: 5 }}
                            >
                              <FormInput
                                id='#co_applicant_related_to'
                                name='co_applicant_relationship_name'
                                placeholder='Enter name'
                                onChange={event =>
                                  this.validateAndSetInput(
                                    event,
                                    'co_applicant_relationship_name',
                                    'text'
                                  )
                                }
                                value={
                                  this.state['co_applicant_relationship_name']
                                    .value
                                    ? this.state[
                                        'co_applicant_relationship_name'
                                      ].value
                                    : ''
                                }
                                valid={
                                  this.state['co_applicant_relationship_name']
                                    .valid
                                }
                                invalid={
                                  !this.state['co_applicant_relationship_name']
                                    .empty &&
                                  !this.state['co_applicant_relationship_name']
                                    .valid
                                }
                              />
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12' md='12'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='co_applicant_aadhaar_number'>
                            <strong>
                              {getTranslatedText(
                                'label.co_applicant_aadhaar_number'
                              )}
                            </strong>
                          </label>
                          <FormInput
                            id='#co_applicant_aadhaar_number'
                            type='number'
                            placeholder='Enter Aadhaar Number'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'co_applicant_aadhaar_number',
                                'number',
                                12
                              )
                            }
                            value={
                              this.state['co_applicant_aadhaar_number'].value
                                ? this.state['co_applicant_aadhaar_number']
                                    .value
                                : ''
                            }
                            name='co_applicant_aadhaar_number'
                            valid={
                              this.state['co_applicant_aadhaar_number'].valid
                            }
                            invalid={
                              !this.state['co_applicant_aadhaar_number']
                                .empty &&
                              !this.state['co_applicant_aadhaar_number'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='co_applicant_phone_number'>
                            <strong>
                              {getTranslatedText(
                                'label.co_applicant_phone_number'
                              )}
                            </strong>
                          </label>
                          <InputGroup className='mb-2'>
                            <InputGroupAddon type='prepend'>
                              <InputGroupText>+91</InputGroupText>
                            </InputGroupAddon>
                            <FormInput
                              id='#co_applicant_phone_number'
                              type='number'
                              placeholder='Enter Mobile Number'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'co_applicant_phone_number',
                                  'number',
                                  10
                                )
                              }
                              value={
                                this.state['co_applicant_phone_number'].value
                                  ? this.state['co_applicant_phone_number']
                                      .value
                                  : ''
                              }
                              name='co_applicant_phone_number'
                              valid={
                                this.state['co_applicant_phone_number'].valid
                              }
                              invalid={
                                !this.state['co_applicant_phone_number']
                                  .empty &&
                                !this.state['co_applicant_phone_number'].valid
                              }
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='co_applicant_email_id'>
                            <strong>
                              {getTranslatedText('label.co_applicant_email_id')}
                            </strong>{' '}
                            ({getTranslatedText('label.optional')})
                          </label>
                          <FormInput
                            type='email'
                            id='#co_applicant_email_id'
                            placeholder='Enter Email ID'
                            name='email'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'co_applicant_email',
                                'email'
                              )
                            }
                            valid={this.state['co_applicant_email'].valid}
                            invalid={
                              !this.state['co_applicant_email'].empty &&
                              !this.state['co_applicant_email'].valid
                            }
                            value={
                              this.state['co_applicant_email'].value
                                ? this.state['co_applicant_email'].value
                                : ''
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {/* layout fields*/}
                    <Row>
                      <Col xs='12'>
                        <h4
                          style={{ color: '#1d9a5b', marginTop: 5 }}
                          className={this.getLabelTextAlignment()}
                        >
                          {getTranslatedText('heading.site_details')}
                        </h4>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='layout_type'>
                            <strong>
                              {getTranslatedText('label.layout_type')}
                            </strong>
                          </label>
                          <FormSelect
                            name='layout_type'
                            onChange={event => {
                              this.processVisibilityForLayout(event);
                              this.validateAndSetInput(
                                event,
                                'layout_type',
                                'select'
                              );
                            }}
                            valid={this.state['layout_type'].valid}
                            invalid={
                              !this.state['layout_type'].empty &&
                              !this.state['layout_type'].valid
                            }
                            value={
                              this.state['layout_type'].value
                                ? this.state['layout_type'].value
                                : ''
                            }
                          >
                            <option value=''>Select</option>
                            <option value='layout_with_open_plots'>
                              Layout with open plots
                            </option>
                            <option value='layout_with_housing_without_compound_wall'>
                              Layout with housing(Without compound wall)
                            </option>
                            <option value='group_development_scheme'>
                              Group Development Scheme
                            </option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      {this.state.layout_category.visible ?
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='layout_category'>
                            <strong>
                              {getTranslatedText('label.layout_category')}
                            </strong>
                          </label>
                          <FormSelect
                            name='layout_category'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'layout_category',
                                'select'
                              )
                            }
                            valid={this.state['layout_category'].valid}
                            invalid={
                              !this.state['layout_category'].empty &&
                              !this.state['layout_category'].valid
                            }
                            value={
                              this.state['layout_category'].value
                                ? this.state['layout_category'].value
                                : ''
                            }
                          >
                            <option value=''>Select</option>
                            <option value='gated_community_with_compound_wall'>
                              Gated Community (With Compound Wall)
                            </option>
                            <option value='row_type_housing_10m'>
                              Row Type Housing -10 Mts
                            </option>
                            <option value='cluster_housing_6m'>
                              Cluster Housing - 6 Mts
                            </option>
                          </FormSelect>
                        </FormGroup>
                      </Col> : null}
                    </Row>
                    {this.state.layout_type.value !== '' &&
                    this.state.layout_category.value !== '' ? (
                      <Row>
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='plot_area'>
                              <strong>
                                {getTranslatedText('label.plot_area')}
                              </strong>
                            </label>
                            <InputGroup>
                              <FormInput
                                type='number'
                                id='#plot_area'
                                placeholder='Enter plot area'
                                name='plot_area'
                                min={1}
                                step={0.01}
                                onChange={event => {
                                  this.validateAndSetInput(
                                    event,
                                    'plot_area',
                                    'float'
                                  );
                                }}
                                onBlur={event => {
                                 this.validateMinPlotArea();
                                }}
                                value={
                                  this.state['plot_area'].value
                                    ? this.state['plot_area'].value
                                    : ''
                                }
                                valid={this.state['plot_area'].valid}
                                invalid={
                                  !this.state['plot_area'].empty &&
                                  !this.state['plot_area'].valid
                                }
                              />
                              <Dropdown
                                addonType='append'
                                open={plotarea_unit_open}
                                toggle={this.showChangePlotAreaUnitModal}
                              >
                                <DropdownToggle caret theme='light'>
                                  {plotarea_unit == 'sq.m'
                                    ? getTranslatedText('label.in_meters')
                                    : getTranslatedText('label.in_yards')}
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <DropdownItem
                                    active={plotarea_unit == 'sq.m'}
                                    onClick={() =>
                                      this.changePlotAreaUnit('sq.m')
                                    }
                                  >
                                    {getTranslatedText('label.in_meters')}
                                  </DropdownItem>
                                  <DropdownItem
                                    active={plotarea_unit == 'sq.yards'}
                                    onClick={() =>
                                      this.changePlotAreaUnit('sq.yards')
                                    }
                                  >
                                    {getTranslatedText('label.in_yards')}
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                    ) : null}
                    <Row>
                      <Col xs='12'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='proposed_site_area_for_approval'>
                            <strong>
                              {getTranslatedText(
                                'label.proposed_site_area_for_approval'
                              )}
                            </strong>
                          </label>
                          <FormInput
                            id='#proposed_site_area_for_approval'
                            placeholder='Enter proposed site area for approval'
                            name='proposed_site_area_for_approval'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'proposed_site_area_for_approval',
                                'float'
                              )
                            }
                            valid={
                              this.state['proposed_site_area_for_approval']
                                .valid
                            }
                            invalid={
                              !this.state['proposed_site_area_for_approval']
                                .empty &&
                              !this.state['proposed_site_area_for_approval']
                                .valid
                            }
                            value={
                              this.state['proposed_site_area_for_approval']
                                .value
                                ? this.state['proposed_site_area_for_approval']
                                    .value
                                : ''
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='land_type'>
                            <strong>
                              {getTranslatedText('label.land_type')}
                            </strong>
                          </label>
                          <FormSelect
                            id='land_type'
                            name='land_type'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'land_type',
                                'select'
                              )
                            }
                            value={
                              this.state.land_type.value
                                ? this.state.land_type.value
                                : ''
                            }
                            valid={this.state['land_type'].valid}
                            invalid={
                              !this.state['land_type'].empty &&
                              !this.state['land_type'].valid
                            }
                          >
                            <option value=''>Select</option>
                            <option value='AGRICULTURE'>Agriculture</option>
                            <option value='NON_AGRICULTURE'>
                              Non-Agriculture
                            </option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='survey_no'>
                            <strong>
                              {getTranslatedText('label.survey_no')}
                            </strong>
                          </label>
                          <FormInput
                            id='#survey_no'
                            placeholder='Enter survey number'
                            name='survey_no'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'survey_no',
                                'pure_text'
                              )
                            }
                            valid={this.state['survey_no'].valid}
                            invalid={
                              !this.state['survey_no'].empty &&
                              !this.state['survey_no'].valid
                            }
                            value={
                              this.state['survey_no'].value
                                ? this.state['survey_no'].value
                                : ''
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='#ulb_id'>
                            <strong>
                              {getTranslatedText('label.ulb_name')}
                            </strong>
                          </label>
                          <FormSelect
                            id='#ulb_id'
                            name='ulb_id'
                            onChange={event => {
                              this.validateAndSetInputDropdowns(
                                event,
                                'ulb_name',
                                'select'
                              );
                            }}
                            valid={this.state['ulb_name'].valid}
                            invalid={
                              !this.state['ulb_name'].empty &&
                              !this.state['ulb_name'].valid
                            }
                            value={
                              this.state['ulb_name'].value
                                ? this.state['ulb_name'].value
                                : ''
                            }
                          >
                            <option value=''>Select</option>
                            {ulbs.map(ulb => {
                              return (
                                <option value={ulb.ulb_name} key={ulb.ulb_name}>
                                  {ulb.ulb_name}
                                </option>
                              );
                            })}
                          </FormSelect>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='mandal'>
                            <strong>{getTranslatedText('label.mandal')}</strong>
                          </label>
                          <FormSelect
                            id='mandal'
                            name='mandal'
                            onChange={event =>
                              this.validateAndSetInputDropdowns(
                                event,
                                'mandal',
                                'select'
                              )
                            }
                            valid={this.state['mandal'].valid}
                            invalid={
                              !this.state['mandal'].empty &&
                              !this.state['mandal'].valid
                            }
                            value={
                              this.state['mandal'].value
                                ? this.state['mandal'].value
                                : ''
                            }
                          >
                            <option value=''> Select</option>
                            {mandals.map(mandal => {
                              return (
                                <option
                                  value={mandal.mandal}
                                  key={mandal.mandal}
                                >
                                  {mandal.mandal}
                                </option>
                              );
                            })}
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      {this.state.village.visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='village'>
                              <strong>
                                {getTranslatedText('label.village')}
                              </strong>
                            </label>
                            <FormSelect
                              id='village'
                              name='village'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'village',
                                  'select'
                                )
                              }
                              valid={this.state['village'].valid}
                              invalid={
                                !this.state['village'].empty &&
                                !this.state['village'].valid
                              }
                              value={
                                this.state['village'].value
                                  ? this.state['village'].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              {villages.map(village => {
                                return (
                                  <option
                                    value={village.village}
                                    key={village.village}
                                  >
                                    {village.village}
                                  </option>
                                );
                              })}
                              }
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='revenue_village'>
                            <strong>
                              {getTranslatedText('label.revenue_village')}
                            </strong>
                          </label>
                          <FormInput
                            id='#revenue_village'
                            name='name'
                            placeholder='Enter Revenue Village'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'revenue_village',
                                'text'
                              )
                            }
                            value={
                              this.state['revenue_village'].value
                                ? this.state['revenue_village'].value
                                : ''
                            }
                            valid={this.state['revenue_village'].valid}
                            invalid={
                              !this.state['revenue_village'].empty &&
                              !this.state['revenue_village'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='if_site_area_more_than_proposed_reason'>
                            <strong>
                              {getTranslatedText(
                                'label.if_site_area_more_than_proposed_reason'
                              )}
                            </strong>
                          </label>
                          <FormSelect
                            id='if_site_area_more_than_proposed_reason'
                            name='if_site_area_more_than_proposed_reason'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'if_site_area_more_than_proposed_reason',
                                'select'
                              )
                            }
                            valid={
                              this.state[
                                'if_site_area_more_than_proposed_reason'
                              ].valid
                            }
                            invalid={
                              !this.state[
                                'if_site_area_more_than_proposed_reason'
                              ].empty &&
                              !this.state[
                                'if_site_area_more_than_proposed_reason'
                              ].valid
                            }
                            value={
                              this.state[
                                'if_site_area_more_than_proposed_reason'
                              ].value
                                ? this.state[
                                    'if_site_area_more_than_proposed_reason'
                                  ].value
                                : ''
                            }
                          >
                            <option value=''>Select</option>
                            <option value='already_Developed'>
                              Already Developed
                            </option>
                            <option value='not_available_on_ground'>
                              Not available on ground
                            </option>
                            <option value='for_future_development'>
                              For future development
                            </option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='address'>
                            <strong>
                              {getTranslatedText('label.address')}
                            </strong>
                          </label>
                          <FormTextarea
                            id='#address'
                            placeholder='Enter Property address'
                            name='address'
                            onChange={event =>
                              this.validateAndSetInput(event, 'address', 'text')
                            }
                            valid={this.state['address'].valid}
                            invalid={
                              !this.state['address'].empty &&
                              !this.state['address'].valid
                            }
                            value={
                              this.state['address'].value
                                ? this.state['address'].value
                                : ''
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='is_site_under_sanctioned_master_plan'>
                            <strong>
                              {getTranslatedText(
                                'label.is_site_under_sanctioned_master_plan'
                              )}
                            </strong>
                          </label>
                          <FormSelect
                            id='is_site_under_sanctioned_master_plan'
                            name='is_site_under_sanctioned_master_plan'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'is_site_under_sanctioned_master_plan',
                                'select'
                              );
                              this.updateVisibility(
                                'is_site_under_sanctioned_master_plan',
                                event.target.value
                              );
                            }}
                            valid={
                              this.state['is_site_under_sanctioned_master_plan']
                                .valid
                            }
                            invalid={
                              !this.state[
                                'is_site_under_sanctioned_master_plan'
                              ].empty &&
                              !this.state[
                                'is_site_under_sanctioned_master_plan'
                              ].valid
                            }
                            value={
                              this.state['is_site_under_sanctioned_master_plan']
                                .value
                                ? this.state[
                                    'is_site_under_sanctioned_master_plan'
                                  ].value
                                : ''
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      {this.state.land_use_as_per_master_plan.visible ? (
                        <Col xs='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='land_use_as_per_master_plan'>
                              <strong>
                                {getTranslatedText(
                                  'label.land_use_as_per_master_plan'
                                )}
                              </strong>
                            </label>
                            <FormInput
                              id='#land_use_as_per_master_plan'
                              name='land_use_as_per_master_plan'
                              placeholder='Land use as per master plan'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'land_use_as_per_master_plan',
                                  'text'
                                )
                              }
                              value={
                                this.state['land_use_as_per_master_plan'].value
                                  ? this.state['land_use_as_per_master_plan']
                                      .value
                                  : ''
                              }
                              valid={
                                this.state['land_use_as_per_master_plan'].valid
                              }
                              invalid={
                                !this.state['land_use_as_per_master_plan']
                                  .empty &&
                                !this.state['land_use_as_per_master_plan'].valid
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='land_allotment_by_govt'>
                            <strong>
                              {getTranslatedText(
                                'label.land_allotment_by_govt'
                              )}
                            </strong>
                          </label>
                          <FormSelect
                            id='land_allotment_by_govt'
                            name='land_allotment_by_govt'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'land_allotment_by_govt',
                                'select'
                              );
                            }}
                            valid={this.state['land_allotment_by_govt'].valid}
                            invalid={
                              !this.state['land_allotment_by_govt'].empty &&
                              !this.state['land_allotment_by_govt'].valid
                            }
                            value={
                              this.state['land_allotment_by_govt'].value
                                ? this.state['land_allotment_by_govt'].value
                                : ''
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='market_value'>
                            <strong>
                              {getTranslatedText('label.market_value')}
                            </strong>
                          </label>
                          <FormInput
                            id='#market_value'
                            name='market_value'
                            placeholder='Enter Market Value'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'market_value',
                                'text'
                              )
                            }
                            value={
                              this.state['market_value'].value
                                ? this.state['market_value'].value
                                : ''
                            }
                            valid={this.state['market_value'].valid}
                            invalid={
                              !this.state['market_value'].empty &&
                              !this.state['market_value'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <h4
                          style={{ color: '#1d9a5b', marginTop: 5 }}
                          className={this.getLabelTextAlignment()}
                        >
                          {getTranslatedText('heading.vicinity_details')}
                        </h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='airport_vicinity'>
                            <strong>
                              {getTranslatedText('label.airport_vicinity')}
                            </strong>
                          </label>
                          <FormSelect
                            id='airport_vicinity'
                            name='airport_vicinity'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'airport_vicinity',
                                'select'
                              );
                            }}
                            valid={this.state['airport_vicinity'].valid}
                            invalid={
                              !this.state['airport_vicinity'].empty &&
                              !this.state['airport_vicinity'].valid
                            }
                            value={
                              this.state['airport_vicinity'].value
                                ? this.state['airport_vicinity'].value
                                : ''
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='national_monument_vicinity'>
                            <strong>
                              {getTranslatedText(
                                'label.national_monument_vicinity'
                              )}
                            </strong>
                          </label>
                          <FormSelect
                            id='national_monument_vicinity'
                            name='national_monument_vicinity'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'national_monument_vicinity',
                                'select'
                              );
                            }}
                            valid={
                              this.state['national_monument_vicinity'].valid
                            }
                            invalid={
                              !this.state['national_monument_vicinity'].empty &&
                              !this.state['national_monument_vicinity'].valid
                            }
                            value={
                              this.state['national_monument_vicinity'].value
                                ? this.state['national_monument_vicinity'].value
                                : ''
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='heritage_structure_vicinity'>
                            <strong>
                              {getTranslatedText(
                                'label.heritage_structure_vicinity'
                              )}
                            </strong>
                          </label>
                          <FormSelect
                            id='heritage_structure_vicinity'
                            name='heritage_structure_vicinity'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'heritage_structure_vicinity',
                                'select'
                              );
                            }}
                            valid={
                              this.state['heritage_structure_vicinity'].valid
                            }
                            invalid={
                              !this.state['heritage_structure_vicinity']
                                .empty &&
                              !this.state['heritage_structure_vicinity'].valid
                            }
                            value={
                              this.state['heritage_structure_vicinity'].value
                                ? this.state['heritage_structure_vicinity']
                                    .value
                                : ''
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='oil_gas_pipeline_vicinity'>
                            <strong>
                              {getTranslatedText(
                                'label.oil_gas_pipeline_vicinity'
                              )}
                            </strong>
                          </label>
                          <FormSelect
                            id='oil_gas_pipeline_vicinity'
                            name='oil_gas_pipeline_vicinity'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'oil_gas_pipeline_vicinity',
                                'select'
                              );
                            }}
                            valid={
                              this.state['oil_gas_pipeline_vicinity'].valid
                            }
                            invalid={
                              !this.state['oil_gas_pipeline_vicinity'].empty &&
                              !this.state['oil_gas_pipeline_vicinity'].valid
                            }
                            value={
                              this.state['oil_gas_pipeline_vicinity'].value
                                ? this.state['oil_gas_pipeline_vicinity'].value
                                : ''
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='religious_structure_vicinity'>
                            <strong>
                              {getTranslatedText(
                                'label.religious_structure_vicinity'
                              )}
                            </strong>
                          </label>
                          <FormSelect
                            id='religious_structure_vicinity'
                            name='religious_structure_vicinity'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'religious_structure_vicinity',
                                'select'
                              );
                            }}
                            valid={
                              this.state['religious_structure_vicinity'].valid
                            }
                            invalid={
                              !this.state['religious_structure_vicinity']
                                .empty &&
                              !this.state['religious_structure_vicinity'].valid
                            }
                            value={
                              this.state['religious_structure_vicinity'].value
                                ? this.state['religious_structure_vicinity']
                                    .value
                                : ''
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                    </Row>
                    {/* road fields*/}
                    <Row>
                      <Col xs='12'>
                        <h4
                          style={{ color: '#1d9a5b', marginTop: 5 }}
                          className={this.getLabelTextAlignment()}
                        >
                          {getTranslatedText('heading.approach_road_details')}
                        </h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='is_approach_road_existing'>
                            <strong>
                              {getTranslatedText(
                                'label.is_approach_road_existing'
                              )}
                            </strong>
                          </label>
                          <FormSelect
                            id='is_approach_road_existing'
                            name='is_approach_road_existing'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'is_approach_road_existing',
                                'select'
                              );
                              this.updateVisibility(
                                'is_approach_road_existing',
                                event.target.value
                              );
                            }}
                            valid={
                              this.state['is_approach_road_existing'].valid
                            }
                            invalid={
                              !this.state['is_approach_road_existing'].empty &&
                              !this.state['is_approach_road_existing'].valid
                            }
                            value={
                              this.state['is_approach_road_existing'].value
                                ? this.state['is_approach_road_existing'].value
                                : ''
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      {this.state.road_width.visible ? (
                        <Col xs='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='road_width'>
                              <strong>
                                {getTranslatedText('label.road_width')}
                              </strong>
                            </label>
                            <FormInput
                              id='#road_width'
                              name='road_width'
                              placeholder='Enter Road Width'
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'road_width',
                                  'text'
                                );
                                this.updateVisibility(
                                  'road_width',
                                  event.target.value
                                );
                              }}
                              value={
                                this.state['road_width'].value
                                  ? this.state['road_width'].value
                                  : ''
                              }
                              valid={this.state['road_width'].valid}
                              invalid={
                                !this.state['road_width'].empty &&
                                !this.state['road_width'].valid
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.state.approach_road_connect_with_public_road
                        .visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='approach_road_connect_with_public_road'>
                              <strong>
                                {getTranslatedText(
                                  'label.approach_road_connect_with_public_road'
                                )}
                              </strong>
                            </label>
                            <FormSelect
                              id='approach_road_connect_with_public_road'
                              name='approach_road_connect_with_public_road'
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'approach_road_connect_with_public_road',
                                  'select'
                                );
                              }}
                              valid={
                                this.state[
                                  'approach_road_connect_with_public_road'
                                ].valid
                              }
                              invalid={
                                !this.state[
                                  'approach_road_connect_with_public_road'
                                ].empty &&
                                !this.state[
                                  'approach_road_connect_with_public_road'
                                ].valid
                              }
                              value={
                                this.state[
                                  'approach_road_connect_with_public_road'
                                ].value
                                  ? this.state[
                                      'approach_road_connect_with_public_road'
                                    ].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='yes'>Yes</option>
                              <option value='no'>No</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.state.status_of_road.visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='status_of_road'>
                              <strong>
                                {getTranslatedText('label.status_of_road')}
                              </strong>
                            </label>
                            <FormSelect
                              id='status_of_road'
                              name='status_of_road'
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'status_of_road',
                                  'select'
                                );
                              }}
                              valid={this.state['status_of_road'].valid}
                              invalid={
                                !this.state['status_of_road'].empty &&
                                !this.state['status_of_road'].valid
                              }
                              value={
                                this.state['status_of_road'].value
                                  ? this.state['status_of_road'].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='yes'>Yes</option>
                              <option value='no'>No</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.state.commencement_of_work_onsite.visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='commencement_of_work_onsite'>
                              <strong>
                                {getTranslatedText(
                                  'label.commencement_of_work_onsite'
                                )}
                              </strong>
                            </label>
                            <FormSelect
                              id='commencement_of_work_onsite'
                              name='commencement_of_work_onsite'
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'commencement_of_work_onsite',
                                  'select'
                                );
                              }}
                              valid={
                                this.state['commencement_of_work_onsite'].valid
                              }
                              invalid={
                                !this.state['commencement_of_work_onsite']
                                  .empty &&
                                !this.state['commencement_of_work_onsite'].valid
                              }
                              value={
                                this.state['commencement_of_work_onsite'].value
                                  ? this.state['commencement_of_work_onsite']
                                      .value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='yes'>Yes</option>
                              <option value='no'>No</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    {/*boundary attributes*/}
                    <Row>
                      <Col xs='12'>
                        <h4
                          style={{ color: '#1d9a5b', marginTop: 5 }}
                          className={this.getLabelTextAlignment()}
                        >
                          {getTranslatedText('heading.schedule_of_boundaries')}
                        </h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='boundary_schedule_north'>
                            <strong>
                              {getTranslatedText(
                                'label.boundary_schedule_north'
                              )}
                            </strong>
                          </label>
                          <FormInput
                            id='#boundary_schedule_north'
                            name='boundary_schedule_north'
                            placeholder='Enter Boundary schedule North'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'boundary_schedule_north',
                                'text'
                              );
                            }}
                            value={
                              this.state['boundary_schedule_north'].value
                                ? this.state['boundary_schedule_north'].value
                                : ''
                            }
                            valid={this.state['boundary_schedule_north'].valid}
                            invalid={
                              !this.state['boundary_schedule_north'].empty &&
                              !this.state['boundary_schedule_north'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='boundary_schedule_east'>
                            <strong>
                              {getTranslatedText(
                                'label.boundary_schedule_east'
                              )}
                            </strong>
                          </label>
                          <FormInput
                            id='#boundary_schedule_east'
                            name='boundary_schedule_east'
                            placeholder='Enter Boundary schedule East'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'boundary_schedule_east',
                                'text'
                              );
                            }}
                            value={
                              this.state['boundary_schedule_east'].value
                                ? this.state['boundary_schedule_east'].value
                                : ''
                            }
                            valid={this.state['boundary_schedule_east'].valid}
                            invalid={
                              !this.state['boundary_schedule_east'].empty &&
                              !this.state['boundary_schedule_east'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='boundary_schedule_west'>
                            <strong>
                              {getTranslatedText(
                                'label.boundary_schedule_west'
                              )}
                            </strong>
                          </label>
                          <FormInput
                            id='#boundary_schedule_west'
                            name='boundary_schedule_west'
                            placeholder='Enter Boundary schedule West'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'boundary_schedule_west',
                                'text'
                              );
                            }}
                            value={
                              this.state['boundary_schedule_west'].value
                                ? this.state['boundary_schedule_west'].value
                                : ''
                            }
                            valid={this.state['boundary_schedule_west'].valid}
                            invalid={
                              !this.state['boundary_schedule_west'].empty &&
                              !this.state['boundary_schedule_west'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='boundary_schedule_south'>
                            <strong>
                              {getTranslatedText(
                                'label.boundary_schedule_south'
                              )}
                            </strong>
                          </label>
                          <FormInput
                            id='#boundary_schedule_south'
                            name='boundary_schedule_south'
                            placeholder='Enter Boundary schedule South'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'boundary_schedule_south',
                                'text'
                              );
                            }}
                            value={
                              this.state['boundary_schedule_south'].value
                                ? this.state['boundary_schedule_south'].value
                                : ''
                            }
                            valid={this.state['boundary_schedule_south'].valid}
                            invalid={
                              !this.state['boundary_schedule_south'].empty &&
                              !this.state['boundary_schedule_south'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <h4
                          style={{ color: '#1d9a5b', marginTop: 5 }}
                          className={this.getLabelTextAlignment()}
                        >
                          {getTranslatedText('heading.town_planner_details')}
                        </h4>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='town_planner_license_number'>
                            <strong>
                              {getTranslatedText(
                                'label.town_planner_license_number'
                              )}
                            </strong>
                          </label>
                          <FormInput
                            id='#town_planner_license_number'
                            name='town_planner_license_number'
                            placeholder='Town planner license number'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'town_planner_license_number',
                                'text'
                              );
                            }}
                            value={
                              this.state['town_planner_license_number'].value
                                ? this.state['town_planner_license_number']
                                    .value
                                : ''
                            }
                            valid={
                              this.state['town_planner_license_number'].valid
                            }
                            invalid={
                              !this.state['town_planner_license_number']
                                .empty &&
                              !this.state['town_planner_license_number'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='town_planner_name'>
                            <strong>
                              {getTranslatedText('label.town_planner_name')}
                            </strong>
                          </label>
                          <FormInput
                            id='#town_planner_name'
                            name='town_planner_name'
                            placeholder='Town planner name'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'town_planner_name',
                                'text'
                              );
                            }}
                            value={
                              this.state['town_planner_name'].value
                                ? this.state['town_planner_name'].value
                                : ''
                            }
                            valid={this.state['town_planner_name'].valid}
                            invalid={
                              !this.state['town_planner_name'].empty &&
                              !this.state['town_planner_name'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='town_planner_mobile_number'>
                            <strong>
                              {getTranslatedText(
                                'label.town_planner_mobile_number'
                              )}
                            </strong>
                          </label>
                          <InputGroup className='mb-2'>
                            <InputGroupAddon type='prepend'>
                              <InputGroupText>+91</InputGroupText>
                            </InputGroupAddon>
                            <FormInput
                              id='#town_planner_mobile_number'
                              name='town_planner_mobile_number'
                              placeholder='Town planner mobile number'
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'town_planner_mobile_number',
                                  'number',
                                  10,
                                  10
                                );
                              }}
                              value={
                                this.state['town_planner_mobile_number'].value
                                  ? this.state['town_planner_mobile_number']
                                      .value
                                  : ''
                              }
                              valid={
                                this.state['town_planner_mobile_number'].valid
                              }
                              invalid={
                                !this.state['town_planner_mobile_number']
                                  .empty &&
                                !this.state['town_planner_mobile_number'].valid
                              }
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='town_planner_email_id'>
                            <strong>
                              {getTranslatedText('label.town_planner_email_id')}
                            </strong>
                          </label>
                          <FormInput
                            id='#town_planner_email_id'
                            name='town_planner_email_id'
                            placeholder='Town planner email id'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'town_planner_email_id',
                                'email'
                              );
                            }}
                            value={
                              this.state['town_planner_email_id'].value
                                ? this.state['town_planner_email_id'].value
                                : ''
                            }
                            valid={this.state['town_planner_email_id'].valid}
                            invalid={
                              !this.state['town_planner_email_id'].empty &&
                              !this.state['town_planner_email_id'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='town_planner_address'>
                            <strong>
                              {getTranslatedText('label.town_planner_address')}
                            </strong>
                          </label>
                          <FormInput
                            id='#town_planner_address'
                            name='town_planner_address'
                            placeholder='Town planner address'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'town_planner_address',
                                'text'
                              );
                            }}
                            value={
                              this.state['town_planner_address'].value
                                ? this.state['town_planner_address'].value
                                : ''
                            }
                            valid={this.state['town_planner_address'].valid}
                            invalid={
                              !this.state['town_planner_address'].empty &&
                              !this.state['town_planner_address'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <h4
                          style={{ color: '#1d9a5b', marginTop: 5 }}
                          className={this.getLabelTextAlignment()}
                        >
                          {getTranslatedText('heading.builder_details')}
                        </h4>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='builder_license_number'>
                            <strong>
                              {getTranslatedText(
                                'label.builder_license_number'
                              )}
                            </strong>
                          </label>
                          <FormInput
                            id='#builder_license_number'
                            name='builder_license_number'
                            placeholder='Builder license number'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'builder_license_number',
                                'text'
                              );
                            }}
                            value={
                              this.state['builder_license_number'].value
                                ? this.state['builder_license_number'].value
                                : ''
                            }
                            valid={this.state['builder_license_number'].valid}
                            invalid={
                              !this.state['builder_license_number'].empty &&
                              !this.state['builder_license_number'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='builder_name'>
                            <strong>
                              {getTranslatedText('label.builder_name')}
                            </strong>
                          </label>
                          <FormInput
                            id='#builder_name'
                            name='builder_name'
                            placeholder='Builder name'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'builder_name',
                                'text'
                              );
                            }}
                            value={
                              this.state['builder_name'].value
                                ? this.state['builder_name'].value
                                : ''
                            }
                            valid={this.state['builder_name'].valid}
                            invalid={
                              !this.state['builder_name'].empty &&
                              !this.state['builder_name'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='builder_mobile_number'>
                            <strong>
                              {getTranslatedText('label.builder_mobile_number')}
                            </strong>
                          </label>
                          <InputGroup className='mb-2'>
                            <InputGroupAddon type='prepend'>
                              <InputGroupText>+91</InputGroupText>
                            </InputGroupAddon>
                            <FormInput
                              id='#builder_mobile_number'
                              name='builder_mobile_number'
                              placeholder='Builder mobile number'
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'builder_mobile_number',
                                  'number',
                                  10
                                );
                              }}
                              value={
                                this.state['builder_mobile_number'].value
                                  ? this.state['builder_mobile_number'].value
                                  : ''
                              }
                              valid={this.state['builder_mobile_number'].valid}
                              invalid={
                                !this.state['builder_mobile_number'].empty &&
                                !this.state['builder_mobile_number'].valid
                              }
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='builder_email_id'>
                            <strong>
                              {getTranslatedText('label.builder_email_id')}
                            </strong>
                          </label>
                          <FormInput
                            id='#builder_email_id'
                            name='builder_email_id'
                            placeholder='Builder email id'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'builder_email_id',
                                'email'
                              );
                            }}
                            value={
                              this.state['builder_email_id'].value
                                ? this.state['builder_email_id'].value
                                : ''
                            }
                            valid={this.state['builder_email_id'].valid}
                            invalid={
                              !this.state['builder_email_id'].empty &&
                              !this.state['builder_email_id'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='builder_address'>
                            <strong>
                              {getTranslatedText('label.builder_address')}
                            </strong>
                          </label>
                          <FormInput
                            id='#builder_address'
                            name='builder_address'
                            placeholder='Builder address'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'builder_address',
                                'text'
                              );
                            }}
                            value={
                              this.state['builder_address'].value
                                ? this.state['builder_address'].value
                                : ''
                            }
                            valid={this.state['builder_address'].valid}
                            invalid={
                              !this.state['builder_address'].empty &&
                              !this.state['builder_address'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <h4
                          style={{ color: '#1d9a5b', marginTop: 5 }}
                          className={this.getLabelTextAlignment()}
                        >
                          {getTranslatedText('heading.surveyor_details')}
                        </h4>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='surveyor_license_number'>
                            <strong>
                              {getTranslatedText(
                                'label.surveyor_license_number'
                              )}
                            </strong>
                          </label>
                          <FormInput
                            id='#surveyor_license_number'
                            name='surveyor_license_number'
                            placeholder="Surveyor's license number"
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'surveyor_license_number',
                                'text'
                              );
                            }}
                            value={
                              this.state['surveyor_license_number'].value
                                ? this.state['surveyor_license_number'].value
                                : ''
                            }
                            valid={this.state['surveyor_license_number'].valid}
                            invalid={
                              !this.state['surveyor_license_number'].empty &&
                              !this.state['surveyor_license_number'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='surveyor_name'>
                            <strong>
                              {getTranslatedText('label.surveyor_name')}
                            </strong>
                          </label>
                          <FormInput
                            id='#surveyor_name'
                            name='surveyor_name'
                            placeholder="Surveyor's Name"
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'surveyor_name',
                                'text'
                              );
                            }}
                            value={
                              this.state['surveyor_name'].value
                                ? this.state['surveyor_name'].value
                                : ''
                            }
                            valid={this.state['surveyor_name'].valid}
                            invalid={
                              !this.state['surveyor_name'].empty &&
                              !this.state['surveyor_name'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='surveyor_mobile_number'>
                            <strong>
                              {getTranslatedText(
                                'label.surveyor_mobile_number'
                              )}
                            </strong>
                          </label>
                          <InputGroup className='mb-2'>
                            <InputGroupAddon type='prepend'>
                              <InputGroupText>+91</InputGroupText>
                            </InputGroupAddon>
                            <FormInput
                              id='#surveyor_mobile_number'
                              name='surveyor_mobile_number'
                              placeholder="Surveyor's mobile number"
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'surveyor_mobile_number',
                                  'number',
                                  10
                                );
                              }}
                              value={
                                this.state['surveyor_mobile_number'].value
                                  ? this.state['surveyor_mobile_number'].value
                                  : ''
                              }
                              valid={this.state['surveyor_mobile_number'].valid}
                              invalid={
                                !this.state['surveyor_mobile_number'].empty &&
                                !this.state['surveyor_mobile_number'].valid
                              }
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='surveyor_email_id'>
                            <strong>
                              {getTranslatedText('label.surveyor_email_id')}
                            </strong>
                          </label>
                          <FormInput
                            id='#surveyor_email_id'
                            name='surveyor_email_id'
                            placeholder="Surveyor's email id"
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'surveyor_email_id',
                                'email'
                              );
                            }}
                            value={
                              this.state['surveyor_email_id'].value
                                ? this.state['surveyor_email_id'].value
                                : ''
                            }
                            valid={this.state['surveyor_email_id'].valid}
                            invalid={
                              !this.state['surveyor_email_id'].empty &&
                              !this.state['surveyor_email_id'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='surveyor_address'>
                            <strong>
                              {getTranslatedText('label.surveyor_address')}
                            </strong>
                          </label>
                          <FormInput
                            id='#surveyor_address'
                            name='surveyor_address'
                            placeholder="Surveyor's address"
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'surveyor_address',
                                'text'
                              );
                            }}
                            value={
                              this.state['surveyor_address'].value
                                ? this.state['surveyor_address'].value
                                : ''
                            }
                            valid={this.state['surveyor_address'].valid}
                            invalid={
                              !this.state['surveyor_address'].empty &&
                              !this.state['surveyor_address'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <h4
                          style={{ color: '#1d9a5b', marginTop: 5 }}
                          className={this.getLabelTextAlignment()}
                        >
                          {getTranslatedText('heading.architect_details')}
                        </h4>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='architect_license_number'>
                            <strong>
                              {getTranslatedText(
                                'label.architect_license_number'
                              )}
                            </strong>
                          </label>
                          <FormInput
                            id='#architect_license_number'
                            name='architect_license_number'
                            placeholder="Architect's license number"
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'architect_license_number',
                                'text'
                              );
                            }}
                            value={
                              this.state['architect_license_number'].value
                                ? this.state['architect_license_number'].value
                                : ''
                            }
                            valid={this.state['architect_license_number'].valid}
                            invalid={
                              !this.state['architect_license_number'].empty &&
                              !this.state['architect_license_number'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='architect_name'>
                            <strong>
                              {getTranslatedText('label.architect_name')}
                            </strong>
                          </label>
                          <FormInput
                            id='#architect_name'
                            name='architect_name'
                            placeholder="Architect's Name"
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'architect_name',
                                'text'
                              );
                            }}
                            value={
                              this.state['architect_name'].value
                                ? this.state['architect_name'].value
                                : ''
                            }
                            valid={this.state['architect_name'].valid}
                            invalid={
                              !this.state['architect_name'].empty &&
                              !this.state['architect_name'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='architect_mobile_number'>
                            <strong>
                              {getTranslatedText(
                                'label.architect_mobile_number'
                              )}
                            </strong>
                          </label>
                          <InputGroup className='mb-2'>
                            <InputGroupAddon type='prepend'>
                              <InputGroupText>+91</InputGroupText>
                            </InputGroupAddon>
                            <FormInput
                              id='#architect_mobile_number'
                              name='architect_mobile_number'
                              placeholder="Architect's mobile number"
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'architect_mobile_number',
                                  'number',
                                  10
                                );
                              }}
                              value={
                                this.state['architect_mobile_number'].value
                                  ? this.state['architect_mobile_number'].value
                                  : ''
                              }
                              valid={
                                this.state['architect_mobile_number'].valid
                              }
                              invalid={
                                !this.state['architect_mobile_number'].empty &&
                                !this.state['architect_mobile_number'].valid
                              }
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='architect_email_id'>
                            <strong>
                              {getTranslatedText('label.architect_email_id')}
                            </strong>
                          </label>
                          <FormInput
                            id='#architect_email_id'
                            name='architect_email_id'
                            placeholder="Architect's email id"
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'architect_email_id',
                                'email'
                              );
                            }}
                            value={
                              this.state['architect_email_id'].value
                                ? this.state['architect_email_id'].value
                                : ''
                            }
                            valid={this.state['architect_email_id'].valid}
                            invalid={
                              !this.state['architect_email_id'].empty &&
                              !this.state['architect_email_id'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='architect_address'>
                            <strong>
                              {getTranslatedText('label.architect_address')}
                            </strong>
                          </label>
                          <FormInput
                            id='#architect_address'
                            name='architect_address'
                            placeholder="Architect's address"
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'architect_address',
                                'text'
                              );
                            }}
                            value={
                              this.state['architect_address'].value
                                ? this.state['architect_address'].value
                                : ''
                            }
                            valid={this.state['architect_address'].valid}
                            invalid={
                              !this.state['architect_address'].empty &&
                              !this.state['architect_address'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <h4
                          style={{ color: '#1d9a5b', marginTop: 5 }}
                          className={this.getLabelTextAlignment()}
                        >
                          {getTranslatedText(
                            'heading.structural_engineer_details'
                          )}
                        </h4>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='structural_engineer_license_number'>
                            <strong>
                              {getTranslatedText(
                                'label.structural_engineer_license_number'
                              )}
                            </strong>
                          </label>
                          <FormInput
                            id='#structural_engineer_license_number'
                            name='structural_engineer_license_number'
                            placeholder="Structural Engineer's license number"
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'structural_engineer_license_number',
                                'text'
                              );
                            }}
                            value={
                              this.state['structural_engineer_license_number']
                                .value
                                ? this.state[
                                    'structural_engineer_license_number'
                                  ].value
                                : ''
                            }
                            valid={
                              this.state['structural_engineer_license_number']
                                .valid
                            }
                            invalid={
                              !this.state['structural_engineer_license_number']
                                .empty &&
                              !this.state['structural_engineer_license_number']
                                .valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='structural_engineer_name'>
                            <strong>
                              {getTranslatedText(
                                'label.structural_engineer_name'
                              )}
                            </strong>
                          </label>
                          <FormInput
                            id='#structural_engineer_name'
                            name='structural_engineer_name'
                            placeholder="Structural Engineer's Name"
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'structural_engineer_name',
                                'text'
                              );
                            }}
                            value={
                              this.state['structural_engineer_name'].value
                                ? this.state['structural_engineer_name'].value
                                : ''
                            }
                            valid={this.state['structural_engineer_name'].valid}
                            invalid={
                              !this.state['structural_engineer_name'].empty &&
                              !this.state['structural_engineer_name'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='structural_engineer_mobile_number'>
                            <strong>
                              {getTranslatedText(
                                'label.structural_engineer_mobile_number'
                              )}
                            </strong>
                          </label>
                          <InputGroup className='mb-2'>
                            <InputGroupAddon type='prepend'>
                              <InputGroupText>+91</InputGroupText>
                            </InputGroupAddon>
                            <FormInput
                              id='#structural_engineer_mobile_number'
                              name='structural_engineer_mobile_number'
                              placeholder="Structural Engineer's mobile number"
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'structural_engineer_mobile_number',
                                  'number',
                                  10
                                );
                              }}
                              value={
                                this.state['structural_engineer_mobile_number']
                                  .value
                                  ? this.state[
                                      'structural_engineer_mobile_number'
                                    ].value
                                  : ''
                              }
                              valid={
                                this.state['structural_engineer_mobile_number']
                                  .valid
                              }
                              invalid={
                                !this.state['structural_engineer_mobile_number']
                                  .empty &&
                                !this.state['structural_engineer_mobile_number']
                                  .valid
                              }
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='structural_engineer_email_id'>
                            <strong>
                              {getTranslatedText(
                                'label.structural_engineer_email_id'
                              )}
                            </strong>
                          </label>
                          <FormInput
                            id='#structural_engineer_email_id'
                            name='structural_engineer_email_id'
                            placeholder="Structural Engineer's email id"
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'structural_engineer_email_id',
                                'email'
                              );
                            }}
                            value={
                              this.state['structural_engineer_email_id'].value
                                ? this.state['structural_engineer_email_id']
                                    .value
                                : ''
                            }
                            valid={
                              this.state['structural_engineer_email_id'].valid
                            }
                            invalid={
                              !this.state['structural_engineer_email_id']
                                .empty &&
                              !this.state['structural_engineer_email_id'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='structural_engineer_address'>
                            <strong>
                              {getTranslatedText(
                                'label.structural_engineer_address'
                              )}
                            </strong>
                          </label>
                          <FormInput
                            id='#structural_engineer_address'
                            name='structural_engineer_address'
                            placeholder="Structural Engineer's address"
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'structural_engineer_address',
                                'text'
                              );
                            }}
                            value={
                              this.state['structural_engineer_address'].value
                                ? this.state['structural_engineer_address']
                                    .value
                                : ''
                            }
                            valid={
                              this.state['structural_engineer_address'].valid
                            }
                            invalid={
                              !this.state['structural_engineer_address']
                                .empty &&
                              !this.state['structural_engineer_address'].valid
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <h4
                          style={{ color: '#1d9a5b', marginTop: 5 }}
                          className={this.getLabelTextAlignment()}
                        >
                          {getTranslatedText('heading.noc_processing')}
                        </h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='revenue_noc'>
                            <strong>
                              {getTranslatedText('label.revenue_noc')}
                            </strong>
                          </label>
                          <FormSelect
                            id='revenue_noc'
                            name='revenue_noc'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'revenue_noc',
                                'select'
                              )
                            }
                            value={
                              this.state.revenue_noc.value
                                ? this.state.revenue_noc.value
                                : ''
                            }
                            valid={this.state['revenue_noc'].valid}
                            invalid={
                              !this.state['revenue_noc'].empty &&
                              !this.state['revenue_noc'].valid
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='river_boundary'>
                            <strong>
                              {getTranslatedText('label.river_boundary')}
                            </strong>
                          </label>
                          <FormSelect
                            id='river_boundary'
                            name='river_boundary'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'river_boundary',
                                'select'
                              )
                            }
                            value={
                              this.state.river_boundary.value
                                ? this.state.river_boundary.value
                                : ''
                            }
                            valid={this.state['river_boundary'].valid}
                            invalid={
                              !this.state['river_boundary'].empty &&
                              !this.state['river_boundary'].valid
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='water_body_gt_10ha_boundary'>
                            <strong>
                              {getTranslatedText(
                                'label.water_body_gt_10ha_boundary'
                              )}
                            </strong>
                          </label>
                          <FormSelect
                            id='water_body_gt_10ha_boundary'
                            name='water_body_gt_10ha_boundary'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'water_body_gt_10ha_boundary',
                                'select'
                              )
                            }
                            value={
                              this.state.water_body_gt_10ha_boundary.value
                                ? this.state.water_body_gt_10ha_boundary.value
                                : ''
                            }
                            valid={
                              this.state['water_body_gt_10ha_boundary'].valid
                            }
                            invalid={
                              !this.state['water_body_gt_10ha_boundary']
                                .empty &&
                              !this.state['water_body_gt_10ha_boundary'].valid
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='water_body_lt_10ha_boundary'>
                            <strong>
                              {getTranslatedText(
                                'label.water_body_lt_10ha_boundary'
                              )}
                            </strong>
                          </label>
                          <FormSelect
                            id='water_body_lt_10ha_boundary'
                            name='water_body_lt_10ha_boundary'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'water_body_lt_10ha_boundary',
                                'select'
                              )
                            }
                            value={
                              this.state.water_body_lt_10ha_boundary.value
                                ? this.state.water_body_lt_10ha_boundary.value
                                : ''
                            }
                            valid={
                              this.state['water_body_lt_10ha_boundary'].valid
                            }
                            invalid={
                              !this.state['water_body_lt_10ha_boundary']
                                .empty &&
                              !this.state['water_body_lt_10ha_boundary'].valid
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='canal_gt_10m_boundary'>
                            <strong>
                              {getTranslatedText('label.canal_gt_10m_boundary')}
                            </strong>
                          </label>
                          <FormSelect
                            id='canal_gt_10m_boundary'
                            name='canal_gt_10m_boundary'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'canal_gt_10m_boundary',
                                'select'
                              )
                            }
                            value={
                              this.state.canal_gt_10m_boundary.value
                                ? this.state.canal_gt_10m_boundary.value
                                : ''
                            }
                            valid={this.state['canal_gt_10m_boundary'].valid}
                            invalid={
                              !this.state['canal_gt_10m_boundary'].empty &&
                              !this.state['canal_gt_10m_boundary'].valid
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='canal_lt_10m_boundary'>
                            <strong>
                              {getTranslatedText('label.canal_lt_10m_boundary')}
                            </strong>
                          </label>
                          <FormSelect
                            id='canal_lt_10m_boundary'
                            name='canal_lt_10m_boundary'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'canal_lt_10m_boundary',
                                'select'
                              )
                            }
                            value={
                              this.state.canal_lt_10m_boundary.value
                                ? this.state.canal_lt_10m_boundary.value
                                : ''
                            }
                            valid={this.state['canal_lt_10m_boundary'].valid}
                            invalid={
                              !this.state['canal_lt_10m_boundary'].empty &&
                              !this.state['canal_lt_10m_boundary'].valid
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='aai_land_layout_mapping'>
                            <strong>
                              {getTranslatedText(
                                'label.aai_land_layout_mapping'
                              )}
                            </strong>
                          </label>
                          <FormSelect
                            id='aai_land_layout_mapping'
                            name='aai_land_layout_mapping'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'aai_land_layout_mapping',
                                'select'
                              )
                            }
                            value={
                              this.state.aai_land_layout_mapping.value
                                ? this.state.aai_land_layout_mapping.value
                                : ''
                            }
                            valid={this.state['aai_land_layout_mapping'].valid}
                            invalid={
                              !this.state['aai_land_layout_mapping'].empty &&
                              !this.state['aai_land_layout_mapping'].valid
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='land_dev_gt_500000_or_area_gt_200000'>
                            <strong>
                              {getTranslatedText(
                                'label.land_dev_gt_500000_or_area_gt_200000'
                              )}
                            </strong>
                          </label>
                          <FormSelect
                            id='land_dev_gt_500000_or_area_gt_200000'
                            name='land_dev_gt_500000_or_area_gt_200000'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'land_dev_gt_500000_or_area_gt_200000',
                                'select'
                              )
                            }
                            value={
                              this.state.land_dev_gt_500000_or_area_gt_200000
                                .value
                                ? this.state
                                    .land_dev_gt_500000_or_area_gt_200000.value
                                : ''
                            }
                            valid={
                              this.state['land_dev_gt_500000_or_area_gt_200000']
                                .valid
                            }
                            invalid={
                              !this.state[
                                'land_dev_gt_500000_or_area_gt_200000'
                              ].empty &&
                              !this.state[
                                'land_dev_gt_500000_or_area_gt_200000'
                              ].valid
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='national_monument_authority'>
                            <strong>
                              {getTranslatedText(
                                'label.national_monument_authority'
                              )}
                            </strong>
                          </label>
                          <FormSelect
                            id='national_monument_authority'
                            name='national_monument_authority'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'national_monument_authority',
                                'select'
                              )
                            }
                            value={
                              this.state.national_monument_authority.value
                                ? this.state.national_monument_authority.value
                                : ''
                            }
                            valid={
                              this.state['national_monument_authority'].valid
                            }
                            invalid={
                              !this.state['national_monument_authority']
                                .empty &&
                              !this.state['national_monument_authority'].valid
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='heritage_structure'>
                            <strong>
                              {getTranslatedText('label.heritage_structure')}
                            </strong>
                          </label>
                          <FormSelect
                            id='heritage_structure'
                            name='heritage_structure'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'heritage_structure',
                                'select'
                              )
                            }
                            value={
                              this.state.heritage_structure.value
                                ? this.state.heritage_structure.value
                                : ''
                            }
                            valid={this.state['heritage_structure'].valid}
                            invalid={
                              !this.state['heritage_structure'].empty &&
                              !this.state['heritage_structure'].valid
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='oil_gas_authority'>
                            <strong>
                              {getTranslatedText('label.oil_gas_authority')}
                            </strong>
                          </label>
                          <FormSelect
                            id='oil_gas_authority'
                            name='oil_gas_authority'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'oil_gas_authority',
                                'select'
                              )
                            }
                            value={
                              this.state.oil_gas_authority.value
                                ? this.state.oil_gas_authority.value
                                : ''
                            }
                            valid={this.state['oil_gas_authority'].valid}
                            invalid={
                              !this.state['oil_gas_authority'].empty &&
                              !this.state['oil_gas_authority'].valid
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='religious_structures'>
                            <strong>
                              {getTranslatedText('label.religious_structures')}
                            </strong>
                          </label>
                          <FormSelect
                            id='religious_structures'
                            name='religious_structures'
                            onChange={event =>
                              this.validateAndSetInput(
                                event,
                                'religious_structures',
                                'select'
                              )
                            }
                            value={
                              this.state.religious_structures.value
                                ? this.state.religious_structures.value
                                : ''
                            }
                            valid={this.state['religious_structures'].valid}
                            invalid={
                              !this.state['religious_structures'].empty &&
                              !this.state['religious_structures'].valid
                            }
                          >
                            <option value=''>Select</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row className='align-items-center justify-content-center'>
                      <Col xs='auto' style={{ marginTop: 5, marginBottom: 5 }}>
                        <Button
                          theme='success'
                          type='submit'
                          disabled={this.isSubmitButtonDisabled()}
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
        </div>
      </LocalizationProvider>
    );
  }
}

export default LayoutForm;

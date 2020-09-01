import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormFeedback,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalBody,
  ModalHeader
} from 'shards-react';
import { Col, Row, Spinner } from 'react-bootstrap';
import Select from 'react-select'
import { alterParamsForUrl, getURL } from '../../utils/urlUtils';
import { clone, filter, forEach, isEmpty } from 'lodash';
import {
  convertStringToFloat,
  convertToSqMeters,
  convertToSqYards
} from '../../utils/convertionUtils';
import { inject, observer } from 'mobx-react';

import { FLOOR_ORDER } from '../../constants/floorDisplayNameConstants';
import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import { MdInfoOutline } from 'react-icons/md';
import React from 'react';
import { Router } from '../../routes';
import apiConstants from '../../constants/apiConstants';
import buildingApplicationFields from '../../constants/buildingApplicationFields';
import colorConstants from '../../constants/colorConstants';
import cryptoUtils from '../../utils/cryptoUtils';
import entryFormFields from '../../constants/entryFormFields';
import fetch from 'isomorphic-unfetch';
import { getTranslatedText } from '../../utils/translationUtils';
import { getTranslationLocale } from '../../utils/routeUtils';
import queryString from 'querystring';
import stringConstants from '../../constants/stringConstants';
import MapContainer from './map';

const empty_input = {
  value: '',
  empty: true,
  valid: false
};

@inject('applicationForm')
@inject('localization')
@observer
class ApplicationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapOpen: false,
      application_identifier: '',
      informationBox: false,
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
      plot_no: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      lrs_no: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        // validateAlternative: 'lp_no',
        visible: false
      },
      lp_no: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        // validateAlternative: 'lrs_no',
        visible: false
      },
      bps_no: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: false
      },

      ap_no: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: false
      },

      ab_no: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: false
      },


      village: {
        value: '',
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
      building_usage: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: false
      },
      actual_plot_area: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      plot_area_as_per_document: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      geo_coordinate_url: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      address: {
        value: null,
        infoType: 'property',
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
      survey_no: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      locality: {
        value: null,
        infoType: 'property',
        valid: false,
        empty: true,
        required: true,
        visible: true
      },
      no_of_floors: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      msb_no: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: false,
        visible: false
      },
      cellar: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      addinitional_stilts: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      ground_floor_as_parking: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      roof_type: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      front_existing_road_width: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      rear_existing_road_width: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      side1_existing_road_width: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      side2_existing_road_width: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      front_proposed_road_width: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      rear_proposed_road_width: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      side1_proposed_road_width: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      side2_proposed_road_width: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      front_road_affected_area: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      rear_road_affected_area: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      side1_road_affected_area: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      side2_road_affected_area: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      is_front_road_affected: {
        value: 'true',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      is_rear_road_affected: {
        value: 'false',
        infoType: 'property',
        valid: true,
        empty: false,
        disabled: false,
        required: true,
        visible: false
      },
      is_side1_road_affected: {
        value: 'false',
        infoType: 'property',
        valid: true,
        empty: false,
        disabled: false,
        required: true,
        visible: false
      },
      is_side2_road_affected: {
        value: 'false',
        infoType: 'property',
        valid: true,
        empty: false,
        disabled: false,
        required: true,
        visible: false
      },
      front_setback: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: true,
        required: true,
        visible: false
      },
      other_setback: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: true,
        required: true,
        visible: false
      },
      plot_status: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      is_under_slum_area: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: true
      },
      slum_name: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      other_slum_name: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      sale_deed_registration_date: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      floor_areas: {
        value: [],
        infoType: 'property',
        valid: true,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      total_built_up_area: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      net_plot_area: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      market_value: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      is_market_value_from_user: {
        value: 'false',
        infoType: 'property',
        valid: true,
        empty: false,
        disabled: false,
        required: true,
        visible: false
      },
      compound_length: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      construction_cost: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      mortgage_area: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: true,
        required: true,
        visible: false
      },
      mortgage_floor: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      // mortgage_document_number: {
      //   value: '',
      //   infoType: 'property',
      //   valid: false,
      //   empty: true,
      //   disabled: false,
      //   required: false,
      //   visible: false
      // },
      // mortgage_date: {
      //   value: '',
      //   infoType: 'property',
      //   valid: false,
      //   empty: true,
      //   disabled: false,
      //   required: false,
      //   visible: false
      // },
      sro_location: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      land_type: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      construction_status: {
        value: '',
        infoType: 'property',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      architect_name: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      architect_license_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      architect_mobile_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      architect_email_id: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: false,
        visible: false
      },
      structural_engineer_name: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      structural_engineer_license_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      structural_engineer_mobile_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      structural_engineer_email_id: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: false,
        visible: false
      },
      builder_name: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      builder_license_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      builder_mobile_number: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: true,
        visible: false
      },
      builder_email_id: {
        value: '',
        infoType: 'external_personnel_detail',
        valid: false,
        empty: true,
        disabled: false,
        required: false,
        visible: false
      },
      plot_area: {
        value: ''
      },

      fire_department_fields: {
        owner_name: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        father_name: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        age: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        owner_house_number: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        owner_pincode: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        owner_mobile_number: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        owner_email_id: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        building_name: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        building_address: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        district_id: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        mandal_id: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        village_id: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        height_of_the_building: {
          value: 0,
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        height_of_stilt_floor: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        total_built_up_area: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        area_site: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        application_stages: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        amount: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        road_widening: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        gov_building: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        fire_north: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        fire_south: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        fire_east: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        fire_west: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        abutting_road_width: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        front_side_dir: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        width_of_entry_gate: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        width_of_exit_gate: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        head_clearance: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        head_exit: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        corridor: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        farthest: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        transformer_safety: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        no_of_fire_lifts: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        car_parking: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        ramps_provides: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        generator_capacity: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        air_conditioning_safety: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: true,
          visible: false
        },
        department_type: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        building_year: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        occupancy_type: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        uld_no: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        questionnaire_id: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        entrepreneur_id: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        stage_id: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        rc_number: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        prov_noc_issue_date: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
        name_of_block: {
          value: '',
          infoType: 'fire_department_fields',
          valid: false,
          empty: true,
          disabled: false,
          required: false,
          visible: false
        },
      
      },

      stiltInput: [],
      floorInput: [],
      ulbs: [],
      mandals: [],
      villages: [],
      floors: [],
      floorSplitRoof: [],
      floorObj: {},
      slum_areas: [],
      sro_list: [],
      actual_plotarea_unit_open: false,
      actual_plotarea_unit: '',
      document_plotarea_unit_open: false,
      document_plotarea_unit: '',
      height: 0
    };
    this.applicationForm = this.props.applicationForm;
    this.localizationStore = this.props.localization;
  }

  static getRequestBody = req => {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('readable', function() {
        body += req.read();
      });
      req.on('end', function() {
        resolve(body);
      });
    });
  };

  static getInitialProps = async ({ mobxStore, query, req }) => {
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

  //TODO : Applicaiton on revisit does not fill all fields
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
      await this.retrieveDataForDropdowns(stringConstants.SRO, data.ulb_name);
      // this.updateVisibility('roof_effect_area', data.roof_effect_area); -- not used, method changed to uploadPlotStatusDependentFields
      //this.calculateBuildUpAreaAndMortgage();

      this.setState({
        actual_plotarea_unit: 'sq.m',
        document_plotarea_unit: 'sq.m'
      });

      Object.keys(this.state).map(stateItem => {
        if (
          (stateItem in entryFormFields ||
            stateItem in buildingApplicationFields) &&
          stateItem !== 'fire_department_fields'
        ) {
          this.state[stateItem].value = data[stateItem];
          if (this.state[stateItem].required && data[stateItem] != null)
            this.state[stateItem].valid = true;
          else this.state[stateItem].valid = false;
          if (this.state[stateItem].required && data[stateItem] != null)
            this.state[stateItem].empty = false;
          else this.state[stateItem].empty = true;
        }
      });
      await this.updatePlotAreaDependentFields(true);
      this.updatePlotStatusDependentFields('plot_status', data.plot_status);
      await this.populateFloorsDependentInputs();
      await this.fillParkingBuiltUpArea(data.floor_areas);
      this.updatingParkingFloorAreaVisibility();

      this.updateLrsLpNumberInputSelection(this.state.plot_status.value);

      await this.updateSlumAreaDropdown();

      this.calculateMortgageArea();

      this.updateRoadDetailsVisibility(
        'is_rear_road_affected',
        this.state.is_rear_road_affected.value
      );
      this.updateRoadDetailsVisibility(
        'is_side1_road_affected',
        this.state.is_side1_road_affected.value
      );
      this.updateRoadDetailsVisibility(
        'is_side2_road_affected',
        this.state.is_side2_road_affected.value
      );
      // await this.retrieveDataForDropdowns(
      //   stringConstants.FLOORS,
      //   data.plot_area
      // );
        
      if (data.fire_department_fields) {
        let fire_department_fields = data.fire_department_fields;
        Object.keys(this.state.fire_department_fields).map(
          fireDepartmentField => {
            this.state.fire_department_fields[fireDepartmentField].value =
              fire_department_fields[fireDepartmentField];
            if (
              this.state.fire_department_fields[fireDepartmentField].required &&
              fire_department_fields[fireDepartmentField] != null
            ) {
              this.state.fire_department_fields[
                fireDepartmentField
              ].valid = true;
            } else
              this.state.fire_department_fields[
                fireDepartmentField
              ].valid = false;
            if (
              this.state.fire_department_fields[fireDepartmentField].required &&
              fire_department_fields[fireDepartmentField] != null
            ) {
              this.state.fire_department_fields[
                fireDepartmentField
              ].empty = false;
            } else
              this.state.fire_department_fields[
                fireDepartmentField
              ].empty = true;
          }
        );
        this.state.height = fire_department_fields['height_of_the_building']
          ? fire_department_fields['height_of_the_building']
          : 0;
      }

      this.setState(
        { isAPILoading: false, refresh: !this.state.refresh },
        async () => {
          // this.processVisibilityForInputs();
        }
      );
    } else {
      this.setState({ isAPILoading: false });
    }
  };

  /**
   * Method to extract floor areas object from application details and check if stilt area is filled.
   * Assumption - Stilt area is the build up area for parking
   * If stilt area exists, set is_ground_floor_as_parking to YES, to fill the floor areas stilt obj to stilt area state obj
   */
  fillParkingBuiltUpArea = async floor_areas => {
    const parkingArea = filter(floor_areas, { type: 'stilt' });
    if (parkingArea.length > 0) {
      this.setState(prevState => ({
        ground_floor_as_parking: {
          ...prevState.ground_floor_as_parking,
          empty: false,
          value: 'YES',
          valid: true
        }
      }));
      this.state.stiltInput[0].value = parkingArea[0].area;
      this.state.stiltInput[0].empty = false;
      this.state.stiltInput[0].valid = true;
    } else {
      this.setState(prevState => ({
        ground_floor_as_parking: {
          ...prevState.ground_floor_as_parking,
          empty: false,
          value: 'NO',
          valid: true
        }
      }));
    }
  };

  resetMandalsAndVillages() {
    this.setState(prevState => ({
      villages: [],
      mandals: [],
      village: { ...prevState.village, value: '', valid: false, empty: true },
      mandal: { ...prevState.mandal, value: '', valid: false, empty: true }
    }));
  }

  resetSroLocation = () => {
    this.setState(prevState => ({
      sro_list: [],
      sro_location: {
        ...prevState.sro_location,
        value: '',
        valid: false,
        empty: true
      }
    }));
  };

  processFormData = async event => {
    
    event.preventDefault();
    const data = new FormData(event.target);
    
    //Validate if all fields are filled and valid
    Object.keys(this.state).map(stateItem => {
      if (stateItem in entryFormFields) {
        if (this.state[stateItem].validateAlternative == null) {
          if (!this.state[stateItem].valid && this.state[stateItem].required) {
            return;
          }
        } else {
          const dependentStateItem = this.state[stateItem].validateAlternative;
          if (
            (this.state[stateItem].empty &&
              !this.state[dependentStateItem].valid) ||
            (!this.state[stateItem].empty && !this.state[stateItem].valid)
          ) {
            return;
          }
        }
      }
    });

    //Converting plot area inputs to sq.m since DB stores everything as sq.m
    this.changePlotAreaUnit(true, 'sq.m'); //For Plot are as per document
    this.changePlotAreaUnit(false, 'sq.m'); //For Actual plot area

    let dataObj = {};

    Object.keys(this.state).map(stateItem => {
      if (stateItem in entryFormFields && this.state[stateItem].visible) {
        let paramType = this.state[stateItem].infoType;
        let elt = { [stateItem]: this.state[stateItem].value };
        dataObj[paramType] = { ...dataObj[paramType], ...elt };
      }
    });
    Object.keys(this.state.fire_department_fields).map(stateItem => {
      if (this.areFireDepartmentFieldsVisible()) {
        let fire_department_fields = this.state.fire_department_fields;
        let paramType = fire_department_fields[stateItem].infoType;
        this.copyApplicationDataToFireDepartmentFields(fire_department_fields);
        let elt = { [stateItem]: fire_department_fields[stateItem].value };
        dataObj[paramType] = { ...dataObj[paramType], ...elt };
      }
    });
    const { stiltInput, floorInput } = this.state;
    if (stiltInput.length > 0 || floorInput.length > 0) {
      var floorAreaObj = {
        area: null,
        type: ''
      };

      var floorAreas = [];
      forEach(stiltInput, function(stilt) {
        var stiltObj = clone(floorAreaObj);
        stiltObj.area = stilt.value;
        stiltObj.type = 'stilt';
        if (stilt.value) floorAreas.push(stiltObj);
      });
      forEach(floorInput, function(floor) {
        var floorObj = clone(floorAreaObj);
        floorObj.area = floor.value;
        floorObj.type = 'floor';
        if (floor.value) floorAreas.push(floorObj);
      });
      if (floorAreas.length > 0)
        dataObj['property']['floor_areas'] = floorAreas;
    }
    if (this.applicationForm.getApplicationId())
      dataObj.identifier = this.applicationForm.getApplicationId();

    dataObj.approval_for = stringConstants.BUILDING;
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
    if (res) {
      const data = await res.json();
      if (data.isSuccess) {
        const { application_identifier } = data;
        // this.applicationForm.setApplicationId(application_identifier);
        // this.applicationForm.setPassword(password);
        // this.setState({ isLoading: false });
        // return Router.replaceRoute('redirect', {
        //   language: language,
        //   applicationId: application_identifier
        // });
        this.setState({informationBox: true, application_identifier: application_identifier});
      } else {
        this.setState({ isLoading: false }, () => {
          alert(data.message);
        });
        return;
      }
    }
    // this.setState({ isLoading: false }, () => {
    //   alert('Unable to process application now, please try again later');
    // });
  };

  onClickOkInformationBox = () =>{
    const {application_identifier} = this.state;
    const language = this.localizationStore.getLanguage();
    this.setState({informationBox: false});
     return Router.replaceRoute('redirect', {
          language: language,
          applicationId: application_identifier
        });
  }


  copyApplicationDataToFireDepartmentFields = fire_department_fields => {
    fire_department_fields.owner_name.value = this.state.name.value;
    fire_department_fields.owner_house_number.value = this.state.plot_no.value;
    fire_department_fields.owner_mobile_number.value = this.state.phone_number.value;
    fire_department_fields.owner_email_id.value = this.state.email.value;
    fire_department_fields.building_address.value = this.state.address.value;
    fire_department_fields.mandal_id.value = this.state.mandal.value;
    fire_department_fields.village_id.value = this.state.village.value;
    fire_department_fields.height_of_the_building.value = this.state.height; // might be zero.
    fire_department_fields.total_built_up_area.value = this.state.total_built_up_area.value;
    fire_department_fields.area_site.value = this.state.plot_area.value;
    fire_department_fields.application_stages.value = 'PROVISIONALNOC';
    fire_department_fields.amount.value = '';
    fire_department_fields.department_type.value = 'MAUD';
    fire_department_fields.occupancy_type.value = 'PROVISIONALNOC';
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
          } else if (inputValue > 1) return true;
          else return false;
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
        let isSaleDeedInputValid =
          new Date(inputValue).getTime() < new Date('2018-03-31').getTime();
        if (!isSaleDeedInputValid)
          alert(
            'Your application will not be eligible for building permission approvals as the plot is part of un-authorized layout and not eligible for LRS.'
          );
        return isSaleDeedInputValid;
      case 'mortgage_date':
        return (
          new Date(inputValue).getTime() >= new Date('2020-01-01').getTime()
        );
      case 'url':
        let urlValid = inputValue.match(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
        );
        return urlValid ? true : false;
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
    this.updateMarketValueForApplication();
    this.updateSlumAreaDropdown();
    if (this.state[inputName].valid) {
      const isParamInput = inputName === 'ulb_name';
      const param = isParamInput
        ? stringConstants.MANDAL
        : stringConstants.VILLAGE;
      if (isParamInput) {
        this.resetMandalsAndVillages();
        this.retrieveDataForDropdowns(
          stringConstants.SRO,
          this.state[inputName].value
        );
      }
      this.retrieveDataForDropdowns(param, this.state[inputName].value);
    } else {
      const isParamInput = inputName === 'ulb_name';
      if (isParamInput) {
        this.resetMandalsAndVillages();
        this.resetSroLocation();
      } else {
        this.setState(prevState => ({
          village: {
            ...prevState.village,
            value: '',
            valid: false,
            empty: true
          }
        }));
      }
    }
  };

  /* Populates floor object for other dependent inputs to work seamlessly*/
  populateFloorsDependentInputs = async () => {
    const { floorSplitRoof, no_of_floors } = this.state;
    let floorObj = floorSplitRoof[no_of_floors.value];
    if (isEmpty(floorObj)) {
      this.setState(prevState => ({
        floorObj: {},
        stiltInput: [],
        floorInput: [],
        ground_floor_as_parking: {
          ...prevState.ground_floor_as_parking,
          visible: false,
          value: ''
        }
      }));
      this.getSetbackDetailsForApplication();
    }

    const defaultState = {
      value: '',
      infoType: 'property',
      valid: false,
      empty: true,
      disabled: false,
      required: true,
      visible: false
    };
    let stiltInput = Array(floorObj.split.stilt + 1).fill({ ...defaultState }), //Considering ground floor as stilt
      floorInput = Array(floorObj.split.floors - 1).fill({ ...defaultState });
    // let height = this.calculateHeight(floorObj);

    this.setState({ floorObj: floorObj, stiltInput, floorInput });
    this.getSetbackDetailsForApplication();
    this.updateMSB();
    await this.updateParkingFloorInputVisibility(floorObj);
  };

  validateFloorDropdownAndSetInput = async (event, inputName, inputType) => {
    await this.validateAndSetInput(event, inputName, inputType);

    // if (isEmpty(floorObj)) {
    //   this.state.roof_type.visible = false;
    //   this.state.roof_type.value = '';
    //   this.state.roof_type.empty = true;
    //   this.state.roof_type.valid = true;
    //   return;
    // }

    this.processVisibilityForInputs();
    await this.populateFloorsDependentInputs();
  };

  updateMSB = () => {
    const { floorSplitRoof, no_of_floors } = this.state;
    const plot_area = this.state.plot_area.value
    this.setState(prevState => ({
      msb_no: {
        ...prevState.msb_no,
        visible: false
      },
    }));   
    if(no_of_floors.value === 'MSB') {
      this.setState(prevState => ({
        msb_no: {
          ...prevState.msb_no,
          visible: true
        },
      }));
    }
  }

  updateParkingFloorInputVisibility = floorObject => {
    const { plot_area } = this.state;
    if (
      floorObject.split.floors == 1 ||
      plot_area.value <= 50 ||
      plot_area.value > 2500
    ) {
      this.setState(prevState => ({
        ground_floor_as_parking: {
          ...prevState.ground_floor_as_parking,
          visible: false
        }
      }));
    } else {
      this.setState(prevState => ({
        ground_floor_as_parking: {
          ...prevState.ground_floor_as_parking,
          visible: true
        }
      }));
    }
  };

  //This is not used at all
  calculateHeight = floorObj => {
    if (floorObj && floorObj.split) {
      return floorObj.split.floors * 3; // assuming each floor height is 3m.
    }
    return 0;
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
    } else if (type == stringConstants.FLOORS) {
      if (!this.state.plot_area.value) {
        this.setState({
          floors: [],
          floorObj: {},
          floorSplitRoof: [],
          isAPILoading: false
        });
        this.state.roof_type.value = '';
        return;
      }
      let url = getURL(apiConstants.FLOOR_DROPDOWN.USECASE);
      url = alterParamsForUrl(url, {
        dependant_value: value
      });
      let response = await fetch(url);
      if (response && response.status === 200) {
        const models = await response.json();
        var floors = [];
        var floorSplitRoof = {};
        if (models && models.length) {
          models.map(floor => {
            const obj_ = (({ type, display_name }) => ({ type, display_name }))(
              floor
            );
            floors.push(obj_);
            floorSplitRoof[floor.type] = {
              roof: floor.roof,
              split: floor.split
            };
          });
          this.setState({
            floors: floors,
            floorSplitRoof: floorSplitRoof,
            isAPILoading: false
          });
          return;
        }
      }
      this.setState({
        floors: [],
        floorObj: {},
        isAPILoading: false
      });
    } else if (type == stringConstants.SRO) {
      this.setState({ isAPILoading: true });
      let url = getURL(apiConstants.SRO_DROPDOWN.USECASE);
      url = alterParamsForUrl(url, {
        ulb_name: value
      });
      let response = await fetch(url);
      if (response && response.status === 200) {
        const sros_for_ulb = await response.json();
        this.setState({
          sro_list: sros_for_ulb,
          isAPILoading: false
        });
      } else {
        this.resetSroLocation();
      }
    }
  };

  updatingParkingFloorAreaVisibility = () => {
    const { ground_floor_as_parking } = this.state;

    if (ground_floor_as_parking.value === 'YES') {
      this.setState(prevState => ({
        floor_areas: {
          ...prevState.floor_areas,
          visible: true
        }
      }));
    } else {
      this.setState(prevState => ({
        floor_areas: {
          ...prevState.floor_areas,
          visible: false
        }
      }));
    }
  };

  processVisibilityForConstructionType = event => {
    const construction_type = event.target.value;
    if (construction_type == 'NON_RESIDENTIAL') {
      this.setState(prevState => ({
        building_usage: {
          ...prevState.building_usage,
          visible: true
        }
      }));
      this.updateVisibilityForSingleWindow();
    } else {
      this.setState(prevState => ({
        building_usage: {
          ...prevState.building_usage,
          visible: false
        }
      }));
      const plot_area = this.state.plot_area.value;
      this.updateVisibilityForNonSingleWindow(plot_area);
    }
  };

  updateVisibilityForSingleWindow = () => {
    this.setState(prevState => ({
      no_of_floors: {
        ...prevState.no_of_floors,
        visible: true
      },
      lrs_no: {
        ...prevState.lrs_no,
        visible: false
      },
      lp_no: {
        ...prevState.lp_no,
        visible: false
      },
      ap_no: {
        ...prevState.ap_no,
        visible: false
      },
      ab_no: {
        ...prevState.ab_no,
        visible: false
      },
      bps_no: {
        ...prevState.bps_no,
        visible: false
      },
      roof_type: {
        ...prevState.roof_type,
        visible: false
      },
      front_road_width: {
        ...prevState.front_road_width,
        visible: false
      },
      road_effect_area: {
        ...prevState.road_effect_area,
        visible: false
      },
      current_road_width: {
        ...prevState.current_road_width,
        visible: false
      },
      proposed_road_width: {
        ...prevState.proposed_road_width,
        visible: false
      },
      plot_status: {
        ...prevState.plot_status,
        visible: false
      },
      sale_deed_registration_date: {
        ...prevState.sale_deed_registration_date,
        visible: false
      },
      floor_areas: {
        ...prevState.floor_areas,
        visible: false
      },
      total_built_up_area: {
        ...prevState.total_built_up_area,
        visible: false
      },
      net_plot_area: {
        ...prevState.net_plot_area,
        visible: false
      },
      market_value: {
        ...prevState.market_value,
        visible: false
      },
      compound_length: {
        ...prevState.compound_length,
        visible: false
      },
      construction_cost: {
        ...prevState.construction_cost,
        visible: false
      },
      mortgage_area: {
        ...prevState.mortgage_area,
        visible: false
      },
      mortgage_floor: {
        ...prevState.mortgage_floor,
        visible: false
      },
      // mortgage_document_number: {
      //   ...prevState.mortgage_document_number,
      //   visible: false
      // },
      // mortgage_date: {
      //   ...prevState.mortgage_date,
      //   visible: false
      // },
      sro_location: {
        ...prevState.sro_location,
        visible: true
      },
      architect_name: {
        ...prevState.architect_name,
        visible: true
      },
      architect_license_number: {
        ...prevState.architect_license_number,
        visible: true
      },
      architect_mobile_number: {
        ...prevState.architect_mobile_number,
        visible: true
      },
      architect_email_id: {
        ...prevState.architect_email_id,
        visible: true
      },
      structural_engineer_name: {
        ...prevState.structural_engineer_name,
        visible: true
      },
      structural_engineer_license_number: {
        ...prevState.structural_engineer_license_number,
        visible: true
      },
      structural_engineer_mobile_number: {
        ...prevState.structural_engineer_mobile_number,
        visible: true
      },
      structural_engineer_email_id: {
        ...prevState.structural_engineer_email_id,
        visible: true
      },
      builder_name: {
        ...prevState.builder_name,
        visible: true
      },
      builder_license_number: {
        ...prevState.builder_license_number,
        visible: true
      },
      builder_mobile_number: {
        ...prevState.builder_mobile_number,
        visible: true
      },
      builder_email_id: {
        ...prevState.builder_email_id,
        visible: true
      },
      front_existing_road_width: {
        ...prevState.front_existing_road_width,
        visible: false
      },
      front_proposed_road_width: {
        ...prevState.front_proposed_road_width,
        visible: false
      },
      front_road_affected_area: {
        ...prevState.front_road_affected_area,
        visible: false
      },
      is_front_road_affected: {
        ...prevState.is_front_road_affected,
        visible: false
      },
      rear_existing_road_width: {
        ...prevState.rear_existing_road_width,
        visible: false
      },
      rear_proposed_road_width: {
        ...prevState.rear_proposed_road_width,
        visible: false
      },
      rear_road_affected_area: {
        ...prevState.rear_road_affected_area,
        visible: false
      },
      is_rear_road_affected: {
        ...prevState.is_rear_road_affected,
        visible: false
      },
      side1_existing_road_width: {
        ...prevState.side1_existing_road_width,
        visible: false
      },
      side1_proposed_road_width: {
        ...prevState.side1_proposed_road_width,
        visible: false
      },
      side1_road_affected_area: {
        ...prevState.side1_road_affected_area,
        visible: false
      },
      is_side1_road_affected: {
        ...prevState.is_side1_road_affected,
        visible: false
      },
      side2_existing_road_width: {
        ...prevState.side2_existing_road_width,
        visible: false
      },
      side2_proposed_road_width: {
        ...prevState.side2_proposed_road_width,
        visible: false
      },
      side2_road_affected_area: {
        ...prevState.side2_road_affected_area,
        visible: false
      },
      is_side2_road_affected: {
        ...prevState.is_side2_road_affected,
        visible: false
      },
      front_setback: {
        ...prevState.front_setback,
        visible: false
      },
      other_setback: {
        ...prevState.other_setback,
        visible: false
      }
    }));
  };

  /**
   * @param {Number} plotArea PlotArea of the building application (Min of actual and as on document)
   */
  updateVisibilityForNonSingleWindow = plotArea => {
    const { floorSplitRoof, no_of_floors } = this.state;
    this.processVisibilityOnlineReg();
    if (((plotArea > 50 && plotArea <= 63) || (plotArea > 63 && plotArea <= 300) || 
    (plotArea > 300 && plotArea <= 500)
    ) && 
      (no_of_floors.value === 'GROUND+2FLOORS' || 
      no_of_floors.value === 'STILT+GROUND+2FLOORS')
      ) {
        this.processVisibilityOnlineInstantWithMortgage()
    }
    if (((plotArea > 63 && plotArea <= 300) || (plotArea > 300 && plotArea <= 500))&& 
      (no_of_floors.value === 'GROUND+1FLOOR' || 
      no_of_floors.value === 'STILT+GROUNDFLOOR' ||
      no_of_floors.value === 'GROUNDFLOOR' ||
      no_of_floors.value === 'STILT+GROUND+1FLOOR')) {
      this.processVisibilityOnlineInstant();
    }
   if((plotArea > 300 && plotArea <= 500) && (no_of_floors.value === 'STILT+GROUND+3FLOORS' || 
   no_of_floors.value === 'GROUND+3FLOORS')) {
    this.updateVisibilityForSingleWindow();
   }
    if(plotArea > 500) {
      this.updateVisibilityForSingleWindow();
    }
  };

  processVisibilityOnlineReg = () =>{
    this.setState(prevState => ({
      no_of_floors: {
        ...prevState.no_of_floors,
        visible: true
      },
      lrs_no: {
        ...prevState.lrs_no,
        visible: false
      },
      lp_no: {
        ...prevState.lp_no,
        visible: false
      },
      ap_no: {
        ...prevState.ap_no,
        visible: false
      },
      bps_no: {
        ...prevState.bps_no,
        visible: false
      },
      ab_no: {
        ...prevState.ab_no,
        visible: false
      },
      roof_type: {
        ...prevState.roof_type,
        visible: false
      },
      front_road_width: {
        ...prevState.front_road_width,
        visible: false
      },
      road_effect_area: {
        ...prevState.road_effect_area,
        visible: false
      },
      current_road_width: {
        ...prevState.current_road_width,
        visible: false
      },
      proposed_road_width: {
        ...prevState.proposed_road_width,
        visible: false
      },
      plot_status: {
        ...prevState.plot_status,
        visible: false
      },
      sale_deed_registration_date: {
        ...prevState.sale_deed_registration_date,
        visible: false
      },
      floor_areas: {
        ...prevState.floor_areas,
        visible: false
      },
      total_built_up_area: {
        ...prevState.total_built_up_area,
        visible: false
      },
      net_plot_area: {
        ...prevState.net_plot_area,
        visible: false
      },
      market_value: {
        ...prevState.market_value,
        visible: false
      },
      compound_length: {
        ...prevState.compound_length,
        visible: false
      },
      construction_cost: {
        ...prevState.construction_cost,
        visible: false
      },
      mortgage_area: {
        ...prevState.mortgage_area,
        visible: false
      },
      mortgage_floor: {
        ...prevState.mortgage_floor,
        visible: false
      },
      // mortgage_document_number: {
      //   ...prevState.mortgage_document_number,
      //   visible: false
      // },
      // mortgage_date: {
      //   ...prevState.mortgage_date,
      //   visible: false
      // },
      sro_location: {
        ...prevState.sro_location,
        visible: false
      },
      architect_name: {
        ...prevState.architect_name,
        visible: false
      },
      architect_license_number: {
        ...prevState.architect_license_number,
        visible: false
      },
      architect_mobile_number: {
        ...prevState.architect_mobile_number,
        visible: false
      },
      architect_email_id: {
        ...prevState.architect_email_id,
        visible: false
      },
      structural_engineer_name: {
        ...prevState.structural_engineer_name,
        visible: false
      },
      structural_engineer_license_number: {
        ...prevState.structural_engineer_license_number,
        visible: false
      },
      structural_engineer_mobile_number: {
        ...prevState.structural_engineer_mobile_number,
        visible: false
      },
      structural_engineer_email_id: {
        ...prevState.structural_engineer_email_id,
        visible: false
      },
      builder_name: {
        ...prevState.builder_name,
        visible: false
      },
      builder_license_number: {
        ...prevState.builder_license_number,
        visible: false
      },
      builder_mobile_number: {
        ...prevState.builder_mobile_number,
        visible: false
      },
      builder_email_id: {
        ...prevState.builder_email_id,
        visible: false
      },
      front_existing_road_width: {
        ...prevState.front_existing_road_width,
        visible: false
      },
      front_proposed_road_width: {
        ...prevState.front_proposed_road_width,
        visible: false
      },
      front_road_affected_area: {
        ...prevState.front_road_affected_area,
        visible: false
      },
      is_front_road_affected: {
        ...prevState.is_front_road_affected,
        visible: false
      },
      rear_existing_road_width: {
        ...prevState.rear_existing_road_width,
        visible: false
      },
      rear_proposed_road_width: {
        ...prevState.rear_proposed_road_width,
        visible: false
      },
      rear_road_affected_area: {
        ...prevState.rear_road_affected_area,
        visible: false
      },
      is_rear_road_affected: {
        ...prevState.is_rear_road_affected,
        visible: false
      },
      side1_existing_road_width: {
        ...prevState.side1_existing_road_width,
        visible: false
      },
      side1_proposed_road_width: {
        ...prevState.side1_proposed_road_width,
        visible: false
      },
      side1_road_affected_area: {
        ...prevState.side1_road_affected_area,
        visible: false
      },
      is_side1_road_affected: {
        ...prevState.is_side1_road_affected,
        visible: false
      },
      side2_existing_road_width: {
        ...prevState.side2_existing_road_width,
        visible: false
      },
      side2_proposed_road_width: {
        ...prevState.side2_proposed_road_width,
        visible: false
      },
      side2_road_affected_area: {
        ...prevState.side2_road_affected_area,
        visible: false
      },
      is_side2_road_affected: {
        ...prevState.is_side2_road_affected,
        visible: false
      },
      front_setback: {
        ...prevState.front_setback,
        visible: false
      },
      other_setback: {
        ...prevState.other_setback,
        visible: false
      },
      is_market_value_from_user: {
        ...prevState.is_market_value_from_user,
        visible: false
      }
    }));
  }

  processVisibilityOnlineInstant = () => {
    this.setState(prevState => ({
      no_of_floors: {
        ...prevState.no_of_floors,
        visible: true
      },
      lrs_no: {
        ...prevState.lrs_no,
        visible: false
      },
      ap_no: {
        ...prevState.ap_no,
        visible: false
      },
      ab_no: {
        ...prevState.ab_no,
        visible: false
      },
      bpa_no: {
        ...prevState.bpa_no,
        visible: false
      },
      lp_no: {
        ...prevState.lp_no,
        visible: false
      },
      roof_type: {
        ...prevState.roof_type,
        visible: true
      },
      front_road_width: {
        ...prevState.front_road_width,
        visible: true
      },
      road_effect_area: {
        ...prevState.road_effect_area,
        visible: true
      },
      current_road_width: {
        ...prevState.current_road_width,
        visible: true
      },
      proposed_road_width: {
        ...prevState.proposed_road_width,
        visible: true
      },
      plot_status: {
        ...prevState.plot_status,
        visible: true
      },
      sale_deed_registration_date: {
        ...prevState.sale_deed_registration_date,
        visible: false
      },
      floor_areas: {
        ...prevState.floor_areas,
        visible: false
      },
      total_built_up_area: {
        ...prevState.total_built_up_area,
        visible: true
      },
      net_plot_area: {
        ...prevState.net_plot_area,
        visible: false
      },
      market_value: {
        ...prevState.market_value,
        visible: true
      },
      is_market_value_from_user: {
        ...prevState.is_market_value_from_user,
        visible: true
      },
      compound_length: {
        ...prevState.compound_length,
        visible: false
      },
      construction_cost: {
        ...prevState.construction_cost,
        visible: true,
        disabled: true
      },
      mortgage_area: {
        ...prevState.mortgage_area,
        disabled: true,
        visible: false
      },
      mortgage_floor: {
        ...prevState.mortgage_floor,
        visible: false
      },
      // mortgage_document_number: {
      //   ...prevState.mortgage_document_number,
      //   visible: false
      // },
      // mortgage_date: {
      //   ...prevState.mortgage_date,
      //   visible: false
      // },
      sro_location: {
        ...prevState.sro_location,
        visible: false
      },
      architect_name: {
        ...prevState.architect_name,
        visible: false
      },
      architect_license_number: {
        ...prevState.architect_license_number,
        visible: false
      },
      architect_mobile_number: {
        ...prevState.architect_mobile_number,
        visible: false
      },
      architect_email_id: {
        ...prevState.architect_email_id,
        visible: false
      },
      structural_engineer_name: {
        ...prevState.structural_engineer_name,
        visible: false
      },
      structural_engineer_license_number: {
        ...prevState.structural_engineer_license_number,
        visible: false
      },
      structural_engineer_mobile_number: {
        ...prevState.structural_engineer_mobile_number,
        visible: false
      },
      structural_engineer_email_id: {
        ...prevState.structural_engineer_email_id,
        visible: false
      },
      builder_name: {
        ...prevState.builder_name,
        visible: false
      },
      builder_license_number: {
        ...prevState.builder_license_number,
        visible: false
      },
      builder_mobile_number: {
        ...prevState.builder_mobile_number,
        visible: false
      },
      builder_email_id: {
        ...prevState.builder_email_id,
        visible: false
      },
      front_existing_road_width: {
        ...prevState.front_existing_road_width,
        visible: true
      },
      front_proposed_road_width: {
        ...prevState.front_proposed_road_width,
        visible: true
      },
      front_road_affected_area: {
        ...prevState.front_road_affected_area,
        visible: true
      },
      is_front_road_affected: {
        ...prevState.is_front_road_affected,
        visible: true
      },
      rear_existing_road_width: {
        ...prevState.rear_existing_road_width,
        visible: false
      },
      rear_proposed_road_width: {
        ...prevState.rear_proposed_road_width,
        visible: false
      },
      rear_road_affected_area: {
        ...prevState.rear_road_affected_area,
        visible: false
      },
      is_rear_road_affected: {
        ...prevState.is_rear_road_affected,
        visible: true
      },
      side1_existing_road_width: {
        ...prevState.side1_existing_road_width,
        visible: false
      },
      side1_proposed_road_width: {
        ...prevState.side1_proposed_road_width,
        visible: false
      },
      side1_road_affected_area: {
        ...prevState.side1_road_affected_area,
        visible: false
      },
      is_side1_road_affected: {
        ...prevState.is_side1_road_affected,
        visible: true
      },
      side2_existing_road_width: {
        ...prevState.side2_existing_road_width,
        visible: false
      },
      side2_proposed_road_width: {
        ...prevState.side2_proposed_road_width,
        visible: false
      },
      side2_road_affected_area: {
        ...prevState.side2_road_affected_area,
        visible: false
      },
      is_side2_road_affected: {
        ...prevState.is_side2_road_affected,
        visible: true
      },
      front_setback: {
        ...prevState.front_setback,
        value: '',
        empty: true,
        visible: true
      },
      other_setback: {
        ...prevState.other_setback,
        value: '',
        empty: true,
        visible: true
      }
    }));
  } 

  processVisibilityOnlineInstantWithMortgage = () => {
    this.setState(prevState => ({
      no_of_floors: {
        ...prevState.no_of_floors,
        visible: true
      },
      lrs_no: {
        ...prevState.lrs_no,
        visible: false
      },
      lp_no: {
        ...prevState.lp_no,
        visible: false
      },
      ap_no: {
        ...prevState.ap_no,
        visible: false
      },
      ab_no: {
        ...prevState.ab_no,
        visible: false
      },
      bpa_no: {
        ...prevState.bpa_no,
        visible: false
      },

      roof_type: {
        ...prevState.roof_type,
        visible: true
      },
      plot_status: {
        ...prevState.plot_status,
        visible: true
      },
      sale_deed_registration_date: {
        ...prevState.sale_deed_registration_date,
        visible: false
      },
      floor_areas: {
        ...prevState.floor_areas,
        visible: false
      },
      total_built_up_area: {
        ...prevState.total_built_up_area,
        visible: true
      },
      net_plot_area: {
        ...prevState.net_plot_area,
        visible: false
      },
      market_value: {
        ...prevState.market_value,
        visible: true
      },
      is_market_value_from_user: {
        ...prevState.is_market_value_from_user,
        visible: true
      },
      compound_length: {
        ...prevState.compound_length,
        visible: false
      },
      construction_cost: {
        ...prevState.construction_cost,
        visible: true,
        disabled: true
      },
      mortgage_area: {
        ...prevState.mortgage_area,
        disabled: true,
        visible: true
      },
      mortgage_floor: {
        ...prevState.mortgage_floor,
        visible: true
      },
      // mortgage_document_number: {
      //   ...prevState.mortgage_document_number,
      //   visible: true
      // },
      // mortgage_date: {
      //   ...prevState.mortgage_date,
      //   visible: true
      // },
      sro_location: {
        ...prevState.sro_location,
        visible: true
      },
      architect_name: {
        ...prevState.architect_name,
        visible: false
      },
      architect_license_number: {
        ...prevState.architect_license_number,
        visible: false
      },
      architect_mobile_number: {
        ...prevState.architect_mobile_number,
        visible: false
      },
      architect_email_id: {
        ...prevState.architect_email_id,
        visible: false
      },
      structural_engineer_name: {
        ...prevState.structural_engineer_name,
        visible: false
      },
      structural_engineer_license_number: {
        ...prevState.structural_engineer_license_number,
        visible: false
      },
      structural_engineer_mobile_number: {
        ...prevState.structural_engineer_mobile_number,
        visible: false
      },
      structural_engineer_email_id: {
        ...prevState.structural_engineer_email_id,
        visible: false
      },
      builder_name: {
        ...prevState.builder_name,
        visible: false
      },
      builder_license_number: {
        ...prevState.builder_license_number,
        visible: false
      },
      builder_mobile_number: {
        ...prevState.builder_mobile_number,
        visible: false
      },
      builder_email_id: {
        ...prevState.builder_email_id,
        visible: false
      },
      front_existing_road_width: {
        ...prevState.front_existing_road_width,
        visible: true
      },
      front_proposed_road_width: {
        ...prevState.front_proposed_road_width,
        visible: true
      },
      front_road_affected_area: {
        ...prevState.front_road_affected_area,
        visible: true
      },
      is_front_road_affected: {
        ...prevState.is_front_road_affected,
        visible: true
      },
      rear_existing_road_width: {
        ...prevState.rear_existing_road_width,
        visible: false
      },
      rear_proposed_road_width: {
        ...prevState.rear_proposed_road_width,
        visible: false
      },
      rear_road_affected_area: {
        ...prevState.rear_road_affected_area,
        visible: false
      },
      is_rear_road_affected: {
        ...prevState.is_rear_road_affected,
        visible: true
      },
      side1_existing_road_width: {
        ...prevState.side1_existing_road_width,
        visible: false
      },
      side1_proposed_road_width: {
        ...prevState.side1_proposed_road_width,
        visible: false
      },
      side1_road_affected_area: {
        ...prevState.side1_road_affected_area,
        visible: false
      },
      is_side1_road_affected: {
        ...prevState.is_side1_road_affected,
        visible: true
      },
      side2_existing_road_width: {
        ...prevState.side2_existing_road_width,
        visible: false
      },
      side2_proposed_road_width: {
        ...prevState.side2_proposed_road_width,
        visible: false
      },
      side2_road_affected_area: {
        ...prevState.side2_road_affected_area,
        visible: false
      },
      is_side2_road_affected: {
        ...prevState.is_side2_road_affected,
        visible: true
      },
      front_setback: {
        ...prevState.front_setback,
        value: '',
        empty: true,
        visible: true
      },
      other_setback: {
        ...prevState.other_setback,
        value: '',
        empty: true,
        visible: true
      }
    }));
  }


  validateCellarAndAddinitionalStilts = (plot_area) =>{
    this.setState(prevState => ({
      cellar: {
        ...prevState.cellar,
        visible: false
      },
      addinitional_stilts: {
        ...prevState.addinitional_stilts,
        visible: false
      },
    }));
    if(plot_area >= 750) {
      this.setState(prevState => ({
        cellar: {
          ...prevState.cellar,
          visible: true
        },
      }));     
    } 
     if(plot_area >= 2500) {
      this.setState(prevState => ({
        addinitional_stilts: {
          ...prevState.addinitional_stilts,
          visible: true
        },
      }));
    } 
  }

  processVisibilityForInputs = () => {
   
    const plot_area = this.state.plot_area.value;
    const construction_type = this.state.construction_type.value;

    if (construction_type == 'RESIDENTIAL') {
        this.updateVisibilityForNonSingleWindow(plot_area); 
    } else if (construction_type == 'NON_RESIDENTIAL') {
      this.updateVisibilityForSingleWindow();
    }
    this.validateCellarAndAddinitionalStilts(plot_area);
  };

  getSetbackDetailsForApplication = async () => {
    if (
      this.state.plot_area.value &&
      this.state.no_of_floors.valid &&
      this.state.front_existing_road_width.valid
    ) {
      this.setState({ isAPILoading: true });
      const plot_area = this.state.plot_area.value,
        no_of_floors = this.state.no_of_floors.value,
        road_width = this.state.front_existing_road_width.value;
      let url = getURL(apiConstants.APPLICATION_SETBACKS.USECASE);
      url = alterParamsForUrl(url, {
        floor: no_of_floors,
        plot_area: plot_area,
        road_width: road_width
      });
      let response = await (await fetch(url)).json();

      let front_setback = -1,
        other_setback = -1;
      forEach(response, setbackObj => {
        if (setbackObj.side == 'FRONT') {
          front_setback = setbackObj.value;
        } else if (setbackObj.side == 'OTHERS') {
          other_setback = setbackObj.value;
        }
        if (front_setback >= 0 && other_setback >= 0) {
          this.setState(prevState => ({
            front_setback: {
              ...prevState.front_setback,
              empty: false,
              valid: true,
              value: front_setback
            },
            other_setback: {
              ...prevState.other_setback,
              empty: false,
              valid: true,
              value: other_setback
            }
          }));
        }
      });
      this.setState({ isAPILoading: false });
    } else {
      this.setState(prevState => ({
        front_setback: {
          ...prevState.front_setback,
          empty: true,
          valid: false,
          value: ''
        },
        other_setback: {
          ...prevState.other_setback,
          empty: true,
          valid: false,
          value: ''
        }
      }));
    }
  };

  getLabelTextAlignment = () => {
    if (this.props.textAlign) {
      return this.props.textAlign;
    }
  };

  isSubmitButtonDisabled = () => {
    if (this.state.isLoading) return true;
    let check = (item, visible) => {
      if (item.validateAlternative == null) {
        if (item.required && visible) return !item.valid || item.empty;
        else if (!item.required && !item.empty && visible) {
          return !item.valid;
        } else return false;
      } else if (item.validateAlternative != null && visible) {
        const dependentStateItem = item.validateAlternative;
        if (
          (item.empty && !this.state[dependentStateItem].valid) ||
          (!item.empty && !item.valid)
        ) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    };

    let isDisabled = Object.keys(this.state).some(stateItem => {
      if (
        stateItem in entryFormFields &&
        stateItem !== 'fire_department_fields'
      ) {
        var result = check(
          this.state[stateItem],
          this.state[stateItem].visible
        );
        return result;
      } else return false;
    });

    if (this.areFireDepartmentFieldsVisible()) {
      isDisabled =
        Object.keys(this.state.fire_department_fields)
          .filter(stateItem => {
            return (
              this.state.fire_department_fields[stateItem].required === true
            );
          })
          .some(stateItem => {
            return check(this.state.fire_department_fields[stateItem], true);
          }) || isDisabled;
    }

    return isDisabled;
  };

  // Currently not being used
  calculateBuildUpAreaAndMortgage() {
    const { floorInput } = this.state;
    let builtUpArea = 0,
      mortgageArea = 0;
    forEach(floorInput, function(floor) {
      builtUpArea += parseFloat(floor.value);
    });
    mortgageArea = parseFloat(builtUpArea) * 0.1;
    this.setState(prevState => ({
      total_built_up_area: {
        ...prevState.total_built_up_area,
        valid: true,
        empty: false,
        value: parseFloat(builtUpArea).toFixed(2)
      },
      mortgage_area: {
        ...prevState.mortgage_area,
        valid: true,
        empty: false,
        value: parseFloat(mortgageArea).toFixed(2)
      }
    }));
  }

  /**
   * Method to calculate mortgage area based on Total built up area input entered by user
   */
  calculateMortgageArea = () => {
    const { total_built_up_area, plot_area } = this.state;
    var mortgage_area = 0,
      valid = false,
      empty = true;
    var total_built_up_area_valid = true;

    if (total_built_up_area.valid) {
      // if (total_built_up_area.value >= plot_area.value) {
      mortgage_area = parseFloat(total_built_up_area.value) * 0.1;
      valid = true;
      empty = false;
      // } else {
      //   total_built_up_area_valid = false;
      // }
    }
    this.setState(prevState => ({
      mortgage_area: {
        ...prevState.mortgage_area,
        valid,
        empty,
        value: parseFloat(mortgage_area).toFixed(2)
      },
      total_built_up_area: {
        ...prevState.total_built_up_area,
        valid: total_built_up_area_valid
      }
    }));
  };

  /**
   * Method to update the road inputs visibility based on the user selection
   * @param {String} inputName Name of the road field that is being updated
   * @param {Number} inputValue value of the given field
   */
  updateRoadDetailsVisibility = (inputName, inputValue) => {
    if (inputName == 'is_front_road_affected') {
      //Front Road Visibility Update
      if (inputValue == 'true') {
        this.setState(prevState => ({
          front_proposed_road_width: {
            ...prevState.front_proposed_road_width,
            visible: true
          },
          front_road_affected_area: {
            ...prevState.front_road_affected_area,
            visible: true
          }
        }));
      } else {
        this.setState(prevState => ({
          front_proposed_road_width: {
            ...prevState.front_proposed_road_width,
            visible: false,
            value: '',
            empty: true,
            valid: false
          },
          front_road_affected_area: {
            ...prevState.front_road_affected_area,
            visible: false,
            value: '',
            empty: true,
            valid: false
          }
        }));
      }
    } else if (inputName == 'is_rear_road_affected') {
      //Rear Road Visibility Update
      if (inputValue == 'true') {
        this.setState(prevState => ({
          rear_existing_road_width: {
            ...prevState.rear_existing_road_width,
            visible: true
          },
          rear_proposed_road_width: {
            ...prevState.rear_proposed_road_width,
            visible: true
          },
          rear_road_affected_area: {
            ...prevState.rear_road_affected_area,
            visible: true
          }
        }));
      } else {
        this.setState(prevState => ({
          rear_existing_road_width: {
            ...prevState.rear_existing_road_width,
            visible: false,
            value: '',
            empty: true,
            valid: false
          },
          rear_proposed_road_width: {
            ...prevState.rear_proposed_road_width,
            visible: false,
            value: '',
            empty: true,
            valid: false
          },
          rear_road_affected_area: {
            ...prevState.rear_road_affected_area,
            visible: false,
            value: '',
            empty: true,
            valid: false
          }
        }));
      }
    } else if (inputName == 'is_side1_road_affected') {
      //Side 1 Road Visibility Update
      if (inputValue == 'true') {
        this.setState(prevState => ({
          side1_existing_road_width: {
            ...prevState.side1_existing_road_width,
            visible: true
          },
          side1_proposed_road_width: {
            ...prevState.side1_proposed_road_width,
            visible: true
          },
          side1_road_affected_area: {
            ...prevState.side1_road_affected_area,
            visible: true
          }
        }));
      } else {
        this.setState(prevState => ({
          side1_existing_road_width: {
            ...prevState.side1_existing_road_width,
            visible: false,
            value: '',
            empty: true,
            valid: false
          },
          side1_proposed_road_width: {
            ...prevState.side1_proposed_road_width,
            visible: false,
            value: '',
            empty: true,
            valid: false
          },
          side1_road_affected_area: {
            ...prevState.side1_road_affected_area,
            visible: false,
            value: '',
            empty: true,
            valid: false
          }
        }));
      }
    } else if (inputName == 'is_side2_road_affected') {
      //Side 2 Road Visibility Update
      if (inputValue == 'true') {
        this.setState(prevState => ({
          side2_existing_road_width: {
            ...prevState.side2_existing_road_width,
            visible: true
          },
          side2_proposed_road_width: {
            ...prevState.side2_proposed_road_width,
            visible: true
          },
          side2_road_affected_area: {
            ...prevState.side2_road_affected_area,
            visible: true
          }
        }));
      } else {
        this.setState(prevState => ({
          side2_existing_road_width: {
            ...prevState.side2_existing_road_width,
            visible: false,
            value: '',
            empty: true,
            valid: false
          },
          side2_proposed_road_width: {
            ...prevState.side2_proposed_road_width,
            visible: false,
            value: '',
            empty: true,
            valid: false
          },
          side2_road_affected_area: {
            ...prevState.side2_road_affected_area,
            visible: false,
            value: '',
            empty: true,
            valid: false
          }
        }));
      }
    }
  };

  updateLrsLpNumberInputSelection = (lrs_lp_input) => {
    let lp_visibility = false,
      lrs_visibility = false,
      ap_visibility = false,
      ab_visibility = false,
      brs_visibility = false;


    if (lrs_lp_input == 'Lrs') {
      lrs_visibility = true;
      this.state.lp_no.value = '';
      this.state.ap_no.value = '';
      this.state.ab_no.value = '';
      this.state.bps_no.value = '';
    } else if (lrs_lp_input == 'Lp') {
      lp_visibility = true;
      this.state.lrs_no.value = '';
      this.state.ap_no.value = '';
      this.state.ab_no.value = '';
      this.state.bps_no.value = '';
    }
    else if (lrs_lp_input == 'Approved') {
      ap_visibility = true;
      this.state.lp_no.value = '';
      this.state.lrs_no.value = '';
      this.state.ab_no.value = '';
      this.state.bps_no.value = '';
    }
    else if (lrs_lp_input == 'Ab') {
      ab_visibility = true;
      this.state.lp_no.value = '';
      this.state.lrs_no.value = '';
      this.state.ap_no.value = '';
      this.state.bps_no.value = '';
    }
    else if (lrs_lp_input == 'Bps') {
      brs_visibility = true;
      this.state.lp_no.value = '';
      this.state.lrs_no.value = '';
      this.state.ap_no.value = '';
      this.state.ab_no.value = '';
    }

    this.setState(prevState => ({
      lrs_no: {
        ...prevState.lrs_no,
        visible: lrs_visibility
      },
      lp_no: {
        ...prevState.lp_no,
        visible: lp_visibility
      },
      ap_no: {
        ...prevState.ap_no,
        visible: ap_visibility
      },
      ab_no: {
        ...prevState.ab_no,
        visible: ab_visibility
      },
      bps_no: {
        ...prevState.bps_no,
        visible: brs_visibility
      }
    }));
  };

  updatePlotStatusDependentFields = (inputName, inputValue) => {
    if (inputName == 'plot_status') {
      if (inputValue != 'UnApproved') {
        this.setState(prevState => ({
          lrs_no: {
            ...prevState.lrs_no,
            visible: false
          },
          ap_no: {
            ...prevState.ap_no,
            visible: false
          },
          ab_no: {
            ...prevState.ab_no,
            visible: false
          },
          bps_no: {
            ...prevState.bps_no,
            visible: false
          },
          lp_no: {
            ...prevState.lp_no,
            visible: false
          },
          sale_deed_registration_date: {
            ...prevState.sale_deed_registration_date,
            ...empty_input,
            visible: false
          }
        }));
      } else if (inputValue == 'Unapproved') {
        this.setState(prevState => ({
          lrs_lp_input: {
            ...prevState.lrs_lp_input,
            ...empty_input,
            visible: false
          },
          lrs_no: {
            ...prevState.lrs_no,
            ...empty_input,
            visible: false
          },
          lp_no: {
            ...prevState.lp_no,
            ...empty_input,
            visible: false
          },
          ap_no: {
            ...prevState.ap_no,
            ...empty_input,
            visible: false
          },
          ab_no: {
            ...prevState.ab_no,
            ...empty_input,
            visible: false
          },
          bps_no: {
            ...prevState.bps_no,
            ...empty_input,
            visible: false
          },
          sale_deed_registration_date: {
            ...prevState.sale_deed_registration_date,
            visible: true
          }
        }));
      } else {
        this.setState(prevState => ({
          lrs_no: {
            ...prevState.lrs_no,
            ...empty_input,
            visible: false
          },
          lp_no: {
            ...prevState.lp_no,
            ...empty_input,
            visible: false
          },
          ap_no: {
            ...prevState.ap_no,
            ...empty_input,
            visible: false
          },
          ab_no: {
            ...prevState.ab_no,
            ...empty_input,
            visible: false
          },
          bps_no: {
            ...prevState.bps_no,
            ...empty_input,
            visible: false
          },
          sale_deed_registration_date: {
            ...prevState.sale_deed_registration_date,
            ...empty_input,
            visible: false
          }
        }));
      }
    }
  };

  /*Update floor dropdown and other fields visibility based on min of actual plot area nad plot area as per document
  plot area is always in sq.m */
  updatePlotAreaDependentFields = async isApplicationPrefill => {
    let actual_plot_area = convertStringToFloat(
      this.state.actual_plot_area.value
    );
    let plot_area_as_per_document = convertStringToFloat(
      this.state.plot_area_as_per_document.value
    );

    const { actual_plotarea_unit, document_plotarea_unit } = this.state;

    if (!(actual_plot_area > 0 && plot_area_as_per_document > 0)) return;

    if (actual_plotarea_unit == 'sq.yards') {
      actual_plot_area = convertToSqMeters(actual_plot_area);
    }
    if (document_plotarea_unit == 'sq.yards') {
      plot_area_as_per_document = convertToSqMeters(plot_area_as_per_document);
    }
    //Actual plot area cannot be greater than the plot area mentioned in the document
    if (plot_area_as_per_document >= actual_plot_area) {
      let plot_area =
        actual_plot_area < plot_area_as_per_document
          ? actual_plot_area
          : plot_area_as_per_document;
      this.state.plot_area.value = plot_area;
      this.state.actual_plot_area.valid = true;
      await this.retrieveDataForDropdowns(stringConstants.FLOORS, plot_area);
      this.processVisibilityForInputs();
      this.getSetbackDetailsForApplication();
      if (!isApplicationPrefill) this.updateMarketValueForApplication();
    } else if (
      !this.state.actual_plot_area.empty &&
      this.state.actual_plot_area.valid
    ) {
      alert(
        'Plot area as on ground cannot be more than the plot area mentioned in patta certificate'
      );
      this.setState(prevState => ({
        plot_area: {
          value: ''
        },
        actual_plot_area: {
          ...prevState.actual_plot_area,
          valid: false
        }
      }));
    }
  };

  /* Plot area unit dropdown visibility value setter */
  showChangePlotAreaUnitModal = isDocumentPlotAreaInput => {
    if (isDocumentPlotAreaInput)
      this.setState({
        document_plotarea_unit_open: !this.state.document_plotarea_unit_open
      });
    else
      this.setState({
        actual_plotarea_unit_open: !this.state.actual_plotarea_unit_open
      });
  };

  /**
   * Update Slum area dropdown if is_under_slum_area is true
   */
  updateSlumAreaDropdown = async () => {
    const { is_under_slum_area, village, mandal, ulb_name } = this.state;
    if (is_under_slum_area.valid && is_under_slum_area.value == 'true') {
      this.setState(prevState => ({
        slum_name: {
          ...prevState.slum_name,
          visible: true
        }
      }));
    } else {
      this.setState(prevState => ({
        slum_name: {
          ...prevState.slum_name,
          visible: false,
          ...empty_input
        }
      }));
    }
    if (
      village.valid &&
      mandal.valid &&
      ulb_name.valid &&
      is_under_slum_area.value == 'true'
    ) {
      const params = {
        village: village.value,
        mandal: mandal.value,
        ulb_name: ulb_name.value
      };
      this.setState({ isAPILoading: true });
      const url = getURL(apiConstants.APPLICATION_SLUM_AREA.USECASE).toString();
      fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
        .then(res => res.json())
        .then(response => {
          this.setState({
            slum_areas: response,
            isAPILoading: false
          });
        });
    }

    this.updateOtherSlumAreaVisibility();
  };

  /**
   * Updates visiblity of other_slum input when user sets slum name to "OTHERS"
   */
  updateOtherSlumAreaVisibility = () => {
    const { slum_name } = this.state;
    var visibility = false;
    if (slum_name.valid && slum_name.visible && slum_name.value == 'Others') {
      visibility = true;
    }
    this.setState(prevState => ({
      other_slum_name: {
        ...prevState.other_slum_name,
        visible: visibility
      }
    }));
  };

  areFireDepartmentFieldsVisible = () => {
    return (
      this.state.height > 10 ||
      this.state.construction_type.value === 'NON_RESIDENTIAL'
    );
  };

  /* Update unit for inputs Actual Plot area and Plot area as per document */
  /**
   * @param {Boolean} isDocumentPlotAreaInput is this plot area as per document input
   * @param {String} value unit to be converted to
   */
  changePlotAreaUnit = (isDocumentPlotAreaInput, value) => {
    if (!isDocumentPlotAreaInput) {
      const { actual_plotarea_unit } = this.state;
      if (actual_plotarea_unit != value) {
        if (value == 'sq.yards' && !this.state.actual_plot_area.empty) {
          this.state.actual_plot_area.value = convertToSqYards(
            this.state.actual_plot_area.value
          );
        } else if (value == 'sq.m' && !this.state.actual_plot_area.empty) {
          this.state.actual_plot_area.value = convertToSqMeters(
            this.state.actual_plot_area.value
          );
        }
      }
      this.setState({ actual_plotarea_unit: value });
    } else {
      const { document_plotarea_unit } = this.state;
      if (document_plotarea_unit != value) {
        if (
          value == 'sq.yards' &&
          !this.state.plot_area_as_per_document.empty
        ) {
          this.state.plot_area_as_per_document.value = convertToSqYards(
            this.state.plot_area_as_per_document.value
          );
        } else if (
          value == 'sq.m' &&
          !this.state.plot_area_as_per_document.empty
        ) {
          this.state.plot_area_as_per_document.value = convertToSqMeters(
            this.state.plot_area_as_per_document.value
          );
        }
      }
      this.setState({ document_plotarea_unit: value });
    }
  };

  /* Method to return the value of read-only field road affected area of each side */
  updateRoadAffectedArea = side => {
    var proposed_road_width = 0,
      existing_road_width = 0;
    let getRoadAffectedArea = (existing_road_width_, proposed_road_width_) => {
      existing_road_width_ = parseFloat(existing_road_width_);
      proposed_road_width_ = parseFloat(proposed_road_width_);
      if (proposed_road_width_ > existing_road_width_) {
        return parseFloat(
          (proposed_road_width_ - existing_road_width_) * 0.5
        ).toFixed(2);
      }
      return 0;
    };

    if (side == 'front') {
      existing_road_width = this.state.front_existing_road_width.valid
        ? this.state.front_existing_road_width.value
        : 0;
      proposed_road_width = this.state.front_proposed_road_width.valid
        ? this.state.front_proposed_road_width.value
        : 0;
      const road_affected_area = getRoadAffectedArea(
        existing_road_width,
        proposed_road_width
      );
      this.setState(prevState => ({
        front_road_affected_area: {
          ...prevState.front_road_affected_area,
          value: road_affected_area,
          valid: road_affected_area >= 0
        }
      }));
      this.getSetbackDetailsForApplication();
    } else if (side == 'rear') {
      existing_road_width = this.state.rear_existing_road_width.valid
        ? this.state.rear_existing_road_width.value
        : 0;
      proposed_road_width = this.state.rear_proposed_road_width.valid
        ? this.state.rear_proposed_road_width.value
        : 0;
      const road_affected_area = getRoadAffectedArea(
        existing_road_width,
        proposed_road_width
      );
      this.setState(prevState => ({
        rear_road_affected_area: {
          ...prevState.rear_road_affected_area,
          value: road_affected_area,
          valid: road_affected_area >= 0
        }
      }));
    } else if (side == 'side1') {
      existing_road_width = this.state.side1_existing_road_width.valid
        ? this.state.side1_existing_road_width.value
        : 0;
      proposed_road_width = this.state.side1_proposed_road_width.valid
        ? this.state.side1_proposed_road_width.value
        : 0;
      const road_affected_area = getRoadAffectedArea(
        existing_road_width,
        proposed_road_width
      );
      this.setState(prevState => ({
        side1_road_affected_area: {
          ...prevState.side1_road_affected_area,
          value: road_affected_area,
          valid: road_affected_area >= 0
        }
      }));
    } else if (side == 'side2') {
      existing_road_width = this.state.side2_existing_road_width.valid
        ? this.state.side2_existing_road_width.value
        : 0;
      proposed_road_width = this.state.side2_proposed_road_width.valid
        ? this.state.side2_proposed_road_width.value
        : 0;
      const road_affected_area = getRoadAffectedArea(
        existing_road_width,
        proposed_road_width
      );
      this.setState(prevState => ({
        side2_road_affected_area: {
          ...prevState.side2_road_affected_area,
          value: road_affected_area,
          valid: road_affected_area >= 0
        }
      }));
    }
  };

  /*  Method to return the marketValue for user */
  updateMarketValueForApplication = () => {
    const {
      village,
      mandal,
      ulb_name,
      survey_no,
      plot_no,
      locality,
      market_value
    } = this.state;
    if (
      village.valid &&
      mandal.valid &&
      ulb_name.valid &&
      survey_no.valid &&
      plot_no.valid &&
      locality.valid &&
      market_value.visible
    ) {
      const params = {
        village: village.value,
        mandal: mandal.value,
        ulb_name: ulb_name.value,
        survey_number: survey_no.value,
        door_number: plot_no.value,
        locality: locality.value
      };
      this.setState({ isAPILoading: true });
      const url = getURL(
        apiConstants.APPLICATION_MARKET_VALUE.USECASE
      ).toString();
      fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
        .then(res => res.json())
        .then(response => {
          const market_value_ = response.market_value;
          this.setState(prevState => ({
            market_value: {
              ...prevState.market_value,
              disabled: market_value_ != null,
              value: market_value_ == null ? '' : market_value_,
              valid: market_value_ != null,
              empty: market_value_ == null
            },
            is_market_value_from_user: {
              ...prevState.is_market_value_from_user,
              value: market_value_ === null ? 'true' : 'false',
              valid: true,
              empty: false
            },
            isAPILoading: false
          }));
        });
    } else {
      this.setState(prevState => ({
        market_value: {
          ...prevState.market_value,
          value: '',
          valid: market_value.visible ? false : true,
          empty: true,
          disabled: false
        },
        is_market_value_from_user: {
          ...prevState.is_market_value_from_user,
          value: 'false',
          valid: true,
          empty: false
        }
      }));
    }
  };

  getMortgageFloorOptions = () => {
    const {floorObj} = this.state;
    if(!isEmpty(floorObj)) {
      const options =   Object.keys(FLOOR_ORDER)
         .slice(0, floorObj.split.floors)
         .map((value, index) => {
           return ({value: value, label: FLOOR_ORDER[value]}
           );
         })
         options.push({value: 'STILT', label: 'Stilt'})
         return options;
       } 
      return {};
  }

  validateMortgageFloor = (selectedOption) =>{
    this.setState(prevState => ({
      mortgage_floor: {
        ...prevState.mortgage_floor,
        valid: true,
        empty: false,
        value: JSON.stringify(selectedOption)
      }
    }));
  }


  selectLocation = (locationLink) => {
       this.setState(prevState => ({
        geo_coordinate_url: {
          ...prevState.geo_coordinate_url,
          value: locationLink,
          valid: true,
          empty: false,
        },
        mapOpen: false,
      }));
  }

  mapLinkClick = () => {
    this.setState({ mapOpen: true})
  }

  render() {
    const {
      ulbs,
      isLoading,
      isAPILoading,
      mandals,
      villages,
      floors,
      floorObj,
      stiltInput,
      floorInput,
      slum_areas,
      sro_list,
      actual_plotarea_unit,
      actual_plotarea_unit_open,
      document_plotarea_unit,
      document_plotarea_unit_open
    } = this.state;
    const { language } = this.props;
    const localizationBundle = this.localizationStore.getLocalizationBundle()
      ? this.localizationStore.getLocalizationBundle()
      : {};
    const { stilt = 0, floors: floor = 0 } = floorObj['split'] || {};
    

    return (
      <LocalizationProvider messages={localizationBundle}>
        <Header
          route='application'
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
            <div className='application-container'>
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
                              {getTranslatedText('label.contact_address')}
                            </strong>
                          </label>
                          <FormTextarea
                            id='#contact_address'
                            placeholder='Enter contact address'
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
                          {getTranslatedText('heading.plot')}{' '}
                        </h4>
                      </Col>
                    </Row>

                    {/* Plot Area starts here */}
                    <Row>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='plot_area_as_per_document'>
                            <strong>
                              {getTranslatedText(
                                'label.plot_area_as_per_document'
                              )}
                            </strong>
                          </label>
                          <InputGroup>
                            <InputGroupAddon type='prepend'>
                              <Dropdown
                                addonType='append'
                                open={document_plotarea_unit_open}
                                toggle={() =>
                                  this.showChangePlotAreaUnitModal(true)
                                }
                              >
                                <DropdownToggle caret theme='light'>
                                  {document_plotarea_unit
                                    ? document_plotarea_unit == 'sq.m'
                                      ? getTranslatedText('label.in_meters')
                                      : getTranslatedText('label.in_yards')
                                    : 'Please select a unit'}
                                </DropdownToggle>
                                <DropdownMenu left='true'>
                                  <DropdownItem
                                    active={document_plotarea_unit == 'sq.m'}
                                    onClick={() =>
                                      this.changePlotAreaUnit(true, 'sq.m')
                                    }
                                  >
                                    {getTranslatedText('label.in_meters')}
                                  </DropdownItem>
                                  <DropdownItem
                                    active={
                                      document_plotarea_unit == 'sq.yards'
                                    }
                                    onClick={() =>
                                      this.changePlotAreaUnit(true, 'sq.yards')
                                    }
                                  >
                                    {getTranslatedText('label.in_yards')}
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </InputGroupAddon>
                            <FormInput
                              type='number'
                              id='#plot_area_as_per_document'
                              placeholder='Enter plot area as per document'
                              name='plot_area_as_per_document'
                              min={1}
                              step={0.01}
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'plot_area_as_per_document',
                                  'float',
                                  null,
                                  [1, 500000]
                                );
                              }}
                              onBlur={event => {
                                this.updatePlotAreaDependentFields();
                              }}
                              value={
                                this.state['plot_area_as_per_document'].value
                                  ? this.state['plot_area_as_per_document']
                                      .value
                                  : ''
                              }
                              valid={
                                this.state['plot_area_as_per_document'].valid
                              }
                              invalid={
                                !this.state['plot_area_as_per_document']
                                  .empty &&
                                !this.state['plot_area_as_per_document'].valid
                              }
                              disabled={document_plotarea_unit == ''}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>

                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='actual_plot_area'>
                            <strong>
                              {getTranslatedText('label.actual_plot_area')}
                            </strong>
                          </label>
                          <InputGroup>
                            <InputGroupAddon type='prepend'>
                              <Dropdown
                                open={actual_plotarea_unit_open}
                                toggle={() =>
                                  this.showChangePlotAreaUnitModal(false)
                                }
                              >
                                <DropdownToggle caret theme='light'>
                                  {actual_plotarea_unit
                                    ? actual_plotarea_unit == 'sq.m'
                                      ? getTranslatedText('label.in_meters')
                                      : getTranslatedText('label.in_yards')
                                    : 'Please select a unit'}
                                </DropdownToggle>
                                <DropdownMenu left='true'>
                                  <DropdownItem
                                    active={actual_plotarea_unit == 'sq.m'}
                                    onClick={() =>
                                      this.changePlotAreaUnit(false, 'sq.m')
                                    }
                                  >
                                    {getTranslatedText('label.in_meters')}
                                  </DropdownItem>
                                  <DropdownItem
                                    active={actual_plotarea_unit == 'sq.yards'}
                                    onClick={() =>
                                      this.changePlotAreaUnit(false, 'sq.yards')
                                    }
                                  >
                                    {getTranslatedText('label.in_yards')}
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </InputGroupAddon>
                            <FormInput
                              type='number'
                              id='#actual_plot_area'
                              placeholder='Enter plot area'
                              name='actual_plot_area'
                              min={1}
                              step={0.01}
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'actual_plot_area',
                                  'float',
                                  null,
                                  [1, 500000]
                                );
                              }}
                              onBlur={event => {
                                this.updatePlotAreaDependentFields();
                              }}
                              value={
                                this.state['actual_plot_area'].value
                                  ? this.state['actual_plot_area'].value
                                  : ''
                              }
                              valid={this.state['actual_plot_area'].valid}
                              invalid={
                                !this.state['actual_plot_area'].empty &&
                                !this.state['actual_plot_area'].valid
                              }
                              disabled={actual_plotarea_unit == ''}
                            />
                            <FormFeedback type='invalid'>
                              {getTranslatedText('error.plot_area_message')}
                            </FormFeedback>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='doorno'>
                            <strong>
                              {getTranslatedText('label.plot_no')}
                            </strong>
                          </label>
                          <FormInput
                            id='#door_no'
                            placeholder='Enter Plot No/Door No'
                            name='plot_no'
                            onChange={async event => {
                              await this.validateAndSetInput(
                                event,
                                'plot_no',
                                'pure_text'
                              );
                              this.updateMarketValueForApplication();
                            }}
                            valid={this.state['plot_no'].valid}
                            invalid={
                              !this.state['plot_no'].empty &&
                              !this.state['plot_no'].valid
                            }
                            value={
                              this.state['plot_no'].value
                                ? this.state['plot_no'].value
                                : ''
                            }
                          />
                        </FormGroup>
                      </Col>

                      <Col xs='12' md='6'>
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
                            onChange={async event => {
                              await this.validateAndSetInput(
                                event,
                                'survey_no',
                                'pure_text'
                              );
                              this.updateMarketValueForApplication();
                            }}
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
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='locality'>
                            <strong>
                              {getTranslatedText('label.locality')}
                            </strong>
                          </label>
                          <FormInput
                            id='#locality'
                            placeholder='Enter Locality'
                            name='locality'
                            onChange={async event => {
                              await this.validateAndSetInput(
                                event,
                                'locality',
                                'pure_text'
                              );
                              this.updateMarketValueForApplication();
                            }}
                            valid={this.state['locality'].valid}
                            invalid={
                              !this.state['locality'].empty &&
                              !this.state['locality'].valid
                            }
                            value={
                              this.state['locality'].value
                                ? this.state['locality'].value
                                : ''
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='12'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label html='geo_coordinate_url'>
                            <strong>
                              {getTranslatedText('label.geo_coordinate_url')}
                            </strong>
                            <strong> <a href="#" onClick={this.mapLinkClick}> Map </a>  </strong>
                          </label>
                          <FormInput
                            id='#geo_coordinate_url'
                            placeholder='Geo-Coordinates Link'
                            name='geo_coordinate_url'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'geo_coordinate_url',
                                'url'
                              );
                            }}
                            valid={this.state['geo_coordinate_url'].valid}
                            invalid={
                              !this.state['geo_coordinate_url'].empty &&
                              !this.state['geo_coordinate_url'].valid
                            }
                            value={
                              this.state['geo_coordinate_url'].value
                                ? this.state['geo_coordinate_url'].value
                                : ''
                            }
                          /> 
                        </FormGroup>
                      </Col>
                      <Col xs='12'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='address'>
                            <strong>
                              {getTranslatedText('label.address')}
                            </strong>
                          </label>
                          <FormTextarea
                            id='#address'
                            placeholder='Enter address'
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
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='mandal'>
                            <strong>{getTranslatedText('label.mandal')}</strong>
                          </label>
                          <FormSelect
                            id='mandal'
                            name='mandal'
                            onChange={event => {
                              this.validateAndSetInputDropdowns(
                                event,
                                'mandal',
                                'select'
                              );
                            }}
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
                            <option value=''> Select </option>
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
                              onChange={async event => {
                                await this.validateAndSetInput(
                                  event,
                                  'village',
                                  'select'
                                );
                                this.updateMarketValueForApplication();
                                this.updateSlumAreaDropdown();
                              }}
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
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      ) : null}
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='construction_type'>
                            <strong>
                              {getTranslatedText('label.construction_type')}
                            </strong>
                          </label>
                          <FormSelect
                            id='construction_type'
                            name='construction_type'
                            onChange={event => {
                              this.validateAndSetInput(
                                event,
                                'construction_type',
                                'select'
                              );
                              this.processVisibilityForConstructionType(event);
                            }}
                            value={
                              this.state.construction_type.value
                                ? this.state.construction_type.value
                                : ''
                            }
                            valid={this.state['construction_type'].valid}
                            invalid={
                              !this.state['construction_type'].empty &&
                              !this.state['construction_type'].valid
                            }
                          >
                            <option value='RESIDENTIAL'>Residential</option>
                            <option value='NON_RESIDENTIAL'>Non Residential</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>

                      {this.state.no_of_floors.visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='no_of_floors'>
                              <strong>
                                {getTranslatedText('label.no_of_floors')}
                              </strong>
                            </label>
                            <FormSelect
                              id='#no_of_floors'
                              name='no_of_floors'
                              min={1}
                              disabled={this.state.no_of_floors.disabled}
                              onChange={event => {
                                this.validateFloorDropdownAndSetInput(
                                  event,
                                  'no_of_floors',
                                  'select_with_validation'
                                );
                              }}
                              value={
                                this.state.no_of_floors.value
                                  ? this.state.no_of_floors.value
                                  : ''
                              }
                              valid={this.state['no_of_floors'].valid}
                              invalid={
                                !this.state['no_of_floors'].empty &&
                                !this.state['no_of_floors'].valid
                              }
                            >
                              <option value=''>Select</option>
                              {floors.map((floor, index) => {
                                return (
                                  <option value={floor.type} key={index}>
                                    {floor.display_name}
                                  </option>
                                );
                              })}
                            </FormSelect>

                            {this.state.msb_no.visible && (  
                            <FormInput
                              id='#floorCustomNumber'
                              placeholder='Enter Floor Number'
                              name='msb_no'
                              onChange={async event => {
                                await this.validateAndSetInput(
                                  event,
                                  'msb_no',
                                  'number',
                                  null,
                                  [1, 90]
                                );
                              }}
                              valid={this.state['msb_no'].valid}
                              invalid={
                                !this.state['msb_no'].empty &&
                                !this.state['msb_no'].valid
                              }
                              value={
                                this.state['msb_no'].value
                                  ? this.state['msb_no'].value
                                  : ''
                              }
                            />
                          )}
                          </FormGroup>
                        </Col>
                      )}
                    
                      {this.state.cellar.visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='cellar'>
                              <strong>
                              {getTranslatedText('label.cellar')}
                              </strong>
                            </label>
                            <FormSelect
                             id='#cellar'
                             name='cellar'
                             onChange={event => {
                               this.validateAndSetInput(
                                 event,
                                 'cellar',
                                 'select'
                               );
                             }}
                             value={
                               this.state.cellar.value
                                 ? this.state.cellar.value
                                 : ''
                             }
                             valid={this.state['cellar'].valid}
                             invalid={
                               !this.state['cellar'].empty &&
                               !this.state['cellar'].valid
                             }
                           >
                             <option value=''>Select</option>
                             <option value='1'>1</option>
                             <option value='2'>2</option>
                             <option value='3'>3</option>
                             <option value='4'>4</option>
                             <option value='5'>5</option>
                           </FormSelect>
                          </FormGroup>
                        </Col>
                      )}
                    
                      {this.state.addinitional_stilts.visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='addinitional_stilts'>
                              <strong>
                              {getTranslatedText('label.additional')}
                              </strong>
                            </label>
                          <FormSelect
                             id='#addinitional_stilts'
                             name='addinitional_stilts'
                             onChange={event => {
                               this.validateAndSetInput(
                                 event,
                                 'addinitional_stilts',
                                 'select'
                               );
                             }}
                             value={
                               this.state.addinitional_stilts.value
                                 ? this.state.addinitional_stilts.value
                                 : ''
                             }
                             valid={this.state['addinitional_stilts'].valid}
                             invalid={
                               !this.state['addinitional_stilts'].empty &&
                               !this.state['addinitional_stilts'].valid
                             }
                           >
                             <option value=''>Select</option>
                             <option value='1'>1</option>
                             <option value='2'>2</option>
                             <option value='3'>3</option>
                             <option value='4'>4</option>
                             <option value='5'>5</option>
                           </FormSelect>
                          </FormGroup>
                        </Col>
                      )}
                    
                      {!isEmpty(floorObj.roof) && this.state.roof_type.visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='roof_type'>
                              <strong>
                                {getTranslatedText('label.roof_type')}
                              </strong>
                            </label>
                            <FormSelect
                              id='#roof_type'
                              name='roof_type'
                              min={1}
                              disabled={this.state.roof_type.disabled}
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'roof_type',
                                  'select'
                                );
                              }}
                              value={
                                this.state.roof_type.value
                                  ? this.state.roof_type.value
                                  : ''
                              }
                              valid={this.state['roof_type'].valid}
                              invalid={
                                !this.state['roof_type'].empty &&
                                !this.state['roof_type'].valid
                              }
                            >
                              <option value=''>Select</option>
                              {floorObj.roof.map((roofTypeObj, index) => {
                                return (
                                  <option value={roofTypeObj.type} key={index}>
                                    {roofTypeObj.type}
                                  </option>
                                );
                              })}
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      )}

                      {this.state.ground_floor_as_parking.visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='ground_floor_as_parking'>
                              <strong>
                                {getTranslatedText(
                                  'label.ground_floor_as_parking'
                                )}
                              </strong>
                            </label>
                            <FormSelect
                              id='#ground_floor_as_parking'
                              name='ground_floor_as_parking'
                              onChange={async event => {
                                await this.validateAndSetInput(
                                  event,
                                  'ground_floor_as_parking',
                                  'select_with_validation'
                                );
                                this.updatingParkingFloorAreaVisibility();
                              }}
                              value={this.state.ground_floor_as_parking.value}
                              valid={
                                this.state['ground_floor_as_parking'].valid
                              }
                              invalid={
                                !this.state['ground_floor_as_parking'].empty &&
                                !this.state['ground_floor_as_parking'].valid
                              }
                            >
                              <option value=''>Select</option>
                              <option value='YES'>Yes</option>
                              <option value='NO'>No</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      )}

                      {this.state['total_built_up_area'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='total_built_up_area'>
                              <strong>
                                {getTranslatedText('label.total_built_up_area')}
                              </strong>
                            </label>

                            <FormInput
                              type='number'
                              id='total_built_up_area'
                              min={1}
                              step={0.01}
                              onChange={async () => {
                                await this.validateAndSetInput(
                                  event,
                                  'total_built_up_area',
                                  'float'
                                );
                                this.calculateMortgageArea();
                              }}
                              disabled={
                                this.state['total_built_up_area'].disabled
                              }
                              value={
                                this.state['total_built_up_area'].value
                                  ? this.state['total_built_up_area'].value
                                  : ''
                              }
                              name='total_built_up_area'
                              valid={this.state['total_built_up_area'].valid}
                              invalid={
                                !this.state['total_built_up_area'].empty &&
                                !this.state['total_built_up_area'].valid
                              }
                            ></FormInput>
                            <FormFeedback type='invalid'>
                              {getTranslatedText('error.total_built_up_area')}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                      )}

                      {this.state['floor_areas'].visible
                        ? stiltInput.map((val, index) => {
                            return (
                              <Col key='stiltInput' xs='12' md='6'>
                                <FormGroup
                                  className={this.getLabelTextAlignment()}
                                >
                                  <label htmlFor='stiltInput'>
                                    <strong>
                                      {getTranslatedText('label.stiltInput')}
                                    </strong>
                                  </label>

                                  <FormInput
                                    type='number'
                                    min={1}
                                    step={0.01}
                                    id='stiltInput'
                                    name='stiltInput'
                                    onChange={event => {
                                      this.validateAndSetInput(
                                        event,
                                        'stiltInput',
                                        'float',
                                        undefined,
                                        undefined,
                                        0
                                      );
                                    }}
                                    value={
                                      this.state['stiltInput'][0].value
                                        ? this.state['stiltInput'][0].value
                                        : ''
                                    }
                                    valid={this.state['stiltInput'][0].valid}
                                    invalid={
                                      !this.state['stiltInput'][0].empty &&
                                      !this.state['stiltInput'][0].valid
                                    }
                                  ></FormInput>
                                </FormGroup>
                              </Col>
                            );
                          })
                        : null}

                      {/* Making floor area for upper floors disbaled */}
                      {false && this.state['floor_areas'].visible
                        ? floorInput.map((val, index) => {
                            return (
                              <Col key={'floorInput_' + index} xs='12' md='6'>
                                <FormGroup
                                  className={this.getLabelTextAlignment()}
                                >
                                  <label htmlFor='floorInput'>
                                    <strong>
                                      {index == 0
                                        ? getTranslatedText('label.groundFloor')
                                        : getTranslatedText(
                                            'label.floorInput'
                                          )}{' '}
                                      {index == 0 ? null : index}
                                    </strong>
                                  </label>

                                  <FormInput
                                    type='number'
                                    id='floorInput'
                                    name='floorInput'
                                    min={1}
                                    step={0.01}
                                    onChange={event => {
                                      this.validateAndSetInput(
                                        event,
                                        'floorInput',
                                        'float',
                                        undefined,
                                        undefined,
                                        index
                                      );
                                      this.calculateBuildUpAreaAndMortgage();
                                    }}
                                    value={
                                      this.state['floorInput'][index].value
                                        ? this.state['floorInput'][index].value
                                        : ''
                                    }
                                    valid={
                                      this.state['floorInput'][index].valid
                                    }
                                    invalid={
                                      !this.state['floorInput'][index].empty &&
                                      !this.state['floorInput'][index].valid
                                    }
                                  ></FormInput>
                                </FormGroup>
                              </Col>
                            );
                          })
                        : null}

                      {this.state['plot_status'].visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='#plot_status'>
                              <strong>
                                {getTranslatedText('label.plot_status')}
                              </strong>
                            </label>
                            <FormSelect
                              id='#plot_status'
                              name='plot_status'
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'plot_status',
                                  'select'
                                );
                                this.updatePlotStatusDependentFields(
                                  'plot_status',
                                  event.target.value
                                );
                                this.updateLrsLpNumberInputSelection(event.target.value);
                              }}
                              valid={this.state['plot_status'].valid}
                              invalid={
                                !this.state['plot_status'].empty &&
                                !this.state['plot_status'].valid
                              }
                              value={
                                this.state['plot_status'].value
                                  ? this.state['plot_status'].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='Approved'>Approved Layout</option>
                              <option value='Ab'>Approved Building</option>
                              <option value='Lrs'>LRS Approved</option>
                              <option value='Op'>Open plot/Piece of land registered prior to cut off date</option>
                              <option value='Gk'>Constructed prior to 1985/Gramakantam/ Abadi</option>
                              <option value='Lp'>LRS /approved plot subdivided ( To calculate sub divisional charges)</option>
                              <option value='Bps'>Building regularized under BPS</option>
                              <option value='Ot'>Others</option>
                              <option value='Unapproved'>Unapproved Layout</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      ) : null}

                      {/* {this.state['lrs_lp_input'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='#lrs_lp_input'>
                              <strong>
                                {getTranslatedText('label.lrs_lp_input')}
                              </strong>
                            </label>
                            <FormSelect
                              id='#lrs_lp_input'
                              name='lrs_lp_input'
                              onChange={async event => {
                                await this.validateAndSetInput(
                                  event,
                                  'lrs_lp_input',
                                  'select'
                                );
                                this.updateLrsLpNumberInputSelection(event);
                              }}
                              valid={this.state['lrs_lp_input'].valid}
                              invalid={
                                !this.state['lrs_lp_input'].empty &&
                                !this.state['lrs_lp_input'].valid
                              }
                              value={
                                this.state['lrs_lp_input'].value
                                  ? this.state['lrs_lp_input'].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='appproved'>Approved Building</option>
                              <option value='lrs'>LRS Approved</option>
                              <option value='op'>Open plot/Piece of land registered prior to cut off date</option>
                              <option value='gk'>Constructed prior to 1985/Gramakantam/ Abadi</option>
                              <option value='lp'>LRS /approved plot subdivided ( To calculate sub divisional charges)</option>
                              <option value='brs'>Building regularized under BPS</option>
                              <option value='ot'>Others</option>
                              <option value='Unapproved'>Unapproved Layout</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      )} */}

                      {this.state['ap_no'].visible && (
                        <Col xs='12' md='6'>
                                                <FormGroup className={this.getLabelTextAlignment()}>
                                                  <label htmlFor='ap_no'>
                                                    <strong>
                                                      {getTranslatedText('label.ap_number')}
                                                    </strong>{' '}
                                                  </label>

                                                  <FormInput
                                                    type='text'
                                                    id='ap_no'
                                                    name='ap_no'
                                                    onChange={event =>
                                                      this.validateAndSetInput(event, 'ap_no', 'text')
                                                    }
                                                    value={
                                                      this.state['ap_no'].value
                                                        ? this.state['ap_no'].value
                                                        : ''
                                                    }
                                                    name='ap_no'
                                                    valid={this.state['ap_no'].valid}
                                                    invalid={
                                                      !this.state['ap_no'].empty &&
                                                      !this.state['ap_no'].valid
                                                    }
                                                  ></FormInput>
                                                </FormGroup>
                                              </Col>
                      )}

                      {this.state['ab_no'].visible && (
                            <Col xs='12' md='6'>
                                              <FormGroup className={this.getLabelTextAlignment()}>
                                                <label htmlFor='ab_no'>
                                                  <strong>
                                                    {getTranslatedText('label.ab_number')}
                                                  </strong>{' '}
                                                </label>

                                                <FormInput
                                                  type='text'
                                                  id='ab_no'
                                                  name='ab_no'
                                                  onChange={event =>
                                                    this.validateAndSetInput(event, 'ab_no', 'text')
                                                  }
                                                  value={
                                                    this.state['ab_no'].value
                                                      ? this.state['ab_no'].value
                                                      : ''
                                                  }
                                                  name='ab_no'
                                                  valid={this.state['ab_no'].valid}
                                                  invalid={
                                                    !this.state['ab_no'].empty &&
                                                    !this.state['ab_no'].valid
                                                  }
                                                ></FormInput>
                                              </FormGroup>
                                            </Col>
                      )}

                      {this.state['lrs_no'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='lrs_no'>
                              <strong>
                                {getTranslatedText('label.lrs_number')}
                              </strong>{' '}
                            </label>

                            <FormInput
                              type='text'
                              id='lrs_no'
                              name='lrs_no'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'lrs_no',
                                  'text'
                                )
                              }
                              value={
                                this.state['lrs_no'].value
                                  ? this.state['lrs_no'].value
                                  : ''
                              }
                              name='lrs_no'
                              valid={this.state['lrs_no'].valid}
                              invalid={
                                !this.state['lrs_no'].empty &&
                                !this.state['lrs_no'].valid
                              }
                            ></FormInput>
                          </FormGroup>
                        </Col>
                      )}

                      {this.state['lp_no'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='lp_no'>
                              <strong>
                                {getTranslatedText('label.lp_number')}
                              </strong>{' '}
                            </label>

                            <FormInput
                              type='text'
                              id='lp_no'
                              name='lp_no'
                              onChange={event =>
                                this.validateAndSetInput(event, 'lp_no', 'text')
                              }
                              value={
                                this.state['lp_no'].value
                                  ? this.state['lp_no'].value
                                  : ''
                              }
                              name='lp_no'
                              valid={this.state['lp_no'].valid}
                              invalid={
                                !this.state['lp_no'].empty &&
                                !this.state['lp_no'].valid
                              }
                            ></FormInput>
                          </FormGroup>
                        </Col>
                      )}

                     {this.state['bps_no'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='bps_no'>
                              <strong>
                                {getTranslatedText('label.bps_number')}
                              </strong>{' '}
                            </label>

                            <FormInput
                              type='text'
                              id='bps_no'
                              name='bps_no'
                              onChange={event =>
                                this.validateAndSetInput(event, 'bps_no', 'text')
                              }
                              value={
                                this.state['bps_no'].value
                                  ? this.state['bps_no'].value
                                  : ''
                              }
                              name='bps_no'
                              valid={this.state['bps_no'].valid}
                              invalid={
                                !this.state['bps_no'].empty &&
                                !this.state['bps_no'].valid
                              }
                            ></FormInput>
                          </FormGroup>
                        </Col>
                      )}



                      {this.state['net_plot_area'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='net_plot_area'>
                              <strong>
                                {getTranslatedText('label.net_plot_area')}
                              </strong>
                            </label>

                            <FormInput
                              type='number'
                              id='net_plot_area'
                              name='net_plot_area'
                              min={1}
                              step={0.01}
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'net_plot_area',
                                  'float'
                                )
                              }
                              value={
                                this.state['net_plot_area'].value
                                  ? this.state['net_plot_area'].value
                                  : ''
                              }
                              name='net_plot_area'
                              valid={this.state['net_plot_area'].valid}
                              invalid={
                                !this.state['net_plot_area'].empty &&
                                !this.state['net_plot_area'].valid
                              }
                            ></FormInput>
                          </FormGroup>
                        </Col>
                      )}

                      {this.state['compound_length'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='compound_length'>
                              <strong>
                                {getTranslatedText('label.compound_length')}
                              </strong>
                            </label>

                            <FormInput
                              type='number'
                              min={1}
                              step={0.01}
                              id='compound_length'
                              name='compound_length'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'compound_length',
                                  'float'
                                )
                              }
                              value={
                                this.state['compound_length'].value
                                  ? this.state['compound_length'].value
                                  : ''
                              }
                              name='compound_length'
                              valid={this.state['compound_length'].valid}
                              invalid={
                                !this.state['compound_length'].empty &&
                                !this.state['compound_length'].valid
                              }
                            ></FormInput>
                          </FormGroup>
                        </Col>
                      )}

                      {this.state['sale_deed_registration_date'].visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='sale_deed_registration_date'>
                              <strong>
                                {getTranslatedText(
                                  'label.sale_deed_registration_date'
                                )}
                              </strong>
                            </label>

                            <FormInput
                              type='date'
                              id='sale_deed_registration_date'
                              name='sale_deed_registration_date'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'sale_deed_registration_date',
                                  'sale_deed_registration_date'
                                )
                              }
                              value={
                                this.state['sale_deed_registration_date'].value
                                  ? this.state['sale_deed_registration_date']
                                      .value
                                  : ''
                              }
                              name='sale_deed_registration_date'
                              valid={
                                this.state['sale_deed_registration_date'].valid
                              }
                              invalid={
                                !this.state['sale_deed_registration_date']
                                  .empty &&
                                !this.state['sale_deed_registration_date'].valid
                              }
                            ></FormInput>
                          </FormGroup>
                        </Col>
                      ) : null}

                      {this.state.building_usage.visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='building_usage'>
                              <strong className='mr-2'>
                                {getTranslatedText('label.building_usage')}
                              </strong>
                              <a
                                href='http://dtcp.telangana.gov.in/master-plans/'
                                target='_blank'
                              >
                                <MdInfoOutline
                                  data-toggle='tooltip'
                                  title='View master plans'
                                ></MdInfoOutline>
                              </a>
                            </label>
                            <FormSelect
                              id='building_usage'
                              name='building_usage'
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'building_usage',
                                  'select'
                                );
                              }}
                              value={
                                this.state.building_usage.value
                                  ? this.state.building_usage.value
                                  : ''
                              }
                              valid={this.state['building_usage'].valid}
                              invalid={
                                !this.state['building_usage'].empty &&
                                !this.state['building_usage'].valid
                              }
                            >
                              <option value=''>Select usage of building</option>
                              <option value='Schools'>Schools</option>
                              <option value='Function halls, Cinemas, multiplexes, malls with multiplexs, Religious Places'>
                                Function halls, Cinemas, multiplexes, malls with
                                multiplexs, Religious Places
                              </option>
                              <option value='Dormitories'>Dormitories</option>
                              <option value='Apartment Houses'>
                                Apartment Houses
                              </option>
                              <option value='Hotels (Upto 4 star category)'>
                                Hotels (Upto 4 star category)
                              </option>
                              <option value='Starred Hotels (5 starts and above)'>
                                Starred Hotels (5 starts and above)
                              </option>
                              <option value='Colleges (including junior colleges)/ all others/ Training Institutions'>
                                Colleges (including junior colleges)/ all
                                others/ Training Institutions
                              </option>
                              <option value='Hospitals and sanatoria'>
                                Hospitals and sanatoria
                              </option>
                              <option value='Custodial Institutions'>
                                Custodial Institutions
                              </option>
                              <option value='Penal and Mental Institutions'>
                                Penal and Mental Institutions
                              </option>
                              <option value='Offices, Banks, Professional Establishments, like offices of architects, engineers, doctors, lawyers, post offices and police stations'>
                                Offices, Banks, Professional Establishments,
                                like offices of architects, engineers, doctors,
                                lawyers, post offices and police stations
                              </option>
                              <option value='Laboratories, Outpatient clinics, research establishment, libraries, and test houses.'>
                                Laboratories, Outpatient clinics, research
                                establishment, libraries, and test houses.
                              </option>
                              <option value='Electronic data processing centres, Computer installations, information technology parks, and call centres.'>
                                Electronic data processing centres, Computer
                                installations, information technology parks, and
                                call centres.
                              </option>
                              <option value='Telephone exchanges'>
                                Telephone exchanges
                              </option>
                              <option value='Broadcasting stations, TV stations and Air Traffic control Towers.'>
                                Broadcasting stations, TV stations and Air
                                Traffic control Towers.
                              </option>
                              <option value='Shops, stores, departmental stores, market, for display and sale of merchandise either wholesale or retail (Any with covered area more than 500 m2)'>
                                Shops, stores, departmental stores, market, for
                                display and sale of merchandise either wholesale
                                or retail (Any with covered area more than 500
                                m2)
                              </option>
                              <option value='undergone shopping centers'>
                                undergone shopping centers
                              </option>
                              <option value='building used for low hazard industries'>
                                building used for low hazard industries
                              </option>
                              <option value='building used for moderate hazard industries'>
                                building used for moderate hazard industries
                              </option>
                              <option value='Multi-level car parking'>
                                Multi-level car parking
                              </option>
                              <option value='Usage not mentioned in list'>
                                Usage not mentioned in list
                              </option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      )}
                    </Row>
                   
                     {/* Slum area */}
                     <Row>
                      <Col xs='12' md='6'>
                        <FormGroup className={this.getLabelTextAlignment()}>
                          <label htmlFor='#is_under_slum_area'>
                            <strong>
                              {getTranslatedText('label.slum_area')}
                            </strong>
                          </label>
                          <FormSelect
                            id='#is_under_slum_area'
                            name='is_under_slum_area'
                            onChange={async event => {
                              await this.validateAndSetInput(
                                event,
                                'is_under_slum_area',
                                'select'
                              );
                              this.updateSlumAreaDropdown();
                            }}
                            valid={this.state['is_under_slum_area'].valid}
                            invalid={
                              !this.state['is_under_slum_area'].empty &&
                              !this.state['is_under_slum_area'].valid
                            }
                            value={
                              this.state['is_under_slum_area'].value
                                ? this.state['is_under_slum_area'].value
                                : ''
                            }
                          >
                            <option value=''>Select</option>
                            <option value='true'>Yes</option>
                            <option value='false'>No</option>
                          </FormSelect>
                        </FormGroup>
                      </Col>
                  
                  
                      {this.state.slum_name.visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='#slum_name'>
                              <strong>
                                {getTranslatedText('label.slum_name')}
                              </strong>
                            </label>
                            <FormSelect
                              id='slum_name'
                              name='slum_name'
                              onChange={async event => {
                                await this.validateAndSetInput(
                                  event,
                                  'slum_name',
                                  'select'
                                );
                                this.updateOtherSlumAreaVisibility();
                              }}
                              value={
                                this.state['slum_name'].value
                                  ? this.state['slum_name'].value
                                  : ''
                              }
                              valid={this.state['slum_name'].valid}
                              invalid={
                                !this.state['slum_name'].empty &&
                                !this.state['slum_name'].valid
                              }
                            >
                              <option value=''>Select</option>
                              <option value='Others'>Others</option>
                              {!isEmpty(slum_areas) &&
                                slum_areas.map((value, index) => {
                                  return (
                                    <option key={index} value={value.slum_name}>
                                      {value.slum_name}
                                    </option>
                                  );
                                })}
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      )}
                      {this.state.other_slum_name.visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='#other_slum_name'>
                              <strong>
                                {getTranslatedText('label.other_slum_name')}
                              </strong>
                            </label>
                            <FormInput
                              id='other_slum_name'
                              name='other_slum_name'
                              onChange={async event => {
                                await this.validateAndSetInput(
                                  event,
                                  'other_slum_name',
                                  'text'
                                );
                                this.updateSlumAreaDropdown();
                              }}
                              value={
                                this.state['other_slum_name'].value
                                  ? this.state['other_slum_name'].value
                                  : ''
                              }
                              valid={this.state['other_slum_name'].valid}
                              invalid={
                                !this.state['other_slum_name'].empty &&
                                !this.state['other_slum_name'].valid
                              }
                            ></FormInput>
                          </FormGroup>
                        </Col>
                      )}
                    </Row>
                  

                    <Row>
                      {this.state.land_type.visible && (
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
                      )}
                      {this.state.construction_status.visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='construction_status'>
                              <strong>
                                {getTranslatedText('label.construction_status')}
                              </strong>
                            </label>
                            <FormSelect
                              id='construction_status'
                              name='construction_status'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'construction_status',
                                  'select'
                                )
                              }
                              value={
                                this.state.construction_status.value
                                  ? this.state.construction_status.value
                                  : ''
                              }
                              valid={this.state['construction_status'].valid}
                              invalid={
                                !this.state['construction_status'].empty &&
                                !this.state['construction_status'].valid
                              }
                            >
                              <option value=''>Select</option>
                              <option value='NEW_STRUCTURE'>
                                New structure
                              </option>
                              <option value='EXISTING_STRUCTURE'>
                                Existing structure
                              </option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      )}
                    </Row>

                    {/* Road Details (Front, Rear, Side 1 and Side 2) */}
                    {this.state['front_existing_road_width'].visible ? (
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{ color: '#1d9a5b', marginTop: 5 }}
                            className={this.getLabelTextAlignment()}
                          >
                            {getTranslatedText('heading.road_details')}{' '}
                          </h4>
                        </Col>
                      </Row>
                    ) : null}
                    {/* Front Road Details */}
                    <Row>
                      {/* {this.state['is_front_road_affected'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='#is_front_road_affected'>
                              <strong>
                                {getTranslatedText(
                                  'label.is_front_road_affected'
                                )}
                              </strong>
                            </label>
                            <FormSelect
                              id='#is_front_road_affected'
                              name='is_front_road_affected'
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'is_front_road_affected',
                                  'select'
                                );
                                this.updateRoadDetailsVisibility(
                                  'is_front_road_affected',
                                  event.target.value
                                );
                              }}
                              valid={this.state['is_front_road_affected'].valid}
                              invalid={
                                !this.state['is_front_road_affected'].empty &&
                                !this.state['is_front_road_affected'].valid
                              }
                              value={
                                this.state['is_front_road_affected'].value
                                  ? this.state['is_front_road_affected'].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='yes'>Yes</option>
                              <option value='no'>No</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      )} */}
                      {this.state['front_existing_road_width'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='front_existing_road_width'>
                              <strong>
                                {getTranslatedText(
                                  'label.front_existing_road_width'
                                )}
                              </strong>
                            </label>
                            <FormInput
                              type='number'
                              id='#front_existing_road_width'
                              placeholder='Enter current front road width (feet)'
                              name='front_existing_road_width'
                              min={1}
                              step={0.01}
                              onChange={async event => {
                                await this.validateAndSetInput(
                                  event,
                                  'front_existing_road_width',
                                  'float',
                                  null
                                );
                                this.updateRoadAffectedArea('front');
                              }}
                              value={
                                this.state['front_existing_road_width'].value
                                  ? this.state['front_existing_road_width']
                                      .value
                                  : ''
                              }
                              valid={
                                this.state['front_existing_road_width'].valid
                              }
                              invalid={
                                !this.state['front_existing_road_width']
                                  .empty &&
                                !this.state['front_existing_road_width'].valid
                              }
                            />
                          </FormGroup>
                        </Col>
                      )}
                    </Row>
                    {this.state['is_front_road_affected'].value === 'true' && (
                      <Row>
                        {this.state.front_proposed_road_width.visible && (
                          <Col xs='12' md='6'>
                            <FormGroup className={this.getLabelTextAlignment()}>
                              <label htmlFor='front_proposed_road_width'>
                                <strong>
                                  {getTranslatedText(
                                    'label.front_proposed_road_width'
                                  )}
                                </strong>
                              </label>
                              <FormInput
                                type='number'
                                id='#front_proposed_road_width'
                                placeholder='Enter Proposed road width (feet)'
                                name='front_proposed_road_width'
                                min={30}
                                step={0.01}
                                onChange={async event => {
                                  await this.validateAndSetInput(
                                    event,
                                    'front_proposed_road_width',
                                    'float',
                                    null,
                                    [30, 300]
                                  );
                                  this.updateRoadAffectedArea('front');
                                }}
                                value={
                                  this.state['front_proposed_road_width'].value
                                    ? this.state['front_proposed_road_width']
                                        .value
                                    : ''
                                }
                                valid={
                                  this.state['front_proposed_road_width'].valid
                                }
                                invalid={
                                  !this.state['front_proposed_road_width']
                                    .empty &&
                                  !this.state['front_proposed_road_width'].valid
                                }
                              />
                              <FormFeedback type='invalid'>
                                Value must be between 30 and 300
                              </FormFeedback>
                            </FormGroup>
                          </Col>
                        )}

                        {this.state.front_road_affected_area.visible && (
                          <Col xs='12' md='6'>
                            <FormGroup className={this.getLabelTextAlignment()}>
                              <label htmlFor='front_road_affected_area'>
                                <strong>
                                  {getTranslatedText(
                                    'label.front_road_affected_area'
                                  )}
                                </strong>
                              </label>
                              <FormInput
                                type='number'
                                id='#front_road_affected_area'
                                placeholder='Front road affected area (feet)'
                                name='front_road_affected_area'
                                disabled={true}
                                value={
                                  this.state['front_road_affected_area']
                                    .value >= 0
                                    ? this.state['front_road_affected_area']
                                        .value
                                    : ''
                                }
                              />
                            </FormGroup>
                          </Col>
                        )}
                      </Row>
                    )}

                    {/* Side 1 road details */}
                    <Row>
                      {this.state['is_side1_road_affected'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='#is_side1_road_affected'>
                              <strong>
                                {getTranslatedText(
                                  'label.is_side1_road_affected'
                                )}
                              </strong>
                            </label>
                            <FormSelect
                              id='#is_side1_road_affected'
                              name='is_side1_road_affected'
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'is_side1_road_affected',
                                  'select'
                                );
                                this.updateRoadDetailsVisibility(
                                  'is_side1_road_affected',
                                  event.target.value
                                );
                              }}
                              valid={this.state['is_side1_road_affected'].valid}
                              invalid={
                                !this.state['is_side1_road_affected'].empty &&
                                !this.state['is_side1_road_affected'].valid
                              }
                              value={
                                this.state['is_side1_road_affected'].value
                                  ? this.state['is_side1_road_affected'].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='true'>Yes</option>
                              <option value='false'>No</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      )}
                      {this.state['side1_existing_road_width'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='side1_existing_road_width'>
                              <strong>
                                {getTranslatedText(
                                  'label.side1_existing_road_width'
                                )}
                              </strong>
                            </label>
                            <FormInput
                              type='number'
                              id='#side1_existing_road_width'
                              placeholder='Enter current front road width (feet)'
                              name='side1_existing_road_width'
                              min={1}
                              step={0.01}
                              onChange={async event => {
                                await this.validateAndSetInput(
                                  event,
                                  'side1_existing_road_width',
                                  'float',
                                  null
                                );
                                this.updateRoadAffectedArea('side1');
                              }}
                              value={
                                this.state['side1_existing_road_width'].value
                                  ? this.state['side1_existing_road_width']
                                      .value
                                  : ''
                              }
                              valid={
                                this.state['side1_existing_road_width'].valid
                              }
                              invalid={
                                !this.state['side1_existing_road_width']
                                  .empty &&
                                !this.state['side1_existing_road_width'].valid
                              }
                            />
                          </FormGroup>
                        </Col>
                      )}
                      {}
                    </Row>
                    {this.state['is_side1_road_affected'].value === 'true' && (
                      <Row>
                        {this.state.side1_proposed_road_width.visible && (
                          <Col xs='12' md='6'>
                            <FormGroup className={this.getLabelTextAlignment()}>
                              <label htmlFor='side1_proposed_road_width'>
                                <strong>
                                  {getTranslatedText(
                                    'label.side1_proposed_road_width'
                                  )}
                                </strong>
                              </label>
                              <FormInput
                                type='number'
                                id='#side1_proposed_road_width'
                                placeholder='Enter Proposed road width (feet)'
                                name='side1_proposed_road_width'
                                min={30}
                                step={0.01}
                                onChange={async event => {
                                  await this.validateAndSetInput(
                                    event,
                                    'side1_proposed_road_width',
                                    'float',
                                    null,
                                    [30, 100]
                                  );
                                  this.updateRoadAffectedArea('side1');
                                }}
                                value={
                                  this.state['side1_proposed_road_width'].value
                                    ? this.state['side1_proposed_road_width']
                                        .value
                                    : ''
                                }
                                valid={
                                  this.state['side1_proposed_road_width'].valid
                                }
                                invalid={
                                  !this.state['side1_proposed_road_width']
                                    .empty &&
                                  !this.state['side1_proposed_road_width'].valid
                                }
                              />
                              <FormFeedback type='invalid'>
                                Value must be between 30 and 100
                              </FormFeedback>
                            </FormGroup>
                          </Col>
                        )}

                        {this.state.side1_road_affected_area.visible && (
                          <Col xs='12' md='6'>
                            <FormGroup className={this.getLabelTextAlignment()}>
                              <label htmlFor='side1_road_affected_area'>
                                <strong>
                                  {getTranslatedText(
                                    'label.side1_road_affected_area'
                                  )}
                                </strong>
                              </label>
                              <FormInput
                                type='number'
                                id='#side1_road_affected_area'
                                placeholder='Front road affected area (feet)'
                                name='side1_road_affected_area'
                                disabled={true}
                                value={
                                  this.state['side1_road_affected_area']
                                    .value >= 0
                                    ? this.state['side1_road_affected_area']
                                        .value
                                    : ''
                                }
                              />
                            </FormGroup>
                          </Col>
                        )}
                      </Row>
                    )}

                    {/* Side 2 Road details */}
                    <Row>
                      {this.state['is_side2_road_affected'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='#is_side2_road_affected'>
                              <strong>
                                {getTranslatedText(
                                  'label.is_side2_road_affected'
                                )}
                              </strong>
                            </label>
                            <FormSelect
                              id='#is_side2_road_affected'
                              name='is_side2_road_affected'
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'is_side2_road_affected',
                                  'select'
                                );
                                this.updateRoadDetailsVisibility(
                                  'is_side2_road_affected',
                                  event.target.value
                                );
                              }}
                              valid={this.state['is_side2_road_affected'].valid}
                              invalid={
                                !this.state['is_side2_road_affected'].empty &&
                                !this.state['is_side2_road_affected'].valid
                              }
                              value={
                                this.state['is_side2_road_affected'].value
                                  ? this.state['is_side2_road_affected'].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='true'>Yes</option>
                              <option value='false'>No</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      )}
                      {this.state['side2_existing_road_width'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='side2_existing_road_width'>
                              <strong>
                                {getTranslatedText(
                                  'label.side2_existing_road_width'
                                )}
                              </strong>
                            </label>
                            <FormInput
                              type='number'
                              id='#side2_existing_road_width'
                              placeholder='Enter current front road width (feet)'
                              name='side2_existing_road_width'
                              min={1}
                              step={0.01}
                              onChange={async event => {
                                await this.validateAndSetInput(
                                  event,
                                  'side2_existing_road_width',
                                  'float',
                                  null
                                );
                                this.updateRoadAffectedArea('side2');
                              }}
                              value={
                                this.state['side2_existing_road_width'].value
                                  ? this.state['side2_existing_road_width']
                                      .value
                                  : ''
                              }
                              valid={
                                this.state['side2_existing_road_width'].valid
                              }
                              invalid={
                                !this.state['side2_existing_road_width']
                                  .empty &&
                                !this.state['side2_existing_road_width'].valid
                              }
                            />
                          </FormGroup>
                        </Col>
                      )}
                    </Row>
                    {this.state['is_side2_road_affected'].value === 'true' && (
                      <Row>
                        {this.state.side2_proposed_road_width.visible && (
                          <Col xs='12' md='6'>
                            <FormGroup className={this.getLabelTextAlignment()}>
                              <label htmlFor='side2_proposed_road_width'>
                                <strong>
                                  {getTranslatedText(
                                    'label.side2_proposed_road_width'
                                  )}
                                </strong>
                              </label>
                              <FormInput
                                type='number'
                                id='#side2_proposed_road_width'
                                placeholder='Enter Proposed road width (feet)'
                                name='side2_proposed_road_width'
                                min={30}
                                step={0.01}
                                onChange={async event => {
                                  await this.validateAndSetInput(
                                    event,
                                    'side2_proposed_road_width',
                                    'float',
                                    null,
                                    [30, 100]
                                  );
                                  this.updateRoadAffectedArea('side2');
                                }}
                                value={
                                  this.state['side2_proposed_road_width'].value
                                    ? this.state['side2_proposed_road_width']
                                        .value
                                    : ''
                                }
                                valid={
                                  this.state['side2_proposed_road_width'].valid
                                }
                                invalid={
                                  !this.state['side2_proposed_road_width']
                                    .empty &&
                                  !this.state['side2_proposed_road_width'].valid
                                }
                              />
                              <FormFeedback type='invalid'>
                                Value must be between 30 and 100
                              </FormFeedback>
                            </FormGroup>
                          </Col>
                        )}

                        {this.state.side2_road_affected_area.visible && (
                          <Col xs='12' md='6'>
                            <FormGroup className={this.getLabelTextAlignment()}>
                              <label htmlFor='side2_road_affected_area'>
                                <strong>
                                  {getTranslatedText(
                                    'label.side2_road_affected_area'
                                  )}
                                </strong>
                              </label>
                              <FormInput
                                type='number'
                                id='#side2_road_affected_area'
                                placeholder='Front road affected area (feet)'
                                name='side2_road_affected_area'
                                disabled={true}
                                value={
                                  this.state['side2_road_affected_area']
                                    .value >= 0
                                    ? this.state['side2_road_affected_area']
                                        .value
                                    : ''
                                }
                              />
                            </FormGroup>
                          </Col>
                        )}
                      </Row>
                    )}

                    {/* Rear road Details */}
                    <Row>
                      {this.state['is_rear_road_affected'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='#is_rear_road_affected'>
                              <strong>
                                {getTranslatedText(
                                  'label.is_rear_road_affected'
                                )}
                              </strong>
                            </label>
                            <FormSelect
                              id='#is_rear_road_affected'
                              name='is_rear_road_affected'
                              onChange={event => {
                                this.validateAndSetInput(
                                  event,
                                  'is_rear_road_affected',
                                  'select'
                                );
                                this.updateRoadDetailsVisibility(
                                  'is_rear_road_affected',
                                  event.target.value
                                );
                              }}
                              valid={this.state['is_rear_road_affected'].valid}
                              invalid={
                                !this.state['is_rear_road_affected'].empty &&
                                !this.state['is_rear_road_affected'].valid
                              }
                              value={
                                this.state['is_rear_road_affected'].value
                                  ? this.state['is_rear_road_affected'].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='true'>Yes</option>
                              <option value='false'>No</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      )}
                      {this.state['rear_existing_road_width'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='rear_existing_road_width'>
                              <strong>
                                {getTranslatedText(
                                  'label.rear_existing_road_width'
                                )}
                              </strong>
                            </label>
                            <FormInput
                              type='number'
                              id='#rear_existing_road_width'
                              placeholder='Enter current rear road width (feet)'
                              name='rear_existing_road_width'
                              min={1}
                              step={0.01}
                              onChange={async event => {
                                await this.validateAndSetInput(
                                  event,
                                  'rear_existing_road_width',
                                  'float',
                                  null
                                );
                                this.updateRoadAffectedArea('rear');
                              }}
                              value={
                                this.state['rear_existing_road_width'].value
                                  ? this.state['rear_existing_road_width'].value
                                  : ''
                              }
                              valid={
                                this.state['rear_existing_road_width'].valid
                              }
                              invalid={
                                !this.state['rear_existing_road_width'].empty &&
                                !this.state['rear_existing_road_width'].valid
                              }
                            />
                          </FormGroup>
                        </Col>
                      )}
                    </Row>
                    {this.state['is_rear_road_affected'].value === 'true' && (
                      <Row>
                        {this.state.rear_proposed_road_width.visible && (
                          <Col xs='12' md='6'>
                            <FormGroup className={this.getLabelTextAlignment()}>
                              <label htmlFor='rear_proposed_road_width'>
                                <strong>
                                  {getTranslatedText(
                                    'label.rear_proposed_road_width'
                                  )}
                                </strong>
                              </label>
                              <FormInput
                                type='number'
                                id='#rear_proposed_road_width'
                                placeholder='Enter Proposed road width (feet)'
                                name='rear_proposed_road_width'
                                min={30}
                                step={0.01}
                                onChange={async event => {
                                  await this.validateAndSetInput(
                                    event,
                                    'rear_proposed_road_width',
                                    'float',
                                    null,
                                    [30, 100]
                                  );
                                  this.updateRoadAffectedArea('rear');
                                }}
                                value={
                                  this.state['rear_proposed_road_width'].value
                                    ? this.state['rear_proposed_road_width']
                                        .value
                                    : ''
                                }
                                valid={
                                  this.state['rear_proposed_road_width'].valid
                                }
                                invalid={
                                  !this.state['rear_proposed_road_width']
                                    .empty &&
                                  !this.state['rear_proposed_road_width'].valid
                                }
                              />
                              <FormFeedback type='invalid'>
                                Value must be between 30 and 100
                              </FormFeedback>
                            </FormGroup>
                          </Col>
                        )}

                        {this.state.rear_road_affected_area.visible && (
                          <Col xs='12' md='6'>
                            <FormGroup className={this.getLabelTextAlignment()}>
                              <label htmlFor='rear_road_affected_area'>
                                <strong>
                                  {getTranslatedText(
                                    'label.rear_road_affected_area'
                                  )}
                                </strong>
                              </label>
                              <FormInput
                                type='number'
                                id='#rear_road_affected_area'
                                placeholder='Rear road affected area (feet)'
                                name='rear_road_affected_area'
                                disabled={true}
                                value={
                                  this.state['rear_road_affected_area'].value >=
                                  0
                                    ? this.state['rear_road_affected_area']
                                        .value
                                    : ''
                                }
                              />
                            </FormGroup>
                          </Col>
                        )}
                      </Row>
                    )}

                    {/* Set back inputs */}
                    {this.state['front_setback'].visible && (
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{ color: '#1d9a5b' }}
                            className={[
                              this.getLabelTextAlignment(),
                              'mt-1 mb-0'
                            ].join(' ')}
                          >
                            {getTranslatedText('heading.setback_details')}
                          </h4>
                        </Col>
                        <Col xs='12' className='mt-0 mb-2'>
                          <span style={{ fontSize: 14, color: 'black' }}>
                            <span style={{ color: 'red' }}>*</span> I will leave
                            the required set backs as applicable to my plot
                            during my construction, as prescribed in the
                            application section.
                          </span>
                        </Col>
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='front_setback'>
                              <strong>
                                {getTranslatedText('label.front_setback')}
                              </strong>
                            </label>
                            <FormInput
                              type='number'
                              id='#front_setback'
                              placeholder='Setback front'
                              name='front_setback'
                              disabled={true}
                              value={
                                this.state['front_setback'].value
                                  ? this.state['front_setback'].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='other_setback'>
                              <strong>
                                {getTranslatedText('label.other_setback')}
                              </strong>
                            </label>
                            <FormInput
                              type='number'
                              id='#other_setback'
                              placeholder='Setback sides'
                              name='other_setback'
                              disabled={true}
                              value={
                                this.state['other_setback'].value >= 0
                                  ? this.state['other_setback'].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    )}

                    {/* Market Value and slum area*/}
                    <Row>
                      {this.state['market_value'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='market_value'>
                              <strong>
                                {getTranslatedText('label.market_value')}
                              </strong>
                            </label>

                            <FormInput
                              type='number'
                              min={1}
                              step={0.01}
                              id='market_value'
                              name='market_value'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'market_value',
                                  'float'
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
                              disabled={this.state['market_value'].disabled}
                            ></FormInput>
                          </FormGroup>
                        </Col>
                      )}
                    </Row>
                 
                  
                    {/* Mortgage Details */}
                    {this.state['mortgage_area'].visible ? (
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{ color: '#1d9a5b', marginTop: 5 }}
                            className={this.getLabelTextAlignment()}
                          >
                            {getTranslatedText('heading.mortgage_details')}{' '}
                          </h4>
                        </Col>
                      </Row>
                    ) : null}
                    <Row>
                      {this.state['mortgage_area'].visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='mortgage_area'>
                              <strong>
                                {getTranslatedText('label.mortgage_area')}
                              </strong>
                            </label>

                            <FormInput
                              type='number'
                              id='mortgage_area'
                              name='mortgage_area'
                              disabled={this.state['mortgage_area'].disabled}
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'mortgage_area',
                                  'float'
                                )
                              }
                              value={
                                this.state['mortgage_area'].value
                                  ? this.state['mortgage_area'].value
                                  : ''
                              }
                              name='mortgage_area'
                              valid={this.state['mortgage_area'].valid}
                              invalid={
                                !this.state['mortgage_area'].empty &&
                                !this.state['mortgage_area'].valid
                              }
                            ></FormInput>
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.state['mortgage_floor'].visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='mortgage_floor'>
                              <strong>
                                {getTranslatedText('label.mortgage_floor')}
                              </strong>
                            </label>
                            <Select
                            id='mortgage_floor'
                            name='mortgage_floor'
                            onChange={this.validateMortgageFloor}
                            options={this.getMortgageFloorOptions()}
                            value={
                              this.state['mortgage_floor'].value
                                ? JSON.parse(this.state['mortgage_floor'].value)
                                : ''
                            } 
                            valid={this.state['mortgage_floor'].valid}
                            invalid={
                              !this.state['mortgage_floor'].empty &&
                              !this.state['mortgage_floor'].valid
                            }
                            isMulti
                            >
                            </Select>


                            {/* <FormSelect
                              id='mortgage_floor'
                              name='mortgage_floor'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'mortgage_floor',
                                  'select'
                                )
                              }
                              value={
                                this.state['mortgage_floor'].value
                                  ? this.state['mortgage_floor'].value
                                  : ''
                              }
                              valid={this.state['mortgage_floor'].valid}
                              invalid={
                                !this.state['mortgage_floor'].empty &&
                                !this.state['mortgage_floor'].valid
                              }
                            >
                              <option value=''>Select</option>

                              {!isEmpty(floorObj) &&
                                Object.keys(FLOOR_ORDER)
                                  .slice(0, floorObj.split.floors)
                                  .map((value, index) => {
                                    return (
                                      <option key={index} value={value}>
                                        {FLOOR_ORDER[value]}
                                      </option>
                                    );
                                  })}
                               <option value="STILT">Stilt</option>   
                            </FormSelect> */}
                          </FormGroup>
                        </Col>
                      ) : null}

                      {/* {this.state['mortgage_document_number'].visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='mortgage_document_number'>
                              <strong>
                                {getTranslatedText(
                                  'label.mortgage_document_number'
                                )}
                              </strong>
                            </label>

                            <FormInput
                              type='text'
                              id='mortgage_document_number'
                              name='mortgage_document_number'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'mortgage_document_number',
                                  'text'
                                )
                              }
                              value={
                                this.state['mortgage_document_number'].value
                                  ? this.state['mortgage_document_number'].value
                                  : ''
                              }
                              name='mortgage_document_number'
                              valid={
                                this.state['mortgage_document_number'].valid
                              }
                              invalid={
                                !this.state['mortgage_document_number'].empty &&
                                !this.state['mortgage_document_number'].valid
                              }
                            ></FormInput>
                          </FormGroup>
                        </Col>
                      ) : null}

                      {this.state['mortgage_date'].visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='mortgage_date'>
                              <strong>
                                {getTranslatedText('label.mortgage_date')}
                              </strong>
                            </label>

                            <FormInput
                              type='date'
                              max='9999-12-31'
                              id='mortgage_date'
                              name='mortgage_date'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'mortgage_date',
                                  'mortgage_date'
                                )
                              }
                              value={
                                this.state['mortgage_date'].value
                                  ? this.state['mortgage_date'].value
                                  : ''
                              }
                              valid={this.state['mortgage_date'].valid}
                              invalid={
                                !this.state['mortgage_date'].empty &&
                                !this.state['mortgage_date'].valid
                              }
                            ></FormInput>
                            <FormFeedback type='invalid'>
                              {getTranslatedText('error.mortgage_date_message')}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                      ) : null} */}

                      {this.state['sro_location'].visible && (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='sro_location'>
                              <strong>
                                {getTranslatedText('label.sro_location')}
                              </strong>
                            </label>
                            <FormSelect
                              id='sro_location'
                              name='sro_location'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'sro_location',
                                  'select'
                                )
                              }
                              value={
                                this.state['sro_location'].value
                                  ? this.state['sro_location'].value
                                  : ''
                              }
                              valid={this.state['sro_location'].valid}
                              invalid={
                                !this.state['sro_location'].empty &&
                                !this.state['sro_location'].valid
                              }
                            >
                              <option value=''>Select</option>

                              {!isEmpty(sro_list) &&
                                sro_list.map((value, index) => {
                                  return (
                                    <option key={index} value={value.sro_name}>
                                      {value.sro_name}
                                    </option>
                                  );
                                })}
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      )}
                    </Row>
                    {this.state.architect_name.visible ? (
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{ color: '#1d9a5b', marginTop: 5 }}
                            className={this.getLabelTextAlignment()}
                          >
                            {getTranslatedText('heading.architect_details')}{' '}
                          </h4>
                        </Col>
                      </Row>
                    ) : null}

                    <Row>
                      {this.state['architect_name'].visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='architect_name'>
                              <strong>
                                {getTranslatedText('label.architect_name')}
                              </strong>
                            </label>
                            <FormInput
                              id='#architect_name'
                              name='architect_name'
                              placeholder='Enter architect name'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'architect_name',
                                  'text'
                                )
                              }
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
                      ) : null}
                      {this.state['architect_license_number'].visible ? (
                        <Col xs='12' md='6'>
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
                              placeholder='Enter architect license number'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'architect_license_number',
                                  'text'
                                )
                              }
                              value={
                                this.state['architect_license_number'].value
                                  ? this.state['architect_license_number'].value
                                  : ''
                              }
                              valid={
                                this.state['architect_license_number'].valid
                              }
                              invalid={
                                !this.state['architect_license_number'].empty &&
                                !this.state['architect_license_number'].valid
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.state['architect_mobile_number'].visible ? (
                        <Col xs='12' md='6'>
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
                                type='number'
                                placeholder='Enter Architect Mobile Number'
                                onChange={event =>
                                  this.validateAndSetInput(
                                    event,
                                    'architect_mobile_number',
                                    'number',
                                    10
                                  )
                                }
                                value={
                                  this.state['architect_mobile_number'].value
                                    ? this.state['architect_mobile_number']
                                        .value
                                    : ''
                                }
                                name='architect_mobile_number'
                                valid={
                                  this.state['architect_mobile_number'].valid
                                }
                                invalid={
                                  !this.state['architect_mobile_number']
                                    .empty &&
                                  !this.state['architect_mobile_number'].valid
                                }
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.state['architect_email_id'].visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='architect_email_id'>
                              <strong>
                                {getTranslatedText('label.architect_email_id')}
                              </strong>{' '}
                              ({getTranslatedText('label.optional')})
                            </label>
                            <FormInput
                              type='email'
                              id='#architect_email_id'
                              placeholder='Enter Architect email'
                              name='email'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'architect_email_id',
                                  'email'
                                )
                              }
                              valid={this.state['architect_email_id'].valid}
                              invalid={
                                !this.state['architect_email_id'].empty &&
                                !this.state['architect_email_id'].valid
                              }
                              value={
                                this.state['architect_email_id'].value
                                  ? this.state['architect_email_id'].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>

                    {/* Structural Engineer */}
                    {this.state.structural_engineer_name.visible ? (
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{ color: '#1d9a5b', marginTop: 5 }}
                            className={this.getLabelTextAlignment()}
                          >
                            {getTranslatedText(
                              'heading.structural_engineer_details'
                            )}{' '}
                          </h4>
                        </Col>
                      </Row>
                    ) : null}
                    <Row>
                      {this.state['structural_engineer_name'].visible ? (
                        <Col xs='12' md='6'>
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
                              placeholder='Enter Structural engineer name'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'structural_engineer_name',
                                  'text'
                                )
                              }
                              value={
                                this.state['structural_engineer_name'].value
                                  ? this.state['structural_engineer_name'].value
                                  : ''
                              }
                              valid={
                                this.state['structural_engineer_name'].valid
                              }
                              invalid={
                                !this.state['structural_engineer_name'].empty &&
                                !this.state['structural_engineer_name'].valid
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.state['structural_engineer_license_number']
                        .visible ? (
                        <Col xs='12' md='6'>
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
                              placeholder='Structural engineer License'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'structural_engineer_license_number',
                                  'text'
                                )
                              }
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
                                !this.state[
                                  'structural_engineer_license_number'
                                ].empty &&
                                !this.state[
                                  'structural_engineer_license_number'
                                ].valid
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.state['structural_engineer_mobile_number']
                        .visible ? (
                        <Col xs='12' md='6'>
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
                                type='number'
                                placeholder='Enter Structural Engg Mobile Number'
                                onChange={event =>
                                  this.validateAndSetInput(
                                    event,
                                    'structural_engineer_mobile_number',
                                    'number',
                                    10
                                  )
                                }
                                value={
                                  this.state[
                                    'structural_engineer_mobile_number'
                                  ].value
                                    ? this.state[
                                        'structural_engineer_mobile_number'
                                      ].value
                                    : ''
                                }
                                name='structural_engineer_mobile_number'
                                valid={
                                  this.state[
                                    'structural_engineer_mobile_number'
                                  ].valid
                                }
                                invalid={
                                  !this.state[
                                    'structural_engineer_mobile_number'
                                  ].empty &&
                                  !this.state[
                                    'structural_engineer_mobile_number'
                                  ].valid
                                }
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.state['structural_engineer_email_id'].visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='structural_engineer_email_id'>
                              <strong>
                                {getTranslatedText(
                                  'label.structural_engineer_email_id'
                                )}
                              </strong>{' '}
                              ({getTranslatedText('label.optional')})
                            </label>
                            <FormInput
                              type='email'
                              id='#structural_engineer_email_id'
                              placeholder='Enter Structural Engg email'
                              name='email'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'structural_engineer_email_id',
                                  'email'
                                )
                              }
                              valid={
                                this.state['structural_engineer_email_id'].valid
                              }
                              invalid={
                                !this.state['structural_engineer_email_id']
                                  .empty &&
                                !this.state['structural_engineer_email_id']
                                  .valid
                              }
                              value={
                                this.state['structural_engineer_email_id'].value
                                  ? this.state['structural_engineer_email_id']
                                      .value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>

                    {/* Builder */}
                    {this.state.builder_name.visible ? (
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{ color: '#1d9a5b', marginTop: 5 }}
                            className={this.getLabelTextAlignment()}
                          >
                            {getTranslatedText('heading.builder_details')}{' '}
                          </h4>
                        </Col>
                      </Row>
                    ) : null}
                    <Row>
                      {this.state['builder_name'].visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='builder_name'>
                              <strong>
                                {getTranslatedText('label.builder_name')}
                              </strong>
                            </label>
                            <FormInput
                              id='#builder_name'
                              name='builder_name'
                              placeholder='Enter Builder name'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'builder_name',
                                  'text'
                                )
                              }
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
                      ) : null}
                      {this.state['builder_license_number'].visible ? (
                        <Col xs='12' md='6'>
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
                              placeholder='Enter builder license number'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'builder_license_number',
                                  'text'
                                )
                              }
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
                      ) : null}
                      {this.state['builder_mobile_number'].visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='builder_mobile_number'>
                              <strong>
                                {getTranslatedText(
                                  'label.builder_mobile_number'
                                )}
                              </strong>
                            </label>
                            <InputGroup className='mb-2'>
                              <InputGroupAddon type='prepend'>
                                <InputGroupText>+91</InputGroupText>
                              </InputGroupAddon>
                              <FormInput
                                id='#builder_mobile_number'
                                type='number'
                                placeholder='Enter builder mobile number'
                                onChange={event =>
                                  this.validateAndSetInput(
                                    event,
                                    'builder_mobile_number',
                                    'number',
                                    10
                                  )
                                }
                                value={
                                  this.state['builder_mobile_number'].value
                                    ? this.state['builder_mobile_number'].value
                                    : ''
                                }
                                name='builder_mobile_number'
                                valid={
                                  this.state['builder_mobile_number'].valid
                                }
                                invalid={
                                  !this.state['builder_mobile_number'].empty &&
                                  !this.state['builder_mobile_number'].valid
                                }
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.state['builder_email_id'].visible ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='builder_email_id'>
                              <strong>
                                {getTranslatedText('label.builder_email_id')}
                              </strong>{' '}
                              ({getTranslatedText('label.optional')})
                            </label>
                            <FormInput
                              type='email'
                              id='#builder_email_id'
                              placeholder='Enter builder email'
                              name='email'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'builder_email_id',
                                  'email'
                                )
                              }
                              valid={this.state['builder_email_id'].valid}
                              invalid={
                                !this.state['builder_email_id'].empty &&
                                !this.state['builder_email_id'].valid
                              }
                              value={
                                this.state['builder_email_id'].value
                                  ? this.state['builder_email_id'].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    {/*{fire fields start here}*/}
                    {this.areFireDepartmentFieldsVisible() ? (
                      <Row>
                        <Col xs='12'>
                          <h4
                            style={{ color: '#1d9a5b', marginTop: 5 }}
                            className={this.getLabelTextAlignment()}
                          >
                            <strong>
                              {getTranslatedText(
                                'heading.fire_department_details'
                              )}
                            </strong>
                          </h4>
                        </Col>
                      </Row>
                    ) : null}
                    <Row>
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='father_name'>
                              <strong>
                                {getTranslatedText('label.father_name')}
                              </strong>
                            </label>
                            <FormInput
                              id='#father_name'
                              placeholder="Enter father's name"
                              name='email'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'text',
                                  null,
                                  null,
                                  'father_name'
                                )
                              }
                              valid={
                                this.state.fire_department_fields['father_name']
                                  .valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'father_name'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'father_name'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields['father_name']
                                  .value
                                  ? this.state.fire_department_fields[
                                      'father_name'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='age'>
                              <strong>{getTranslatedText('label.age')}</strong>
                            </label>
                            <FormInput
                              id='#age'
                              placeholder='Enter Age'
                              name='age'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'age'
                                )
                              }
                              valid={
                                this.state.fire_department_fields['age'].valid
                              }
                              invalid={
                                !this.state.fire_department_fields['age']
                                  .empty &&
                                !this.state.fire_department_fields['age'].valid
                              }
                              value={
                                this.state.fire_department_fields['age'].value
                                  ? this.state.fire_department_fields['age']
                                      .value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='owner_pincode'>
                              <strong>
                                {getTranslatedText('label.owner_pincode')}
                              </strong>
                            </label>
                            <FormInput
                              id='#owner_pincode'
                              placeholder="Enter Owner's Pincode"
                              name='owner_pincode'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'owner_pincode'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'owner_pincode'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'owner_pincode'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'owner_pincode'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'owner_pincode'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'owner_pincode'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='building_name'>
                              <strong>
                                {getTranslatedText('label.building_name')}
                              </strong>
                            </label>
                            <FormInput
                              id='#building_name'
                              placeholder='Enter Building Name'
                              name='building_name'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'text',
                                  null,
                                  null,
                                  'building_name'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'building_name'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'building_name'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'building_name'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'building_name'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'building_name'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='height_of_stilt_floor'>
                              <strong>
                                {getTranslatedText(
                                  'label.height_of_stilt_floor'
                                )}
                              </strong>
                            </label>
                            <FormInput
                              id='#height_of_stilt_floor'
                              placeholder='Enter Height of Stilt Floor in meters'
                              name='height_of_stilt_floor'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'height_of_stilt_floor'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'height_of_stilt_floor'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'height_of_stilt_floor'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'height_of_stilt_floor'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'height_of_stilt_floor'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'height_of_stilt_floor'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='road_widening'>
                              <strong>
                                {getTranslatedText('label.road_widening')}
                              </strong>
                            </label>
                            <FormSelect
                              name='road_widening'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'select',
                                  null,
                                  null,
                                  'road_widening'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'road_widening'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'road_widening'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'road_widening'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'road_widening'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'road_widening'
                                    ].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='Yes'>Yes</option>
                              <option value='No'>No</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='gov_building'>
                              <strong>
                                {getTranslatedText('label.gov_building')}
                              </strong>
                            </label>
                            <FormSelect
                              name='gov_building'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'select',
                                  null,
                                  null,
                                  'gov_building'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'gov_building'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'gov_building'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'gov_building'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'gov_building'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'gov_building'
                                    ].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='Yes'>Yes</option>
                              <option value='No'>No</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='fire_north'>
                              <strong>
                                {getTranslatedText('label.fire_north')}
                              </strong>
                            </label>
                            <FormInput
                              id='#fire_north'
                              placeholder='North Side Open Space in meters'
                              name='fire_north'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'fire_north'
                                )
                              }
                              valid={
                                this.state.fire_department_fields['fire_north']
                                  .valid
                              }
                              invalid={
                                !this.state.fire_department_fields['fire_north']
                                  .empty &&
                                !this.state.fire_department_fields['fire_north']
                                  .valid
                              }
                              value={
                                this.state.fire_department_fields['fire_north']
                                  .value
                                  ? this.state.fire_department_fields[
                                      'fire_north'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='fire_south'>
                              <strong>
                                {getTranslatedText('label.fire_south')}
                              </strong>
                            </label>
                            <FormInput
                              id='#fire_south'
                              placeholder='South Side Open Space in meters'
                              name='fire_south'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'fire_south'
                                )
                              }
                              valid={
                                this.state.fire_department_fields['fire_south']
                                  .valid
                              }
                              invalid={
                                !this.state.fire_department_fields['fire_south']
                                  .empty &&
                                !this.state.fire_department_fields['fire_south']
                                  .valid
                              }
                              value={
                                this.state.fire_department_fields['fire_south']
                                  .value
                                  ? this.state.fire_department_fields[
                                      'fire_south'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='fire_east'>
                              <strong>
                                {getTranslatedText('label.fire_east')}
                              </strong>
                            </label>
                            <FormInput
                              id='#fire_east'
                              placeholder='East Side Open Space in meters'
                              name='fire_east'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'fire_east'
                                )
                              }
                              valid={
                                this.state.fire_department_fields['fire_east']
                                  .valid
                              }
                              invalid={
                                !this.state.fire_department_fields['fire_east']
                                  .empty &&
                                !this.state.fire_department_fields['fire_east']
                                  .valid
                              }
                              value={
                                this.state.fire_department_fields['fire_east']
                                  .value
                                  ? this.state.fire_department_fields[
                                      'fire_east'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='fire_west'>
                              <strong>
                                {getTranslatedText('label.fire_west')}
                              </strong>
                            </label>
                            <FormInput
                              id='#fire_west'
                              placeholder='West Side Open Space in meters'
                              name='fire_west'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'fire_west'
                                )
                              }
                              valid={
                                this.state.fire_department_fields['fire_west']
                                  .valid
                              }
                              invalid={
                                !this.state.fire_department_fields['fire_west']
                                  .empty &&
                                !this.state.fire_department_fields['fire_west']
                                  .valid
                              }
                              value={
                                this.state.fire_department_fields['fire_west']
                                  .value
                                  ? this.state.fire_department_fields[
                                      'fire_west'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='abutting_road_width'>
                              <strong>
                                {getTranslatedText('label.abutting_road_width')}
                              </strong>
                            </label>
                            <FormInput
                              id='#abutting_road_width'
                              placeholder='Abutting Road Width in meters'
                              name='abutting_road_width'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'abutting_road_width'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'abutting_road_width'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'abutting_road_width'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'abutting_road_width'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'abutting_road_width'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'abutting_road_width'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='front_side_dir'>
                              <strong>
                                {getTranslatedText('label.front_side_dir')}
                              </strong>
                            </label>
                            <FormSelect
                              name='front_side_dir'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'select',
                                  null,
                                  null,
                                  'front_side_dir'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'front_side_dir'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'front_side_dir'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'front_side_dir'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'front_side_dir'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'front_side_dir'
                                    ].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='North'>North</option>
                              <option value='South'>South</option>
                              <option value='East'>East</option>
                              <option value='West'>West</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='width_of_entry_gate'>
                              <strong>
                                {getTranslatedText('label.width_of_entry_gate')}
                              </strong>
                            </label>
                            <FormInput
                              id='#width_of_entry_gate'
                              placeholder='Width of Entry Gate in meters'
                              name='width_of_entry_gate'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'width_of_entry_gate'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'width_of_entry_gate'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'width_of_entry_gate'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'width_of_entry_gate'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'width_of_entry_gate'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'width_of_entry_gate'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='width_of_exit_gate'>
                              <strong>
                                {getTranslatedText('label.width_of_exit_gate')}
                              </strong>
                            </label>
                            <FormInput
                              id='#width_of_exit_gate'
                              placeholder='Width of Exit Gate in meters'
                              name='width_of_exit_gate'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'width_of_exit_gate'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'width_of_exit_gate'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'width_of_exit_gate'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'width_of_exit_gate'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'width_of_exit_gate'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'width_of_exit_gate'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='head_clearance'>
                              <strong>
                                {getTranslatedText('label.head_clearance')}
                              </strong>
                            </label>
                            <FormInput
                              id='#head_clearance'
                              placeholder='Entry Gate Head Clearance in meters'
                              name='head_clearance'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'head_clearance'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'head_clearance'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'head_clearance'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'head_clearance'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'head_clearance'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'head_clearance'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='head_exit'>
                              <strong>
                                {getTranslatedText('label.head_exit')}
                              </strong>
                            </label>
                            <FormInput
                              id='#head_exit'
                              placeholder='Exit Gate Head Clearance in meters'
                              name='head_exit'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'head_exit'
                                )
                              }
                              valid={
                                this.state.fire_department_fields['head_exit']
                                  .valid
                              }
                              invalid={
                                !this.state.fire_department_fields['head_exit']
                                  .empty &&
                                !this.state.fire_department_fields['head_exit']
                                  .valid
                              }
                              value={
                                this.state.fire_department_fields['head_exit']
                                  .value
                                  ? this.state.fire_department_fields[
                                      'head_exit'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='corridor'>
                              <strong>
                                {getTranslatedText('label.corridor')}
                              </strong>
                            </label>
                            <FormInput
                              id='#corridor'
                              placeholder='Travel Distance from the dead end of the corridor'
                              name='corridor'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'corridor'
                                )
                              }
                              valid={
                                this.state.fire_department_fields['corridor']
                                  .valid
                              }
                              invalid={
                                !this.state.fire_department_fields['corridor']
                                  .empty &&
                                !this.state.fire_department_fields['corridor']
                                  .valid
                              }
                              value={
                                this.state.fire_department_fields['corridor']
                                  .value
                                  ? this.state.fire_department_fields[
                                      'corridor'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='farthest'>
                              <strong>
                                {getTranslatedText('label.farthest')}
                              </strong>
                            </label>
                            <FormInput
                              id='#farthest'
                              placeholder='Travel Distance from the farthest point'
                              name='farthest'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'farthest'
                                )
                              }
                              valid={
                                this.state.fire_department_fields['farthest']
                                  .valid
                              }
                              invalid={
                                !this.state.fire_department_fields['farthest']
                                  .empty &&
                                !this.state.fire_department_fields['farthest']
                                  .valid
                              }
                              value={
                                this.state.fire_department_fields['farthest']
                                  .value
                                  ? this.state.fire_department_fields[
                                      'farthest'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='transformer_safety'>
                              <strong>
                                {getTranslatedText('label.transformer_safety')}
                              </strong>
                            </label>
                            <FormSelect
                              name='transformer_safety'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'select',
                                  null,
                                  null,
                                  'transformer_safety'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'transformer_safety'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'transformer_safety'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'transformer_safety'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'transformer_safety'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'transformer_safety'
                                    ].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='Yes'>Yes</option>
                              <option value='No'>No</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='no_of_fire_lifts'>
                              <strong>
                                {getTranslatedText('label.no_of_fire_lifts')}
                              </strong>
                            </label>
                            <FormInput
                              id='#no_of_fire_lifts'
                              placeholder='No of fire lifts'
                              name='no_of_fire_lifts'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'no_of_fire_lifts'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'no_of_fire_lifts'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'no_of_fire_lifts'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'no_of_fire_lifts'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'no_of_fire_lifts'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'no_of_fire_lifts'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='car_parking'>
                              <strong>
                                {getTranslatedText('label.car_parking')}
                              </strong>
                            </label>
                            <FormSelect
                              name='car_parking'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'select',
                                  null,
                                  null,
                                  'car_parking'
                                )
                              }
                              valid={
                                this.state.fire_department_fields['car_parking']
                                  .valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'car_parking'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'car_parking'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields['car_parking']
                                  .value
                                  ? this.state.fire_department_fields[
                                      'car_parking'
                                    ].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='Yes'>Yes</option>
                              <option value='No'>No</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='ramps_provides'>
                              <strong>
                                {getTranslatedText('label.ramps_provides')}
                              </strong>
                            </label>
                            <FormSelect
                              name='ramps_provides'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'select',
                                  null,
                                  null,
                                  'ramps_provides'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'ramps_provides'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'ramps_provides'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'ramps_provides'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'ramps_provides'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'ramps_provides'
                                    ].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='Yes'>Yes</option>
                              <option value='No'>No</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='generator_capacity'>
                              <strong>
                                {getTranslatedText('label.generator_capacity')}
                              </strong>
                            </label>
                            <FormInput
                              id='#generator_capacity'
                              placeholder='Generator Capacity'
                              name='generator_capacity'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'text',
                                  null,
                                  null,
                                  'generator_capacity'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'generator_capacity'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'generator_capacity'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'generator_capacity'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'generator_capacity'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'generator_capacity'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='air_conditioning_safety'>
                              <strong>
                                {getTranslatedText(
                                  'label.air_conditioning_safety'
                                )}
                              </strong>
                            </label>
                            <FormSelect
                              name='air_conditioning_safety'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'select',
                                  null,
                                  null,
                                  'air_conditioning_safety'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'air_conditioning_safety'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'air_conditioning_safety'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'air_conditioning_safety'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'air_conditioning_safety'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'air_conditioning_safety'
                                    ].value
                                  : ''
                              }
                            >
                              <option value=''>Select</option>
                              <option value='Yes'>Yes</option>
                              <option value='No'>No</option>
                            </FormSelect>
                          </FormGroup>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      {this.areFireDepartmentFieldsVisible() ? (
                        <Col xs='12' md='6'>
                          <FormGroup className={this.getLabelTextAlignment()}>
                            <label htmlFor='building_year'>
                              <strong>
                                {getTranslatedText('label.building_year')}
                              </strong>
                            </label>
                            <FormInput
                              id='#building_year'
                              placeholder='Building Year'
                              name='building_year'
                              onChange={event =>
                                this.validateAndSetInput(
                                  event,
                                  'fire_department_fields',
                                  'number',
                                  null,
                                  null,
                                  'building_year'
                                )
                              }
                              valid={
                                this.state.fire_department_fields[
                                  'building_year'
                                ].valid
                              }
                              invalid={
                                !this.state.fire_department_fields[
                                  'building_year'
                                ].empty &&
                                !this.state.fire_department_fields[
                                  'building_year'
                                ].valid
                              }
                              value={
                                this.state.fire_department_fields[
                                  'building_year'
                                ].value
                                  ? this.state.fire_department_fields[
                                      'building_year'
                                    ].value
                                  : ''
                              }
                            />
                          </FormGroup>
                        </Col>
                      ) : null}
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
        <Modal 
        open={this.state.informationBox}
        className='modal-dialog col-12 modal-dialog-centered'
        >
          <ModalHeader>Your application has been saved successfully and the current status is in draft mode.</ModalHeader>
          <ModalBody>
            <p>Please have all the necessary documents ready to upload.</p>
            <p>An SMS has been sent to your registered mobile number along with your application login details.</p>
            <p>In case if do not have these documents you can re-login and continue with the application process by uploading the pending documents.</p>
            <p>Your documents will be in draft mode for 21 days if you cannot act on these documents within 21 days your application will be automatically closed.</p>
          <p>
          <Button
            theme='primary'
            onClick={this.onClickOkInformationBox}
            >
                    Ok
           </Button>
          </p>
          </ModalBody>
        </Modal>
        <MapContainer
         openMap={this.state.mapOpen}
         selectLocation={this.selectLocation} 
        ></MapContainer>
      </LocalizationProvider>
    );
  }
}

export default ApplicationForm;

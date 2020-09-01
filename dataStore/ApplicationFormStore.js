import { action, observable } from 'mobx';

class ApplicationFormStore {
  @observable approval_for = null;
  @observable applicationId = null;
  @observable password = null;

  @observable meseva_request = null;

  @observable status = null;
  @observable applicationType = null;
  //Docs to upload
  @observable docsToUpload = null;

  @observable name = null;
  @observable email = null;
  @observable phone_number = null;
  @observable relationship_type = null;
  @observable relationship_name = null;
  @observable contact_address = null;
  @observable ulb_name = null;
  @observable mandal = null;
  @observable village = null;
  @observable plot_no = null;
  @observable construction_type = null;
  @observable construction_type = null;
  @observable building_usage = null;
  @observable road_width = null;
  @observable actual_plot_area = null;
  @observable plot_area_as_per_document = null;
  @observable lrs_no = null;
  @observable lp_no = null;
  @observable ap_no = null;
  @observable ab_no = null;
  @observable bps_no = null;
  @observable lrs_lp_input = null;
  @observable no_of_floors = null;
  @observable floor_areas = null;
  @observable height = null;
  @observable address = null;
  @observable survey_no = null;
  @observable locality = null;
  @observable aadhaar_number = null;
  @observable is_under_slum_area = null;
  @observable slum_name = null;
  @observable other_slum_name = null;
  @observable fire_department_fields = null;
  @observable front_setback = null;
  @observable other_setback = null;
  @observable front_existing_road_width = null;
  @observable front_proposed_road_width = null;
  @observable front_road_affected_area = null;
  @observable is_rear_road_affected = 'false';
  @observable rear_existing_road_width = null;
  @observable rear_proposed_road_width = null;
  @observable rear_road_affected_area = null;
  @observable is_side1_road_affected = 'false';
  @observable side1_existing_road_width = null;
  @observable side1_proposed_road_width = null;
  @observable side1_road_affected_area = null;
  @observable is_side2_road_affected = 'false';
  @observable side2_existing_road_width = null;
  @observable side2_proposed_road_width = null;
  @observable side2_road_affected_area = null;
  @observable total_built_up_area = null;
  @observable market_value = null;
  @observable is_market_value_from_user = null;
  @observable geo_coordinate_url = null;
  @observable mortgage_area = null;
  @observable mortgage_floor = null;
  @observable mortgage_document_number = null;
  @observable mortgage_date = null;
  //Uploads
  @observable ownership_document = null;
  @observable mortgage_document = null;
  @observable layout_plan = null;
  @observable indemnity_bond = null;
  @observable road_effect_undertaking = null;
  @observable ltp_declaration = null;
  @observable offlline_auto_dcr = null;
  @observable pahani_patta_ror = null;
  @observable link_document_1 = null;
  @observable link_document_2 = null;
  @observable link_document_3 = null;
  @observable ec_document = null;
  @observable land_conversion_certificate = null;
  @observable geo_location_plan = null;
  @observable master_plan = null;
  
  
  @observable lrs_document = null;
  @observable lp_document = null;
  @observable gk_document = null;
  @observable ap_document = null;
  @observable ab_document = null;
  @observable bps_document = null;
  @observable op_document = null;
  @observable ot_document = null;



  @observable market_value_certificate = null;
  @observable front_view = null;
  @observable rear_view = null;
  @observable side1_view = null;
  @observable side2_view = null;

  @observable payment = null;

  @observable uploads = null;

  @observable acknowledgment = null;
  @observable auto_dcr_id = null;
  @observable auto_dcr_secret_key = null;
  @observable workflow = null;

  @observable cellar = null;
  @observable addinitional_stilts = null;
  @observable msb_no = null;

  @action
  setApprovalFor = approval_for => {
    this.approval_for = approval_for;
  };
  getApprovalFor = () => {
    return this.approval_for;
  };

  @action
  setApplicationId = applicationId => {
    this.applicationId = applicationId;
  };
  getApplicationId = () => {
    return this.applicationId;
  };

  @action
  setPassword = password => {
    this.password = password;
  };
  getPassword = () => {
    return this.password;
  };

  @action
  setStatus = status => {
    this.status = status;
  };
  getStatus = () => {
    return this.status;
  };

  @action
  setUploads = uploads => {
    this.uploads = uploads;
  };
  getUploads = () => {
    return this.uploads;
  };

  @action
  setAcknowledgment = acknowledgment => {
    this.acknowledgment = acknowledgment;
  };
  getAcknowledgment = () => {
    return this.acknowledgment;
  };

  @action
  setApplicationType = applicationType => {
    this.applicationType = applicationType;
  };
  getApplicationType = () => {
    return this.applicationType;
  };

  @action
  setDocsToUpload = docsToUpload => {
    this.docsToUpload = JSON.stringify(docsToUpload);
  };
  getDocsToUpload = () => {
    return JSON.parse(this.docsToUpload);
  };

  @action
  setApplicationPayment = payment => {
    this.payment = payment;
  };
  getApplicationPayment = () => {
    return this.payment;
  };

  @action
  setHeight = height => {
    this.height = height;
  };

  getHeight = () => {
    return this.height;
  };

  @action
  setFloorType = floorType => {
    this.floorType = floorType;
  };

  getFloorType = () => {
    return this.floorType;
  };

  @action
  setAutoDCRSecretKey = auto_dcr_secret_key => {
    this.auto_dcr_secret_key = auto_dcr_secret_key;
  };

  getAutoDCRSecretKey = () => this.auto_dcr_secret_key;

  @action
  setAutoDCRId = auto_dcr_id => {
    this.auto_dcr_id = auto_dcr_id;
  };

  getAutoDCRId = () => this.auto_dcr_id;

  isMeSevaRequest = () => this.meseva_request && this.meseva_request !== null;

  @action
  setWorkflow = workflow => (this.workflow = workflow);

  getWorkflow = () => this.workflow;

  @action
  setNoOfFloors = no_of_floors => {
    this.no_of_floors = no_of_floors;
  };

  @action
  setDocumentData = data => {
    if (data.ownership_document)
      this.ownership_document = data.ownership_document;
    if (data.mortgage_document) this.mortgage_document = data.mortgage_document;
    if (data.layout_plan) this.layout_plan = data.layout_plan;
    if (data.indemnity_bond) this.indemnity_bond = data.indemnity_bond;
    if (data.road_effect_undertaking)
      this.road_effect_undertaking = data.road_effect_undertaking;
    if (data.ltp_declaration) this.ltp_declaration = data.ltp_declaration;
    if (data.offlline_auto_dcr) this.offlline_auto_dcr = data.offlline_auto_dcr;
    if (data.pahani_patta_ror) this.pahani_patta_ror = data.pahani_patta_ror;
    if (data.link_document_1) this.link_document_1 = data.link_document_1;
    if (data.link_document_2) this.link_document_2 = data.link_document_2;
    if (data.link_document_3) this.link_document_3 = data.link_document_3;
    if (data.ec_document) this.ec_document = data.ec_document;
    if (data.land_conversion_certificate)
      this.land_conversion_certificate = data.land_conversion_certificate;
    if (data.geo_location_plan) this.geo_location_plan = data.geo_location_plan;
    if (data.master_plan) this.master_plan = data.master_plan;
    if (data.lrs_document) this.lrs_document = data.lrs_document;
    if (data.lp_document) this.lp_document = data.lp_document;
    if (data.gk_document) this.gk_document = data.gk_document;
    if (data.ap_document) this.ap_document = data.ap_document;
    if (data.ab_document) this.ab_document = data.ab_document;
    if (data.bps_document) this.bps_document = data.bps_document;
    if (data.op_document) this.op_document = data.op_document;
    if (data.ot_document) this.ot_document = data.ot_document;

    if (data.market_value_certificate)
      this.market_value_certificate = data.market_value_certificate;
    if (data.front_view) this.front_view = data.front_view;
    if (data.rear_view) this.rear_view = data.rear_view;
    if (data.side1_view) this.side1_view = data.side1_view;
    if (data.side2_view) this.side2_view = data.side2_view;

  };

  getDocumentData = () => {
    var data = {};
    data.ownership_document = this.ownership_document;
    data.mortgage_document = this.mortgage_document;
    data.layout_plan = this.layout_plan;
    data.indemnity_bond = this.indemnity_bond;
    data.road_effect_undertaking = this.road_effect_undertaking;
    data.ltp_declaration = this.ltp_declaration;
    data.offlline_auto_dcr = this.offlline_auto_dcr;
    data.pahani_patta_ror = this.pahani_patta_ror;
    data.link_document_1 = this.link_document_1;
    data.link_document_2 = this.link_document_2;
    data.link_document_3 = this.link_document_3;
    data.ec_document = this.ec_document;
    data.land_conversion_certificate = this.land_conversion_certificate;
    data.geo_location_plan = this.geo_location_plan;
    data.master_plan = this.master_plan;
    data.lrs_document = this.lrs_document;
    data.lp_document = this.lp_document;
    data.gk_document = this.gk_document;
    data.ap_document = this.ap_document;
    data.ab_document = this.ab_document;
    data.bps_document = this.bps_document;
    data.op_document = this.op_document;
    data.ot_document = this.ot_document;
    data.market_value_certificate = this.market_value_certificate;
    data.front_view = this.front_view;
    data.rear_view = this.rear_view;
    data.side1_view = this.side1_view;
    data.side2_view = this.side2_view;
    return data;
  };

  @action
  setApplicationData = data => {
    if (data.approval_for) this.approval_for = data.approval_for;
    if (data.applicationId) this.applicationId = data.applicationId;
    if (data.name) this.name = data.name;
    if (data.email) this.email = data.email;
    if (data.aadhaar_number) this.aadhaar_number = data.aadhaar_number;
    if (data.phone_number) this.phone_number = data.phone_number;
    if (data.relationship_type) this.relationship_type = data.relationship_type;
    if (data.relationship_type) this.relationship_name = data.relationship_name;
    if (data.ulb_name) this.ulb_name = data.ulb_name;
    if (data.mandal) this.mandal = data.mandal;
    if (data.plot_no) this.plot_no = data.plot_no;
    if (data.lrs_no) {
      this.lrs_no = data.lrs_no;
    }
    if (data.lp_no) {
      this.lp_no = data.lp_no;
    }
    if (data.ap_no) {
      this.ap_no = data.ap_no;
    }
    if (data.ab_no) {
      this.ab_no = data.ab_no;
    }
    if (data.bps_no) {
      this.bps_no = data.bps_no;
    }
    if (data.ap_no) {
      this.ap_no = data.ap_no;
    }
    if (data.village) this.village = data.village;
    if (data.construction_type) this.construction_type = data.construction_type;
    if (data.building_usage) this.building_usage = data.building_usage;
    if (data.actual_plot_area) this.actual_plot_area = data.actual_plot_area;
    if (data.plot_area_as_per_document)
      this.plot_area_as_per_document = data.plot_area_as_per_document;
    if (data.address) this.address = data.address;
    if (data.geo_coordinate_url)
      this.geo_coordinate_url = data.geo_coordinate_url;
    if (data.survey_no) this.survey_no = data.survey_no;
    if (data.locality) this.locality = data.locality;
    if (data.no_of_floors) this.no_of_floors = data.no_of_floors;
    if (data.roof_type) this.roof_type = data.roof_type;
    if (data.front_setback) this.front_setback = data.front_setback;
    if (data.other_setback) this.other_setback = data.other_setback;

    if (data.front_existing_road_width)
      this.front_existing_road_width = data.front_existing_road_width;
    if (data.front_proposed_road_width)
      this.front_proposed_road_width = data.front_proposed_road_width;
    if (data.front_road_affected_area != null)
      this.front_road_affected_area = data.front_road_affected_area;

    if (data.rear_existing_road_width)
      this.rear_existing_road_width = data.rear_existing_road_width;
    if (data.rear_proposed_road_width)
      this.rear_proposed_road_width = data.rear_proposed_road_width;
    if (data.rear_road_affected_area != null) {
      this.rear_road_affected_area = data.rear_road_affected_area;
      this.is_rear_road_affected = 'true';
    }

    if (data.side1_existing_road_width)
      this.side1_existing_road_width = data.side1_existing_road_width;
    if (data.side1_proposed_road_width)
      this.side1_proposed_road_width = data.side1_proposed_road_width;
    if (data.side1_road_affected_area != null) {
      this.side1_road_affected_area = data.side1_road_affected_area;
      this.is_side1_road_affected = 'true';
    }
    if (data.side2_existing_road_width)
      this.side2_existing_road_width = data.side2_existing_road_width;
    if (data.side2_proposed_road_width)
      this.side2_proposed_road_width = data.side2_proposed_road_width;
    if (data.side2_road_affected_area != null) {
      this.side2_road_affected_area = data.side2_road_affected_area;
      this.is_side2_road_affected = 'true';
    }

    if (data.plot_status) this.plot_status = data.plot_status;
    if (data.sale_deed_registration_date)
      this.sale_deed_registration_date = data.sale_deed_registration_date;
    if (data.floor_areas) this.floor_areas = JSON.stringify(data.floor_areas);
    if (data.net_plot_area) this.net_plot_area = data.net_plot_area;
    if (data.market_value) this.market_value = data.market_value;
    if (data.is_market_value_from_user)
      this.is_market_value_from_user = data.is_market_value_from_user;
    if (data.compound_length) this.compound_length = data.compound_length;
    if (data.mortgage_area) this.mortgage_area = data.mortgage_area;
    if (data.mortgage_floor) this.mortgage_floor = data.mortgage_floor;
    if (data.mortgage_document_number)
      this.mortgage_document_number = data.mortgage_document_number;
    if (data.mortgage_date) this.mortgage_date = data.mortgage_date;
    if (data.sro_location) this.sro_location = data.sro_location;
    if (data.status) this.status = data.status;
    if (data.uploads) this.uploads = data.uploads;
    if (data.auto_dcr_id) this.auto_dcr_id = data.auto_dcr_id;
    if (data.auto_dcr_secret_key)
      this.auto_dcr_secret_key = data.auto_dcr_secret_key;
    if (data.meseva_request) this.meseva_request = data.meseva_request;
    if (data.workflow) this.workflow = data.workflow;
    if (data.fire_department_fields)
      this.fire_department_fields = data.fire_department_fields;
    if (data.height) this.height = data.height;
    if (data.contact_address) this.contact_address = data.contact_address;
    if (data.co_applicant_name) this.co_applicant_name = data.co_applicant_name;
    if (data.co_applicant_relationship_type)
      this.co_applicant_relationship_type = data.co_applicant_relationship_type;
    if (data.co_applicant_relationship_name)
      this.co_applicant_relationship_name = data.co_applicant_relationship_name;
    if (data.co_applicant_aadhaar_number)
      this.co_applicant_aadhaar_number = data.co_applicant_aadhaar_number;
    if (data.co_applicant_email)
      this.co_applicant_email = data.co_applicant_email;
    if (data.co_applicant_phone_number)
      this.co_applicant_phone_number = data.co_applicant_phone_number;
    if (data.layout_type) this.layout_type = data.layout_type;
    if (data.layout_category) this.layout_category = data.layout_category;
    if (data.proposed_site_area_for_approval)
      this.proposed_site_area_for_approval =
        data.proposed_site_area_for_approval;
    if (data.land_type) this.land_type = data.land_type;
    if (data.revenue_village) this.revenue_village = data.revenue_village;
    if (data.if_site_area_more_than_proposed_reason)
      this.if_site_area_more_than_proposed_reason =
        data.if_site_area_more_than_proposed_reason;
    if (data.is_site_under_sanctioned_master_plan)
      this.is_site_under_sanctioned_master_plan =
        data.is_site_under_sanctioned_master_plan;
    if (data.land_use_as_per_master_plan)
      this.land_use_as_per_master_plan = data.land_use_as_per_master_plan;
    if (data.land_allotment_by_govt)
      this.land_allotment_by_govt = data.land_allotment_by_govt;
    if (data.airport_vicinity) this.airport_vicinity = data.airport_vicinity;
    if (data.national_monument_vicinity)
      this.national_monument_vicinity = data.national_monument_vicinity;
    if (data.heritage_structure_vicinity)
      this.heritage_structure_vicinity = data.heritage_structure_vicinity;
    if (data.oil_gas_pipeline_vicinity)
      this.oil_gas_pipeline_vicinity = data.oil_gas_pipeline_vicinity;
    if (data.religious_structure_vicinity)
      this.religious_structure_vicinity = data.religious_structure_vicinity;
    if (data.does_approach_road_exist)
      this.does_approach_road_exist = data.does_approach_road_exist;
    if (data.road_width) this.road_width = data.road_width;
    if (data.approach_road_connect_with_public_road)
      this.approach_road_connect_with_public_road =
        data.approach_road_connect_with_public_road;
    if (data.status_of_road) this.status_of_road = data.status_of_road;
    if (data.commencement_of_work_onsite)
      this.commencement_of_work_onsite = data.commencement_of_work_onsite;
    if (data.boundary_schedule_north)
      this.boundary_schedule_north = data.boundary_schedule_north;
    if (data.boundary_schedule_east)
      this.boundary_schedule_east = data.boundary_schedule_east;
    if (data.boundary_schedule_west)
      this.boundary_schedule_west = data.boundary_schedule_west;
    if (data.boundary_schedule_south)
      this.boundary_schedule_south = data.boundary_schedule_south;
    if (data.town_planner_license_number)
      this.town_planner_license_number = data.town_planner_license_number;
    if (data.town_planner_name) this.town_planner_name = data.town_planner_name;
    if (data.town_planner_mobile_number)
      this.town_planner_mobile_number = data.town_planner_mobile_number;
    if (data.town_planner_email_id)
      this.town_planner_email_id = data.town_planner_email_id;
    if (data.town_planner_address)
      this.town_planner_address = data.town_planner_address;
    if (data.builder_license_number)
      this.builder_license_number = data.builder_license_number;
    if (data.builder_name) this.builder_name = data.builder_name;
    if (data.builder_mobile_number)
      this.builder_mobile_number = data.builder_mobile_number;
    if (data.builder_email_id) this.builder_email_id = data.builder_email_id;
    if (data.builder_address) this.builder_address = data.builder_address;
    if (data.surveyor_license_number)
      this.surveyor_license_number = data.surveyor_license_number;
    if (data.surveyor_name) this.surveyor_name = data.surveyor_name;
    if (data.surveyor_mobile_number)
      this.surveyor_mobile_number = data.surveyor_mobile_number;
    if (data.surveyor_email_id) this.surveyor_email_id = data.surveyor_email_id;
    if (data.surveyor_address) this.surveyor_address = data.surveyor_address;
    if (data.architect_license_number)
      this.architect_license_number = data.architect_license_number;
    if (data.architect_name) this.architect_name = data.architect_name;
    if (data.architect_mobile_number)
      this.architect_mobile_number = data.architect_mobile_number;
    if (data.architect_email_id)
      this.architect_email_id = data.architect_email_id;
    if (data.architect_address) this.architect_address = data.architect_address;

    if (data.structural_engineer_license_number)
      this.structural_engineer_license_number =
        data.structural_engineer_license_number;
    if (data.structural_engineer_name)
      this.structural_engineer_name = data.structural_engineer_name;
    if (data.structural_engineer_mobile_number)
      this.structural_engineer_mobile_number =
        data.structural_engineer_mobile_number;
    if (data.structural_engineer_email_id)
      this.structural_engineer_email_id = data.structural_engineer_email_id;
    if (data.structural_engineer_address)
      this.structural_engineer_email_id = data.structural_engineer_email_id;

    if (data.revenue_noc) this.revenue_noc = data.revenue_noc;
    if (data.river_boundary) this.river_boundary = data.river_boundary;
    if (data.water_body_gt_10ha_boundary)
      this.water_body_gt_10ha_boundary = data.water_body_gt_10ha_boundary;
    if (data.water_body_lt_10ha_boundary)
      this.water_body_lt_10ha_boundary = data.water_body_lt_10ha_boundary;
    if (data.canal_gt_10m_boundary)
      this.canal_gt_10m_boundary = data.canal_gt_10m_boundary;
    if (data.canal_lt_10m_boundary)
      this.canal_lt_10m_boundary = data.canal_lt_10m_boundary;
    if (data.aai_land_layout_mapping)
      this.aai_land_layout_mapping = data.aai_land_layout_mapping;
    if (data.land_dev_gt_500000_or_area_gt_200000)
      this.land_dev_gt_500000_or_area_gt_200000 =
        data.land_dev_gt_500000_or_area_gt_200000;
    if (data.national_monument_authority)
      this.national_monument_authority = data.national_monument_authority;
    if (data.heritage_structure)
      this.heritage_structure = data.heritage_structure;
    if (data.oil_gas_authority) this.oil_gas_authority = data.oil_gas_authority;
    if (data.religious_structures)
      this.religious_structures = data.religious_structures;
    if (data.fire_department_fields)
      this.fire_department_fields = data.fire_department_fields;
    if (data.height) this.height = data.height;
    if (data.is_under_slum_area)
      this.is_under_slum_area = data.is_under_slum_area;
    if (data.slum_name) this.slum_name = data.slum_name;
    if (data.other_slum_name) this.other_slum_name = data.other_slum_name;
    if (data.total_built_up_area)
      this.total_built_up_area = data.total_built_up_area;
    if(data.cellar) this.cellar = data.cellar;
    if(data.addinitional_stilts) this.addinitional_stilts = data.addinitional_stilts;
    if(data.msb_no) this.msb_no = data.msb_no;
  };

  getApplicationData = () => {
    var data = {};
    data.approval_for = this.approval_for;
    data.applicationId = this.applicationId;
    data.name = this.name;
    data.email = this.email;
    data.aadhaar_number = this.aadhaar_number;
    data.phone_number = this.phone_number;
    data.relationship_type = this.relationship_type;
    data.relationship_name = this.relationship_name;
    data.ulb_name = this.ulb_name;
    data.mandal = this.mandal;
    data.plot_no = this.plot_no;
    data.lrs_no = this.lrs_no;
    data.lp_no = this.lp_no;
    data.ap_no = this.ap_no;
    data.ab_no = this.ab_no;
    data.bps_no = this.bps_no;
    data.village = this.village;
    data.construction_type = this.construction_type;
    data.building_usage = this.building_usage;
    data.actual_plot_area = this.actual_plot_area;
    data.plot_area_as_per_document = this.plot_area_as_per_document;
    data.address = this.address;
    data.survey_no = this.survey_no;
    data.locality = this.locality;
    data.no_of_floors = this.no_of_floors;
    data.roof_type = this.roof_type;
    data.plot_status = this.plot_status;
    data.sale_deed_registration_date = this.sale_deed_registration_date;
    data.floor_areas = JSON.parse(this.floor_areas);
    data.net_plot_area = this.net_plot_area;
    data.market_value = this.market_value;
    data.is_market_value_from_user = this.is_market_value_from_user;
    data.geo_coordinate_url = this.geo_coordinate_url;
    data.compound_length = this.compound_length;
    data.mortgage_area = this.mortgage_area;
    data.mortgage_floor = this.mortgage_floor;
    data.mortgage_document_number = this.mortgage_document_number;
    data.mortgage_date = this.mortgage_date;
    data.sro_location = this.sro_location;
    data.status = this.status;
    data.uploads = this.uploads;
    data.auto_dcr_id = this.auto_dcr_id;
    data.auto_dcr_secret_key = this.auto_dcr_secret_key;
    data.meseva_request = this.meseva_request;
    data.fire_department_fields = this.fire_department_fields;
    data.height = this.height;
    data.workflow = this.workflow;
    data.contact_address = this.contact_address;
    data.co_applicant_name = this.co_applicant_name;
    data.co_applicant_relationship_type = this.co_applicant_relationship_type;
    data.co_applicant_relationship_name = this.co_applicant_relationship_name;
    data.co_applicant_aadhaar_number = this.co_applicant_aadhaar_number;
    data.co_applicant_email = this.co_applicant_email;
    data.co_applicant_phone_number = this.co_applicant_phone_number;
    data.layout_type = this.layout_type;
    data.layout_category = this.layout_category;
    data.proposed_site_area_for_approval = this.proposed_site_area_for_approval;
    data.land_type = this.land_type;
    data.revenue_village = this.revenue_village;
    data.if_site_area_more_than_proposed_reason = this.if_site_area_more_than_proposed_reason;
    data.is_site_under_sanctioned_master_plan = this.is_site_under_sanctioned_master_plan;
    data.land_use_as_per_master_plan = this.land_use_as_per_master_plan;
    data.land_allotment_by_govt = this.land_allotment_by_govt;
    data.airport_vicinity = this.airport_vicinity;
    data.national_monument_vicinity = this.national_monument_vicinity;
    data.heritage_structure_vicinity = this.heritage_structure_vicinity;
    data.oil_gas_pipeline_vicinity = this.oil_gas_pipeline_vicinity;
    data.religious_structure_vicinity = this.religious_structure_vicinity;
    data.does_approach_road_exist = this.does_approach_road_exist;
    data.road_width = this.road_width;
    data.approach_road_connect_with_public_road = this.approach_road_connect_with_public_road;
    data.status_of_road = this.status_of_road;
    data.commencement_of_work_onsite = this.commencement_of_work_onsite;
    data.boundary_schedule_north = this.boundary_schedule_north;
    data.boundary_schedule_east = this.boundary_schedule_east;
    data.boundary_schedule_west = this.boundary_schedule_west;
    data.boundary_schedule_south = this.boundary_schedule_south;
    data.town_planner_license_number = this.town_planner_license_number;
    data.town_planner_name = this.town_planner_name;
    data.town_planner_mobile_number = this.town_planner_mobile_number;
    data.town_planner_email_id = this.town_planner_email_id;
    data.town_planner_address = this.town_planner_address;
    data.builder_license_number = this.builder_license_number;
    data.builder_name = this.builder_name;
    data.builder_mobile_number = this.builder_mobile_number;
    data.builder_email_id = this.builder_email_id;
    data.builder_address = this.builder_address;
    data.surveyor_license_number = this.surveyor_license_number;
    data.surveyor_name = this.surveyor_name;
    data.surveyor_mobile_number = this.surveyor_mobile_number;
    data.surveyor_email_id = this.surveyor_email_id;
    data.surveyor_address = this.surveyor_address;
    data.architect_license_number = this.architect_license_number;
    data.architect_name = this.architect_name;
    data.architect_mobile_number = this.architect_mobile_number;
    data.architect_email_id = this.architect_email_id;
    data.architect_address = this.architect_address;
    data.structural_engineer_license_number = this.structural_engineer_license_number;
    data.structural_engineer_name = this.structural_engineer_name;
    data.structural_engineer_mobile_number = this.structural_engineer_mobile_number;
    data.structural_engineer_email_id = this.structural_engineer_email_id;
    data.structural_engineer_email_id = this.structural_engineer_email_id;
    data.revenue_noc = this.revenue_noc;
    data.river_boundary = this.river_boundary;
    data.water_body_gt_10ha_boundary = this.water_body_gt_10ha_boundary;
    data.water_body_lt_10ha_boundary = this.water_body_lt_10ha_boundary;
    data.canal_gt_10m_boundary = this.canal_gt_10m_boundary;
    data.canal_lt_10m_boundary = this.canal_lt_10m_boundary;
    data.aai_land_layout_mapping = this.aai_land_layout_mapping;
    data.land_dev_gt_500000_or_area_gt_200000 = this.land_dev_gt_500000_or_area_gt_200000;
    data.national_monument_authority = this.national_monument_authority;
    data.heritage_structure = this.heritage_structure;
    data.oil_gas_authority = this.oil_gas_authority;
    data.religious_structures = this.religious_structures;
    data.is_under_slum_area = this.is_under_slum_area;
    data.slum_name = this.slum_name;
    data.other_slum_name = this.other_slum_name;
    data.front_setback = this.front_setback;
    data.other_setback = this.other_setback;
    data.front_existing_road_width = this.front_existing_road_width;
    data.front_proposed_road_width = this.front_proposed_road_width;
    data.front_road_affected_area = this.front_road_affected_area;
    data.rear_existing_road_width = this.rear_existing_road_width;
    data.is_rear_road_affected = this.is_rear_road_affected;
    data.rear_proposed_road_width = this.rear_proposed_road_width;
    data.rear_road_affected_area = this.rear_road_affected_area;
    data.is_side1_road_affected = this.is_side1_road_affected;
    data.side1_existing_road_width = this.side1_existing_road_width;
    data.side1_proposed_road_width = this.side1_proposed_road_width;
    data.side1_road_affected_area = this.side1_road_affected_area;
    data.is_side2_road_affected = this.is_side2_road_affected;
    data.side2_existing_road_width = this.side2_existing_road_width;
    data.side2_proposed_road_width = this.side2_proposed_road_width;
    data.side2_road_affected_area = this.side2_road_affected_area;
    data.total_built_up_area = this.total_built_up_area;
    data.cellar = this.cellar;
    data.addinitional_stilts = this.addinitional_stilts;
    data.msb_no = this.msb_no;
    return data;
  };

  @action
  setFireDepartmentFields = data => {
    this.fire_department_fields = data;
  };

  getFireDepartmentFields = () => {
    return this.fire_department_fields;
  };

  @action
  restore() {
    this.approval_for = null;
    this.applicationId = null;
    this.name = null;
    this.email = null;
    this.aadhaar_number = null;
    this.phone_number = null;
    this.relationship_type = null;
    this.relationship_name = null;
    this.ulb_name = null;
    this.mandal = null;
    this.plot_no = null;
    this.lrs_no = null;
    this.ap_no = null;
    this.ab_no = null;
    this.bps_no = null;
    this.village = null;
    this.construction_type = null;
    this.actual_plot_area = null;
    this.address = null;
    this.survey_no = null;
    this.no_of_floors = null;
    this.roof_type = null;
    this.plot_status = null;
    this.sale_deed_registration_date = null;
    this.floor_areas = null;
    this.net_plot_area = null;
    this.market_value = null;
    this.is_market_value_from_user = null;
    this.compound_length = null;
    this.mortgage_area = null;
    this.mortgage_floor = null;
    this.mortgage_document_number = null;
    this.mortgage_date = null;
    this.sro_location = null;
    this.status = null;
    this.uploads = null;
    this.auto_dcr_id = null;
    this.auto_dcr_secret_key = null;
    this.height = null;
    this.fire_department_fields = null;
    this.is_under_slum_area = null;
    this.slum_name = null;
    this.front_existing_road_width = null;
    this.front_proposed_road_width = null;
    this.front_road_affected_area = null;
    this.is_rear_road_affected = 'false';
    this.rear_existing_road_width = null;
    this.rear_proposed_road_width = null;
    this.rear_road_affected_area = null;
    this.is_side1_road_affected = 'false';
    this.side1_existing_road_width = null;
    this.side1_proposed_road_width = null;
    this.side1_road_affected_area = null;
    this.is_side2_road_affected = 'false';
    this.side2_existing_road_width = null;
    this.side2_proposed_road_width = null;
    this.side2_road_affected_area = null;
    this.contact_address = null;
    this.geo_coordinate_url = null;
    this.cellar = null;
    this.addinitional_stilts = null;
    this.msb_no = null;
  }
}
export default ApplicationFormStore;

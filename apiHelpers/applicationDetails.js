import { alterParamsForUrl, getURL } from '../utils/urlUtils';

import apiConstants from '../constants/apiConstants';
import applicationStatusConstants from '../constants/applicationStatusConstants';
import fetch from 'isomorphic-unfetch';

export async function getApplicationDetails(applicationId) {
  let url = getURL(apiConstants.GET_APPLICATION_DETAILS.USECASE);
  url = alterParamsForUrl(url, { identifier: applicationId });
  let response = await fetch(url);
  if (response.url.indexOf('citizen-search') !== -1) {
    return {
      notLoggedIn: true
    };
  }
  if (response && response.status === 200) {
    response = await response.json();
    if (response.details) {
      const data = response.details;
      var applicationDetails = {
        approval_for: data.approval_for,
        applicationId: data.application_identifier,
        meseva_request: data.meseva_request,
        name: data.applicant.name,
        email: data.applicant.email,
        aadhaar_number: data.applicant.aadhaar_number,
        phone_number: data.applicant.phone_number,
        contact_address: data.applicant.contact_address,
        relationship_type: data.applicant.relationship_type,
        relationship_name: data.applicant.relationship_name,
        co_applicant_name: data.applicant.co_applicant_name,
        co_applicant_relationship_type:
          data.applicant.co_applicant_relationship_type,
        co_applicant_relationship_name:
          data.applicant.co_applicant_relationship_name,
        co_applicant_aadhaar_number: data.applicant.co_applicant_aadhaar_number,
        co_applicant_email: data.applicant.co_applicant_email,
        co_applicant_phone_number: data.applicant.co_applicant_phone_number,
        layout_type: data.property.layout_type,
        layout_category: data.property.layout_category,
        proposed_site_area_for_approval:
          data.property.proposed_site_area_for_approval,
        land_type: data.property.land_type,
        revenue_village: data.property.revenue_village,
        if_site_area_more_than_proposed_reason:
          data.property.if_site_area_more_than_proposed_reason,
        is_site_under_sanctioned_master_plan:
          data.property.is_site_under_sanctioned_master_plan,
        land_use_as_per_master_plan: data.property.land_use_as_per_master_plan,
        land_allotment_by_govt: data.property.land_allotment_by_govt,
        airport_vicinity: data.property.airport_vicinity,
        national_monument_vicinity: data.property.national_monument_vicinity,
        heritage_structure_vicinity: data.property.heritage_structure_vicinity,
        oil_gas_pipeline_vicinity: data.property.oil_gas_pipeline_vicinity,
        religious_structure_vicinity:
          data.property.religious_structure_vicinity,
        does_approach_road_exist: data.property.does_approach_road_exist,
        road_width: data.property.road_width,
        approach_road_connect_with_public_road:
          data.property.approach_road_connect_with_public_road,
        status_of_road: data.property.status_of_road,
        commencement_of_work_onsite: data.property.commencement_of_work_onsite,
        boundary_schedule_north: data.property.boundary_schedule_north,
        boundary_schedule_east: data.property.boundary_schedule_east,
        boundary_schedule_west: data.property.boundary_schedule_west,
        boundary_schedule_south: data.property.boundary_schedule_south,
        is_under_slum_area: data.property.is_under_slum_area ? data.property.is_under_slum_area.toString() : '',
        slum_name: data.property.slum_name,
        other_slum_name: data.property.other_slum_name,
        ulb_name: data.property.ulb_name,
        mandal: data.property.mandal,
        plot_no: data.property.plot_no,
        lrs_no: data.property.lrs_no,
        lp_no: data.property.lp_no,
        ap_no: data.property.ap_no,
        ab_no: data.property.ab_no,
        bps_no: data.property.bps_no,
        village: data.property.village,
        construction_type: data.property.construction_type,
        building_usage: data.property.building_usage,
        actual_plot_area: data.property.actual_plot_area,
        plot_area_as_per_document: data.property.plot_area_as_per_document,
        address: data.property.address,
        geo_coordinate_url: data.property.geo_coordinate_url,
        survey_no: data.property.survey_no,
        locality: data.property.locality,
        no_of_floors: data.property.no_of_floors,
        cellar: data.property.cellar,
        addinitional_stilts: data.property.addinitional_stilts,
        msb_no: data.property.msb_no,
        roof_type: data.property.roof_type,
        plot_status: data.property.plot_status,
        sale_deed_registration_date: data.property.sale_deed_registration_date,
        floor_areas: data.property.floor_areas,
        net_plot_area: data.property.net_plot_area,
        market_value: data.property.market_value,
        is_market_value_from_user: data.property.is_market_value_from_user,
        compund_length: data.property.compund_length,
        mortgage_area: data.property.mortgage_area,
        mortgage_floor: data.property.mortgage_floor,
        mortgage_document_number: data.property.mortgage_document_number,
        mortgage_date: data.property.mortgage_date,
        sro_location: data.property.sro_location,
        status: data.status,
        acknowledegment_document_url: data.acknowledegment_document_url,
        uploads: data.uploads,
        auto_dcr_id: data.property.auto_dcr_id,
        auto_dcr_secret_key: data.property.auto_dcr_secret_key,
        workflow: data.workflow,
        front_setback: data.property.front_setback,
        other_setback: data.property.other_setback,
        front_existing_road_width: data.property.front_existing_road_width,
        front_proposed_road_width: data.property.front_proposed_road_width,
        front_road_affected_area: data.property.front_road_affected_area,
        rear_existing_road_width: data.property.rear_existing_road_width,
        rear_proposed_road_width: data.property.rear_proposed_road_width,
        rear_road_affected_area: data.property.rear_road_affected_area,
        side1_existing_road_width: data.property.side1_existing_road_width,
        side1_proposed_road_width: data.property.side1_proposed_road_width,
        side1_road_affected_area: data.property.side1_road_affected_area,
        side2_existing_road_width: data.property.side2_existing_road_width,
        side2_proposed_road_width: data.property.side2_proposed_road_width,
        side2_road_affected_area: data.property.side2_road_affected_area,
        total_built_up_area: data.property.total_built_up_area,
        fire_department_fields: data.fire_detail
          ? data.fire_detail.fire_department_fields
          : null,
        application_comments: data.application_comments
      };
      if (
        data.external_personnel_detail &&
        data.external_personnel_detail.details
      ) {
        applicationDetails = {
          ...applicationDetails,
          town_planner_license_number:
            data.external_personnel_detail.details.town_planner_license_number,
          town_planner_name:
            data.external_personnel_detail.details.town_planner_name,
          town_planner_mobile_number:
            data.external_personnel_detail.details.town_planner_mobile_number,
          town_planner_email_id:
            data.external_personnel_detail.details.town_planner_email_id,
          town_planner_address:
            data.external_personnel_detail.details.town_planner_address,

          builder_license_number:
            data.external_personnel_detail.details.builder_license_number,
          builder_name: data.external_personnel_detail.details.builder_name,
          builder_mobile_number:
            data.external_personnel_detail.details.builder_mobile_number,
          builder_email_id:
            data.external_personnel_detail.details.builder_email_id,
          builder_address:
            data.external_personnel_detail.details.builder_address,

          surveyor_license_number:
            data.external_personnel_detail.details.surveyor_license_number,
          surveyor_name: data.external_personnel_detail.details.surveyor_name,
          surveyor_mobile_number:
            data.external_personnel_detail.details.surveyor_mobile_number,
          surveyor_email_id:
            data.external_personnel_detail.details.surveyor_email_id,
          surveyor_address:
            data.external_personnel_detail.details.surveyor_address,

          architect_license_number:
            data.external_personnel_detail.details.architect_license_number,
          architect_name: data.external_personnel_detail.details.architect_name,
          architect_mobile_number:
            data.external_personnel_detail.details.architect_mobile_number,
          architect_email_id:
            data.external_personnel_detail.details.architect_email_id,
          architect_address:
            data.external_personnel_detail.details.architect_address,

          structural_engineer_license_number:
            data.external_personnel_detail.details
              .structural_engineer_license_number,
          structural_engineer_name:
            data.external_personnel_detail.details.structural_engineer_name,
          structural_engineer_mobile_number:
            data.external_personnel_detail.details
              .structural_engineer_mobile_number,
          structural_engineer_email_id:
            data.external_personnel_detail.details.structural_engineer_email_id,
          structural_engineer_address:
            data.external_personnel_detail.details.structural_engineer_address
        };
      }
      if (data.property.noc_processing_info) {
        applicationDetails = {
          ...applicationDetails,
          revenue_noc: data.property.noc_processing_info.revenue_noc,
          river_boundary: data.property.noc_processing_info.river_boundary,
          water_body_gt_10ha_boundary:
            data.property.noc_processing_info.water_body_gt_10ha_boundary,
          water_body_lt_10ha_boundary:
            data.property.noc_processing_info.water_body_lt_10ha_boundary,
          canal_gt_10m_boundary:
            data.property.noc_processing_info.canal_gt_10m_boundary,
          canal_lt_10m_boundary:
            data.property.noc_processing_info.canal_lt_10m_boundary,
          aai_land_layout_mapping:
            data.property.noc_processing_info.aai_land_layout_mapping,
          land_dev_gt_500000_or_area_gt_200000:
            data.property.noc_processing_info
              .land_dev_gt_500000_or_area_gt_200000,
          national_monument_authority:
            data.property.noc_processing_info.national_monument_authority,
          heritage_structure:
            data.property.noc_processing_info.heritage_structure,
          oil_gas_authority:
            data.property.noc_processing_info.oil_gas_authority,
          religious_structures:
            data.property.noc_processing_info.religious_structures
        };
      }
      const applicationType = data.application_type;
      const docsToUpload = data.docs_to_upload;
      const applicationPayment = data.payment;
      const applicationDocuments = extractUploadsFromApplicationDetails(
        data.uploads
      );
      return {
        applicationDetails,
        applicationType,
        docsToUpload,
        applicationPayment,
        applicationDocuments,
        acknowledgment: extractAcknowledgment(data)
      };
    }
  }
  return { error: true };
}

function extractUploadsFromApplicationDetails(uploads) {
  let uploadedFiles = {};
  uploads.map(uploadedFileObj => {
    if (uploadedFileObj.file_url != null) {
      let fileName = uploadedFileObj.file_url.substring(
        uploadedFileObj.file_url.lastIndexOf('/') + 1
      );
      fileName = fileName.substring(
        fileName.split('-', 2).join('-').length + 1
      );

      uploadedFiles[uploadedFileObj.file_type] = fileName;
    }
  });
  return uploadedFiles;
}

function extractAcknowledgment(data) {
  return {
    status: data.acknowledgment_status,
    file_url: data.acknowledegment_document_url
  };
}
export async function markSelfDeclarationAccepted(applicationId) {
  let url = getURL(apiConstants.SELF_DECLARATION_UPDATE.USECASE);
  url = alterParamsForUrl(url, { identifier: applicationId });
  let response = await fetch(url);
  if (response && response.status === 200) {
    response = await response.json();
    return { paymentDetails: response };
  } else {
    return { error: true };
  }
}

export async function getApplicationIdList(role) {
  let url = getURL(apiConstants.GET_APPLICATION_LIST_FOR_ADMIN.USECASE);
  url = alterParamsForUrl(url, {role})
  let response = await fetch(url, { credentials: 'include' });

  if (response && response.status === 200) {
    response = await response.json();
    return { appIdList: response };
  } else {
    return { error: true };
  }
}

export async function getApplicationIdListForSingleWindow(role) {
  let url = getURL(apiConstants.ALL_OPEN_WORKFLOWS.USECASE);
  url = alterParamsForUrl(url, {role})
  let response = await fetch(url, {
    credentials: 'include'
  });

  if (response && response.status === 200) {
    response = await response.json();
    return { appIdList: response };
  } else {
    return { error: true };
  }
}

export async function getApplicationIdListForTaskManager(role, isSingleWindow) {
  let url = getURL(apiConstants.GET_APPLICATION_FOR_TASK_MANAGER.USECASE);
  url = alterParamsForUrl(url, {role, category: isSingleWindow ? 'SINGLE_WINDOW' : 'SELF_DECLARATION'})
  let response = await fetch(url, {
    credentials: 'include'
  });

  if (response && response.status === 200) {
    response = await response.json();
    return { appIdList: response };
  } else {
    return { error: true };
  }
}

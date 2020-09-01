export default [
  'ownership_document',
  'mortgage_document',
  'layout_plan',
  'indemnity_bond',
  'road_effect_undertaking',
  'ltp_declaration',
  'lrs_document',
  'lp_document',
  'gk_document',
  'ab_document',
  'ap_document',
  'bps_document',
  'op_document',
  'ot_document',
  'market_value_certificate'
];

export const sitePhotographDocs = [
  'front_view',
  'rear_view',
  'side1_view',
  'side2_view'
];

export const DOCUMENT_GROUP_FOR_BUILDINGS = {
  'Documents of Ownership': ['ownership_document'],
  'Building Plan': ['layout_plan'],
  'Plot Approval Documents': ['lrs_document', 'lp_document', 'gk_document', 
  'ap_document', 'ab_document', 'bps_document', 
  'op_document', 'ot_document'],
  Mortgage: ['mortgage_document'],
  Undertakings: [
    'indemnity_bond',
    'road_effect_undertaking',
    'ltp_declaration'
  ],
  'Other supporting documents': ['market_value_certificate']
};

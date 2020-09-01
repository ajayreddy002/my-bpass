import floorDisplayNameConstants from '../floorDisplayNameConstants';
import { convertToSqYards } from '../../utils/convertionUtils';
export const getSelfDeclaration = applicationData => {
  var plot_area_sq_mtrs =
    applicationData.actual_plot_area < applicationData.plot_area_as_per_document
      ? applicationData.actual_plot_area
      : applicationData.plot_area_as_per_document;

  var plot_area_sq_yards = convertToSqYards(plot_area_sq_mtrs);

  //@brampr : This is the old set of self declaration statements as on 5th March 2020
  var selfDeclarationText = [
    'I/We certify that the particulars furnished in the online application form and uploaded documents for registration as required under sub-section (1) of section 174 of the Telangana Municipalities Act 2019.',
    'I/We here by certify that size of the said plot is less than <b>' +
      plot_area_sq_mtrs +
      ' Sq. Mts. ( ' +
      plot_area_sq_yards +
      ' Sq.Yards )</b> and the plot is not part of bigger plot which has been split for this purpose and the proposed building is not more than <b>' +
      floorDisplayNameConstants[applicationData.no_of_floors] +
      '.</b>',
    'I/We here by certify that my plot is abutting to the existing road width of more than 9.00 mts. and if it is not available, I will surrender and fore go the affected portion to a strip of 4.5 mts. from the center of the existing road for road widening at free of cost.',
    'I/We here by undertake that I shall not construct any extra floor other than declared.',
    'I / We here by undertake that the proposed site is not a Government land / Prohibited land / Disputed land / Municipal land / Layout Open space / Water bodies / Earmarked Parks and playgrounds and the proposal is in confirmity with the master plan land use etc.,',
    'I/We shall be made liable for penal action as proposed under section 177 and 180 of Telangana Municipalities Act, 2019 if in case of misrepresentation or false declaration.',
    'I/We certify that the particulars furnished in the Application form are true, correct and complete to the best of my / our knowledge and undertake to adhere to the declarations made there under.'
  ];

  if (plot_area_sq_mtrs <= 63) {
    selfDeclarationText = [
      'I/We here by certify that we are the owners of the plot and that there is no other claimant or dispute pertaining to this plot.',
      'I/We here by certify that the extent/area of this plot is not more than <b>' +
        plot_area_sq_mtrs +
        ' Sq. Mts. ( ' +
        plot_area_sq_yards +
        ' Sq.Yards )</b>  and the plot is not part of bigger plot which has been split for this purpose.',
      'I/We here by undertake that I shall not construct more than <b>' +
        floorDisplayNameConstants[applicationData.no_of_floors] +
        '</b>. Any further construction beyond <b>' +
        floorDisplayNameConstants[applicationData.no_of_floors] +
        '</b> will have prior approvals failing which I/we will be liable for penality / demolision with out notice.',
      'I/We here by certify that I shall leave a front set-back of 5 feet from my plot boundry.',
      'I/We here by certify that my plot is abutting to the existing road width not less than 30 feet and if it is not available, I will maintain 15 feet distance from the center of the existing road in addition to front set-back.',
      'I / We here by certify that my proposed building is in confirmity with the master plan land use and zoning regulations.',
      'I / We here by undertake that the proposed site is not a Government land / Prohibited land / Disputed land / Municipal land / Layout Open space / Water bodies / Earmarked Parks and playgrounds and the proposal is in confirmity with the master plan land use etc.,',
      'I/We shall be made liable for penal action as per Telangana Municipalities Act, 2019 if in case of misrepresentation or false declaration.',
      'I/We certify that the particulars furnished in the Application form are true, correct and complete to the best of my / our knowledge and undertake to adhere to the declarations made there under.',
      'I/We Agree to include the registration fee of <b>ONE RUPEE</b> in my first property tax assessment.'
    ];
  } else if (plot_area_sq_mtrs > 63 && plot_area_sq_mtrs <= 200) {
    selfDeclarationText = [
      'I/We here by certify that we are the owners of the plot and that there is no other claimant or dispute pertaining to this plot.',
      'I/We here by certify that the extent/area of this plot is not more than  <b>' +
        plot_area_sq_mtrs +
        ' Sq. Mts. ( ' +
        plot_area_sq_yards +
        ' Sq.Yards )</b> and height of the proposed building is not more than 7mts (<b>' +
        floorDisplayNameConstants[applicationData.no_of_floors] +
        '</b>) and the plot is not part of bigger plot which has been split for this purpose.',
      'I/We here by undertake that I shall not construct more than <b>' +
        floorDisplayNameConstants[applicationData.no_of_floors] +
        '</b>  . Any further construction beyond <b>' +
        floorDisplayNameConstants[applicationData.no_of_floors] +
        '</b> will have prior approvals failing which I/we will be liable for penality / demolision with out notice.',
      'I/We here by certify that I shall construct the building leaving the mandatory set backs, road affected area and as per National Building Code under the supervision of qualified technical person.',
      'I/We here by certify that my plot is abutting to the existing road width not less than 30 feet and if it is not available, I will maintain 15 feet distance from the center of the existing road in addition to front set-back.',
      'I / We here by undertake that the proposed site is not a Government land / Prohibited land / Disputed land / Municipal land / Layout Open space / Water bodies / Earmarked Parks and playgrounds and the proposal is in confirmity with the master plan land use etc.,',
      'I/We shall be made liable for penal action ie., Penality, Revokation, Demolition with out notice as per Telangana Municipalities Act, 2019 if in case of misrepresentation or false declaration.',
      'I/We certify that I will construct the <b>1<b> rain water harvesting pit, and will plant <b>6</b> Trees with in the plot at appropriate location.',
      'I/We certify that the particulars furnished in the Application form are true, correct and complete to the best of my / our knowledge and undertake to adhere to the declarations made there under.'
    ];
  } else if (plot_area_sq_mtrs > 200 && plot_area_sq_mtrs <= 500) {
    selfDeclarationText = [
      'I/We here by certify that we are the owners of the plot and that there is no other claimant or dispute pertaining to this plot.',
      'I/We here by certify that the extent/area of this plot is not more than <b>' +
        plot_area_sq_mtrs +
        ' Sq. Mts. ( ' +
        plot_area_sq_yards +
        ' Sq.Yards )</b> and height of the proposed building is not more than 10mts (<b>' +
        floorDisplayNameConstants[applicationData.no_of_floors] +
        '</b>) and the plot is not part of bigger plot which has been split for this purpose.',
      'I/We here by undertake that I shall not construct more than  <b>' +
        applicationData.no_of_floors +
        '</b>. Any further construction beyond <b>' +
        floorDisplayNameConstants[applicationData.no_of_floors] +
        '</b> will have prior approvals failing which I/we will be liable for penality / demolision with out notice.',
      'I/We here by certify that I shall construct the building leaving the mandatory set backs, road affected area and as per National Building Code under the supervision of qualified technical person.',
      'I/We here by certify that my plot is abutting to the existing road width not less than 30 feet and if it is not available, I will maintain 15 feet distance from the center of the existing road in addition to front set-back.',
      'I / We here by undertake that the proposed site is not a Government land / Prohibited land / Disputed land / Municipal land / Layout Open space / Water bodies / Earmarked Parks and playgrounds and the proposal is in confirmity with the master plan land use etc.,',
      'I/We shall be made liable for penal action ie., Penality, Revokation, Demolition with out notice as per Telangana Municipalities Act, 2019 if in case of misrepresentation or false declaration.',
      'I/We certify that the particulars furnished in the Application form are true, correct and complete to the best of my / our knowledge and undertake to adhere to the declarations made there under.'
    ];
  } else if (plot_area_sq_mtrs > 500) {
    selfDeclarationText = [
      'I/We here by certify that we are the owners of the plot and that there is no other claimant or dispute pertaining to this plot.',
      'I/We here by undertake that I shall not construct more than <b>' +
        floorDisplayNameConstants[applicationData.no_of_floors] +
        '</b>. Any further construction beyond Ground + First Floor will have prior approvals failing which I/we will be liable for penality / demolision with out notice.',
      'I/We here by certify that I shall construct the building leaving the mandatory set backs, road affected area and as per National Building Code under the supervision of qualified technical person.',
      'I/We here by certify that my plot is abutting to the existing road width not less than 30 feet and if it is not available, I will maintain 15 feet distance from the center of the existing road in addition to front set-back.',
      'I / We here by undertake that the proposed site is not a Government land / Prohibited land / Disputed land / Municipal land / Layout Open space / Water bodies / Earmarked Parks and playgrounds and the proposal is in confirmity with the master plan land use etc.,',
      'I/We shall be made liable for penal action ie., Penality, Revokation, Demolition with out notice as per Telangana Municipalities Act, 2019 if in case of misrepresentation or false declaration.',
      'I/We certify that the particulars furnished in the Application form are true, correct and complete to the best of my / our knowledge and undertake to adhere to the declarations made there under.'
    ];
  }

  if (applicationData.front_setback > 0 || applicationData.other_setback > 0)
    selfDeclarationText.push(
      'I will leave the required set backs as applicable to my plot during my construction, as prescribed in the application section.'
    );

  if (applicationData.is_under_slum_area == 'true')
    selfDeclarationText.push(
      'I will forgo the plot land if required by the Government for the development of the slum area the plot falls in.'
    );
  return selfDeclarationText;
};

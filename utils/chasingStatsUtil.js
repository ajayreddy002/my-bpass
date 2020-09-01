export const getChasingStatsSummary = chasingStatsData => {
  return (chasingStatsData || []).reduce((result, data) => {
    const resultCopy = JSON.parse(JSON.stringify(result));
    const department = resultCopy[data["department"]];
    if (department) {
      department.totalGreenCount += data.green_count || 0;
      department.totalOrangeCount += data.orange_count || 0;
      department.totalRedCount += data.red_count || 0;
      department.totalApplicationsCount += data.total_count || 0;
      department.totalUserActions += data.total_user_actions || 0;
    } else {
      let obj = {};
      obj.totalGreenCount = data.green_count || 0;
      obj.totalOrangeCount = data.orange_count || 0;
      obj.totalRedCount = data.red_count || 0;
      obj.totalApplicationsCount = data.total_count || 0;
      obj.totalUserActions = data.total_user_actions || 0;
      resultCopy[data["department"]] = { ...obj };
    }

    return resultCopy;
  }, {});
};

export const getCategoryWisePerformanceReportData = performanceData => {
  return (performanceData || []).reduce(
    (result, data) => {
      const resultCopy = { ...result };

      const { officerWiseReport } = resultCopy;
      const officerReport = officerWiseReport[data["assigned_to_user_id"]];
      officerWiseReport[data["assigned_to_user_id"]] = {
        ...addOrUpdateObject(officerReport, data)
      };
      resultCopy.officerWiseReport = { ...officerWiseReport };

      const { departmentWiseReport } = resultCopy;
      const departmentReport = departmentWiseReport[data["assigned_to"]];
      departmentWiseReport[data["assigned_to"]] = {
        ...addOrUpdateObject(departmentReport, data)
      };
      resultCopy.departmentWiseReport = { ...departmentWiseReport };

      const { districtWiseReport } = resultCopy;
      const districtReport = districtWiseReport[data["district"]];
      districtWiseReport[data["district"]] = {
        ...addOrUpdateObject(districtReport, data)
      };
      resultCopy.districtWiseReport = { ...districtWiseReport };

      const { ulbWiseReport } = resultCopy;
      const ulbReport = ulbWiseReport[data["ulb_name"]];
      ulbWiseReport[data["ulb_name"]] = {
        ...addOrUpdateObject(ulbReport, data)
      };
      resultCopy.ulbWiseReport = { ...ulbWiseReport };

      return resultCopy;
    },
    {
      officerWiseReport: {},
      departmentWiseReport: {},
      districtWiseReport: {},
      ulbWiseReport: {}
    }
  );
};

export const addOrUpdateObject = (reportObject, data) => {
  if (reportObject) {
    const reportObjectCopy = { ...reportObject };
    reportObject.totalFilesProcessed += parseInt(data["Issued_Count"]) || 0;
    reportObject.flaggedFilesCount += parseInt(data["Flagged_Count"]) || 0;
    reportObject.deemedCount += parseInt(data["Deemed Approved_Count"]) || 0;
    reportObject.penalties += parseFloat(data["Penalties(Rs)"]) || 0;
    reportObject.currentPendingFiles +=
      parseInt(data["UnderProcess_Count"]) || 0;
    reportObject.greenCount += parseInt(data["green_count"]) || 0;
    reportObject.orangeCount += parseInt(data["orange_count"]) || 0;
    reportObject.redCount += parseInt(data["red_count"]) || 0;
    reportObject.maxDays += parseInt(data["max_days"]) || 0;
    reportObject.minDays += parseInt(data["min_days"]) || 0;
    reportObject.avgDays += parseInt(data["avg_days"]) || 0;
    return reportObjectCopy;
  } else {
    const obj = {};
    obj.totalFilesProcessed = parseInt(data["Issued_Count"]) || 0;
    obj.flaggedFilesCount = parseInt(data["Flagged_Count"]) || 0;
    obj.deemedCount = parseInt(data["Deemed Approved_Count"]) || 0;
    obj.penalties = parseFloat(data["Penalties(Rs)"]) || 0;
    obj.currentPendingFiles = parseInt(data["UnderProcess_Count"]) || 0;
    obj.greenCount = parseInt(data["green_count"]) || 0;
    obj.orangeCount = parseInt(data["orange_count"]) || 0;
    obj.redCount = parseInt(data["red_count"]) || 0;
    obj.maxDays = parseInt(data["max_days"]) || 0;
    obj.minDays = parseInt(data["min_days"]) || 0;
    obj.avgDays = parseInt(data["avg_days"]) || 0;
    return obj;
  }
};

export const getTableTitle = typeOfReport => {
  const titles = {
    officerWiseReport: "Officer Wise Performance Report",
    departmentWiseReport: "Line Department Wise Performance Report",
    districtWiseReport: "Distict Wise Performance Report",
    ulbWiseReport: "ULB Wise Performance Report"
  };

  return titles[typeOfReport] || "";
};

export const getColumnName = typeOfReport => {
  const columnNames = {
    officerWiseReport: "Officer Name",
    departmentWiseReport: "Line Department Name",
    districtWiseReport: "District Name",
    ulbWiseReport: "ULB Name"
  };

  return columnNames[typeOfReport] || "Name";
};

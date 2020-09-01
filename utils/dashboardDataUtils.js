export const getSummaryData = (dashboardData, approval_for) => {
  const filteredDashboardData = (dashboardData || []).filter(
    dataObj => dataObj.approval_for === approval_for
  );

  return filteredDashboardData.reduce(
    (summaryData, data) => {
      summaryData.totalAppliedCount += data["Applied_Count"] || 0;
      summaryData.totalIssuedCount += data["Issued_Count"];
      summaryData.totalDeemedApprovedCount += data["Deemed Approved_Count"];

      return summaryData;
    },
    { totalAppliedCount: 0, totalIssuedCount: 0, totalDeemedApprovedCount: 0 }
  );
};

export const getLeaderBoardData = (dashboardData, category, status) => {
  const dashboardDataCopy = [...dashboardData];

  return dashboardDataCopy.reduce((leaderBoardData, data) => {
    if (leaderBoardData[data[category]]) {
      leaderBoardData[data[category]].totalFilesCount +=
        data.Applied_Count || 0;
      leaderBoardData[data[category]].Revenue += parseFloat(data.Revenue) || 0;
    } else {
      leaderBoardData[data[category]] = {};
      leaderBoardData[data[category]].totalFilesCount = data.Applied_Count || 0;
      leaderBoardData[data[category]].Revenue = parseFloat(data.Revenue) || 0;
    }
    let approvalForObj = leaderBoardData[data[category]][data["approval_for"]];
    if (approvalForObj) {
      approvalForObj.Applied_Count += data.Applied_Count || 0;
      approvalForObj.Issued_Count += data.Issued_Count || 0;
      approvalForObj["Deemed Approved_Count"] +=
        data["Deemed Approved_Count"] || 0;
      approvalForObj.Rejected_Count += data.Rejected_Count || 0;
      approvalForObj.Revoked_Count += data.Revoked_Count || 0;
      approvalForObj.UnderProcess_Count += data.UnderProcess_Count || 0;
    } else {
      let obj = {};
      obj.Applied_Count = {};
      obj.Applied_Count = data.Applied_Count || 0;
      obj.Issued_Count = data.Issued_Count || 0;
      obj["Deemed Approved_Count"] = data["Deemed Approved_Count"] || 0;
      obj.Rejected_Count = data.Rejected_Count || 0;
      obj.Revoked_Count = data.Revoked_Count || 0;
      obj.UnderProcess_Count = data.UnderProcess_Count || 0;
      leaderBoardData[data[category]][data["approval_for"]] = { ...obj };
    }

    return leaderBoardData;
  }, {});
};

export const getDropdownListItems = () => [
  {
    id: "village",
    name: "Village"
  },
  {
    id: "district_administration_area",
    name: "Authority"
  },
  {
    id: "ulb_name",
    name: "ULB"
  },
  {
    id: "mandal",
    name: "Mandal"
  }
];

export const getStatusListItems = () => [
  {
    id: "Issued_Count",
    name: "Issued"
  },
  {
    id: "Applied_Count",
    name: "Applied"
  },
  {
    id: "UnderProcess_Count",
    name: "Under Process"
  },
  {
    id: "Revoked_Count",
    name: "Revoke"
  },
  {
    id: "Rejected_Count",
    name: "Reject"
  }
];

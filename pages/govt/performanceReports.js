import React, { Component, Fragment } from "react";
import {
  getCategoryWisePerformanceReportData,
  getTableTitle
} from "../../utils/performanceReportsUtil";
import { Container } from "react-bootstrap";
import PerformanceReportTable from "../../components/performanceReports/PerformanceReportTable";
import "./performanceReports.css";
import apiConstants from "../../constants/apiConstants";
import { getURL } from "../../utils/urlUtils";

class PerformanceReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      performanceData: [],
      processedPerformanceData: {}
    };
  }

  componentDidMount = async () => {
    // let url = new URL("http://localhost:3000/api/reporting/performance_stats");
    let url = getURL(apiConstants.GET_PERFORMANCE_STATS.USECASE);
    let res = await fetch(url.toString());
    if (res && res.status === 200) {
      res = await res.json();
      const processedPerformanceData = getCategoryWisePerformanceReportData(
        res
      );
      this.setState(() => ({
        performanceData: res,
        processedPerformanceData
      }));
    }
  };

  render() {
    const { processedPerformanceData } = this.state;
    const performanceKeys = Object.keys(processedPerformanceData);
    console.log(processedPerformanceData);
    return (
      <Container>
        {performanceKeys.map(key => (
          <Fragment key={key}>
            <h4 className="performance-table-title">{getTableTitle(key)}</h4>
            <PerformanceReportTable
              typeOfReport={key}
              performanceData={processedPerformanceData[key]}
            />
          </Fragment>
        ))}
      </Container>
    );
  }
}

export default PerformanceReports;

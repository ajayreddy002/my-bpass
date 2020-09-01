import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import fetch from "isomorphic-unfetch";

import SummaryCard from "../../components/reports/SummaryCard";
import LeaderBoardContainer from "../../components/reports/LeaderBoardContainer";
import { getSummaryData } from "../../utils/dashboardDataUtils";
import "./reports.css";

const Reports = () => {
  const [roleStatsData, setRoleStatsData] = useState([]);

  const getLeaderBoardDataFromServer = async () => {
    const res = await fetch(
      new URL("http://localhost:3000/api/reporting/role_stats").toString()
    );
    const json = await res.json();
    setRoleStatsData(json);
  };

  useEffect(() => {
    getLeaderBoardDataFromServer();
  }, []);

  const buildingSummaryData = getSummaryData(roleStatsData, "BUILDING");
  const layoutSummaryData = getSummaryData(roleStatsData, "LAYOUT");
  const occupancySummaryData = getSummaryData(roleStatsData, "OCCUPANCY");
  const enforcementSummaryData = getSummaryData(roleStatsData, "ENFORCEMENT");

  return (
    <Container>
      <h4>Executive Dashboard</h4>
      <Row>
        <Col>
          <SummaryCard
            cardTitle="Building Permissions (Efficeincy %)"
            summary={buildingSummaryData}
          />
        </Col>
        <Col>
          <SummaryCard
            cardTitle="Layout Approvals (Efficeincy %)"
            summary={layoutSummaryData}
          />
        </Col>
        <Col>
          <SummaryCard
            cardTitle="Occupancy Certificates (Efficeincy %)"
            summary={occupancySummaryData}
          />
        </Col>
        <Col>
          <SummaryCard
            cardTitle="Enforcements (Efficeincy %)"
            summary={enforcementSummaryData}
          />
        </Col>
      </Row>
      <LeaderBoardContainer roleStatsData={roleStatsData} />
    </Container>
  );
};

export default Reports;

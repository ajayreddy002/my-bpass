import React, { Component } from "react";
import fetch from "isomorphic-unfetch";
import { Row, Col, Container } from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";

import { getChasingStatsSummary } from "../../utils/chasingStatsUtil";
import ChasingStatCard from "../../components/chasingStats/ChasingStatCard";
import "./chasingStats.css";
import colorConstants from "../../constants/colorConstants";
import apiConstants from "../../constants/apiConstants";
import { getURL } from "../../utils/urlUtils";

class ChasingStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      chasingStats: [],
      processedChasingStats: {}
    };
  }

  // static getInitialProps = async ctx => {
  //   let url = new URL("http://localhost:3000/api/reporting/chasing_stats");
  //   let res = await fetch(url.toString());
  //   if (res && res.status === 200) {
  //     res = await res.json();
  //     return {
  //       chasingStats: res
  //     };
  //   }
  //   return {
  //     chasingStats: []
  //   };
  // };

  componentDidMount = async () => {
    // let url = new URL("http://localhost:3000/api/reporting/chasing_stats");
    let url = getURL(apiConstants.GET_CHASING_STATS.USECASE);
    let res = await fetch(url.toString());
    if (res && res.status === 200) {
      res = await res.json();
      const processedChasingStats = getChasingStatsSummary(res);
      this.setState(() => ({
        isLoading: false,
        chasingStats: res,
        processedChasingStats
      }));
    }
  };

  render() {
    const { processedChasingStats, isLoading } = this.state;
    const departments = Object.keys(processedChasingStats);
    return (
      <Container>
        <LoadingOverlay
          active={isLoading}
          spinner
          text={"Loading..."}
          styles={{
            overlay: base => ({
              ...base,
              background: colorConstants.overlayBackground
            })
          }}
        >
          <h4>Executive Dashboard : Chasing Cell</h4>
          <Row lg={4} sm={3}>
            {departments.map(department => (
              <Col key={department} style={{ marginTop: "15px" }}>
                <ChasingStatCard
                  department={department}
                  chasingStatData={processedChasingStats[department]}
                />
              </Col>
            ))}
          </Row>
        </LoadingOverlay>
      </Container>
    );
  }
}

export default ChasingStats;

import React from "react";
import { Card, CardBody, CardHeader, CardFooter } from "shards-react";
import { Row, Col, Container } from "react-bootstrap";

import "./SummaryCard.css";

const SummaryCard = props => {
  return (
    <Card className="summary-card">
      <CardHeader>{props.cardTitle}</CardHeader>
      <CardBody>
        <Container>
          <Row>
            <Col>Applied</Col>
            <Col>{props.summary.totalAppliedCount || 0}</Col>
          </Row>
          <Row>
            <Col>Issued</Col>
            <Col>{props.summary.totalIssuedCount || 0}</Col>
          </Row>
        </Container>
      </CardBody>
      <CardFooter>
        <Container>
          <Row>
            <Col>Deemed</Col>
            <Col>{props.summary.totalDeemedApprovedCount || 0}</Col>
          </Row>
        </Container>
      </CardFooter>
    </Card>
  );
};

export default SummaryCard;

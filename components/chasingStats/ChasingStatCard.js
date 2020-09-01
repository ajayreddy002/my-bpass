import React from "react";
import { Card, CardBody, CardHeader, CardFooter } from "shards-react";
import { Row, Col, Container } from "react-bootstrap";

const ChasingStatCard = props => {
  return (
    <Card className="summary-card chasing-stat-card">
      <CardHeader>{props.department}</CardHeader>
      <CardBody>
        <Container>
          <Row>
            <Col>Green</Col>
            <Col>{props.chasingStatData.totalGreenCount || 0}</Col>
          </Row>
          <Row>
            <Col>Orange</Col>
            <Col>{props.chasingStatData.totalOrangeCount || 0}</Col>
          </Row>
          <Row>
            <Col>Red</Col>
            <Col>{props.chasingStatData.totalRedCount || 0}</Col>
          </Row>
        </Container>
      </CardBody>
      <CardFooter>
        <Container>
          <Row>
            <Col>Total Applications</Col>
            <Col>{props.chasingStatData.totalApplicationsCount || 0}</Col>
          </Row>
          <Row>
            <Col>Total Users Actions</Col>
            <Col>{props.chasingStatData.totalUserActions || 0}</Col>
          </Row>
        </Container>
      </CardFooter>
    </Card>
  );
};

export default ChasingStatCard;

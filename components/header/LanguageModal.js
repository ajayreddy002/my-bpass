import React, { useState } from 'react';
import Link from 'next/link';
import { Modal, Button, Col } from 'react-bootstrap';

const LanguageModal = (props) => {

  const AnyReactComponent = ({ text }) => <div>{text}</div>;

  return (
    <Modal
      className="language-modal"
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Choose your language
                </Modal.Title>
      </Modal.Header>
      <Modal.Body className="row text-center">
        <Col col={4}><Button> English </Button></Col>
        <Col col={4}><Button> తెలుగు </Button></Col>
        <Col col={4}><Button> اردو </Button></Col>

      </Modal.Body>


    </Modal>
  )
}


export default LanguageModal;
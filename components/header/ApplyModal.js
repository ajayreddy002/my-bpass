import React, { useState } from 'react';
import Link from 'next/link';
import { Modal } from 'react-bootstrap';

const ApplyModal = (props) => {

  const AnyReactComponent = ({ text }) => <div>{text}</div>;

  return (
    <Modal
      className="apply-modal"
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className="apply-modal-content">
          <ul>
            <li><Link href="/!"><a>Building Permissions</a></Link></li>
            <li><Link href="/!"><a>Layout Permissions</a></Link></li>
            <li><Link href="/!"><a>Occupancy Certificate</a></Link></li>
            <li><Link href="/!"><a> Enforcement</a></Link></li>
            <li><Link href="/!"><a>Land use Certificates </a></Link></li>
            <li><Link href="/!"><a>Change of Land use</a></Link></li>
          </ul>
        </div>
      </Modal.Body>

    </Modal>
  )
}


export default ApplyModal;
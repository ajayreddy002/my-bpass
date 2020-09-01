import { Button, Col, Row } from 'shards-react';
import { Nav, Navbar } from 'react-bootstrap';
import React, { Component, Fragment, PureComponent } from 'react';

import Clock from 'react-live-clock';
import { Router } from '../routes';
import cookie from 'react-cookies';
import jwt from 'jsonwebtoken';

const ALLOWED_PP_USERS = [
  'TECHNICAL_SCRUTINY_OFFICER',
  'TITLE_INSPECTOR',
  'SITE_INSPECTOR'
];

class AdminSubHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      role: null,
      hasSingleRole: false,
      resourceType: null,
      resource: null,
      showPostProcessing: false
    };
  }

  componentDidMount() {
    const accessToken = cookie.load('access_token');
    const userObject = jwt.decode(accessToken);
    if (userObject) {
      const entitlements = userObject.entitlements;
      if (entitlements && entitlements.length > 0) {
        this.setState({
          role: entitlements[0].role,
          hasSingleRole: entitlements.length === 1,
          resourceType: entitlements[0].resource_type,
          resource: entitlements[0].entitlement_resource,
          showPostProcessing:
            ALLOWED_PP_USERS.indexOf(entitlements[0].role) > -1
        });
      }
      this.setState({ username: userObject && userObject.first_name });
    }
  }

  renderPostProcessing = () => {
    if (this.props.isSingleWindow)
      Router.pushRoute('admin-list', {
        type: 'pp'
      });
    else Router.pushRoute('admin-list');
    return;
  };

  render() {
    const {
      username,
      role,
      showPostProcessing,
      resource,
      resourceType,
      hasSingleRole
    } = this.state;
    return (
      <Fragment>
        <Navbar style={{ background: '#1d9a5b' }}>
          <Navbar.Brand style={{ padding: 0, fontWeight: 100 }}>
            {username && (
              <p
                style={{
                  marginBottom: 0,
                  color: 'white',
                  marginRight: 10
                }}
              >
                Logged in as : {username}
                {role && `  [${role}]`}
              </p>
            )}
          </Navbar.Brand>

          <Nav className='mr-auto'>
            {hasSingleRole && (
              <Navbar.Text
                style={{ color: 'white', padding: 0, marginRight: 10 }}
              >
                {resourceType + ' : ' + resource}
              </Navbar.Text>
            )}
            <Navbar.Text style={{ padding: 0, marginRight: 10 }}>
              <Clock
                format={'ll hh:mm:ss a'}
                ticking={true}
                timezone={'Asia/Kolkata'}
                style={{ color: 'white' }}
              />
            </Navbar.Text>
          </Nav>
          {!this.props.hideChangePassword && (
            <Navbar.Collapse className='justify-content-end'>
              <Nav.Link
                style={{ color: 'white', padding: 0 }}
                href='/govt/changePassword'
              >
                Change Password
              </Nav.Link>
            </Navbar.Collapse>
          )}
        </Navbar>
      </Fragment>
    );
  }
}

export default AdminSubHeader;

import { Col, Modal, ModalBody, ModalHeader, Row } from 'shards-react';
import {
  MdClose,
  MdGTranslate,
  MdMenu,
  MdPeople,
  MdPhone
} from 'react-icons/md';
import {
  getLocalizationBundleForLanguage,
  getTranslatedText
} from '../../utils/translationUtils';

import { LocalizationProvider } from 'react-localize/lib/react-localize';
import React from 'react';
import { Router } from '../../routes';
import moment from 'moment';
import { withRouter } from 'next/router';

class Header extends React.Component {
  constructor (props) {
    super(props);
    this.state = this.getInitialState();
    this.interval = null;
  }

  getInitialState = () => ({
    modal: false,
    langModal: false,
    date: '',
    toggleMobile: false
  });

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ date: moment(new Date()).format('ll h:mm a') });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  onSelect = lang => {
    this.setState(this.getInitialState(), () => {
      Router.replaceRoute(this.props.route, {
        ...this.props.params,
        language: lang
      });
    });
  };

  toggleAppModal = () => this.setState({ modal: !this.state.modal });

  toggleLangModal = () => this.setState({ langModal: !this.state.langModal });

  renderMenuList = isMobile => {
    const {
      params: { language = 'en' } = {},
      router: { pathname },
      meseva_request
    } = this.props;
    const applyBtn = pathname === '/self-certification-application/application',
      searchBtn = pathname === '/citizen-search/citizenSearch',
      admin = pathname.indexOf('/govt/') !== -1;
    return (
      <ul
        className={
          isMobile
            ? 'site-nav-wrap'
            : 'site-menu main-menu js-clone-nav ml-auto d-none d-lg-block'
        }
      >
        <li style={{ order: 2 }}>
          <a
            className='header-link nav-link'
            href={`/html/${language}/index.html`}
          >
            {getTranslatedText('header.home')}
          </a>
        </li>
        <li style={{ order: 3 }}>
          <a
            className='header-link nav-link'
            href={`/html/${language}/index.html#about-section`}
          >
            {getTranslatedText('header.act')}
          </a>
        </li>
        <li style={{ order: 4 }}>
          <a
            className='header-link nav-link'
            href={`/html/faq/${language}/index.html`}
          >
            {getTranslatedText('header.faq')}
          </a>
        </li>
        <li style={{ order: 5 }}>
          <a
            className='header-link nav-link'
            href='http://dcrportal.telangana.gov.in'
          >
            {getTranslatedText('header.autoDCR')}
          </a>
        </li>
        <li style={{ order: 6 }}>
          <a
            href={`/html/${language}/index.html#contact-section`}
            className='header-link nav-link'
          >
            {getTranslatedText('header.contact')}
          </a>
        </li>
        {!searchBtn ? (
          <li style={{ order: 6 }}>
            <a
              className='header-link nav-link'
              href={`/${language}/citizen-search`}
            >
              {getTranslatedText('header.search')}
            </a>
          </li>
        ) : null}
        {!applyBtn && !admin ? (
          <a
            className='btn btn-primary text-white px-4'
            onClick={this.toggleAppModal}
            style={{
              order: 7,
              cursor: 'pointer',
              fontWeight: '400',
              fontSize: '.875rem',
              lineHeight: '1.125'
            }}
          >
            {getTranslatedText('header.apply')}
          </a>
        ) : null}
        {admin && pathname != '/govt/adminLogin' ? (
          <li style={{ order: 8 }}>
            <a
              className='header-link nav-link'
              href={`/govt/logout`}
              style={{ cursor: 'pointer' }}
            >
              {getTranslatedText('header.logout')}
            </a>
          </li>
        ) : null}
        <li style={{ order: 1 }}>
          <a onClick={this.toggleLangModal}>
            <MdGTranslate className='icon-font text-1d9a5b' fontSize={28} />
          </a>
        </li>
      </ul>
    );
  };

  render() {
    const {
      params: { language = 'en' } = {},
      router: { pathname },
      meseva_request
    } = this.props;

    const applyBtn = pathname === '/self-certification-application/application',
      searchBtn = pathname === '/citizen-search/citizenSearch',
      admin = pathname.indexOf('/govt/') !== -1;

    return this.renderHeader(admin);
  }

  renderHeader = isAdmin => {
    const {
      params: { language = 'en' } = {},
      router: { pathname },
      meseva_request
    } = this.props;
    return (
      <div className={this.state.toggleMobile ? 'offcanvas-menu' : 'sticky'}>
        <Modal
          centered
          open={this.state.modal}
          toggle={this.toggleAppModal}
          className='col-12'
        >
          <ModalHeader>Apply For</ModalHeader>
          <ModalBody className='row text-center'>
            <div className='col-6'>
              <a
                href={`/${language}/self-certification/application`}
                className='btn btn-primary px-3 py-3 mr-1'
                style={{ fontWeight: '400' }}
              >
                {getTranslatedText('header.building')}
              </a>
            </div>
            <div className='col-6'>
              <a
                href={`/${language}/self-certification/layout`}
                className='btn btn-primary px-3 py-3'
                style={{ fontWeight: '400' }}
              >
                {getTranslatedText('header.layout')}
              </a>
            </div>
          </ModalBody>
        </Modal>
        <Modal
          centered
          open={this.state.langModal}
          toggle={this.toggleLangModal}
          className='col-12'
        >
          <ModalHeader>Choose Your Language</ModalHeader>
          <ModalBody className='row text-center'>
            <div className='col-4'>
              <div
                onClick={this.onSelect.bind(this, 'en')}
                className='btn btn-primary px-4 py-2'
                style={{ fontWeight: '400' }}
              >
                English
              </div>
            </div>
            <div className='col-4'>
              <div
                onClick={this.onSelect.bind(this, 'te')}
                className='btn btn-primary px-4 py-2'
                style={{ fontWeight: '400' }}
              >
                తెలుగు
              </div>
            </div>
            <div className='col-4'>
              <div
                onClick={this.onSelect.bind(this, 'ur')}
                className='btn btn-primary px-4 py-2'
                style={{ fontWeight: '400' }}
              >
                اردو
              </div>
            </div>
          </ModalBody>
        </Modal>
        {this.state.toggleMobile ? <div className='site-wrap' id='home-section'>
          <div className='site-mobile-menu site-navbar-target'>
            <div className='site-mobile-menu-header'>
              <div className='site-mobile-menu-close mt-3'>
                <span
                  className={'js-menu-toggle active'}
                  onClick={() => this.setState({ toggleMobile: false })}
                >
                  <MdClose />
                </span>
              </div>
            </div>
            <div className='site-mobile-menu-body'>
              {this.renderMenuList(true)}
            </div>
          </div>
        </div> : null}
        <header
          className='site-navbar js-sticky-header site-navbar-target'
          id='header-tsbpass'
        >
          <div className='container-fluid'>
            <Row className='align-items-center position-relative'>
              <div className='site-logo'>
                <a style={{ textDecoration: 'none' }}>
                  <img
                    src='/html/images/logo.png'
                    className='img img-fluid'
                    id='tsbpass-logo'
                  />
                  <span className='ml-2 text-1d9a5b' style={language === 'te' ? { fontSize: '24px' } : {}}>
                    {getTranslatedText('header.tsbpass')}
                  </span>
                </a>
                <p id='date'>{this.state.date}</p>
              </div>
              <Col xs='12'>
                <nav
                  type='dark'
                  theme='light'
                  className='site-navigation text-right ml-auto'
                >
                  {this.renderMenuList()}
                </nav>
              </Col>
              <div
                className='toggle-button d-inline-block d-lg-none'
                style={{ zIndex: 10 }}
              >
                <a
                  href='#'
                  className='site-menu-toggle js-menu-toggle text-black'
                  onClick={() => this.setState({ toggleMobile: true })}
                >
                  <span>
                    <MdMenu fontSize={28} />
                  </span>
                </a>
              </div>
              <div className='row support' style={{ fontSize: '1rem' }}>
                <div>
                  <span>
                    <MdPhone />
                  </span>
                  <span className='mr-2'>
                    <a href='tel:040-23314622' className='text-black'>
                      040-2331 4622
                    </a>
                  </span>
                  <span>
                    <MdPeople />
                  </span>
                  <span className='mr-2'>
                    <a
                      className='text-1d9a5b'
                      href='http://tsbpass.com/support'
                    >
                      {getTranslatedText('header.support')}
                    </a>
                  </span>
                </div>
              </div>
            </Row>
          </div>
        </header>
        {!isAdmin && (
          <div className='sub-header'>
            <div className='announcement'>
              <div>{getTranslatedText('header.announcement')}</div>
              <marquee direction='left'>
                Telangana State Building Permission Approval and Self
                Certification System
              </marquee>
            </div>
          </div>
        )}
      </div>
    );
  };
}

export default withRouter(Header);

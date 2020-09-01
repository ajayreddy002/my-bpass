
import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import '../styles/index.css';
import '../styles/timeline.css';

import App, { Container } from 'next/app';

import { Provider } from 'mobx-react';
import React from 'react';
import Head from "next/head";
import initializeStore from '../dataStore';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { LocalizationProvider } from 'react-localize';
import { getTranslatedText } from '../utils/translationUtils';
import { getLocalizationBundleForLanguage } from '../utils/translationUtils';

import ApplicationProvider from '../context/application-provider';

class CustomApp extends App {
  // static async getInitialProps(appContext) {
  //   const mobxStore = initializeStore();
  //   appContext.ctx.mobxStore = mobxStore;
  //   const appProps = await App.getInitialProps(appContext);
  //   return {
  //     ...appProps,
  //     initialMobxState: mobxStore
  //   };
  // }

  constructor (props) {
    super(props);
    const isServer = typeof window === 'undefined';
    this.mobxStore = isServer
      ? props.initialMobxState
      : initializeStore(props.initialMobxState);
  }

  render() {
    const { Component, pageProps } = this.props;
    const localizationProvider = getLocalizationBundleForLanguage('en');

    return (
      <React.Fragment>
        
      <LocalizationProvider messages={localizationProvider}>
        <Head>
          <title>TS-bPASS</title>
        </Head>
        <Provider {...this.mobxStore}>
          <ApplicationProvider>
            <Component {...pageProps} />
          </ApplicationProvider>
        </Provider>
        </LocalizationProvider>
        <ToastContainer />
      </React.Fragment>
    );
  }
}

export default CustomApp;

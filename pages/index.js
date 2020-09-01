import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import '../styles/index.css';

import React from 'react';
import Router from 'next/router';

class Home extends React.Component {
  componentDidMount() {
    Router.push('/html/en/index.html');
  }

  render() {
    return null;
  }
}

export default Home;

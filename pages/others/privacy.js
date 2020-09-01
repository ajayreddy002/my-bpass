

import React from 'react';
import Router from 'next/router';

import MainHeader from '../../containers/header'
import MainFooter from '../../containers/footer'

class Home extends React.Component {
  componentDidMount() {
    // Router.push('/html/en/index.html');
  }

  render() {
    return (
        <>
          <MainHeader />
          <div class="block__73694 border-top" id="why-us-section">
                <div class='salient-features'>
                    <div class="container">
                        <div class="row d-flex no-gutters salient-features-inner">
                            <h2 class="col-12 text-center">Privacy Policy</h2>
                            <p class='why-us-section-description' style={{ textAlign :`justify`}}>
                                The Telangana Government has enacted the “Telangana
                                Municipalities Act, 2019” (Act No.11 of 2019) to consolidate and
                                provide for the constitution of Municipalities (Municipal
                                Councils and Municipal Corporations) other than the Greater
                                Hyderabad Municipal Corporation in the State of Telangana in
                                terms of Part IX-A of the constitution of India and for matters
                                connected therewith or incidental thereto.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          <MainFooter /> 
        </>
      )
  }
}

export default Home;

import React from 'react';
const backimg = `url('/html/images/welcomebanner/bg.png')`;

function WelComebanner(props) {
   return (
      <section className="welcomebanner-wrapper" style={{ backgroundImage: backimg }}>
         <div className="welcomebanner-content">
            <div className="main-title-wrapper">
               <h3>Welcome to TS-bPASS</h3>
               <p>Department of Municipal Administration and Urban Development</p>
            </div>
            <div className="welcomebanner-dec">
               <p>
                  Government of Telangana has enacted new Municipalities Act “Telangana Municipalities Act 2019” to improve compliance
                  with laws by citizens, increase accountability among officials, eliminate corrupt practices with an overall aim of
                  delivering effective services to people living in urban areas of the State by consolidating and providing for the
                  constitution of Municipalities in accordance with part IX-A of the Indian Constitution. This act also undertakes random
                  audits and any citizen or official deviating from the rules will be penalized.
              </p>
               <p>
                  The Telangana Government in tune with the Telangana
                  Municipalities Act, 2019 and in order to have speedy processing
                  of applications for issue of various clearances required for
                  development of land through layouts and buildings, a single
                  point based on the self-certificate provided by the land owner /
                  developer and also to create user friendly environment TS-bPASS
                  has been developed.
                 </p>
            </div>
         </div>
      </section>
   )
}
export default WelComebanner;
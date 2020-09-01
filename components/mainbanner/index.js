import React from 'react';
import { Carousel, Button } from 'react-bootstrap';
import { DubbleAngle } from '../../utils/icons';

function MainBanner(props) {
   return (
      <div className="mainbanner-wrapper">
         <Carousel>
            <Carousel.Item>
               <div className="mainbanner-content-img">
                  <div className="mainbanner-content">
                     <div className="mainbanner-dec">
                        <div className="dec-number">
                           <p>Step <span>1</span> / 3</p>
                        </div>
                        <h3>TS-bPASS</h3>
                        <p>Telangana State Building Permission Approval and Self certification  System</p>
                        <p>Registration for plot size up to 75 square yards (63 square meters), and the construction of ground or ground plus one floor (Residential) that are exempted from obtaining Building Plan Approval.</p>

                        <Button>Apply Now <svg dangerouslySetInnerHTML={{ __html: DubbleAngle }} /></Button>
                     </div>
                  </div>
                  <div className="mainbanner-image">
                     <img src="html/images/mainbanner/banner.png" className="image1" alt="" />
                  </div>
               </div>
            </Carousel.Item>
            <Carousel.Item>
               <div className="mainbanner-content-img">
                  <div className="mainbanner-content">
                     <div className="mainbanner-dec">
                        <div className="dec-number">
                           <p>Step <span>2</span> / 3</p>
                        </div>
                        <h3>TS-bPASS</h3>
                        <p>Telangana State Building Permission Approval and Self certification  System</p>
                        <p>Instant online building plan approval for plot size up to 500 square meters and height up to 10 meters (Residential).</p>
                        <Button>Apply Now <svg dangerouslySetInnerHTML={{ __html: DubbleAngle }} /></Button>
                     </div>
                  </div>
                  <div className="mainbanner-image">
                     <img src="html/images/mainbanner/banner.png" className="image1" alt="" />
                  </div>
               </div>
            </Carousel.Item>
            <Carousel.Item>
               <div className="mainbanner-content-img">
                  <div className="mainbanner-content">
                     <div className="mainbanner-dec">
                        <div className="dec-number">
                           <p>Step <span>3</span> / 3</p>
                        </div>
                        <h3>TS-bPASS</h3>
                        <p>Telangana State Building Permission Approval and Self certification  System</p>
                        <p>Single window building plan approval for plot size above 500 square meters and height above 10 meters (Residential & Non-Residential)</p>
                        <Button>Apply Now <svg dangerouslySetInnerHTML={{ __html: DubbleAngle }} /></Button>
                     </div>
                  </div>
                  <div className="mainbanner-image">
                     <img src="html/images/mainbanner/banner.png" className="image1" alt="" />
                  </div>
               </div>
            </Carousel.Item>
         </Carousel>
      </div>
   )
}
export default MainBanner;
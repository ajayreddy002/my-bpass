import React from 'react';
import Link from 'next/link';
import { Table, Col, Row } from 'react-bootstrap';
import Header1 from '../components/header/Header1';
import Footer from '../components/footer';
import '../styles/front.css';


function Content(props) {
   return (
      <div className="main-wrapper">
         <Header1 />
         <div className="second-main-wrapper">
            <section className="terms-of-service-wrapper">
               <div className="teams-services-content">
                  <h3>Terms of Service</h3>
                  <h4>Last Updated: January 21st, 2011</h4>
                  <p>By using this website (the “Site”), you agree to be bound by these Terms of Service and to use the Site in accordance with these Terms of Service, our Privacy Notice, and any additional terms and conditions that are referenced herein or that otherwise may apply to specific sections of the Site, or to products and services that we make available to you through the Site (all of which are deemed part of these Terms of Service). Accessing the Site, in any manner, whether automated or otherwise, constitutes use of the Site and your agreement to be bound by these Terms of Service.  </p>
                  <p>We reserve the right to change these Terms of Service or to impose new conditions on use of the Site, from time to time, in which case we will post the revised Terms of Service on this website and update the “Last Updated” date to reflect the date of the changes. By continuing to use the Site after we post any such changes, you accept the Terms of Service, as modified.</p>
                  <p>We also reserve the right to deny access to the Site or any features of the Site to anyone who violates these Terms of Service or who, in our sole judgment, interferes with the ability of others to enjoy our website or infringes the rights of others.</p>
                  <h5>Rights and Restrictions Relating to Site Content</h5>
                  <p>Your Limited Right to Use Site Materials. This Site and all the materials available on the Site are the property of us and/or our affiliates or licensors, and are protected by copyright, trademark, and other intellectual property laws. The Site is provided solely for your personal noncommercial use. You may not use the Site or the materials available on the Site in a manner that constitutes an infringement of our rights or that has not been authorized by us. More specifically, unless explicitly authorized in these Terms of Service or by the owner of the materials, you may not modify, copy, reproduce, republish, upload, post, transmit, translate, sell, create derivative works, exploit, or distribute in any manner or medium (including by email or other electronic means) any material from the Site. You may, however, from time to time, download and/or print one copy of individual pages of the Site for your personal, non-commercial use, provided that you keep intact all copyright and other proprietary notices. For information about requesting permission to reproduce or distribute materials from the Site, please contact us. </p>
                  <p>Our Right to Use Materials You Submit or Post. When you submit or post any material via the Site, you grant us, and anyone authorized by us, a royalty-free, perpetual, irrevocable, non-exclusive, unrestricted, worldwide license to use, copy, modify, transmit, sell, exploit, create derivative works from, distribute, and/or publicly perform or display such material, in whole or in part, in any manner or medium (whether now known or hereafter developed), for any purpose that we choose. The foregoing grant includes the right to exploit any proprietary rights in such posting or submission, including, but not limited to, rights under copyright, trademark or patent laws that exist in any relevant jurisdiction. Also, in connection with the exercise of these rights, you grant us, and anyone authorized by us, the right to identify you as the author of any of your postings or submissions by name, email address or screen name, as we deem appropriate. You understand that the technical processing and transmission of the Site, including content submitted by you, may involve transmissions over various networks, and may involve changes to the content to conform and adapt it to technical requirements of connecting networks or devices. You will not receive any compensation of any kind for the use of any materials submitted by you.</p>
                  <h5>Your California Privacy Rights</h5>
                  <p>California Civil Code Section 1798.83, also known as the “Shine The Light” law, permits our customers who are California residents to request and obtain from us once a year, free of charge, information about the personal information (if any) we disclosed to third parties for direct marketing purposes in the preceding calendar year. If applicable, this information would include a list of the categories of personal information that was shared and the names and addresses of all third parties with which we shared information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to: </p>
                  <ul>
                     <li>Online Privacy Coordinator</li>
                     <li>Legal Department</li>
                     <li>Relias LLC</li>
                     <li>1010 Sync St.</li>
                     <li>Morrisville, NC 27560</li>
                  </ul>
                  <h5>Privacy Statement</h5>
                  <p>I understand that OnCourse Learning as a requirement of CAPCE accreditation will submit a record of my course completions to the CAPCE AMS. I further understand that my course completion records may be accessed by or shared with such regulators as state EMS offices, training officers, and NREMT on a password-protected need-to-know basis. In addition, I understand that I may review my record of CAPCE-accredited course completions by contacting CAPCE.</p>
                  <ul className="privacy-statement">
                     <li>Course Originally Released on: 3/31/2017</li>
                     <li>Date of Most Recent Review: 3/31/2017</li>
                     <li>Course Termination/Update Date: 4/10/2020</li>
                  </ul>
                  <div className="privacy-table">
                     <Table responsive className="course-table">
                        <thead>
                           <tr>
                              <th>Course Measurement</th>
                              <th>Industry Profession</th>
                           </tr>
                        </thead>
                        <tbody>

                           <tr className="privacy-box">
                              <td>.10 CEU </td>
                              <td>Audiology/SLP, Fitness, Occupational Therapy </td>
                           </tr>
                           <tr>
                              <td>1.0 Credit </td>
                              <td>Medicine </td>
                           </tr>
                           <tr>
                              <td>1.0 CPEU </td>
                              <td>Dietetics/Nutrition </td>
                           </tr>
                           <tr>
                              <td>1.0 CECH </td>
                              <td>Health Education </td>
                           </tr>
                           <tr>
                              <td>1.0 Hour </td>
                              <td>Athletic Training, Physical Therapy </td>
                           </tr>
                           <tr>
                              <td>1.0 CEU </td>
                              <td>Certified Medical Assistants </td>
                           </tr>
                           <tr>
                              <td>1.0 CEH </td>
                              <td>Emergency Medical Services </td>
                           </tr>
                           <tr>
                              <td>1.0 CE Hours </td>
                              <td>Laboratory, Pharmacy, Pharmacy Tech, Respiratory Therapy </td>
                           </tr>
                           <tr>
                              <td>1.0 CE Credit </td>
                              <td>Massage Therapy </td>
                           </tr>
                           <tr>
                              <td>1.0 CE Clock Hour</td>
                              <td>Psychology, Radiologic Technology, Surgical Technology</td>
                           </tr>
                        </tbody>
                     </Table>
                  </div>
                  <h5>First Course Free</h5>
                  <p className='mb-0'>First Course Free is defined as one (1) contact hour. Contact hour measurements vary by industry profession, as determined by the governing regulatory body. Your first course free is the equivalent of a one (1) hour course defined according to the industry profession course measurement outlined here. Thank you.</p>
               </div>
            </section>
         </div>
         <Footer />
      </div>
   )
}
export default Content;
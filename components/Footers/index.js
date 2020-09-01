import React, { useState } from 'react';
import Link from 'next/link';
import { Row, Col } from 'react-bootstrap';

function Footers(props) {
   return (
      <footer>
         <div className="footer-block">
            <div className="footer-second-block">
               <span>Terms and Conditions.</span>
               <span>Privacy Statement</span>
               <span>©TS-BPASS, INC. 2020</span>
            </div>
         </div>
      </footer>
   )
}
export default Footers;
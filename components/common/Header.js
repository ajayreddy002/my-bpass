import React, { useState } from 'react';
import Link from 'next/link';
import { Row, Col, Form, Button } from 'react-bootstrap';


import { getTranslatedText } from '../../utils/translationUtils';

const Header = () => {
    return(
        
        <header>
        <div className="logo-menu-block">
           <div className="logo-block">
              <Link href="/">
                 <a>
                    <img src="/html/images/register/logo.png" alt="" />
                 </a>
              </Link>
           </div>
           <div className="menu-block">
              <ul>
                 <li>
                    <Link href="/">
                       <a>{getTranslatedText('header.about')} </a>
                    </Link>
                 </li>
                 <li>
                    <Link href="/">
                    <a>{getTranslatedText('header.community')} </a>
                    </Link>
                 </li>
                 <li>
                    <Link href="/">
                       <a>{getTranslatedText('header.blogs')} </a>
                    </Link>
                 </li>
              </ul>
           </div>
        </div>
     </header>
    )
}


export default Header;
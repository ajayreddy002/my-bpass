import React from 'react';
import Link from 'next/link';
import Header1 from '../components/header/Header1';
import MainBanner from '../components/mainbanner';
import WelComebanner from '../components/fullbanner';
import Features from '../pages/feature';
import Service from '../pages/services';
import Leaders from '../pages/leaders';
import Blog from '../pages/blog';
import Brand from '../pages/brand';
import Contact from '../pages/contact';
import Footer from '../components/footer';
import '../styles/front.css';


function Home(props) {
   return (
      <div className="main-wrapper">
         <Header1 />
         <div className="main-block">
            <MainBanner />
            <WelComebanner />
            <Features />
            <Service />
            <Leaders />
            <Blog />
            <Brand />
            <Contact />
         </div>
         <Footer />
      </div>
   )
}
export default Home;
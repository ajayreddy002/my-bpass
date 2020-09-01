import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

function Blog(props) {
   return (
      <section className="blog-wrapper">
         <Container className="container1">
            <Row>
               <Col md={4}>
                  <div className="blog-box">
                     <div className="blog-content">
                        <span>Blog</span>
                        <h5>Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit</h5>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et…</p>
                        <div className="read-more">Read more</div>
                     </div>
                  </div>
               </Col>
               <Col md={4}>
                  <div className="blog-box">
                     <div className="blog-content">
                        <span>News</span>
                        <h5>Getting The Most  Out Of Annual Mandatory And Training</h5>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et…</p>
                        <div className="read-more">Read more</div>
                     </div>
                  </div>
               </Col>
               <Col md={4}>
                  <div className="blog-box">
                     <div className="blog-content">
                        <span>Blog</span>
                        <h5>Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit</h5>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et…</p>
                        <div className="read-more">Read more</div>
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      </section>
   )
}
export default Blog;
import React, { useState, useEffect } from 'react';
import Router , {useRouter}  from 'next/router';
import { Container, Form, Button, Card, CardGroup, Modal, OverlayTrigger, Tooltip, } from 'react-bootstrap';
import Upload from '../../containers/plot/upload';
import {convertDateToDMY} from '../../utils/convertionUtils'
import {Logo} from '../../utils/icons';

import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;

const Cards =   (props) => { 
    const {item} = props;
    const [modalShown, setModalShown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toggleModalVisiblity = () => {
        setModalShown(modalShown ? false : true);
      };
    const router = useRouter()

    const handleDownload = (appID) => {
        const authToken = localStorage.getItem('auth-token');
      if(authToken){
         setIsLoading(true)
         axios.get(apiURL + apiConstants.ACKOWLEDGEMENT_LETER.URL, {
            headers: {
               'Authorization': 'Bearer ' + authToken,   
               'Accept' : '*/*'
            },
            params: {
               application_id: appID
            }
         })
         .then(function (response) {
            if(response.data.data.status === 'success'){
               const fileURL = String(response.data.data.data.file_url);
               window.open(fileURL, "_blank");
            }else{
               toast.error(response.data.message, {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
               });
            }
            setIsLoading(false)
         })
         .catch(function (error) {
            if(error.response){
               toast.error(error.response.data.message, {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
               });
            }
            setIsLoading(false)
         })
      }
    }

    return (
                <div className="custom-card-container">
                <CardGroup>
                    <Card >
                        <Card.Body>
                            <Card.Title style={{fontSize: '12px',color:'#9EABB5' }}>Application ID</Card.Title>
                            <Card.Text>
                            <strong>{item.application_id}</strong>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Title style={{fontSize: '12px',color:'#9EABB5' }}>Application Type :</Card.Title>
                            <Card.Text>
                            <strong>Building Permission</strong>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Title style={{fontSize: '12px',color:'#9EABB5' }}>Applied Date :</Card.Title>
                            <Card.Text>
                                <strong>{convertDateToDMY(item.created_at)} </strong>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Text style={{ color: item.completed_steps === 5 ? '#1C9A5B' : '#FA7847', lineHeight: '60px', }}>
                                {item.completed_steps === 5? 'Completed' : 'Incomplete' }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <img src='/html/images/form.png' />
                            <Card.Text style={{ textTransform: 'capitalize', marginLeft: 10, color: '#040E19', fontSize: 12, fontWeight: 500, }}>{(item.status || '').toLowerCase()}</Card.Text>
                        </Card.Body>
                    </Card>
                    {item.completed_steps === 5?
                    <Card>
                        <Card.Body>
                            <Card.Text >
                                <OverlayTrigger
                                    key={'bottom'}
                                    placement={'bottom'}
                                    overlay={
                                        <Tooltip id="tooltip-download">
                                            {'Download Acknowledgement'}
                                        </Tooltip>
                                    }
                                >
                                    <Button style={{textAlign: 'left', padding: '.75rem 1rem'}} onClick={() => handleDownload(item.id)} variant="outline-success">
                                        <img style={{ textAlign: 'center', }} src='/html/images/upload.png' />
                                    </Button>
                                </OverlayTrigger>
                            </Card.Text>
                        </Card.Body>
                    </Card> :
                    <Card>
                        <Card.Body>
                            <Card.Text style={{ lineHeight: '60px', }}>
                                <Button style={{ textAlign: 'left', fontSize: 12, fontWeight: 500, }} onClick={() => router.push(`/application/${item.id}`)} variant="outline-success">
                                    Resume
                                </Button>
                            </Card.Text>
                        </Card.Body>
                    </Card> }
                </CardGroup>
            </div>
        )
}

export default Cards;
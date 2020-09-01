import React from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import {
  Button,
  Modal,
  ModalBody
} from 'shards-react';
import { Col, Row, Spinner } from 'react-bootstrap';


export class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      marker: 
        {
          title: "",
          name: "",
          position: { lat: 37.778519, lng: -122.40564 }
        }
    };
  }
  onMarkerClick = (t, map, coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    this.setState(previousState => {
      return {
        marker:
          {
            title: "",
            name: "",
            position: { lat, lng }
          }
      };
    });
  }

  selectLocation = () => {
    const {  marker } = this.state
    const { lat, lng } = marker.position;
    const link = `http://maps.google.com/maps?q=${lat},${lng}`;
    this.props.selectLocation(link);
  }

  render() {
    const { marker } = this.state;
    return (
      <Modal 
      open={this.props.openMap}
      onClick={this.onClick}
      className='modal-dialog modal-dialog-centered'
      >
        <ModalBody>
          <Row>
          <Col 
            xs='12'
            md='11'
           className="map-size"
          >
          <Map google={this.props.google} zoom={14} 
          onClick={this.onMarkerClick}>
            <Marker
              title={marker.title}
              name={marker.name}
              position={marker.position}
            />
            </Map>
            </Col>
          </Row> 
          <Row>
          <Col
            xs='12'
            md='4'
          >
          <Button
          theme='success'
          type='button'
          onClick={this.selectLocation}
          >
          Submit
          </Button>
          </Col>
          </Row>
        </ModalBody>
      </Modal>
      
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyDwR7S-krwYjEMBxw9dU85PJGwcRwpPQEg')
})(MapContainer)
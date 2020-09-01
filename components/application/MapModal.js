import React, { Component } from 'react';
const { compose, withProps } = require("recompose");
import Link from 'next/link';
import { Modal, Button } from 'react-bootstrap';
import { withScriptjs, withGoogleMap, GoogleMap, Circle, Marker } from "react-google-maps";
const { DrawingManager } = require("react-google-maps/lib/components/drawing/DrawingManager");
import Autocomplete from 'react-google-autocomplete';

var coordinatesss;
function getPaths(polygon){
  var coordinates = (polygon.getPath().getArray());
  // console.log('coordinates', coordinates);
  coordinatesss = coordinates;
}

// var mapLat = 17.3850
// var mapLng = 78.4867

// function mapCenter(place) {
//   const location = place.geometry.location;
  
//   mapLat = location.lat();
//   mapLng = location.lng();
//   console.log('lang', mapLng);
// }

// console.log('mapapapapapap',mapLng);



class MapModal extends Component {

    state = {
      mapLat: 17.3850,
      mapLng: 78.4867
    }

    mapCenter(place) {
      const location = place.geometry.location;
      
      this.setState({
        mapLat: location.lat(),
        mapLng: location.lng()
      })
    }

    selectedMarks = () => {
      const coord = []
      for(var i=0; i<coordinatesss.length; i++) {
        coord.push([coordinatesss[i].lat(), coordinatesss[i].lng()])
      }
      this.props.getCoordinates(coord);
      this.props.onHide();
    }

    
    render() {
      
      const Map = compose(
        withProps({
          googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDwR7S-krwYjEMBxw9dU85PJGwcRwpPQEg&v=3.exp&libraries=geometry,drawing,places",
          loadingElement: <div style={{ height: `100%`}} />,
          containerElement: <div style={{ height: `395px` }} />,
          mapElement: <div style={{ height: `100%` }} />,
        }),
        withScriptjs,
        withGoogleMap
      )(props =>
        <GoogleMap
          
          defaultZoom={15}
          defaultCenter={new google.maps.LatLng(this.state.mapLat, this.state.mapLng)}
        >
          <Autocomplete
            style={{
              width: '100%',
              height: '40px',
              paddingLeft: '16px',
              marginTop: '10px',
              marginBottom: '100px',
              
            }}
            className="autocomplete"
            onPlaceSelected={(place) => this.mapCenter(place) }
            types={['(regions)']}
            
          />
          <DrawingManager
            defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
            defaultOptions={{
              drawingControl: true,
              drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                  // google.maps.drawing.OverlayType.CIRCLE,
                  google.maps.drawing.OverlayType.POLYGON,
                  // google.maps.drawing.OverlayType.POLYLINE,
                  // google.maps.drawing.OverlayType.RECTANGLE,
                ],
              },
              circleOptions: {
                fillColor: `#ffff00`,
                fillOpacity: 1,
                strokeWeight: 5,
                clickable: false,
                editable: true,
                zIndex: 1,
              }
            }}
            onPolygonComplete={(value) => getPaths(value)}
          />
        </GoogleMap>
      );
        
        return (
          <Modal
              className="map-modal"
              {...this.props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Body>
                <div style={{ height: '70vh', width: '100%' }}>
                  <div  className="search-box">
                    <Map />
                  </div>
                </div>
              </Modal.Body>
            <Modal.Footer>
              {/* <Button className="cancle-btn" onClick={this.deleteMark}>Delete Marks</Button> */}
              <Button className="cancle-btn" onClick={this.props.onHide}>Cancel</Button>
              <Button className="area-btn" onClick={this.selectedMarks} >Select Area</Button>
            </Modal.Footer>
          </Modal>
        );
    }
}

export default MapModal;

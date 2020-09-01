import React, {Component} from "react"
import { compose, withProps } from "recompose"
import { Modal, Button } from 'react-bootstrap';
import { withScriptjs, withGoogleMap, GoogleMap, Marker,Polygon } from "react-google-maps"


class GeoMap extends Component {
    state = {
        mapLat: parseFloat(this.props.coordinates[0].lat),
        mapLng: parseFloat(this.props.coordinates[0].lng)
    }

    render() {
        const reversedCoords = this.props.coordinates.map( ll => {
            return { lat: parseFloat(ll.lat), lng: parseFloat(ll.lng) }
        });
    
        const MyMapComponent = compose(
            withProps({
                googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDwR7S-krwYjEMBxw9dU85PJGwcRwpPQEg",
                loadingElement: <div style={{ height: `100%` }} />,
                containerElement: <div style={{ height: `400px` }} />,
                mapElement: <div style={{ height: `100%` }} />,
            }),
            withScriptjs,
            withGoogleMap
        )((props) =>
            <GoogleMap 
                defaultZoom={15}
                defaultCenter={new google.maps.LatLng(this.state.mapLat, this.state.mapLng)}>
                <Polygon
                    path={reversedCoords}
                    //key={1}
                    options={{
                        fillColor: "#000",
                        fillOpacity: 0.4,
                        strokeColor: "#000",
                        strokeOpacity: 1,
                        strokeWeight: 1
                    }} />
            </GoogleMap>
        )
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
                        <MyMapComponent />  
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancle-btn" onClick={this.props.onHide}>close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default GeoMap;
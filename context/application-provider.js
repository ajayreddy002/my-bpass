import React, { Component } from 'react'
import swal from 'sweetalert';
import ContextApi from './';

class ApplicationProvider extends Component {
    state = {
        heightInMeters: 7,
        plotAreaAsDoc: 0,
        plotArea: 0,
        plotAreaType: '',
        applicationType: 'REG',
        bpCaseType: 'NEW',
        floorsID: 0,
        noOfFloors: 0,
        foolrsType: 'Ground',
        totalBuildupArea: 0,
        totalRoadAffected: 0,
        netPlotArea: 0,
        distCode: 0,
        mandalCode: 0,
        disableFileUpload: false,
        disablePlotSubmit: false
    };

    updateFloors = async (ID, floors, type, height) => {
        await this.updateAppType(height, this.state.plotArea)
        await this.setState({
            floorsID: ID,
            noOfFloors: floors,
            foolrsType: type,
        })
    }

    updateAppType = async (height, area) => {
        var type = this.state.applicationType;

        if(type !== 'SW'){
            if(area <= 63 && height <= 7){
                type = 'REG'
            }
            if((area > 63 && area <= 500 )&& height <= 7){
                type = 'SC'
            }
            if((area > 50 && area <= 500 )&& (height > 7 && height <= 10)){
                type = 'SCMOR'
            }
            if(height > 10 || area > 500){
                type = 'SW'
            }
        }
        
        await this.setState({
            heightInMeters: height,
            plotArea: area,
            applicationType: type
        })
        localStorage.setItem('plot-area', parseFloat(area));
    }

    handleAlertForSW = async () => {
        return swal({
            text: "Based on your selection, your application will be processed through single window.",
            buttons: ["Cancel", "Yes, Continue with Single Window"],
            dangerMode: true,
        })
        .then( (willDelete) => {
            if (willDelete) {
                return true
            } else {
                return false
            }
        });
    }

    render() {
        const { 
            heightInMeters, 
            plotAreaAsDoc,
            plotArea, 
            plotAreaType,
            applicationType, 
            floorsID, 
            noOfFloors, 
            foolrsType,
            distCode, 
            mandalCode,
            disableFileUpload,
            disablePlotSubmit
        } = this.state;
        
        return (
            <ContextApi.Provider
                value={{
                    heightInMeters: heightInMeters,
                    plotAreaAsDoc: plotAreaAsDoc,
                    plotArea: plotArea,
                    plotAreaType: plotAreaType,
                    applicationType: applicationType,
                    floorsID: floorsID,
                    noOfFloors: noOfFloors,
                    foolrsType: foolrsType,
                    distCode: distCode,
                    mandalCode: mandalCode,
                    disableFileUpload: disableFileUpload,
                    disablePlotSubmit: disablePlotSubmit,
                    handlePlotAreaType: (value) => {
                        this.setState({
                            plotAreaType: value
                        })
                    },
                    updatePlotArea: (area) => {
                        // if(plotAreaAsDoc > area){
                            this.updateAppType(heightInMeters, area)
                        // }else{
                        //     this.updateAppType(heightInMeters, plotAreaAsDoc)
                        // }
                    },
                    handlePlotAreaAsDoc: (value) => {
                        // console.log('area  value', plotArea, '>', value)
                        // if(plotArea > value){
                        //     this.updateAppType(heightInMeters, value)
                        // }else{
                        //     this.updateAppType(heightInMeters, plotArea)
                        // }
                        this.setState({
                            plotAreaAsDoc: value
                        })
                    },
                    handleDistMandal: (dist, mandal) => {
                        this.setState({
                            distCode:dist,
                            mandalCode: mandal
                        })
                    },
                    handleDisablePlotSubmit: (value) => {
                        this.setState({ disablePlotSubmit: value})
                    },
                    handleAlertForSW: () => { 
                        return this.handleAlertForSW()
                    },
                    updateHeight: (height) => {
                        const plotAreaValue = localStorage.getItem('plot-area')
                        this.updateAppType(height, parseInt(plotAreaValue))
                    },
                    handleContextCaseType: (type) => {
                        this.handleCaseType(type)
                    },
                    updateFloors: (ID, floors, type, height) => {
                        this.updateFloors(ID, floors, type, height)
                    },
                    updateAppTypeToSW: () => {
                        this.setState({
                            applicationType: "SW"
                        })
                    },
                    updateDisableFileUpload: (isDisabled) => {
                        this.setState({
                            disableFileUpload: isDisabled
                        })
                    }
                }}
            >
                {this.props.children}   
            </ContextApi.Provider>
        );
    }
}

export default ApplicationProvider;

import React, { useContext } from 'react';
import { getTranslatedText } from '../../utils/translationUtils';
import InputGroupPrepend from '../../components/common/input-group'
import swal from 'sweetalert';
import { toast } from 'react-toastify';
import { convertToSqMeters } from '../../utils/convertionUtils'
import ContextApi from '../../context'

const PlotAddress = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    customHandleChange
}) => {

  const ContextValue = useContext(ContextApi);

  const handleDocPlotArea = async (area) => {
    if(values.plotAreaType === 'Sq. Yards'){
      const meters = convertToSqMeters(parseFloat(area));
      ContextValue.handlePlotAreaAsDoc(meters)
      ContextValue.handlePlotAreaType('Sq. Yards')
      await customHandleChange('plotAreaDoc', area)
      await customHandleChange('plotArea', meters)
    }else{
      if(area < 63){
        swal({
          text: "Choose Only Sq Yards for below 75",
          button: "OK",
          dangerMode: true,
        })
        await customHandleChange('plotArea', 0)
        await customHandleChange('plotAreaDoc', 0)
      }else{
        await customHandleChange('plotAreaDoc', area)
        await customHandleChange('plotArea', area)
        ContextValue.handlePlotAreaAsDoc(area)
        ContextValue.handlePlotAreaType('Sq. Meters')
      }
    }

    setTimeout(() => {
      handleLowestPlotArea()
    }, 1000)
  }

  const handleGroundPlotArea = async (area) => {
    if(values.plotAreaType === 'Sq. Yards'){
      const meters = convertToSqMeters(parseFloat(area));
      ContextValue.updatePlotArea(meters)
      ContextValue.handlePlotAreaType('Sq. Yards')
      localStorage.setItem('plot-area', meters);
      await customHandleChange('plotAreaGround', meters);
      await customHandleChange('plotAreaGrnd', area);
    }else{
      if(area < 63){
        swal({
          text: "Choose Only Sq Yards for below 75",
          button: "OK",
          dangerMode: true,
        })
        await customHandleChange('plotAreaGround', 0)
        await customHandleChange('plotAreaGrnd', 0);
      }else{
        await customHandleChange('plotAreaGrnd', area);
        ContextValue.updatePlotArea(parseFloat(area))
        ContextValue.handlePlotAreaType('Sq. Meters')
        await customHandleChange('plotAreaGround', area)
      }
    }
    
    setTimeout(() => {
      handleLowestPlotArea()
    }, 1000)
  }

  const handleLowestPlotArea = () => {
    if(values.plotArea > values.plotAreaGround){
      ContextValue.updatePlotArea(values.plotAreaGround) 
    }else{
      ContextValue.updatePlotArea(values.plotArea)
    }
  }

  const handlePlotArea = (e) => {
    if(e.target.name === 'plotAreaType'){
      console.log('area values', values.plotArea, typeof values.plotArea)
      if(values.plotArea && values.plotAreaGround && parseInt(values.plotArea) < 75 && parseInt(values.plotAreaGround) < 75){
        toast.error('error', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
    }
      // console.log('plot area', plotAreaType)
      handleChange(e)
  }

  return (
    <ContextApi.Consumer>
      {value =>
        <>
            <div className="border-line-bottom">
                <span></span>
            </div>
            <h5 className="form-title">{getTranslatedText('label.plot_area')}</h5>
            <InputGroupPrepend
                List={{'Sq. Yards': 'Sq. Yards', 'Sq. Meters': 'Sq. Meters'}}
                Dropdown={true}
                defaultSelectedValue="Sq. Yards"
                InputGroupName="plotAreaType"
                // InputGroupName="sq. Yards"
                Input="plotAreaDoc"
                Label="label.plot_area_document"
                ConvertYards={false}
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={(e) => { handleBlur(e), handleDocPlotArea(e.target.value)}}
                customHandleChange={customHandleChange}
            />
            <InputGroupPrepend
                InputGroupName={values.plotAreaType || 'Sq. Yards'}
                // InputGroupName="sq. Yards"
                Input="plotAreaGrnd"
                Label="label.plot_area_ground"
                ConvertYards={false}
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={(e) => { handleBlur(e), handleGroundPlotArea(e.target.value)}}
                customHandleChange={customHandleChange}
            />
        </>
      }
    </ContextApi.Consumer>
  )
}


export default PlotAddress;
import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { Form, Button, Col, InputGroup, FormControl } from 'react-bootstrap';
import { AngleRight, AngleBottom, MapIcon, AngleLeft, UploadFile } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import InputGroupUnits from '../../components/common/input-group-units'

import ContextApi from '../../context';

const BuiltupArea = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    customHandleChange
}) => {

  const [floorsData, setFloorsData] = useState([])
  const ContextValue = useContext(ContextApi);

  const handleFloors = async (id, type, value, floorId, floorType) => {
    // console.log('values', id, type, value, floorType)
    // return;

    const data = floorsData;
    var index = 0;
    data.some(function(question, i) {
        if (question.id === id) {
            index = i + 1;
            return true;
        }
    });
    
    if(index === 0){
      if(type === 'Qty'){
        await data.push({
          "id": id,
          "floor_id": floorId,
          "floor_type": floorType,
          "units": parseInt(value)
        })
      }else{
        await data.push({
          "id": id,
          "floor_id": floorId,
          "floor_type": floorType,
          "area": parseInt(value)
        })
      }
    }else{
      
      if(type === 'Qty'){
        data[index - 1].units = value 
      }else{
        data[index - 1].area = value 
      }
    }
    await setFloorsData(data)
    
    customHandleChange('builtupArea', data)
    totalBuiltupUnits()
  }

  const totalBuiltupUnits = () => {
    // calculateSum(floorsData, area)
    let totalBuiltupArea = 0;
    let totalBuiltupUnits = 0;
    floorsData.forEach( data => {
      totalBuiltupArea = totalBuiltupArea + parseInt(data.area)
      totalBuiltupUnits = totalBuiltupUnits + parseInt(data.units)  
    });

    customHandleChange('prBuiltup', parseInt(totalBuiltupArea) > 0 ? totalBuiltupArea : 0)
    totalBuiltupUnits && customHandleChange('prBuiltupUnits', totalBuiltupUnits)
    customHandleChange('mortgageArea', (parseInt(totalBuiltupArea) * 10 / 100))
  }


  const displayFloors = (floorId, floors, floorType) => {
    var indents = [];
    for (var i = 0; i < floors; i++) {
      if(!(floorType === 'stilt' && i === 0)){
        indents.push(<InputGroupUnits
          InputGroupName={ContextValue.plotAreaType}
          Input={`${i === 0 ? floorType : 'Floor'+i}`}
          showUnits={ContextValue.plotArea > 200? true : false}
          Units={`Units${i}`}
          Label={`label.${i === 0 ? floorType : 'floor_'+i}`}
          KeyValue={i}
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={(e, key) => { handleFloors(key, e.target.placeholder, e.target.value, floorId, e.target.name)}} 
        />);
      }
    }
    return indents;
  }

  return (
    <ContextApi.Consumer>
      {value =>
        <>
        <h5 className="form-title">{getTranslatedText('title.builtup_area')}</h5>

            {displayFloors(value.floorsID, value.noOfFloors, value.foolrsType)}

            
            <InputGroupUnits
              InputGroupName={value.plotAreaType}
              Input="prBuiltup"
              Units="prBuiltupUnits"
              Label="label.builtup_total"
              showUnits={ContextValue.plotArea > 200? true : false}
              readOnly={true}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          <h5 style={{ fontSize: '12px' }}>The Total Builtup Area mentioned above will be considered for Approval and Fee calculation purpose. Any misrepresentation shall be liable for punishment as per the provisions under section 177 & 180 of Telangana Municipalities Act 2019</h5>
        </>
      }
    </ContextApi.Consumer>
  )
}


export default BuiltupArea;
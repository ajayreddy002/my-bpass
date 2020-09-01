import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Form, Button, Col, InputGroup, FormControl } from 'react-bootstrap';
import { AngleRight, AngleBottom, MapIcon, AngleLeft, UploadFile } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import InputGroupPrepend from '../../components/common/input-group'
import ScheduleGroupSelect from '../../components/common/schedule-group-select'
import CustomTooltip from '../../components/CustomTooltip';

const ScheduleBoundaries = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    customHandleChange
}) => {
    const [north, setNorth] = useState(3)
    const [south, setSouth] = useState(3)
    const [east, setEast] = useState(3)
    const [west, setWest] = useState(3)
    const [showTooltip, setShowTooltip] = useState(false);
    const toggleTooltip = () => {
      setShowTooltip(!showTooltip);
    };

    const scheduleData = ['North', 'South', 'East', 'West'];

  return (
    <>
        <div className="border-line-bottom">
            <span></span>
          </div>
          <CustomTooltip
            title={getTranslatedText('heading.schedule_of_boundaries')}
            showTooltip={showTooltip}
            subTitle={'Select the options provided based on your plot location. For Plot enter Detials of Plot, For Road enter the Road Width.'}
          />
          <h5
            onMouseEnter={toggleTooltip}
            onMouseLeave={toggleTooltip}
            className="form-title">{getTranslatedText('heading.schedule_of_boundaries')}</h5>
          
          <div className="schedule-group">
            <ScheduleGroupSelect
              List={scheduleData}
              Input="frontFacing"
              Label={'label.boundary_schedule_front'}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
            />
            {/* <Form.Group>
              <div className="property-radio">
                <Form.Check
                  type="radio"
                  label={getTranslatedText('label.plot_label')}
                  name="yes-no2"
                  id="property5"
                  defaultChecked={north}
                  onClick={() => {setNorth(1), customHandleChange('northPlotOpen', false)}}
                />
                <Form.Check
                  type="radio"
                  label={getTranslatedText('label.road_label')}
                  name="yes-no2"
                  id="property6"
                  defaultChecked={north}
                  onClick={() => {setNorth(2), customHandleChange('northPlotOpen', false)}}
                />
                <Form.Check
                  type="radio"
                  label={getTranslatedText('label.open_land')}
                  name="yes-no2"
                  id="property7"
                  defaultChecked={north}
                  onClick={() => {setNorth(3), customHandleChange('northPlotOpen', true)}}
                />
              </div>
            </Form.Group>
            {north === 1?
            <InputGroupPrepend
              InputGroupName="plot number"
              Input="northPlotWidth"
              Label="label.north_plot_area"
              PlaceHolder="Enter Plot Number"
              ConvertYards={false}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
            />: north === 2? */}
            <InputGroupPrepend
              InputGroupName="In Meters"
              Input="northRoadwidth"
              Label="label.north_road_width"
              PlaceHolder="Enter Road Width"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
            />
            {/* :'' } */}
          </div>
          <div className="schedule-group">
            <ScheduleGroupSelect
              List={scheduleData}
              Input={'rearFacing'}
              Label={'label.boundary_schedule_rear'}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
            />

            <Form.Group>
              <div className="property-radio">
                <Form.Check
                  type="radio"
                  label={getTranslatedText('label.plot_label')}
                  name="yes-no3"
                  id="property8"
                  defaultChecked={south}
                  onClick={() => {setSouth(1), customHandleChange('southplotOpen', false)}}
                />
                <Form.Check
                  type="radio"
                  label={getTranslatedText('label.road_label')}
                  name="yes-no3"
                  id="property9"
                  defaultChecked={south}
                  onClick={() => {setSouth(2), customHandleChange('southplotOpen', false)}}
                />
                <Form.Check
                  type="radio"
                  label={getTranslatedText('label.open_land')}
                  name="yes-no3"
                  id="property10"
                  defaultChecked={south}
                  onClick={() => {setSouth(3), customHandleChange('southplotOpen', true)}}
                />
              </div>
            </Form.Group>
            {south === 1?
            <InputGroupPrepend
              InputGroupName="Plot details"
              Input="southplotWidth"
              Label="label.south_plot_area"
              PlaceHolder="Enter Plot Details"
              ConvertYards={false}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
            />: south === 2?
            <InputGroupPrepend
              InputGroupName="In Meters"
              Input="southRoadWidth"
              Label="label.south_road_width"
              PlaceHolder="Enter Road Width"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
            />:'' }
          </div>
          <div className="schedule-group">
            <ScheduleGroupSelect
              List={scheduleData}
              Input={'sideOneFacing'}
              Label={'label.boundary_schedule_side_one'}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
            />
            <Form.Group>
              <div className="property-radio">
                <Form.Check
                  type="radio"
                  label={getTranslatedText('label.plot_label')}
                  name="yes-no4"
                  id="property11"
                  defaultChecked={east}
                  onClick={() => {setEast(1), customHandleChange('eastRoadOpen', false)}}
                />
                <Form.Check
                  type="radio"
                  label={getTranslatedText('label.road_label')}
                  name="yes-no4"
                  id="property12"
                  defaultChecked={east}
                  onClick={() => {setEast(2), customHandleChange('eastRoadOpen', false)}}
                />
                <Form.Check
                  type="radio"
                  label={getTranslatedText('label.open_land')}
                  name="yes-no4"
                  id="property13"
                  defaultChecked={east}
                  onClick={() => {setEast(3), customHandleChange('eastRoadOpen', true)}}
                />
              </div>
            </Form.Group>
            {east === 1?
            <InputGroupPrepend
              InputGroupName="plot details"
              Input="eastPlotWidth"
              Label="label.ease_plot_area"
              PlaceHolder="Enter Plot Details"
              ConvertYards={false}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
            />: east === 2?
            <InputGroupPrepend
              InputGroupName="In Meters"
              Input="eastRoadWidth"
              Label="label.ease_road_width"
              PlaceHolder="Enter Road Width"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
            />:'' }
          </div>
          
          <div >
            <ScheduleGroupSelect
              List={scheduleData}
              Input={'sideTwoFacing'}
              Label={'label.boundary_schedule_side_two'}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
            />
            <Form.Group>
              <div className="property-radio">
                <Form.Check
                  type="radio"
                  label={getTranslatedText('label.plot_label')}
                  name="yes-no5"
                  id="property14"
                  defaultChecked={west}
                  onClick={() => {setWest(1), customHandleChange('westRoadOpen', false)}}
                />
                <Form.Check
                  type="radio"
                  label={getTranslatedText('label.road_label')}
                  name="yes-no5"
                  id="property15"
                  defaultChecked={west}
                  onClick={() => {setWest(2), customHandleChange('westRoadOpen', false)}}
                />
                <Form.Check
                  type="radio"
                  label={getTranslatedText('label.open_land')}
                  name="yes-no5"
                  id="property16"
                  defaultChecked={west}
                  onClick={() => {setWest(3), customHandleChange('westRoadOpen', true)}}
                />
              </div>
            </Form.Group>
            {west === 1?
            <InputGroupPrepend
              InputGroupName="plot details"
              Input="westPlotWidth"
              Label="label.west_plot_area"
              PlaceHolder="Enter Plot Details"
              ConvertYards={false}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
            />: west === 2?
            <InputGroupPrepend
              InputGroupName="In Meters"
              Input="westRoadWidth"
              Label="label.west_road_width"
              PlaceHolder="Enter Road Width"
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              customHandleChange={customHandleChange}
            />:'' }
          </div>
    </>
  )
}

export default ScheduleBoundaries;

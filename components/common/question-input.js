import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Form } from 'react-bootstrap';
import FileUpload from '../../components/common/file-upload'
import { AngleRight, AngleBottom } from '../../utils/icons';

import { getTranslatedText } from '../../utils/translationUtils';
import ContextApi from '../../context'

const QuestionsInput = ({
    item,
    errors,
    touched,
    handleBlur,
    customHandleChange
}) => {
    
    const [radio, setRadio] = useState(null)
    const [searchFour, setSearchFour] = useState(false);
    const [plan, setPlan] = useState({id:0, name: ''});
    const ContextValue = useContext(ContextApi);

    const iconClickFour = () => {
        setSearchFour(!searchFour)
    }

    // useEffect(() => {
    //     console.log('fssd', plan)
    // }, [plan])

    const selectedPlanFields = (plan) => {
        if(plan.options && plan.options.length > 0){
          return plan.options.map((item, index) => {
          return ( <>
            {item.response_type === 'text' &&
              <Form.Group>
                  <Form.Label>{item.question_name}</Form.Label>
                  <Form.Control 
                    type="text" 
                    key={`plotPartOfkey-${index}`}
                    defaultValue=""
                    required
                    placeholder={item.question_name}
                    onBlur={(e) => customHandleChange(item.id, e.target.value)}
                />
              </Form.Group> }
            {item.response_type === 'file_url' &&
            <>
                <Form.Label>{item.question_name}</Form.Label>
                <FileUpload 
                  key={`plotPartOfkey-${index}`}
                  Label={item.question_name}
                  ID={`plotPartOf-${index}`}
                  Filename={`question-${index}`}
                  FileType={item.question_name.split(' ').join('_')}
                  errors={errors}
                  required
                  touched={touched}
                  handleBlur={handleBlur}
                  customHandleChange={(name, value) => customHandleChange(item.id, value)}
                />
            </> }
          </> )
          })
        }
    }

    const handleBooleanQuestions = async (item, value) => {
        if(item.is_single_window){
            if(value === 'TRUE'){
                console.log('application type', ContextValue.applicationType)
                if(ContextValue.applicationType !== 'SW'){
                    const confirm = await ContextValue.handleAlertForSW();
                    if(confirm){
                        ContextValue.updateAppTypeToSW()
                        setRadio(true)
                        customHandleChange(item.id, 'TRUE')
                    }
                }else{
                    setRadio(true) 
                    customHandleChange(item.id, 'TRUE')
                }
            }else{
                setRadio(false), 
                customHandleChange(item.id, 'FALSE')
                ContextValue.updatePlotArea(ContextValue.plotArea)
            }
        }else{
            setRadio(value === 'TRUE'? true : false), 
            customHandleChange(item.id, value)
        }
    }

    const handleDropdownSelect = async (item, option) => {
        if(option.is_single_window){
            if(ContextValue.applicationType !== 'SW'){
              const confirm = await ContextValue.handleAlertForSW();
              if(confirm){
                ContextValue.updateAppTypeToSW()
                setPlan(option)
                iconClickFour() 
                customHandleChange(item.id, option.option_name)
              }
            }else{
                setPlan(option)
                iconClickFour() 
                customHandleChange(item.id, option.option_name)
            }
        }else{
            ContextValue.updatePlotArea(ContextValue.plotArea)
            setPlan(option)
            iconClickFour() 
            customHandleChange(item.id, option.option_name)
        }
    }

    return(
        <>
            <Form.Group>
                <Form.Label>{item.question_name}</Form.Label>
                {item.response_type === "boolean" && 
                <div className="property-radio">
                    <Form.Check
                        type="radio"
                        label={getTranslatedText('label.yes_label')}
                        name={`property-${item.id}`}
                        id={`property-${item.id}`}
                        checked={radio === null? false : radio }
                        onChange={() => handleBooleanQuestions(item, 'TRUE')}
                    />
                    <Form.Check
                        type="radio"
                        label={getTranslatedText('label.no_label')}
                        name={`properties-${item.id}`}
                        id={`properties-${item.id}`}
                        checked={radio === null? false : !radio}
                        onChange={() => handleBooleanQuestions(item, 'FALSE')}
                    /> 
                </div> } 
                {item.response_type === "dropdown" && 
                <div className="mandalzone-file">
                    <div className={`selected-box ${searchFour ? 'open' : ''}`}>
                        <div className="village-box" onClick={iconClickFour}>
                        <Form.Control type="type" value={plan.option_name} readOnly required placeholder="Select" autoComplete="off" />
                        <svg className="arrow-right"  dangerouslySetInnerHTML={{ __html: AngleBottom }} />
                        </div>
                        <div className="search-list-box">
                        <ul>
                            {item.child.map((option, i) =>
                            <li key={`options-${i}`} onClick={() => handleDropdownSelect(item, option) }>{option.option_name}</li>
                            )}
                        </ul>
                        </div>
                    </div>
                    <br />
                    {selectedPlanFields(plan)}
                    <span className="map-error-message">Please upload approved building plan</span>
                </div>  }
            </Form.Group>
            
            {(item.response_type === "boolean" && item.child.length > 0  && radio) && 
                item.child.map((item, index) => {
                return (<>
                    {item.response_type === 'text' &&
                        <Form.Group>
                            <Form.Label>{item.question_name}</Form.Label>
                            <Form.Control 
                                type="text" 
                                key={`plotPartOfkey-${index}`}
                                defaultValue=""
                                required
                                placeholder={item.question_name}
                                onBlur={(e) => customHandleChange(item.id, e.target.value)}
                            />
                        </Form.Group> }
                        {item.response_type === 'file_url' &&
                        <Form.Group>
                            <Form.Label>{item.question_name}</Form.Label>
                            <FileUpload 
                            key={`plotPartOfkey-${index}`}
                            Label={item.question_name}
                            ID={`plotPartOf-${index}`}
                            Filename={`question-${index}`}
                            FileType={item.question_name.split(' ').join('_')}
                            errors={errors}
                            required
                            touched={touched}
                            handleBlur={handleBlur}
                            customHandleChange={(name, value) => customHandleChange(item.id, value)}
                            />
                        </Form.Group> }
                </> )
                }
            )}
        </>
    )
}


export default QuestionsInput;
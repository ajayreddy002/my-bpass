import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea
} from 'shards-react';
import { Col, Row, Spinner } from 'react-bootstrap';
import React, { useState } from 'react';

const submitRetrieveAppln = data => {
  console.log(data);
};

function enhancedReducer(state, updateArg) {
  // check if the type of update argument is a callback function
  if (updateArg.constructor === Function) {
    return { ...state, ...updateArg(state) };
  }

  // if the type of update argument is an object
  if (updateArg.constructor === Object) {
    // does the update object have _path and _value as it's keys
    // if yes then use them to update deep object values
    if (has(updateArg, '_path') && has(updateArg, '_value')) {
      const { _path, _value } = updateArg;

      return produce(state, draft => {
        set(draft, _path, _value);
      });
    } else {
      return { ...state, ...updateArg };
    }
  }
}

const initialState = {
  applicant_name: '',
  mandal: '',
  district: '',
  plot_door_no: '',
  survey: ''
};

export default () => {
  const [state, setState] = useState({ applicant_name: '' });
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Card>
        <CardBody>
          <h3>Citizen Search</h3>
          <Form
            style={{ width: '100%' }}
            onSubmit={event => {
              event.preventDefault();
              submitRetrieveAppln({ state });
            }}
          >
            <Row>
              <Col xs='12' md='5'>
                <FormGroup>
                  <label htmlFor='applicant_name'>
                    <strong>Applicant Name</strong>
                  </label>
                  <FormInput
                    id='#applicant_name'
                    placeholder='Enter Applicant Name'
                    onChange={event => {
                      const st = state;
                      st.applicant_name = event.target.value;
                      setState(st);
                    }}
                    value={state.applicant_name}
                    name='applicant_name'
                    valid={state.applicant_name !== ''}
                    invalid={state.applicant_name === ''}
                  />
                </FormGroup>
              </Col>
              <Col xs='12' md='5'>
                <FormGroup>
                  <label htmlFor='mandal'>
                    <strong>Mandal</strong>
                  </label>
                  <FormInput
                    id='#mandal'
                    placeholder='Enter Mandal'
                    name='mandal'
                    onChange={event => setPassword(event.target.value)}
                    valid={1 == 1}
                    invalid={1 == 1}
                    value={state.applicant_name}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs='12' md='5'>
                <FormGroup>
                  <label htmlFor='district'>
                    <strong>District</strong>
                  </label>
                  <FormInput
                    id='#district'
                    placeholder='Enter District'
                    onChange={event => {
                      const st = state;
                      st.applicant_name = event.target.value;
                      setState(st);
                    }}
                    value={state.applicant_name}
                    name='district'
                    valid={state.applicant_name !== ''}
                    invalid={state.applicant_name === ''}
                  />
                </FormGroup>
              </Col>
              <Col xs='12' md='5'>
                <FormGroup>
                  <label htmlFor='survey'>
                    <strong>Survey No.</strong>
                  </label>
                  <FormInput
                    id='#survey'
                    placeholder='Enter Survey Number'
                    name='survey'
                    onChange={event => setPassword(event.target.value)}
                    valid={1 == 1}
                    invalid={1 == 1}
                    value={state.applicant_name}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs='12' md='5'>
                <FormGroup>
                  <label htmlFor='plot_door_no'>
                    <strong>Plot/Door No.</strong>
                  </label>
                  <FormInput
                    id='#plot_door_no'
                    placeholder='Plot/Door No.'
                    onChange={event => {
                      const st = state;
                      st.applicant_name = event.target.value;
                      setState(st);
                    }}
                    value={state.applicant_name}
                    name='applicant_name'
                    valid={state.applicant_name !== ''}
                    invalid={state.applicant_name === ''}
                  />
                </FormGroup>
              </Col>
              <Col xs='12' md='5'>
                <FormGroup>
                  <label htmlFor='survey_no'>
                    <strong>Survey No.</strong>
                  </label>
                  <FormInput
                    id='#survey_no'
                    placeholder='Survey Number'
                    name='survey_no'
                    onChange={event => setPassword(event.target.value)}
                    valid={1 == 1}
                    invalid={1 == 1}
                    value={state.applicant_name}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs='12' md='5'>
                <FormGroup>
                  <label htmlFor='permit_no'>
                    <strong>Permit No.</strong>
                  </label>
                  <FormInput
                    id='#permit_no'
                    placeholder='Permit No'
                    onChange={event => {
                      const st = state;
                      st.applicant_name = event.target.value;
                      setState(st);
                    }}
                    value={state.applicant_name}
                    name='permit_no'
                    valid={state.applicant_name !== ''}
                    invalid={state.applicant_name === ''}
                  />
                </FormGroup>
              </Col>
              <Col xs='12' md='5'>
                <FormGroup>
                  <label htmlFor='village'>
                    <strong>Village</strong>
                  </label>
                  <FormInput
                    id='#village'
                    placeholder='Select Village'
                    name='village'
                    onChange={event => setPassword(event.target.value)}
                    valid={1 == 1}
                    invalid={1 == 1}
                    value={state.applicant_name}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs='12' md='2'>
                <Button
                  theme='success'
                  type='submit'
                  name='searchButton'
                  disabled={1 == 1}
                >
                  {loading ? (
                    <Spinner
                      as='span'
                      animation='grow'
                      size='sm'
                      role='status'
                      aria-hidden='true'
                    />
                  ) : null}
                  {loading ? ' Searching' : 'Search'}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

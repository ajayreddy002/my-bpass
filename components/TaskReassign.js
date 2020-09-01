import React, { Fragment, Component } from 'react';
import { alterParamsForUrl, getURL } from '../utils/urlUtils';
import apiConstants from '../constants/apiConstants';
import { Col, Row, ListGroup } from 'react-bootstrap';
import {
    Button,
    FormSelect
  } from 'shards-react';


class TaskReassign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admins: [],
            selectedAdmin: ''
        }
    }

    async componentDidMount() {
        this.getAdmin();
    }

    getAdmin = async () => {
        const { task: { ulb_name, assigned_to } = {} } = this.props
        let url = getURL(apiConstants.GET_ADMIN_BY_ROLE.USECASE);
        url = alterParamsForUrl(url, { ulb_name, role: assigned_to });
        let res = await fetch(url);
        if (res && res.status === 200) {
            res = await res.json();
            this.setState({ admins: res });
        }
    }

    assignTask = async () => {
        this.props.onLoading();
        const { task: { ulb_name, id, assigned_to } = {}, application_identifier } = this.props,
        { selectedAdmin } = this.state;
        let url = getURL(apiConstants.ASSIGN_TASK.USECASE);
        let res = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                applicationIdentifier: application_identifier,
                role: assigned_to,
                taskId: id,
                assignToUserId: selectedAdmin
            })
        });
        if (res && res.status === 200) {
            this.props.onSuccess();
            this.props.refreshList();
            return;
        }
        this.props.onError();
    }

    render() {
        const { task: { task_type, ulb_name, assigned_to, status } = {} } = this.props
        return <div className="mt-5">
            <Row className='align-items-center justify-content-start mt-2'>
                <Col xs='12'>
                    <h5
                        style={{
                            color: '#1d9a5b',
                            fontSize: '16px',
                            paddingLeft: '1.875rem',
                            paddingRight: '1.875rem'
                        }}
                    >
                        {`${task_type.replace(/_/g, ' ')}: (${assigned_to.replace(
                            /_/g,
                            ' '
                        )})`}
                    </h5>
                </Col>
            </Row>
            <Row className='align-items-center justify-content-start'>
                <Col>
                    <ListGroup>
                        <Row className='align-items-center justify-content-between'>
                            <Col xs='12' md='6' className='text-left'>
                                <ListGroup.Item style={{ border: 'none' }}>
                                    <span>
                                        <b>UlB: </b>
                                        {ulb_name}
                                    </span>
                                </ListGroup.Item>
                            </Col>
                            <Col xs='12' md='6' className='text-left'>
                                <ListGroup.Item style={{ border: 'none' }}>
                                    <span>
                                        <b>Status: </b>
                                        {status}
                                    </span>
                                </ListGroup.Item>
                            </Col>
                        </Row>
                    </ListGroup>
                </Col>
            </Row>
            <Row className="align-items-center justify-content-start ml-3 mt-2">
                <Col xs='2'>
                    <b>Assign Admin:</b>
                </Col>
                <Col xs='4'>
                <FormSelect
                    name='role'
                    onChange={event =>  this.setState({selectedAdmin: event.target.value})}
                    value={
                        this.state.selectedAdmin
                    }
                    >
                    <option value=''>Select</option>
                    {
                        this.state.admins.map((i) => <option key={i.id} value={i.user_id}>{i.user_id}</option>)
                    }
                    </FormSelect>
                </Col>
                <Col xs='2'>
                    <Button
                        theme='success'
                        disabled={this.state.selectedAdmin === ''}
                        onClick={this.assignTask}
                    >
                        Assign
                    </Button>
                </Col>
            </Row>
        </div>
    }
}

export default TaskReassign;
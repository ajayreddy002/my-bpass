import { Accordion, Card, Col, Row } from 'react-bootstrap';
import React, { Component } from 'react';

import { Button } from 'react-bootstrap';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { formatFixed } from 'indian-number-format';
import { makeStyles } from '@material-ui/core/styles';

class PaymentSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { summary, total, paymentPage } = this.props;
    if (!summary || summary.length == 0) return null;
    return (
      <Accordion defaultActiveKey='0'>
        <Accordion.Toggle as={Button} variant='link' eventKey='0'>
          Detailed Fee splitup
        </Accordion.Toggle>
        <Accordion.Collapse eventKey='0'>
          <TableContainer component={Paper}>
            <Table aria-label='Fee summary'>
              <TableHead>
                <TableRow>
                  <TableCell align='center' colSpan={3}>
                    Fee Description
                  </TableCell>
                  <TableCell align='center'>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {row.fee_head}
                      <p
                        style={{ marginBottom: 2, fontSize: 12 }}
                        className='text-muted'
                      >
                        {row.fee_description}
                      </p>
                    </TableCell>
                    <TableCell colSpan={3} align='left'>
                      Rs.{' '}
                      {row.computed_fee
                        ? formatFixed(row.computed_fee, 2)
                        : formatFixed(0, 2)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* <TableRow>
              <TableCell rowSpan={2} />
              <TableCell>Total</TableCell>
              <TableCell colSpan={3} align='left'>
                Rs. {formatFixed(total)}
              </TableCell>
            </TableRow> */}
              </TableBody>
            </Table>
          </TableContainer>
        </Accordion.Collapse>
      </Accordion>
    );
  }
}

export default PaymentSummary;

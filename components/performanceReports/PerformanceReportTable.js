import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import { getColumnName } from "../../utils/performanceReportsUtil";

const PerformanceReportTable = props => {
  const { performanceData, typeOfReport } = props;
  const keys = Object.keys(performanceData || {});
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{getColumnName(typeOfReport)}</TableCell>
            <TableCell align="right">Performance %</TableCell>
            <TableCell align="right">Total Files Processed</TableCell>
            <TableCell align="right">Flagged Files Count#</TableCell>
            <TableCell align="right">Deemed #</TableCell>
            <TableCell align="right">Penalities (#/Rs)</TableCell>
            <TableCell align="right">Current Pending</TableCell>
            <TableCell align="right">Green</TableCell>
            <TableCell align="right">Orange</TableCell>
            <TableCell align="right">Red</TableCell>
            <TableCell align="right">SLA Breached</TableCell>
            <TableCell align="right">Minimum</TableCell>
            <TableCell align="right">Maximum</TableCell>
            <TableCell align="right">Average</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map(row => {
            let dataObj = performanceData[row];
            return (
              <TableRow key={row}>
                <TableCell component="th" scope="row">
                  {row}
                </TableCell>
                <TableCell align="right">{dataObj["performance"]}</TableCell>
                <TableCell align="right">
                  {dataObj["totalFilesProcessed"]}
                </TableCell>
                <TableCell align="right">
                  {dataObj["flaggedFilesCount"]}
                </TableCell>
                <TableCell align="right">{dataObj["deemedCount"]}</TableCell>
                <TableCell align="right">{dataObj["penalties"]}</TableCell>
                <TableCell align="right">
                  {dataObj["currentPendingFiles"]}
                </TableCell>
                <TableCell align="right">{dataObj["greenCount"]}</TableCell>
                <TableCell align="right">{dataObj["orangeCount"]}</TableCell>
                <TableCell align="right">{dataObj["redCount"]}</TableCell>
                <TableCell align="right">{dataObj["sla"] || 0}</TableCell>
                <TableCell align="right">{dataObj["minDays"]}</TableCell>
                <TableCell align="right">{dataObj["maxDays"]}</TableCell>
                <TableCell align="right">{dataObj["avgDays"]}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PerformanceReportTable;

import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";

const LeaderBoard = props => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { leaderBoardData, selectedStatus, selectedCategory } = props;
  const keys = Object.keys(leaderBoardData || {});
  const status = selectedStatus.id;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{selectedCategory.name} Name</TableCell>
            <TableCell align="right">Total Files #</TableCell>
            <TableCell align="right">Building Permissions</TableCell>
            <TableCell align="right">Layout Approvals</TableCell>
            <TableCell align="right">Occupancy</TableCell>
            <TableCell align="right">Enforcements</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keys
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(row => {
              let totalFilesCount =
                ((leaderBoardData[row]["BUILDING"] || {})[status] || 0) +
                ((leaderBoardData[row]["LAYOUT"] || {})[status] || 0) +
                ((leaderBoardData[row]["OCCUPANCY"] || {})[status] || 0) +
                ((leaderBoardData[row]["ENFORCEMENT"] || {})[status] || 0);
              return (
                <TableRow key={row}>
                  <TableCell component="th" scope="row">
                    {row}
                  </TableCell>
                  <TableCell align="right">{totalFilesCount}</TableCell>
                  <TableCell align="right">
                    {(leaderBoardData[row]["BUILDING"] || {})[status] || 0}
                  </TableCell>
                  <TableCell align="right">
                    {(leaderBoardData[row]["LAYOUT"] || {})[status] || 0}
                  </TableCell>
                  <TableCell align="right">
                    {(leaderBoardData[row]["OCCUPANCY"] || {})[status] || 0}
                  </TableCell>
                  <TableCell align="right">
                    {(leaderBoardData[row]["ENFORCEMENT"] || {})[status] || 0}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={keys.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default LeaderBoard;

import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import { visuallyHidden } from "@mui/utils";
import colors from "../Common/colors";

function createData(
  no,
  time,
  evType,
  sirenSoundState,
  sirenLightState,
  intersection,
  laneNo
) {
  return {
    no,
    time,
    evType,
    sirenSoundState,
    sirenLightState,
    intersection,
    laneNo,
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "no",
    numeric: true,
    disablePadding: true,
    label: "No",
  },
  {
    id: "time",
    numeric: false,
    disablePadding: true,
    label: "Time",
  },
  {
    id: "evTyp",
    numeric: false,
    disablePadding: false,
    label: "EV Type",
  },
  {
    id: "sirenSoundState",
    numeric: false,
    disablePadding: false,
    label: "Siren Sound State",
  },
  {
    id: "sirenLightState",
    numeric: false,
    disablePadding: false,
    label: "Siren Light State",
  },
  {
    id: "intersection",
    numeric: false,
    disablePadding: false,
    label: "Intersection",
  },
  {
    id: "laneNo",
    numeric: false,
    disablePadding: false,
    label: "Lane No",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sx={{
              backgroundColor: colors.primary,
              color: "white",
              fontWeight: "bold",
            }}
            align={"center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              sx={{ color: "white" }}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const handleRows = (logs) => {
  const rowList = [];
  console.log("logs", logs);
  logs.forEach((log, index) => {
    rowList.push(
      createData(
        index + 1,
        log.time_detected,
        log.ev_type,
        log.siren_sound_on ? "Siren Sound ON" : "Siren Sound OFF",
        log.siren_light_on ? "Siren Lights ON" : "Siren Lights OFF",
        log.intersection,
        log.lane_number
      )
    );
  });
  return rowList;
};

export default function EVPLogs({ logs, onSelectSchedule }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows] = React.useState([...handleRows(logs)]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows]
  );

  const handleRemove = () => {
    setSelected([]);
  };

  return (
    <center>
      <Box sx={{ width: window.innerWidth - 130 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleRemove={handleRemove}
          // time={schedules[0].from}
          // arrives={schedules[0].to}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                return (
                  <TableRow
                    key={row.no}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        row.no % 2 !== 1 ? colors.primary_light : "",
                    }}
                  >
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">{row.no}</TableCell>
                    <TableCell align="center">{row.time}</TableCell>
                    <TableCell align="center">{row.evType}</TableCell>
                    <TableCell align="center">{row.sirenSoundState}</TableCell>
                    <TableCell align="center">{row.sirenLightState}</TableCell>
                    <TableCell align="center">{row.intersection}</TableCell>
                    <TableCell align="center">{row.laneNo}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ marginTop: "2rem" }}
        />
      </Box>
    </center>
  );
}

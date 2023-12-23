import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import EditUserDialogComponent from "./EditUserDialogComponent";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect } from "react";

import {
  getAllUsers,
  removeUser,
} from "../../../services/PermissionAndSettings/PermissionService";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

// const rows = [
//   createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
//   createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
//   createData("Eclair", 262, 16.0, 24, 6.0),
//   createData("Cupcake", 305, 3.7, 67, 4.3),
//   createData("Gingerbread", 356, 16.0, 49, 3.9),
// ];
export default function EditUsersComponent() {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [objectId, setObjectId] = React.useState("");
  const [permission, setPermission] = React.useState([]);
  const [openRemove, setOpenRemove] = React.useState(false);

  const handleClickOpen = (row) => {
    console.log("rowrowrowrow", row._id.$oid);
    setOpen(true);
    setObjectId(row._id.$oid);
    setPermission(row.permissions);
    console.log("permission", row.permissions);
  };

  const handleCloseRemove = () => {
    setOpenRemove(false);
  };
  const handleClickOpenRemove = (row) => {
    setOpenRemove(true);
    setObjectId(row._id.$oid);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const removeUsers = (row) => {
    const id = row;
    console.log("id", id);
    removeUser(id)
      .then(({ data }) => {
        console.log("fetching data:", data);
        handleCloseRemove();
        fetchData();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const fetchData = () => {
    try {
      const id = localStorage.getItem("organization_id");
      getAllUsers(id)
        .then(({ data }) => {
          console.log("fetching data:", data);
          setRows(data);
          console.log(rows);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>User Reference</StyledTableCell>
              <StyledTableCell align="right">Employee Number</StyledTableCell>
              <StyledTableCell align="right">Email</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.organization_id}>
                <StyledTableCell component="th" scope="row">
                  {row.organization_id}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.employee_no}
                </StyledTableCell>
                <StyledTableCell align="right">{row.email}</StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    variant="contained"
                    endIcon={<BorderColorIcon />}
                    onClick={() => handleClickOpen(row)}
                  >
                    Edit Permision
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    variant="contained"
                    endIcon={<PersonRemoveIcon />}
                    onClick={() => handleClickOpenRemove(row)}
                    color="error"
                  >
                    Remove User
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth={true}>
        <EditUserDialogComponent
          objectId={objectId}
          permission={permission}
          handleClose={handleClose}
        />
      </Dialog>
      <Dialog
        open={openRemove}
        onClose={handleCloseRemove}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to Remove this user?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to remove a user from the system. This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemove}>Cancel</Button>
          <Button onClick={() => removeUsers(objectId)} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

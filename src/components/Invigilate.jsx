import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { postRequest } from "../utils/serviceCall";
import { Header } from "./Header.jsx";
import { socket } from "../constants/socket";
import { useSelector } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Snackbar from "@material-ui/core/Snackbar";
import Avatar from "@material-ui/core/Avatar";
import PhotoIcon from "@material-ui/icons/Photo";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: theme.palette.background.paper,
  },
}));

const Invigilate = () => {
  const classes = useStyles();

  const [examID, setExamID] = useState(null);
  const location = useLocation();
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState({ status: false, email: "" });
  const [activity, setActivity] = useState([]);
  const [openSnack, setOpenSnack] = useState({ status: false, mssg: "" });
  const authReducer = useSelector((state) => state.authenticationReducer);
  let { user } = authReducer;
  if (user === null) user = {};
  const { email } = user;

  useEffect(() => {
    socket.emit("connect to room", email);
  }, [email]);

  const handleClickSnack = (mssg) => {
    setOpenSnack({ status: true, mssg: mssg });
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen({ status: false, mssg: "" });
  };

  useEffect(() => {
    socket.on("user report", (message) => {
      if (!openSnack.status) handleClickSnack(message.message);
    });
  });

  const getUsers = useCallback(async () => {
    if (!examID) return;
    const response = await postRequest("api/exam/users", { examId: examID });
    const userList = response.data.users.map((user) => user.userEmail);
    setUsers(userList);
  }, [examID]);

  const getActivity = async (email) => {
    const response = await postRequest("api/exam/fetch/activity", {
      examId: examID,
      studentEmail: email,
    });
    return response.data.activity;
  };

  const handleClickOpen = (email) => {
    getActivity(email).then((res) => {
      setOpen({ status: true, email: email });
      setActivity(res);
    });
  };

  const handleClose = () => {
    setOpen({ status: false, email: "" });
  };

  useEffect(() => {
    const { state = {} } = location;
    const { examID: stateExamID } = state;
    if (typeof stateExamID === "undefined") {
      history.push("/inv/dashboard");
      return;
    }
    setExamID(stateExamID);
  }, [examID, history, location]);

  useEffect(() => {
    if (!examID) return;
    getUsers();
  }, [examID, getUsers]);

  const getUsersForDisp = () =>
    users.map((user, index) => (
      <div key={user}>
        <ListItem button onClick={() => handleClickOpen(user)}>
          <ListItemText primary={`${index + 1}) User Email : ${user}`} />
        </ListItem>
        <Divider />
      </div>
    ));

  const getUserActivity = () =>
    activity.map((act, index) => (
      <div key={index}>
        <ListItem
          style={{
            background:
              act.status === 1
                ? "#fed8b1"
                : act.status === 2
                ? "#ffcccb"
                : "#d1ffd2",
          }}
          button
        >
          <ListItemText primary={`${index + 1}) ${act.message}`} />
          {act.image && act.image.length > 0 && (
            <a href={act.image} target="_blank" rel="noreferrer">
              <ListItemAvatar>
                <Avatar>
                  <PhotoIcon />
                </Avatar>
              </ListItemAvatar>
            </a>
          )}
        </ListItem>
        <Divider />
      </div>
    ));

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openSnack.status}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        message={openSnack.mssg}
      />
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "3rem",
        }}
      >
        <List component="nav" className={classes.root} aria-label="users">
          {getUsersForDisp()}
        </List>
      </div>
      <Dialog
        open={open.status}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">User Activity</DialogTitle>
        <DialogContent>
          <List component="nav" className={classes.root} aria-label="users">
            {getUserActivity()}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export { Invigilate };

import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText, Menu, MenuItem,
  Tooltip,
  Typography
} from '@material-ui/core';
import {withRouter} from "react-router-dom";
import {MoreVert} from "@material-ui/icons";
import api from "../../../../../../services/api";
import {toast} from "react-toastify";

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  title: {
    fontWeight: 'bold'
  },
  avatarStudent: {
    marginRight: theme.spacing(2),
    background: '#2196f3'
  },
  itensPeople : {
    color: '#2196f3',
    marginTop: '5px',
    marginBottom: '0px',
    fontSize: '15px',
    fontFamily: 'Verdana'
  },
}));

const PeopleListStudents = props => {
  const { className, onClickSearch, onChangeSearch, searchText, history, std, setRefresh, ...rest } = props;

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  async function changeStudentStatus(email, fk_class_id){
    try {
      let url = `class/professor/change-student-status?email=${email}&fk_class_id=${fk_class_id}`;
      const response = await api.post(url);

      if(response.status == 200) {
        toast.success(response.data.message);
        setRefresh(Date.now());
      } else {
        if(response.data.message){
          toast.error(response.data.message);
        }

      }

    } catch (error) {

    }
    setAnchorEl(null);
  }

  async function deleteStudentClass(email, fk_class_id){
    try {
      let url = `class/professor/delete-student?email=${email}&fk_class_id=${fk_class_id}`;
      const response = await api.delete(url);

      if(response.status == 200) {
        toast.success(response.data.message);
        setRefresh(Date.now());
      } else {
        if(response.data.message){
          toast.error(response.data.message);
        }

      }

    } catch (error) {

    }
    setAnchorEl(null);
  }

  return (
      <div>
        <ListItem>
          <Box flexDirection="row" display="flex">
            <ListItemAvatar >
              <Avatar style={{marginTop: '5px'}} className={clsx(std.active == 1 ? classes.avatarStudent : null, className)}>{std.id}</Avatar>
            </ListItemAvatar>
            <ListItemText>{
              <div>
                <div className={classes.itensPeople}>
                  {std.name}
                </div>
                <Typography variant="subtitle2"  component="p">
                   {std.email}
                </Typography>
              </div>
            }</ListItemText>
          </Box>
          <ListItemSecondaryAction>
            {localStorage.getItem('@Questione-acess-level-user') === "2" &&
              <Tooltip title="Opções">
                <IconButton
                    aria-label="settings"
                    onClick={handleClickMenu}>
                  <MoreVert style={{color: std.active == 1 && '#2196f3'}}/>
                </IconButton>
              </Tooltip>}
          </ListItemSecondaryAction>
        </ListItem>
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}>
          { std.active == 0 ? <MenuItem onClick={() => changeStudentStatus(std.email, std.fk_class_id)}>Habilitar {std.name.split(' ',1)}</MenuItem> : null}
          { std.active == 1 ? <MenuItem onClick={() => changeStudentStatus(std.email, std.fk_class_id)}>Desabilitar {std.name.split(' ',1)}</MenuItem> : null}
          <MenuItem onClick={() => deleteStudentClass(std.email, std.fk_class_id)}>Remover {std.name.split(' ',1)}</MenuItem>
        </Menu>
      </div>
  );
};

PeopleListStudents.propTypes = {
  className: PropTypes.string,
  std: PropTypes.object
};

export default withRouter(PeopleListStudents);

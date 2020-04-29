import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import {getInitials} from "../../../../../../helpers";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const Profile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const user = {
    name: localStorage.getItem("@Questione-name-user"),
    avatar: '/images/avatars/avatar_11.png',
    email: localStorage.getItem('@Questione-email-user'),
    level: localStorage.getItem('@Questione-acess-level-user')=="1"
        ? "Administrador" : localStorage.getItem('@Questione-acess-level-user')=="2"
           ? "Professor" : "Usuário"
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}>
        <Avatar
            className={classes.avatar}
            src={user.avatar}>
            {getInitials(user.name)}
        </Avatar>
      <Typography
        className={classes.name}
        variant="h5"
      >
        {user.name}
      </Typography>
      <Typography variant="body2">{user.email}</Typography>
      <Typography variant="body2">{user.level}</Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;

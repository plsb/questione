import React, {useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Avatar, Grid, Link, Typography} from '@material-ui/core';
import {getInitials} from "../../../../../../helpers";
import {Link as RouterLink} from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
    level: localStorage.getItem('@Questione-acess-level-user')==="1"
        ? "Administrador" : localStorage.getItem('@Questione-acess-level-user')==="2"
           ? "Professor(a)" : "Usuário"
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
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center">
          <Typography
            className={classes.name}
            variant="body2">
            {user.name}
          </Typography>
        </Grid>
      <Typography variant="body2">{user.email}</Typography>
      <Typography variant="body2">{user.level}</Typography>
      <Typography
          variant="body2">
        Atualize seu Perfil {' '}
        <Link
            component={RouterLink}
            to="/account"
            variant="body2">
          clicando aqui.
        </Link>
      </Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import { logout } from "../../../../services/auth";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    backgroundColor: '#3a7cf7',
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}));

const Topbar = props => {
  const history = useHistory();

  const { className, onSidebarOpen, ...rest } = props;

  const classes = useStyles();

  async function handleLogout(event) {
    event.preventDefault();

    logout();
    history.push('/sign-in');
  }

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <RouterLink to="/">
          <img
            alt="Logo"
            src="/images/logo.png"
          />
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
            <IconButton
              className={classes.signOutButton}
              color="inherit"
              onClick={handleLogout}>
              <InputIcon />
            </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func,
  history: PropTypes.object
};

export default Topbar;

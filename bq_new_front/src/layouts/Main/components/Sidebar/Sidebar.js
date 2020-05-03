import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import EmojiObjects from '@material-ui/icons/EmojiObjects';
import Note from '@material-ui/icons/Note';

import { Profile, SidebarNavAdm } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pagesAdm = [
    {
      title: 'Cursos',
      href: '/courses',
      icon: <DashboardIcon />
    },
    {
      title: 'Perfis',
      href: '/profiles',
      icon: <PeopleIcon />
    },
    {
      title: 'Competências',
      href: '/skills',
      icon: <Note />
    },
    {
      title: 'Obj. Conhecimento',
      href: '/objects',
      icon: <EmojiObjects />
    },
    {
      title: 'Usuários',
      href: '/users',
      icon: <AccountBoxIcon />
    },
  ];

  const pagesProfessor = [
    {
      title: 'Questões',
      href: '/questions',
      icon: <DashboardIcon />
    },
    {
      title: 'Avaliações',
      href: '/evaluations',
      icon: <PeopleIcon />
    }
  ];

  const pagesUser = [
    {
      title: 'Realizar Avaliação',
      href: '/courses',
      icon: <DashboardIcon />
    },
    {
      title: 'Minhas Avaliações',
      href: '/profiles',
      icon: <PeopleIcon />
    }
  ];

  function handlePage(event) {
    const level_user = localStorage.getItem("@Questione-acess-level-user");
    console.log("Usuer : "+level_user);
    if(level_user == 1){
      return pagesAdm;
    } else if(level_user == 2){
      return pagesProfessor;
    }
    return pagesUser;
  }

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}>
      <div
        {...rest}
        className={clsx(classes.root, className)}>
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNavAdm
            className={classes.nav}
            pages={handlePage()}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;

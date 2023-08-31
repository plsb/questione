import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ClassIcon from '@material-ui/icons/Class';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
// import PeopleIcon from '@material-ui/icons/People';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import { Note, Ballot, EmojiObjects, AccountBox, Assessment, Group } from '@material-ui/icons';

import { Profile, SidebarNavAdm } from './components';
// import {logout} from "../../../../services/auth";
import {withRouter} from "react-router-dom";

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
    marginTop: '20px',
    paddingLeft: '8px',
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, history, openTour, className, ...rest } = props;

  const classes = useStyles();

  const pagesAdm = [
    {
      title: 'Cursos',
      href: '/courses',
      icon: <DashboardIcon />
    },
    {
      title: 'Tipos de avaliação',
      href: '/type-of-evaluation',
      icon: <ClassIcon />
    },
    ,
    {
      title: 'Portarias',
      href: '/regulations',
      icon: <BookmarkBorderIcon />
    },
    {
      title: 'Competências',
      href: '/skills',
      icon: <Note />
    },
    {
      title: 'Conteúdos',
      href: '/objects',
      icon: <EmojiObjects />
    },
    {
      title: 'Mapeamento',
      href: '/mapping',
      icon: <ZoomOutMapIcon />
    },
    {
      title: 'Usuários',
      href: '/users',
      icon: <AccountBox />
    },
  ];

  const pagesProfessor = [
    {
      title: 'Questões',
      href: '/questions',
      icon: <QuestionAnswerIcon />,
      className: 'question-professor',
    },
    {
      title: 'Avaliações',
      href: '/evaluations',
      icon: <Ballot />,
      className: 'evaluation-professor',
    },
    // {
    //   title: 'Aplicações',
    //   href: '/applications-evaluation',
    //   icon: <Assignment />,
    //   className: 'applications-professor',
    // },
    /*{
      title: 'Pratique',
      href: '/evaluation-practice',
      icon: <ExtensionIcon />,
      className: 'practice',
    },*/
    {
      title: 'Turmas',
      href: '/student-class/professor',
      icon: <Group />,
      className: 'class-professor',
    },
    /*{
      title: 'Avaliações respondidas',
      href: '/student/result-evaluations',
      icon: <Assessment />,
      className: 'result-evaluations',
    }*/,
  ];

  const pagesUser = [
    /*{
      title: 'Pratique',
      href: '/evaluation-practice',
      icon: <ExtensionIcon />,
      className: 'practice',
    },*/
    /*{
      title: 'Avaliações respondidas',
      href: '/student/result-evaluations',
      icon: <Assessment />,
      className: 'result-evaluations',
    }*/,
    {
      title: 'Turmas',
      href: '/student-class/student',
      icon: <Group />,
      className: 'class-student',
    },
  ];

  function handlePage(event) {
    const level_user = localStorage.getItem("@Questione-acess-level-user");
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
        <Profile openTour={openTour}/>
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
  openTour: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default withRouter(Sidebar);

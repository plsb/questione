import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';


import { CourseToolbar, CourseTable } from './components';
import api from '../../../services/api';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

export default function CourseList () {
    const classes = useStyles();

    return (
    <div className={classes.root}>
          <CourseToolbar />
      <div className={classes.content}>
        <CourseTable />
      </div>
    </div>
    );
};

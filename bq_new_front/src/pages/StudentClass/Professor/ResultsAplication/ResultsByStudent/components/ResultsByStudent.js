import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Typography

} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  content: {
    padding: 0,
    marginTop: theme.spacing(2)
  },
}));

const ResultsByStudent = props =>{

    const classes = useStyles();
    return(
        <div className={classes.root}>
            <div className={classes.content}>
                <Typography>Resultados de cada aluno aqui!!</Typography>
            </div>

        </div>
    );
}

export default ResultsByStudent;
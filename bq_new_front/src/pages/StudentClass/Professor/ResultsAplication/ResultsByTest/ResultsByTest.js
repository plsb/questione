import React, { useEffect, useState } from 'react';
import api from "../../../../../services/api";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import EvaluationApplicationCard from "../ResultsByTest/components/EvaluationApplicationCard/EvaluationApplicationCard";
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Table,
  TableBody,
  LinearProgress,
  Card,
  CardHeader,
  CardContent

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

const ResultsByTest = props =>{

  const classes = useStyles();

   const { className, history, studentClassId } = props;
    
    const [evaluationsApplications, setEvaluationsApplications] = useState([]);

    const [teste, setTeste] = useState([]);

    async function loadEvaluationsApplications(){
        try {
          let url = `class/professor/list-applications/${studentClassId}`;
          
          const response = await api.get(url);
          
          if(response.status == 200) {  
            setEvaluationsApplications(response.data);
            setTeste(response.data);

          } else {
            setEvaluationsApplications([]);

          }
          
        } catch (error) {
          
        }
      }

    useEffect(() => {
      loadEvaluationsApplications();
      }, []);

      useEffect(() => {
        console.log('eva', evaluationsApplications);
      }, [evaluationsApplications]);
    
    return(
        <div className={classes.root}>
          <div className={classes.content}>
            
                { evaluationsApplications ?
                      
                                  evaluationsApplications.map((application, i) => (
                                                      
                                    <EvaluationApplicationCard 
                                          application={application} 
                                          key={application.id} 
                                          studentClassId={studentClassId} 
                                          position={(evaluationsApplications.length - i)}/>           
                                  ))
                       : null }         
                                 
                 
            </div>            
        </div>
    );
}

export default ResultsByTest;

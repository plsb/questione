import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TablePagination, CardHeader, Grid, LinearProgress
} from '@material-ui/core';
import api from '../../../../../services/api';

import { toast } from 'react-toastify';
import UsersToolbar from "./components/EvaluationApplicationToolbar";
import PropTypes from "prop-types";
import EvaluationApplicationCard from "../EvaluationApplicationCard";

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  content: {
    padding: 0,
    marginTop: theme.spacing(2)
  },
  inner: {
    minWidth: '100%'
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  headTable: {
    fontWeight: "bold"
  },
  actions: {
    justifyContent: 'flex-end'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const EvaluationApplicationTable = props => {
  const { className, history, studentClassId } = props;

  const [evaluationsApplications, setEvaluationsApplications] = useState(null);

  const classes = useStyles();

  
  const [searchText, setSearchText] = useState('');

  async function loadEvaluationsApplications(){
    try {
      let url = `class/professor/list-applications/${studentClassId}`;
      if(searchText != ''){
        url += '&description='+searchText;
      }
      const response = await api.get(url);
      if(response.status == 200) {  
        //setTotal(response.data.total);
        setEvaluationsApplications(response.data);
      } else {
        setEvaluationsApplications([]);
      }
      
    } catch (error) {
      
    }
  }

  useEffect(() => {
    loadEvaluationsApplications();
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    loadEvaluationsApplications(1);
  }

  const handlePageChange = (event, page) => {
    loadEvaluationsApplications(page+1)
  };


  return (
      <div className={classes.root}>
        {/*<UsersToolbar
            onChangeSearch={updateSearch.bind(this)}
            searchText={searchText}
            onClickSearch={onClickSearch}/>*/}
        <div className={classes.content}>

              {evaluationsApplications == null ?
                  <LinearProgress color="secondary"    />
                  :
                    <Grid
                        container
                        spacing={1}>
                      <Grid
                          item
                          md={12}
                          xs={12}>
                        <Table>
                          <TableBody>
                            {

                              evaluationsApplications.map((application, i) => (

                                  <EvaluationApplicationCard
                                      application={application}
                                      key={application.id}
                                      studentClassId={studentClassId}
                                      position={(evaluationsApplications.length - i)}/>
                              ))
                            
                            }
                          </TableBody>
                        </Table>
                      </Grid>
                    </Grid> }
        </div>
      </div>
  );
};

EvaluationApplicationTable.propTypes = {
  history: PropTypes.object
};

export default EvaluationApplicationTable;

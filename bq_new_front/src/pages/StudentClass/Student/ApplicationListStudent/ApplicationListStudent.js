import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TablePagination, CardHeader, Grid, LinearProgress, Chip, Typography, IconButton, Tooltip
} from '@material-ui/core';
import api from '../../../../services/api';
import EvaluationApplicationCardStudent from '../EvaluationApplicationCardStudent';
import {PlayArrow} from "@material-ui/icons";

import { toast } from 'react-toastify';
import PropTypes from "prop-types";


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

const AplicationListStudent = props => {
  const { className, history, studentClassId } = props;

  const [evaluationsApplications, setEvaluationsApplications] = useState(null);

  const classes = useStyles();

  
  const [searchText, setSearchText] = useState('');

  async function loadEvaluationsApplications(){
    try {
      let url = `class/student/list-applications/${studentClassId}`;
      
      const response = await api.get(url);
      console.log('aplicacao student', response.data);
      if(response.status == 200) {  
        //setTotal(response.data.total);
        setEvaluationsApplications(response.data);
        console.log('aplicacao student', response.data);
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
                            {evaluationsApplications.map((application, i) => (
                                <EvaluationApplicationCardStudent
                                    answer_head={application.answer_head}
                                    application={application.application}
                                    key={application.application.id}
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

AplicationListStudent.propTypes = {
  history: PropTypes.object
};

export default AplicationListStudent;
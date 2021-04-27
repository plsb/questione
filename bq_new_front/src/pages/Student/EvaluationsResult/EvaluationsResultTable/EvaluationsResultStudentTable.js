import React, {useEffect, useState} from 'react';
import moment from 'moment';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  IconButton,
  Typography, Table, TableBody, CardActions, TablePagination, Tooltip, Switch, Chip, Grid, LinearProgress
} from '@material-ui/core';
import api from "../../../../services/api";
import ToolbarEvaluation
  from "./EvaluationResultToolbar/EvaluationResultStudentToolbar";
import {Close, FormatListBulleted, PlayArrow} from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  root: {
    margin: 10,
  },
  content: {
    padding: 0
  },
  labelRed: {
    backgroundColor: '#daa520',
    display: 'block',
    margin: '2px',
    padding: '3px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4
  },
  chipblue: {
    margin: 3,
    marginTop: '16px',
    backgroundColor: '#2196f3',
    color: '#fff',
  },
  chipred: {
    margin: 3,
    marginTop: '16px',
    backgroundColor: '#d2691e',
    color: '#fff',
  },
  chipgreen: {
    margin: 3,
    marginTop: '16px',
    backgroundColor: '#6b8e23',
    color: '#fff',
  },
  dFlex: {
    display: 'flex',
  }
}));

const EvaluationsResultStudentTable = props => {
  const { className, history, ...rest } = props;
  const [ evaluations, setEvaluations ] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');

  const classes = useStyles();

  async function load(){
    try {
      const responseHead = await api.get('/evaluation/student/result/evaluations');
      if (responseHead.status === 200) {
        setEvaluations(responseHead.data.data);
        setTotal(responseHead.data.total);
      } else {
        setEvaluations([]);
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    load();

  }, []);

  const handleBack = () => {
    history.goBack();
  };

  const handlePageChange = (event, page) => {
    load(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    load(1);
  }

  const results = (idHead) => {
    history.push('/student/result-evaluations/details/'+idHead);
  }

  return (
      <div className={classes.root}>
        <ToolbarEvaluation
            onChangeSearch={updateSearch.bind(this)}
            searchText={searchText}
            onClickSearch={onClickSearch}/>
        <div className={classes.content}>
          <Card
              className={clsx(classes.root, className)}>
            <CardHeader
                avatar={
                  <div>


                  </div>
                }
                action={
                  <TablePagination
                      component="div"
                      count={total}
                      onChangePage={handlePageChange}
                      onChangeRowsPerPage={handleRowsPerPageChange}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      rowsPerPageOptions={[10]}
                  />

                }/>
            <CardContent>
              {evaluations == null ?
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
                            {evaluations.map(application => (
                                <Card
                                    {...rest}
                                    className={classes.root}>
                                  <CardHeader
                                      className={classes.head}
                                      action={
                                        <div className={classes.dFlex}>
                                          { application.evaluation_application.show_results == 1 && application.finalized_at ?
                                          <Tooltip title="Visualizar resultados">
                                            <IconButton
                                                aria-label="copy"
                                                onClick={() => results(application.id)}>
                                              <FormatListBulleted/>
                                            </IconButton>
                                          </Tooltip>
                                            :
                                              application.evaluation_application.show_results == 0 && application.finalized_at && <span className={classes.labelRed}>{'Resultado não liberado.'}</span>
                                          }

                                          {!application.finalized_at && application.finished_automatically === 0 && (
                                              <Tooltip title="Realizar avaliação">
                                                  <IconButton
                                                      aria-label="settings"
                                                      onClick={() => history.push(`/code/${application.evaluation_application.id_application}`)}>
                                                      <PlayArrow />
                                                  </IconButton>
                                              </Tooltip>
                                          )}
                                        </div>
                                      }/>
                                      <CardContent>
                                        <div>
                                          <Typography variant="h5" color="textSecondary" component="h2">
                                            {'Descrição da avaliação: '+application.evaluation_application.evaluation.description }
                                          </Typography>
                                          <Typography variant="h5" color="textSecondary" component="h2">
                                            {'Descrição da aplicação: '+application.evaluation_application.description }
                                          </Typography>
                                          {application.evaluation_application.evaluation.practice !== 1 && (
                                            <Typography variant="h5" color="textSecondary" component="h2">
                                              {'Professor(a): '+application.evaluation_application.evaluation.user.name }
                                            </Typography>
                                          )}

                                          {application.finalized_at && (
                                            <Typography variant="h5" color="textSecondary" component="h2">
                                              {'Data de realização: '+moment(application.finalized_at).format('DD/MM/YYYY hh:mm') }
                                            </Typography>
                                          )}

                                          {application.evaluation_application.evaluation.practice === 1 && (
                                            <Chip label="Pratique" className={clsx(classes.chipblue, className)} size="small"/>
                                          )}

                                          {application.finalized_at && application.finished_automatically === 0 && (
                                            <Chip label="Finalizada" className={clsx(classes.chipred, className)} size="small"/>
                                          )}

                                          {application.finalized_at && application.finished_automatically === 1 && (
                                            <Chip label="Finalizada automaticamente" className={clsx(classes.chipred, className)} size="small"/>
                                          )}

                                          {!application.finalized_at && application.finished_automatically === 0 && (
                                            <Chip label="Iniciada" className={clsx(classes.chipgreen, className)} size="small"/>
                                          )}
                                        </div>
                                      </CardContent>
                                </Card>
                            ))}
                          </TableBody>
                        </Table>
                      </Grid>
                    </Grid> }
            </CardContent>
            <CardActions className={classes.actions}>
              <TablePagination
                  component="div"
                  count={total}
                  onChangePage={handlePageChange}
                  onChangeRowsPerPage={handleRowsPerPageChange}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[10]}
              />
            </CardActions>
          </Card>
        </div>
      </div>
  );
};

EvaluationsResultStudentTable.propTypes = {
  className: PropTypes.string,
};

export default EvaluationsResultStudentTable;

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
  Typography, Table, TableBody, CardActions, TablePagination, Tooltip, Switch, Chip, Grid, LinearProgress,
  Select,
  MenuItem,
} from '@material-ui/core';
import api from "../../../../../services/api";
import ToolbarEvaluation
  from "./EvaluationResultToolbar/EvaluationResultStudentToolbar";
import {Close, FormatListBulleted, PlayArrow} from "@material-ui/icons";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const useStyles = makeStyles(() => ({
  root: {
    margin: 10,
    position: 'relative',
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
  chippurple: {
    margin: 3,
    marginTop: '16px',
    backgroundColor: '#4a148c',
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
  },
  releaseResultsMessage: {
    position: 'absolute',
    top: '16px',
    left: '16px',
  }
}));

const EvaluationsResultStudentTable = props => {
  const { className, history, ...rest } = props;
  const [ evaluations, setEvaluations ] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');

  // Filters
  const [openModuleSelect, setOpenModuleSelect] = useState(false);
  const [selectedModule, setSelectedModule] = useState('select');
  const [moduleOptions] = useState([
    { title: 'Comum', value: 'common' },
    { title: 'Pratique', value: 'practice' },
  ]);

  const [openStatusSelect, setOpenStatusSelect] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusOptions] = useState([
    { title: 'Iniciada', value: 'started' },
    { title: 'Finalizada', value: 'finished' },
  ]);

  const classes = useStyles();

  async function load(newPage, currentModule, currentStatus){
    try {
      currentModule = currentModule === 'select' ? '' : currentModule;
      currentStatus = currentStatus === 'select' ? '' : currentStatus;

      const responseHead = await api.get(`class/student/evaluations/answered/${props.studentClassId}/?page=${newPage}&module=${currentModule}&status=${currentStatus}`);
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
    load(1, selectedModule, selectedStatus);
  }, []);

  const handleBack = () => {
    history.goBack();
  };

  const handlePageChange = (event, page) => {
    load(page+1, selectedModule, selectedStatus)
    setPage(page);
  };

  const handleModuleChange = (event) => {
    const { value } = event.target;
    setSelectedModule(value);
    load(page, value, selectedStatus);
  };

  const handleStatusChange = (event) => {
    const { value } = event.target;
    setSelectedStatus(value);
    load(page, selectedModule, value);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    load(1, selectedModule, selectedStatus);
  }

  const results = (idHead) => {
    history.push('/student/result-evaluations/details/'+idHead);
  }

  return (
      <div className={classes.root}>
        <ToastContainer autoClose={10000} position="bottom-center"/>
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
                      <Select
                        labelId="module-label"
                        id="module"
                        name="module"
                        open={openModuleSelect}
                        onOpen={() => setOpenModuleSelect(true)}
                        onClose={() => setOpenModuleSelect(false)}
                        value={selectedModule || 'select'}
                        onChange={handleModuleChange}
                        className={classes.root}
                      >
                        <MenuItem value="select">Selecione</MenuItem>
                        {moduleOptions.map((module) => (
                          <MenuItem key={module.value} value={module.value}>{module.title}</MenuItem>
                        ))}
                      </Select>

                      <Select
                        labelId="module-label"
                        id="module"
                        name="module"
                        open={openStatusSelect}
                        onOpen={() => setOpenStatusSelect(true)}
                        onClose={() => setOpenStatusSelect(false)}
                        value={selectedStatus || 'select'}
                        onChange={handleStatusChange}
                        className={classes.root}
                      >
                        <MenuItem value="select">Selecione</MenuItem>
                        {statusOptions.map((status) => (
                          <MenuItem key={status.value} value={status.value}>{status.title}</MenuItem>
                        ))}
                      </Select>
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
                              <div key={application.id}>
                                <Card
                                  {...rest}
                                  className={classes.root}
                                >
                                  {/*application.evaluation_application.canShowResults == 0 && (
                                    <div className={classes.releaseResultsMessage}>
                                      Data de liberação dos resultados:
                                      <span> </span>
                                      {moment(`${application.evaluation_application.date_release_results} ${application.evaluation_application.time_release_results}`).format('DD/MM/YYYY H:mm')}
                                    </div>
                                  )*/}
                                  <CardHeader
                                      className={classes.head}
                                      action={
                                        <div>
                                          <div className={classes.dFlex}>
                                            { application.evaluation_application.show_results == 1 &&
                                                application.evaluation_application.canShowResults == 1 && application.finalized_at ?
                                            <Tooltip title="Visualizar resultados">
                                              <IconButton
                                                  aria-label="copy"
                                                  onClick={() => results(application.id)}>
                                                <FormatListBulleted/>
                                              </IconButton>
                                            </Tooltip>
                                              :
                                                application.evaluation_application.canShowResults == 0 && application.evaluation_application.show_results == 1
                                                    ? <span className={classes.labelRed}>{'Resultado em: '+moment(`${application.evaluation_application.date_release_results} ${application.evaluation_application.time_release_results}`).format('DD/MM/YYYY H:mm')}</span>
                                                        :
                                                          application.evaluation_application.show_results == 0 && application.finalized_at && <span className={classes.labelRed}>{'Resultado indisponível.'}</span>
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
                                              {'Data de realização: '+moment(application.finalized_at).format('DD/MM/YYYY H:mm') }
                                            </Typography>
                                          )}

                                          {application.evaluation_application.evaluation.practice === 1 && (
                                            <Chip label="Pratique" className={clsx(classes.chippurple, className)} size="small"/>
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
                              </div>
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
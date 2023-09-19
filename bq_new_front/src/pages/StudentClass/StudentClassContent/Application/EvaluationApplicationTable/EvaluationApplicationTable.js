import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TablePagination,
  CardHeader,
  Grid,
  LinearProgress,
  Button,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  DialogActions, Dialog, Typography, Paper, AppBar, Toolbar, List, ListItem, ListItemText, Divider
} from '@material-ui/core';
import api from '../../../../../services/api';

import { toast } from 'react-toastify';
import UsersToolbar from "./components/EvaluationApplicationToolbar";
import PropTypes from "prop-types";
import EvaluationApplicationCard from "../EvaluationApplicationCard";
import {useTheme} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import EvaluationCard from "../../../../Professor/Evaluation/EvaluationCard/EvaluationCard";
import IconButton from "@material-ui/core/IconButton";
import PlayArrow from "@material-ui/icons/PlayArrow";
import CloseIcon from "@material-ui/icons/Close";
import moment from "moment/moment";
import EvaluationQuestions from "../../../../../components/EvaluationQuestions/EvaluationQuestions";

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  content: {
    marginTop: theme.spacing(1)
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
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: 2,
    flex: 1,
    fontWeight: 'bold',
    color: '#ffffff'
  },
}));

const EvaluationApplicationTable = props => {
  const { className, history, studentClassId } = props;

  const [evaluations, setEvaluations] = useState(null);
  const [totalEvaluations, setTotalEvaluations] = useState(0);
  const [evaluationsApplications, setEvaluationsApplications] = useState(null);

  const classes = useStyles();

  const [openNewApplication, setOpenNewApplication] = React.useState(false);
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [evaluationSelected, setEvaluationSelected] = useState(null);

  
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

  const loadEvaluations = async (page) => {
    try {
      let status = 1;
      const response = await api.get(`evaluation`, {
        params: {
          status,
          page
        },
      });

      if (response.status == 200) {
        setTotalEvaluations(response.data.total);
        setEvaluations(response.data.data);
      } else {
        setEvaluations([]);
      }

    } catch (e) {

    }
  };

  useEffect(() => {
    loadEvaluations(1);
    loadEvaluationsApplications();
  }, []);

  useEffect(() => {
    loadEvaluationsApplications();
  }, [evaluationSelected]);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    loadEvaluationsApplications(1);
  }

  const handlePageChange = (event, page) => {
    loadEvaluationsApplications(page+1)
  };

  const handlePageChangeEvaluations = (event, page) => {
    loadEvaluations(page + 1, 1, searchText)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const handleNewApplicationExit = () => {
    setOpenNewApplication(false);
    setEvaluationSelected(null);
  }

  const handleNewApplication = () => {
    setOpenNewApplication(true);
  };

  async function newApplication(){
    if(evaluationSelected != null){
      try {

        const fk_evaluation_id = evaluationSelected.id;
        const description = evaluationSelected.description + ' (Simulado de '+new Date().toLocaleDateString('pt-BR')+')';
        const fk_class_id = studentClassId;
        const data = {
          description, fk_evaluation_id, fk_class_id
        }
        const response = await api.post('evaluation/add-application', data);
        if (response.status === 202) {
          if(response.data.message){
            toast.error(response.data.message);
          }
          setOpenNewApplication(false);
          setEvaluationSelected(null);
        } else {
          toast.success('Nova aplicação cadastrada.');
          setOpenNewApplication(false);
          setEvaluationSelected(null);
        }

      } catch (error) {

      }

    }
  }


  return (
      <div className={classes.root}>
        {/*<UsersToolbar
            onChangeSearch={updateSearch.bind(this)}
            searchText={searchText}
            onClickSearch={onClickSearch}/>*/}
        <div className={classes.content}>
          <Button style={{marginBottom:'20px'}} color="primary" variant='outlined' onClick={handleNewApplication}>Adicionar Simulado</Button>

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
        <Dialog fullScreen={true}
                onClose={handleNewApplicationExit}
                aria-labelledby="responsive-dialog-title" open={openNewApplication}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleNewApplicationExit} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Selecione a avaliação
              </Typography>

            </Toolbar>
          </AppBar>

          {/* não foi selecionada a avaliação*/}
          {evaluationSelected == null && evaluations == null ?
              <LinearProgress color="secondary" />
              :
              evaluationSelected == null &&
              <div style={{margin: '10px'}}>
                <TablePagination
                    component="div"
                    count={totalEvaluations}
                    onChangePage={handlePageChangeEvaluations}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                />
                <List>
                  {evaluations.map(evaluation => (
                      <div>
                        <Divider/>
                        <ListItem button onClick={() => setEvaluationSelected(evaluation)}>
                          <ListItemText id={evaluation.id} primary={
                            <Typography variant="subtitle1" color="#000000" component="p">
                              {'Descrição: '+evaluation.description}
                            </Typography>}

                             secondary={
                            <Typography variant="subtitle2" color="#000000" component="p">
                               {"Criada em: "+  moment(evaluation.created_at).format('DD/MM/YYYY')}
                             </Typography>}/>
                        </ListItem>
                        <Divider/>
                      </div>

                  ))}

                </List>
              </div>}

          {evaluationSelected != null &&
            <div style={{margin: '10px'}}>
              <Button variant="outlined" color="primary" size="small" onClick={newApplication}>
                  Criar um Simulado a partir desta avaliação
              </Button>
              <EvaluationQuestions evaluationId={evaluationSelected.id}/>
            </div>
            }
        </Dialog>
      </div>
  );
};

EvaluationApplicationTable.propTypes = {
  history: PropTypes.object
};

export default EvaluationApplicationTable;

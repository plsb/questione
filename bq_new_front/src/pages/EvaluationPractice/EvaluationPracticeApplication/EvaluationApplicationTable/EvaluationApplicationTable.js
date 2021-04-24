import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  Dialog,
  AppBar,
  Toolbar,
  CardActions,
  CardContent,
  IconButton,
  Typography,
  Table,
  Button,
  TextField,
  TableBody,
  TablePagination, CardHeader, Grid, LinearProgress
} from '@material-ui/core';
import api from '../../../../services/api';
import CloseIcon from "@material-ui/icons/Close";

import Swal from "sweetalert2";
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
  fieldsDialog: {
    marginTop: 20
  }
}));

const EvaluationApplicationTable = props => {
  const { className, history } = props;
  const { idApplication } = props.match.params;

  const [evaluationsApplications, setEvaluationsApplications] = useState(null);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = React.useState(false);
  const [descriptionNewApplication, setDescriptionNewApplication] = React.useState('');

  //configuration alert
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  function loadAlert(icon, message) {
    Toast.fire({
      icon: icon,
      title: message
    });
  }

  async function loadEvaluationsApplications(page){
    try {
      let url = `evaluation/practice/list-applications/${idApplication}?page=+${page}`;
      if(searchText != ''){
        url += '&description='+searchText;
      }
      const response = await api.get(url);
      if(response.status == 200) {
        setTotal(response.data.total);
        setEvaluationsApplications(response.data.data);
      } else {
        setEvaluationsApplications([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadEvaluationsApplications(1);
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadEvaluationsApplications(1);
  }

  const handlePageChange = (event, page) => {
    loadEvaluationsApplications(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  async function saveNewApplication() {
      try {
          if (descriptionNewApplication.length < 5) {
              setOpenNewApplication(false);
              loadAlert('error', 'Informe uma descrição com no mínimo 05 caracteres');
              return;
          }
          const fk_evaluation_id = idApplication;
          const description = descriptionNewApplication;
          const data = {
              description,
          }
          const response = await api.post(`evaluation/practice/add-application/${fk_evaluation_id}`, data);
          if (response.status === 202) {
              if (response.data.message) {
                  loadAlert('error', response.data.message);
              }
              setOpenNewApplication(false);
          } else {
              loadAlert('success', 'Nova aplicação cadastrada.');
              setDescriptionNewApplication('');
              setOpenNewApplication(false);
              window.location.reload();
          }

      } catch (error) {

      }
  }

  //dialog de nova aplicação
  const [openNewApplication, setOpenNewApplication] = React.useState(false);

  const handleNewApplication = () => {
    setOpenNewApplication(true);
  };

  const handleNewApplicationExit = () => {
    setOpenNewApplication(false);
  }

  const handleChangeDescriptionNewApplication = (e) => {
    setDescriptionNewApplication(e.target.value);
  }

  return (
      <div className={classes.root}>
        <UsersToolbar
          onChangeSearch={updateSearch.bind(this)}
          searchText={searchText}
          onClickSearch={onClickSearch}
          onClickHandleNewApplication={handleNewApplication}
        />
            

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
                            {evaluationsApplications.map(application => (
                                <EvaluationApplicationCard application={application} idApplication={idApplication} />
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

            {/* Dialog de cadastro de aplicação */}
            <Dialog fullScreen onClose={handleNewApplicationExit} aria-labelledby="simple-dialog-title" open={openNewApplication}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleNewApplicationExit} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h5" className={classes.title}>
                            Informe a descrição para a aplicação
                        </Typography>
                    </Toolbar>
                </AppBar>
                <TextField
                    fullWidth
                    label="Descrição"
                    margin="dense"
                    name="description"
                    variant="outlined"
                    onChange={handleChangeDescriptionNewApplication}
                    value={descriptionNewApplication}
                    className={classes.fieldsDialog}
                />
                <Button
                    color="primary"
                    variant="outlined"
                    className={classes.fieldsDialog}
                    onClick={saveNewApplication}>
                    Salvar
                </Button>
            </Dialog>
          </Card>
        </div>
      </div>
  );
};

EvaluationApplicationTable.propTypes = {
  history: PropTypes.object
};

export default EvaluationApplicationTable;

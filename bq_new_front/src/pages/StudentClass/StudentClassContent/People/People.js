import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Avatar,
  List,
  ListItem,
  Divider,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tooltip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions, Button, Grid, ListItemSecondaryAction, MenuItem, Menu
} from '@material-ui/core';
import api from '../../../../services/api';
import PropTypes from "prop-types";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { toast } from 'react-toastify';
import {MoreVert} from "@material-ui/icons";
import PeopleListStudents from "./components/PeopleListStudents";
import useStyles from "../../../../style/style";

const useStylesLocal = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('xs')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(6),
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(15),
      paddingRight: theme.spacing(15),
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: theme.spacing(40),
      paddingRight: theme.spacing(40),
    },

  },
  content: {
    padding: 0,
    marginTop: theme.spacing(1)
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatarProfessor: {
    marginRight: theme.spacing(2),
    background: '#2196f3'
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
  title: {
    color: '#000',
    marginTop: '50px',
    marginBottom: '10px',
    fontWeight: 'bold',
    fontSize: '20px',
    fontFamily: 'Verdana'
  },
  itensPeople : {
    color: '#2196f3',
    marginTop: '12px',
    marginBottom: '12px',
    fontSize: '15px',
    fontFamily: 'Verdana'
  }
}));

const People = props => {
  const { className, history, idClass } = props;
  const pathname = window.location.pathname;
  const studentClassId = pathname.substring(pathname.lastIndexOf('/') + 1);

  const [professor, setProfessor] = useState([]);
  const [students, setStudents] = useState([]);

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  //dialog
  const [open, setOpen] = React.useState(false);
  const [studentEmail, setStudentEmail] = React.useState(null);
  const [refresh, setRefresh] = React.useState(0);


  const handleClickOpen = () => {
    setOpen(true);
    setStudentEmail(null);
  };

  const handleClose = () => {
    setOpen(false);
    setStudentEmail(null);
  };


  const handleNewStudent = () => {
    if(studentEmail == null){
      toast.error('Não foi informado o e-mail do estudante.');
    } else {
      addStudent();
      setOpen(false);
      setStudentEmail(null);
    }
  }

  const handleChangeEmail = event => {
    setStudentEmail(event.target.value);
  }

  async function loadPeoples(){
    try {
      let id = idClass ? idClass : studentClassId;
      let url = `class/student/details/${id}`;
      const response = await api.get(url);

      if(response.status == 200) {
        setProfessor(response.data.professor);
        setStudents(response.data.students);
      } else {
        setProfessor([]);
        setStudents([]);
      }

    } catch (error) {

    }
  }

  async function addStudent(){
    try {
      let url = `class/professor/add-student/?email=${studentEmail}&fk_class_id=${studentClassId}`;
      const response = await api.post(url);

      if(response.status == 200) {
        toast.success(response.data.message);
        setRefresh(Date.now());
      } else {
        if(response.data.message){
          toast.error(response.data.message);
        }
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    loadPeoples();
  }, [refresh]);

  return (
      <div className={classes.root}>
            <div className={classes.content}>
              <div className={classes.title}>
                Professor(a)
              </div>
              <Divider />
              <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                       { professor ? 
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar className={clsx(classes.avatarProfessor, className)}>{professor.id}</Avatar>
                              </ListItemAvatar>
                              <ListItemText>{
                                <div className={classes.itensPeople}>
                                  {professor.name}
                                </div>
                              }</ListItemText>
                            </ListItem> 
                          : null }    
              </List>
          </div>


          <div className={classes.content}>
            <Box display="flex">
              <Box flexGrow={1}>
                <div className={classes.title}>
                  Estudantes
                </div>
              </Box>
              <Box display="flex" alignItems="flex-end">
                {students.length == 0 ?
                    <div style={{ marginBottom: '12px'}}>
                      {'0 estudantes'}
                    </div> :
                    students.length == 1 ?
                        <div style={{ marginBottom: '12px'}}>
                        {students.length+' estudante'}
                      </div> :
                        <div style={{ marginBottom: '12px'}}>
                            {students.length+' estudantes'}
                          </div>}

                {localStorage.getItem('@Questione-acess-level-user') === "2" &&
                    <Tooltip title="Adicionar estudante">
                  <IconButton
                      aria-label="copy"
                      onClick={handleClickOpen}>
                    <PersonAddIcon style={{color: '#2196f3'}} />
                  </IconButton>
                </Tooltip>}
              </Box>
            </Box>
            <Divider />
            <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                     { students ?
                        students.map(std => (
                          <PeopleListStudents std={std} setRefresh={setRefresh}/>
                        ))
                      : null}
            </List>
          </div>

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{
            <div>
              <div className={classesGeneral.titleDialog}>
                {'Cadastrar estudante na turma'}
              </div>
              <div className={classesGeneral.messageDialog}>
                {'Para cadastrar um estudante, por favor informe o e-mail.'}
              </div>
            </div>
            }</DialogTitle>
          <DialogContent>

            <TextField
                autoFocus
                margin="dense"
                id="email"
                value={studentEmail}
                onChange={handleChangeEmail}
                label="E-mail do estudante"
                type="email"
                fullWidth/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Fechar
            </Button>
            <Button onClick={handleNewStudent} color="primary">
              Cadastrar estudante
            </Button>
          </DialogActions>
        </Dialog>


      </div>

  );
};

People.propTypes = {
  history: PropTypes.object
};

export default People;

import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Typography,
  Avatar, 
  List, 
  ListItem,
  Divider,
  ListItemAvatar, 
  ListItemButton, 
  ListItemText
} from '@material-ui/core';
import api from '../../../../services/api';
import PropTypes from "prop-types";
//import { deepOrange, deepPurple } from '@material-ui/styles';
//import { SketchPicker } from 'react-color';

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
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
  avatarStudent: {
    marginRight: theme.spacing(2),
    background: '#1769aa'
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
  }
}));

const People = props => {
  const { className, history } = props;
  const pathname = window.location.pathname;
  const studentClassId = pathname.substring(pathname.lastIndexOf('/') + 1);

  const [professor, setProfessor] = useState([]);
  const [students, setStudents] = useState([]);

  const classes = useStyles();

  const [refresh, setRefresh] = React.useState(0);

  async function loadPeoples(page){
    try {
      let url = `class/student/details/${studentClassId}`;
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

  useEffect(() => {
    loadPeoples(1);
  }, [refresh]);



  return (
      <div className={classes.root}>
            <Typography variant="h4" color="textSecondary" component="h3" style={{ marginBottom: '10px' }}>Professores </Typography>
            <Divider />
            <div className={classes.content}>
              <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                       { professor ? 
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar className={clsx(classes.avatarProfessor, className)}>{professor.id}</Avatar>
                              </ListItemAvatar>
                              <ListItemText>{professor.name}</ListItemText>
                            </ListItem> 
                          : null }    
              </List>
          </div>


          <div className={classes.content}>
          <Typography variant="h4" color="textSecondary" component="h3" style={{ marginTop: '50px', marginBottom: '10px' }}>Alunos ({students.length}) </Typography>
          <Divider />
              <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                       { students ? 
                        
                          students.map(std => (
                            <ListItem>
                              <ListItemAvatar >
                                <Avatar className={clsx(classes.avatarStudent, className)}>{std.id}</Avatar>
                              </ListItemAvatar>
                              <ListItemText>{std.name}</ListItemText>
              
                            </ListItem>
                          )) 
                        
                        : null}
                       
                       
                       
                         
              </List>
            </div>
           

      </div>

  );
};

People.propTypes = {
  history: PropTypes.object
};

export default People;

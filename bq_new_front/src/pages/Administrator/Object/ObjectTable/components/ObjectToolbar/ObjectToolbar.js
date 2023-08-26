import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {Button, MenuItem, TextField, Typography} from '@material-ui/core';
import api from "../../../../../../services/api";
import FindInPage from '@material-ui/icons/SearchSharp';
import {withRouter} from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  comboboxSearch: {
    width: '60%'
  },
  spacer: {
    flexGrow: 1
  },
  buttonSeacrh: {
    marginLeft: theme.spacing(1),
  },
  searchInput: {
    marginRight: theme.spacing(1)
  },
  title: {
    fontWeight: 'bold'
  }
}));

const ObjectToolbar = props => {
  const { className, onChangeSearchCourse, onClickSearch,  history,
           searchTextCourse, searchTextRegulation, onChangeSearchRegulation, ...rest } = props;
  const [courses, setCourses] = useState([{'id': '0', 'description': 'Todos os cursos'}]);
  const [regulations, setRegulations] = useState([{'id': '0', 'description': 'Todas as portarias'}]);

  const classes = useStyles();

  const onClickNewObject = e => {
    history.push('/object-details');
  }

  async function loadCourses(){
    try {
      const response = await api.get('all/courses');
      setCourses([...courses, ...response.data]);

    } catch (error) {

    }
  }

  async function loadRegulations(){
    try {
      let courseSelect = localStorage.getItem('@Questione-course-selected');

      if(courseSelect == null){
        setRegulations([{'id': '0', 'description': 'Nenhuma portaria'}]);
      } else if(courseSelect == 0){
        setRegulations([{'id': '0', 'description': 'Nenhuma portaria'}]);
      } else {
        const response = await api.get('regulation/by-course/'+courseSelect);
        if (response.status == 200) {
          if(response.data.length > 0) {
            setRegulations([{'id': '0', 'description': 'Todas as portarias'}]);
            setRegulations([{'id': '0', 'description': 'Todas as portarias'}, ...response.data]);
          } else {
            setRegulations([{'id': '0', 'description': 'Nenhuma portaria'}]);
          }
        }
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    loadCourses();
    loadRegulations();
  }, []);

  useEffect(() => {
    loadRegulations();
  }, [searchTextCourse]);

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <Typography variant="h3" className={classes.title}>{'Conteúdos'}</Typography>
        <span className={classes.spacer} />
        <Button
            color="primary"
            variant="contained"
            onClick={onClickNewObject}>
          Novo Conteúdo
        </Button>
      </div>
      <div className={classes.row}>
        <TextField
            id="filled-select-currency"
            select
            label="Selecione o curso"
            value={searchTextCourse}
            onChange={onChangeSearchCourse}
            helperText="Selecione o curso que deseja pesquisar."
            variant="outlined"
            margin="dense">
          {courses.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.description}
              </MenuItem>
          ))}
        </TextField>
        <TextField
            id="filled-select-currency"
            className={classes.buttonSeacrh}
            select
            label="Selecione a portaria"
            value={searchTextRegulation}
            onChange={onChangeSearchRegulation}
            helperText="Selecione a portaria que deseja pesquisar."
            variant="outlined"
            margin="dense">
          {regulations.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.id == 0 ? option.description : option.description+" de "+option.year}
              </MenuItem>
          ))}
        </TextField>
        <Button
            className={classes.buttonSeacrh}
            onClick={onClickSearch}>
          <FindInPage fontSize="large"/>
        </Button>
      </div>
    </div>
  );
};

ObjectToolbar.propTypes = {
  className: PropTypes.string,
  onChangeSearch: PropTypes.func,
  onClickSearch: PropTypes.func,
  searchText: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(ObjectToolbar);

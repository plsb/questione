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
  const { className, onChangeSearch, onClickSearch, history,
                                searchText, ...rest } = props;
  const [courses, setCourses] = useState([{'id': '0', 'description': 'Todos os cursos'}]);

  const classes = useStyles();

  const onClickNewObject = e => {
    history.push('/object-details');
  }

  async function loadCourses(){
    try {
      const response = await api.get('all/courses');
      console.log()
      setCourses([...courses, ...response.data]);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <Typography variant="h3" className={classes.title}>{'Lista de Objetos de Conhecimento'}</Typography>
        <span className={classes.spacer} />
        <Button
            color="primary"
            variant="contained"
            onClick={onClickNewObject}>
          Novo Objeto
        </Button>
      </div>
      <div className={classes.row}>
        <TextField
            id="filled-select-currency"
            select
            label="Selecione o curso"
            value={searchText}
            onChange={onChangeSearch}
            helperText="Selecione o curso que deseja pesquisar."
            variant="outlined"
            margin="dense">
          {courses.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.description}
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

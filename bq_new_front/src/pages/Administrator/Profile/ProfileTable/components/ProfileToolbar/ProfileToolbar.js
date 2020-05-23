import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {Button, TextField, MenuItem, Typography} from '@material-ui/core';
import api from "../../../../../../services/api";
import SearchSharp from '@material-ui/icons/SearchSharp';
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
    width: '100%'
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

const ProfileToolbar = props => {
  const { className, onChangeSearch, onClickSearch, history, searchText, ...rest } = props;
  const [courses, setCourses] = useState([{'id': '0', 'description': 'Todos os cursos'}]);

  const classes = useStyles();

  async function loadCourses(){
    try {
      const response = await api.get('all/courses');
      if(response.status == 200) {
        setCourses([...courses, ...response.data]);
      }

    } catch (error) {

    }
  }

  const onClickNewProfile = e => {
    history.push('/profile-details');
  }

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <Typography variant="h3" className={classes.title}>{'Lista de Perfis'}</Typography>
        <span className={classes.spacer} />
        <Button
            color="primary"
            variant="contained"
            onClick={onClickNewProfile}>
          Novo Perfil
        </Button>
      </div>
      <div className={classes.row}>
          <TextField
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
          <SearchSharp fontSize="large"/>
        </Button>
      </div>
    </div>
  );
};

ProfileToolbar.propTypes = {
  className: PropTypes.string,
  onChangeSearch: PropTypes.func,
  onClickSearch: PropTypes.func,
  searchText: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(ProfileToolbar);

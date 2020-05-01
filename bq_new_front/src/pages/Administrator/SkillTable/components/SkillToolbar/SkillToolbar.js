import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button, TextField } from '@material-ui/core';
import api from "../../../../../services/api";
import FindInPage from '@material-ui/icons/SearchSharp';

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
  }
}));

const SkillToolbar = props => {
  const { className, onChangeSearch, onClickSearch, searchText, ...rest } = props;
  const [courses, setCourses] = useState([{'id': '0', 'description': 'Sem filtro'}]);

  const classes = useStyles();

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
        <span className={classes.spacer} />
        <Button
            color="primary"
            variant="contained">
          Nova Competência
        </Button>
      </div>
      <div className={classes.row}>
        <div className={classes.comboboxSearch}>
          <TextField
              fullWidth
              label=""
              margin="dense"
              name="state"
              onChange={onChangeSearch}
              required
              select
              // eslint-disable-next-line react/jsx-sort-props
              SelectProps={{ native: true }}
              value={searchText}
              variant="outlined">
              {courses.map(course => (
                  <option
                      key={course.id}
                      value={course.id}>
                    {course.description}
                  </option>
              ))}

          </TextField>
        </div>
        <Button
            className={classes.buttonSeacrh}
            onClick={onClickSearch}>
          <FindInPage fontSize="large"/>
        </Button>
      </div>
    </div>
  );
};

SkillToolbar.propTypes = {
  className: PropTypes.string,
  onChangeSearch: PropTypes.func,
  onClickSearch: PropTypes.func,
  searchText: PropTypes.string
};

export default SkillToolbar;

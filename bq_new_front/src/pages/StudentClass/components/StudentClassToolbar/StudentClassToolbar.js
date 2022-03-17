import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";
import clsx from 'clsx';
import FindInPage from '@material-ui/icons/SearchSharp';

import { Button, Select, MenuItem } from '@material-ui/core';

import { SearchInput } from '../../../../components';

import useStyles from './styles';

const StudentClassToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, handleStatusCallback, history, ...rest } = props;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(1);

  const classes = useStyles();

//   const onClickRequestUsers = () => {
//     history.push('/users/requests');
//   }

  const handleChange = (event) => {
    handleStatusCallback(1, event.target.value);
    setValue(event.target.value);
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}>
      <div className={classes.row}>
        {/* <SearchInput
          className={classes.searchInput}
          placeholder="Pesquisar"
          onChange={onChangeSearch}
          value={searchText}
        />
        <Button
            onClick={onClickSearch}>
          <FindInPage fontSize="large"/>
        </Button> */}
        <Select
            labelId="type-of-evaluation-label"
            id="type-of-evaluation"
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            value={value}
            onChange={handleChange}
            className={classes.root}
            style={{ marginLeft: '16px' }}
        >
            <MenuItem value={1}>Ativas</MenuItem>
            <MenuItem value={2}>Arquivadas</MenuItem>
        </Select>
      </div>
    </div>
  );
};

StudentClassToolbar.propTypes = {
  className: PropTypes.string,
  onChangeSearch: PropTypes.func,
  onClickSearch: PropTypes.func,
  searchText: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(StudentClassToolbar);

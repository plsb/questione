import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import clsx from 'clsx';
import FindInPage from '@material-ui/icons/SearchSharp';

import {Box, Breadcrumbs, Button, Card, CardContent, Link, MenuItem, TextField, Typography} from '@material-ui/core';
import {makeStyles} from "@material-ui/styles";
import useStyles from "../../../../../style/style";
import {CharmHome} from "../../../../../icons/Icons";


const useStylesLocal = makeStyles(theme => ({
  row: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  textField: {
    marginLeft: theme.spacing(1),
  },
}));

const StudentClassToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, handleStatusCallback, tabValue, history, setStatus, ...rest } = props;

  const [value, setValue] = useState(1);

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  const handleChange = (event) => {
    handleStatusCallback(1, event.target.value, searchText);
    setValue(event.target.value);
    setStatus(event.target.value);
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}>
      <Box display="flex">
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            <Box display="flex">
              <Box style={{marginTop: '2px', marginRight: '5px'}}>
                <CharmHome/>
              </Box>
              <Box>
                Início
              </Box>
            </Box>
          </Link>
          <div color="inherit" onClick={null}>
            {localStorage.getItem('@Questione-acess-level-user') === "2" ? 'Turmas' : 'Minhas turmas'}
          </div>
        </Breadcrumbs>
      </Box>
      <Card>
        <CardContent>
          <Box display="flex">
            <Box display="flex" justifyContent="flex-start">
              <div className={classesGeneral.titleList}>{'Turmas'}</div>
            </Box>
            <Box display="flex" sx={{ flexGrow: 1 }} justifyContent="flex-end">
              <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  color="primary"
                  variant="contained"
                  onClick={() => history.push('/student-class-details/professor')}
                  className={classesGeneral.buttons}>
                Nova Turma
              </Button>
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-start" style={{marginTop: '25px'}}>
            <TextField
                id="type-of-evaluation"
                select
                label="Status"
                value={value}
                onChange={handleChange}
                helperText="Selecione um status para aplicar o filtro."
                variant="outlined"
                margin="dense"
                style={{ width: '300px' }}>
              <MenuItem value={1}>Ativas</MenuItem>
              <MenuItem value={2}>Arquivadas</MenuItem>
            </TextField>

            <TextField
                label="Buscar"
                className={classes.textField}
                helperText="Buscar por descrição"
                margin="dense"
                onChange={onChangeSearch}
                value={searchText}
                style={{ width: '300px', marginLeft: '16px' }}
                variant="outlined"
            />
          </Box>
          <Box display="flex" justifyContent="flex-start">

            <Button variant="contained" color="primary" onClick={onClickSearch} className={classesGeneral.buttons}>
              Filtrar turmas
            </Button>
          </Box>
        </CardContent>
      </Card>
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

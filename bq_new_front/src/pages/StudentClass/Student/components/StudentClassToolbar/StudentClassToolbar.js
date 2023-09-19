import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import clsx from 'clsx';
import FindInPage from '@material-ui/icons/SearchSharp';

import {Box, Breadcrumbs, Button, Card, CardContent, Link, MenuItem, TextField, Typography} from '@material-ui/core';
import {makeStyles} from "@material-ui/styles";
import useStyles from "../../../../../style/style";
import {CharmHome} from "../../../StudentClassContent/StudentClassContent";


const useStylesLocal = makeStyles(theme => ({

}));

const StudentClassToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, handleStatusCallback, tabValue, history, setShowRegisterDialog, ...rest } = props;

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classesGeneral.root, className)}>
      <Box display="flex">
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            <Box display="flex">
              <Box style={{marginTop: '2px', marginRight: '5px'}}>
                <CharmHome/>
              </Box>
              <Box>
                Inicio
              </Box>
            </Box>
          </Link>
          <Link color="inherit" onClick={null}>
            Minhas turmas
          </Link>
        </Breadcrumbs>
      </Box>
      <Card>
        <CardContent>
          <Box display="flex">
            <Box display="flex" justifyContent="flex-start">
              <div className={classesGeneral.titleList}>{'Minhas turmas'}</div>
            </Box>
            <Box display="flex" sx={{ flexGrow: 1 }} justifyContent="flex-end">
              <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setShowRegisterDialog(true);
                  }}
                  className={classesGeneral.buttons}>
                Participar de uma turma
              </Button>
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-start" style={{marginTop: '25px'}}>
            <TextField
                label="Buscar"
                helperText="Buscar por descrição da turma"
                margin="dense"
                onChange={onChangeSearch}
                value={searchText}
                style={{ width: '400px' }}
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

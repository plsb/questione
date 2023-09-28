import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';

import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent, Grid,
  Link,
  MenuItem,
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core';
import {makeStyles} from "@material-ui/styles";
import useStyles from "../../../../../style/style";
import {CharmHome, SubwayAdd} from "../../../../../icons/Icons";
import TooltipQuestione from "../../../../../components/TooltipQuestione";


const useStylesLocal = makeStyles(theme => ({

}));

const StudentClassToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, handleStatusCallback, tabValue, history, setShowRegisterDialog, ...rest } = props;

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  return (
    <div
    >
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
            Minhas turmas
          </div>
        </Breadcrumbs>
      </Box>
      <Card>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={4} key={0}>
              <Box display="flex" justifyContent="flex-start">
                <div className={classesGeneral.titleList}>{'Minhas turmas'}</div>
                <div style={{marginTop: '8px', marginLeft: '5px'}}>
                  <TooltipQuestione
                      position="left-start"
                      description={'Clique neste botão para participar de uma nova turma.'} content={

                    <Button
                        color="primary"
                        size="large"
                        variant="text"
                        onClick={() => {
                          setShowRegisterDialog(true);
                        }}
                        className={classesGeneral.buttons}>
                      <SubwayAdd style={{ fontSize: 25 }}/>
                    </Button>
                  }/>
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={1} key={1}>
                <Box display="flex"  justifyContent="flex-start" style={{marginTop: '5px'}}>
                  <div>
                    <TextField
                        label="Buscar"
                        helperText="Buscar por descrição da turma"
                        margin="dense"
                        onChange={onChangeSearch}
                        value={searchText}
                        style={{ width: '200px' }}
                        variant="outlined"
                    />
                  </div>
                  <div style={{marginTop: '5px'}}>
                    <TooltipQuestione
                        position="left-start"
                        description={'Informe a descrição da turma e clique neste botão para realizar a pesquisa.'} content={
                      <Button variant="text"
                              color="primary"
                              size="large"
                              onClick={onClickSearch}
                              className={classesGeneral.buttons}>
                        <SearchIcon style={{ fontSize: 30 }}/>
                      </Button>
                    }/>
                  </div>

                </Box>
            </Grid>
          </Grid>

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

import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Table,
  TableBody,
  TablePagination, CardHeader, Grid, LinearProgress,
  Box, Typography,
} from '@material-ui/core';
import api from '../../../../services/api';
import UsersToolbar from "./components/EvaluationToolbar";
import PropTypes from "prop-types";
import EvaluationCard from "../EvaluationCard";
import useStyles from "../../../../style/style";

const useStylesLocal = makeStyles(theme => ({

}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`nav-tabpanel-${index}`}
          aria-labelledby={`nav-tab-${index}`}
          {...other}>
          {value === index && (
              <Box p={3}>
                  <Typography>{children}</Typography>
              </Box>
          )}
      </div>
  );
}

const EvaluationTable = props => {
  const { className, history } = props;

  const [evaluations, setEvaluations] = useState(null);

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);

  /*async function loadEvaluations(page,) {
    try {
      let url = 'evaluation?status=1&page=' + page;
      if (searchText != '') {
        url += '&description=' + searchText;
      }
      const response = await api.get(url);
      if (response.status == 200) {
        setTotal(response.data.total);
        setEvaluations(response.data.data);
      } else {
        setEvaluations([]);
      }

    } catch (error) {

    }
  }*/

  const loadEvaluations = async (page, status, description = '') => {
    try {
      const response = await api.get(`evaluation`, {
        params: {
          status,
          page,
          description,
        },
      });

      if (response.status == 200) {
        setTotal(response.data.total);
        setEvaluations(response.data.data);
      } else {
        setEvaluations([]);
      }

    } catch (e) {

    }
  };

  useEffect(() => {
    loadEvaluations(page, status, searchText);
  }, [refresh]);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    loadEvaluations(1, status, searchText);
  }

  const handlePageChange = (event, page) => {
    loadEvaluations(page + 1, 1, searchText)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const [tabValue, setTabValue] = useState(parseInt(localStorage.getItem('@questione/evaluation-tab')) || 0);

  return (
    <div className={classesGeneral.root}>
      <UsersToolbar
        onChangeSearch={updateSearch.bind(this)}
        searchText={searchText}
        onClickSearch={onClickSearch}
        handleStatusCallback={loadEvaluations}
        setStatus={setStatus}
      />
      <div className={classesGeneral.content}>
        <TablePagination
            component="div"
            count={total}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
        />
        {evaluations == null ?
            <LinearProgress color="secondary" />
            :
            <Grid
                container
                spacing={1}>
              <Grid
                  item
                  md={12}
                  xs={12}>
                <Table>
                  <TableBody>
                    {evaluations.map(evaluation => (
                        <div style={{marginBottom: '20px'}}>
                          <EvaluationCard evaluation={evaluation}
                                        setTabValue={setTabValue}
                                        setRefresh={setRefresh}
                                        refresh={refresh} />
                        </div>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>}

            <TablePagination
              component="div"
              count={total}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[10]}
            />
      </div>
    </div>
  );
};

EvaluationTable.propTypes = {
  history: PropTypes.object
};

export default EvaluationTable;

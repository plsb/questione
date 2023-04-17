import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TablePagination, CardHeader, Grid, LinearProgress,
  Box, Typography,
} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import api from '../../../../services/api';
import { toast } from 'react-toastify';
import UsersToolbar from "./components/EvaluationToolbar";
import PropTypes from "prop-types";
import EvaluationCard from "../EvaluationCard";
import EvaluationApplicationTable from '../../EvaluationApplication/EvaluationApplicationTable';

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
  avatar: {
    marginRight: theme.spacing(2)
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

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);

  async function loadEvaluations(page) {
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
  }

  useEffect(() => {
    loadEvaluations(1);
  }, [refresh]);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadEvaluations(1);
  }

  const handlePageChange = (event, page) => {
    loadEvaluations(page + 1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const [tabValue, setTabValue] = useState(parseInt(localStorage.getItem('@questione/evaluation-tab')) || 0);

  function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={(event) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
  }

  const handleChangeTab = (event, newValue) => {
    localStorage.setItem('@questione/evaluation-tab', newValue);
    setTabValue(newValue);
  };

  function a11yProps(index) {
    return {
        id: `nav-tab-${index}`,
        'aria-controls': `nav-tabpanel-${index}`,
    };
  }

  return (
    <div className={classes.root}>
      
       {/* <LinkTab label="Avaliações" href="/drafts" {...a11yProps(0)} /> */}
       {/* <LinkTab label="Aplicações" href="#" {...a11yProps(1)} /> */}

      <TabPanel value={tabValue} index={0}>
        <UsersToolbar
          onChangeSearch={updateSearch.bind(this)}
          searchText={searchText}
          onClickSearch={onClickSearch}
        />
        <div className={classes.content}>
          <Card
            className={clsx(classes.root, className)}>
            <div style={{ margin: '16px' }}>
              Para mais informações sobre o módulo avaliações,&nbsp;
              <a
                href="https://docs.google.com/document/d/1FKDHngeXQd5r8CEE8V4EAZFlrM75Nl99vI13zJ3MbTY/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                clique aqui.
              </a>
            </div>
            <CardHeader
              avatar={
                <div>

                </div>
              }
              action={
                <TablePagination
                  component="div"
                  count={total}
                  onChangePage={handlePageChange}
                  onChangeRowsPerPage={handleRowsPerPageChange}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[10]}
                />

              } />
            <CardContent>
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
                          <EvaluationCard evaluation={evaluation}
                            setTabValue={setTabValue}
                            setRefresh={setRefresh}
                            refresh={refresh} />
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>}
            </CardContent>
            <CardActions className={classes.actions}>
              <TablePagination
                component="div"
                count={total}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10]}
              />
            </CardActions>
          </Card>
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <EvaluationApplicationTable />
      </TabPanel>
    </div>
  );
};

EvaluationTable.propTypes = {
  history: PropTypes.object
};

export default EvaluationTable;

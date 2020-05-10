import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  IconButton,
  Typography, Table, TableBody, CardActions, TablePagination, Tooltip, Switch, Chip
} from '@material-ui/core';
import api from "../../../../services/api";
import ToolbarEvaluation
  from "./EvaluationResultToolbar/EvaluationResultStudentToolbar";
import PerfectScrollbar from "react-perfect-scrollbar";
import moment from "moment";
import {FormatListBulleted} from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  root: {
    margin: 10,
  },
  content: {
    padding: 0
  },


}));

const EvaluationsResultStudentTable = props => {
  const { className, history, ...rest } = props;
  const [ evaluations, setEvaluations ] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');

  const classes = useStyles();

  async function load(){
    try {
      const responseHead = await api.get('/evaluation/student/result/evaluations');
      if (responseHead.status === 200) {
        setEvaluations(responseHead.data.data);
        setTotal(responseHead.data.total);
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    load();

  }, []);

  const handleBack = () => {
    history.goBack();
  };

  const handlePageChange = (event, page) => {
    load(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    load(1);
  }

  const results = (idHead) => {
    history.push('/student/result-evaluations/details/'+idHead);
  }

  return (
      <div className={classes.root}>
        <ToolbarEvaluation
            onChangeSearch={updateSearch.bind(this)}
            searchText={searchText}
            onClickSearch={onClickSearch}/>
        <div className={classes.content}>
          <Card
              className={clsx(classes.root, className)}>
            <CardContent className={classes.content}>
              <PerfectScrollbar>
                <div className={classes.inner}>
                  <Table>
                    <TableBody>
                      {evaluations.map(application => (
                          <Card
                              {...rest}
                              className={classes.root}>
                            <CardHeader
                                className={classes.head}
                                action={
                                  <Tooltip title="Visualizar resultados">
                                    <IconButton
                                        aria-label="copy"
                                        onClick={() => results(application.id)}>
                                      <FormatListBulleted/>
                                    </IconButton>
                                  </Tooltip>
                                }/>
                            <CardContent>
                              <Typography variant="h5" color="textSecondary" component="h2">
                                {'Descrição da avaliação: '+application.evaluation_application.evaluation.description }
                              </Typography>
                              <Typography variant="h5" color="textSecondary" component="h2">
                                {'Descrição da aplicação: '+application.evaluation_application.description }
                              </Typography>
                              <Typography variant="h5" color="textSecondary" component="h2">
                                {'Professor(a): '+application.evaluation_application.evaluation.user.name }
                              </Typography>
                              <Typography variant="h6" color="textSecondary" component="h2">
                                {'Data da avaliação: '+moment(application.updated_at).format('DD/MM/YYYY') }
                              </Typography>

                            </CardContent>
                          </Card>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </PerfectScrollbar>
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
      </div>
  );
};

EvaluationsResultStudentTable.propTypes = {
  className: PropTypes.string,
};

export default EvaluationsResultStudentTable;

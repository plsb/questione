import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
//   CardActions,
  CardContent,
  Table,
  TableBody,
  TablePagination, CardHeader, Grid, LinearProgress,
  IconButton,
  Divider
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import api from '../../../services/api';
// import QuestionCard from "../../../components/QuestionCard/QuestionCard";
import QuestionItem from '../components/QuestionItem/QuestionItem';

import Swal from "sweetalert2";
// import UsersToolbar from "./components/EvaluationToolbar";
import PropTypes from "prop-types";
// import EvaluationPracticeCard from "../EvaluationPracticeCard";
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

const EvaluationPracticeQuestions = props => {
  const { className, history } = props;
  const { codigoEvaluation } = props.match.params;

  const [questions, setQuestions] = useState(null);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  // const [searchText, setSearchText] = useState('');
  // const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);


  //configuration alert
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  // function loadAlert(icon, message) {
  //   Toast.fire({
  //     icon: icon,
  //     title: message
  //   });
  // }

  async function loadQuestions(page){
    try {
      let url = `/evaluation/practice/has-questions/${codigoEvaluation}&page=${page}`;
      const response = await api.get(url);
      if(response.status == 200) {
        setTotal(response.data.total);

        setQuestions(response.data.data);
      } else {
        setQuestions([]);
      }

    } catch (error) {

    }
  }

  const handleBack = () => {
    history.goBack();
  };

  useEffect(() => {
    loadQuestions(1);
  }, [refresh]);

  // const updateSearch = (e) => {
  //   setSearchText(e.target.value);
  // }

  // const onClickSearch = (e) => {
  //   setPage(0);
  //   loadQuestions(1);
  // }

  const handlePageChange = (event, page) => {
    loadQuestions(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  return (
      <div className={classes.root}>
        <div className={classes.contentHeader}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <CardHeader
          subheader=""
          title="Questões da avaliação" />
        <Divider />
        {/* <UsersToolbar
            onChangeSearch={updateSearch.bind(this)}
            searchText={searchText}
            onClickSearch={onClickSearch}/> */}
        <div className={classes.content}>
          <Card
              className={clsx(classes.root, className)}>
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

                }/>
            <CardContent>
              {questions == null ?
                  <LinearProgress color="secondary"    />
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
                        {questions.map((question, index) => (
                            // <QuestionCard
                            //   question={question}
                            //   setRefresh={setRefresh}
                            //   refresh={refresh}
                            // />
                            <QuestionItem question={question} index={index} />
                        ))}
                      </TableBody>
                      </Table>
                    </Grid>
                  </Grid> }
            </CardContent>
            {/* <CardActions className={classes.actions}>
              <TablePagination
                  component="div"
                  count={total}
                  onChangePage={handlePageChange}
                  onChangeRowsPerPage={handleRowsPerPageChange}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[10]}
              />
            </CardActions> */}
          </Card>
        </div>
      </div>
  );
};

EvaluationPracticeQuestions.propTypes = {
  history: PropTypes.object
};

export default EvaluationPracticeQuestions;

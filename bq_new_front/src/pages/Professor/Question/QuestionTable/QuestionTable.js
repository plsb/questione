import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination, Tooltip, Button
} from '@material-ui/core';
import api from '../../../../services/api';

import Swal from "sweetalert2";
import UsersToolbar from "./components/QuestionToolbar";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import {DialogQuestione, TableQuestione} from "../../../../components";
import PropTypes from "prop-types";
import QuestionCard from "../../../../components/QuestionCard/QuestionCard";
const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  content: {
    padding: 0,
    marginTop: theme.spacing(2)
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

const QuestionTable = props => {
  const { className, history } = props;

  const [questions, setQuestions] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState([]);
  const [open, setOpen] = React.useState(false);

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

  function loadAlert(icon, message) {
    Toast.fire({
      icon: icon,
      title: message
    });
  }

  async function loadQuestions(page){
    try {
      let url = 'question?page='+page;
      if(searchText[0].value == "S"){
        url += '&user=S';
      } else {
        url += '&user=T';
      }
      if(searchText[1].fk_course_id > 0){
        url += '&fk_course_id='+searchText[1].fk_course_id;

        if(searchText[2].fk_object_id > 0){
          url += '&fk_object_id='+searchText[2].fk_object_id;
        }
      }
      console.log('URL='+url);
      const response = await api.get(url);
      setTotal(response.data.total);
      console.log(response);
      setQuestions(response.data.data);
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
  }


  useEffect(() => {
    loadQuestions(1);
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadQuestions(1);
  }

  const handlePageChange = (event, page) => {
    loadQuestions(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const onClickOpenDialog = (id) => {
    setOpen(true);
  }

  const onClickCloseDialog = () => {
    setOpen(false);
  }

  async function onDeleteQuestion(){
    /*try {
      let url = 'course/'+idCourseDelete;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        loadAlert('success', 'Curso excluído.');
        loadCourses(page+1);
      }
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
    setOpen(false);*/
  }

  const onClickEdit = (id) => {
    console.log(id);
    history.push('/question-details/'+id);
  }

  return (
    <div>
      <div className={classes.root}>
      <UsersToolbar
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
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.headTable}>Questões</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {questions.map(question => (
                        <QuestionCard
                            question={question}/>
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
                rowsPerPageOptions={[5]}
            />
          </CardActions>
        </Card>
         <DialogQuestione handleClose={onClickCloseDialog}
                       open={open}
                       onClickAgree={onDeleteQuestion}
                       onClickDisagree={onClickCloseDialog}
                       mesage={'Deseja excluir a questão selecionada?'}
                       title={'Excluir Questão'}/>
      </div>

    </div>
    </div>
  );
};

QuestionTable.propTypes = {
  history: PropTypes.object
};

export default QuestionTable;

import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  // Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  // Typography,
  TablePagination,
  Tooltip,
  Button,
  // responsiveFontSizes,
} from '@material-ui/core';
import api from '../../../../services/api';

// import { getInitials } from '../../../../helpers';
import Swal from "sweetalert2";
import UsersToolbar from "./components/TypeOfEvaluationToolbar";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import { DialogQuestione } from "../../../../components";
import PropTypes from "prop-types";

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

const TypeOfEvaluationTable = props => {
  const { className, history } = props;

  const [typeOfEvaluations, setTypeOfEvaluations] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = React.useState(false);
  const [idTypeOfEvaluationDelete, setIdTypeOfEvaluationDelete] = React.useState(0);

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

  async function loadTypeOfEvaluations(page){
    try {
      let url = '/type-of-evaluation/?page='+page;
      if(searchText != ''){
        url += '&description='+searchText;
      }
      const response = await api.get(url);
      setTotal(response.data.total);
      setTypeOfEvaluations(response.data.data);
    } catch (error) {

    }
  }

  useEffect(() => {
    loadTypeOfEvaluations(1);
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadTypeOfEvaluations(1);
  }

  const handlePageChange = (event, page) => {
    loadTypeOfEvaluations(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const onClickOpenDialog = (id) => {
    setIdTypeOfEvaluationDelete(id);
    setOpen(true);
  }

  const onClickCloseDialog = () => {
    setOpen(false);
    setIdTypeOfEvaluationDelete(0);
  }

  async function onDeleteObject(){
    try {
      let url = '/type-of-evaluation/'+idTypeOfEvaluationDelete;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        loadAlert('success', 'Tipo de avaliação excluído.');
        loadTypeOfEvaluations(page+1);
      }
    } catch (error) {

    }
    setOpen(false);
  }

  const onClickEdit = (id) => {
    history.push('/type-of-evaluation-details/'+id);
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
                      <TableCell className={classes.headTable}>Descrição</TableCell>
                      <TableCell className={classes.headTable}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {typeOfEvaluations.map(typeOfEvaluation => (
                        <TableRow
                            className={classes.tableRow}
                            hover
                            key={typeOfEvaluation.id}>
                          <TableCell>{typeOfEvaluation.description}</TableCell>
                          <TableCell className={classes.row}>
                            <Tooltip title="Deletar">
                              <Button
                                  className={classes.buttonDelete}
                                  onClick={() => onClickOpenDialog(typeOfEvaluation.id)}>
                                <Delete fontSize="medium"/>
                              </Button>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <Button
                                  className={classes.buttonEdit}
                                  onClick={() => onClickEdit(typeOfEvaluation.id)}>
                                <Edit fontSize="medium"/>
                              </Button>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
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
         <DialogQuestione handleClose={onClickCloseDialog}
                       open={open}
                       onClickAgree={onDeleteObject}
                       onClickDisagree={onClickCloseDialog}
                       mesage={'Deseja excluir o tipo de avaliação selecionado?'}
                       title={'Excluir tipo de avaliação'}/>
      </div>

    </div>
    </div>
  );
};

TypeOfEvaluationTable.propTypes = {
  history: PropTypes.object
};

export default TypeOfEvaluationTable;

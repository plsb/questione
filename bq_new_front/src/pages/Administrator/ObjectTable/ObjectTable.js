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
  TablePagination
} from '@material-ui/core';
import api from '../../../services/api';

import Swal from "sweetalert2";
import ObjectToolbar from "./components/ObjectToolbar";
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
  actions: {
    justifyContent: 'flex-end'
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
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

const ObjectTable = props => {
  const { className } = props;

  const [objects, setObjects] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');

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

  async function loadObject(page){
    try {
      let url = 'object?page='+page;
      if(searchText!=0){
        url += '&fk_course_id='+searchText;
      }
      const response = await api.get(url);
      setTotal(response.data.total);
      setObjects(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
  }

  useEffect(() => {
    loadObject(1);
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    loadObject(1);
  }

  const handlePageChange = (event, page) => {
    loadObject(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  return (
    <div className={classes.root}>
      <ObjectToolbar
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
                      <TableCell>Descrição</TableCell>
                      <TableCell>Curso</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {objects.map(object => (
                        <TableRow
                            className={classes.tableRow}
                            hover
                            key={object.id}>
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <Typography variant="body1">{object.description}</Typography>
                            </div>
                          </TableCell>
                          <TableCell>{object.course.description}</TableCell>
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
      </div>
    </div>
  );
};

ObjectTable.propTypes = {

};

export default ObjectTable;

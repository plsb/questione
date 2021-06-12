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
  TablePagination,
  Checkbox
} from '@material-ui/core';
import api from '../../../services/api';

import { getInitials } from '../../../helpers';
import Swal from "sweetalert2";
import UsersToolbar from "./components/UsersToolbar";
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

const UsersTable = props => {
  const { className } = props;

  const [users, setUsers] = useState([]);

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

  const [checkedList, setCheckedList] = useState([]);

  async function loadUsers(page){
    try {
      let url = 'user?page='+page;
      if(searchText != ''){
        url += '&name='+searchText;
      }
      const response = await api.get(url);
      if(response.status == 200) {
        setTotal(response.data.total);
      }
      setUsers(response.data.data);
      // console.log('bbbbbbb',response.data.data);
      // console.log('AAAAAAAAAAAAAAAAAAAAA = ', response.data.data.map((user) => ({ id: user.id, checked: user.add_external_question == 1 ? true : false })));
      setCheckedList(response.data.data.map((user) => ({ id: user.id, checked: user.add_external_question == 1 ? true : false })));

      // setCheckedList((lastList) => lastList.map((item, index) => {
      //   if (item.id == userId) {
      //     item.checked = add_external_question
      //   }
  
      //   return item;
      // }));
    } catch (error) {

    }
  }

  useEffect(() => {
    loadUsers(1);
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadUsers(1);
  }

  const handlePageChange = (event, page) => {
    loadUsers(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const updateExternalQuestions = async (event, userId, checked) => {
    const add_external_question = event.target.checked;

    setCheckedList((lastList) => lastList.map((item, index) => {
      if (item.id == userId) {
        item.checked = add_external_question
      }

      return item;
    }));

    try {
      let url = 'user/add-external-questions/'+userId;
      const response = await api.put(url, {
        add_external_question: add_external_question ? 1 : 0,
      });
    } catch (error) {

    }
  };

  return (
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
                      <TableCell className={classes.headTable}>Nome</TableCell>
                      <TableCell className={classes.headTable}>Email</TableCell>
                      <TableCell className={classes.headTable}>Nível de Acesso</TableCell>
                      <TableCell className={classes.headTable}>Questões externas</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {console.log(users)}
                    {users.map((user, index) => (
                        <TableRow
                            className={classes.tableRow}
                            hover
                            key={user.id}>
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <Avatar
                                  className={classes.avatar}
                                  src={user.avatarUrl}>
                                {getInitials(user.name)}
                              </Avatar>
                              <Typography variant="body1">{user.name}</Typography>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.acess_level === 0 ? "Aluno" :
                              user.acess_level === 1 ? "Administrador" :
                                user.acess_level === 2 ? "Professor" : ""}
                          </TableCell>
                          <TableCell>
                            <Checkbox checked={checkedList[index] && checkedList[index].checked} onChange={(event, checked) => updateExternalQuestions(event, user.id, checked)} />
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
      </div>
    </div>
  );
};

UsersTable.propTypes = {

};

export default UsersTable;

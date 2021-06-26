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
import { toast } from 'react-toastify';
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

    setUsers((lastUserList) => lastUserList.map((user) => {
      if (user.id == userId) {
        user.add_external_question = checked;
      }
      return user;
    }));

    try {
      let url = 'user/add-external-questions/'+userId;
      const response = await api.put(url, {
        add_external_question: add_external_question,
      });
    } catch (error) {
      setUsers((lastUserList) => lastUserList.map((user) => {
        if (user.id == userId) {
          user.add_external_question = !checked;
        }
        return user;
      }));
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
                            <Checkbox
                              checked={user.add_external_question}
                              onChange={(event, checked) => updateExternalQuestions(event, user.id, checked)}
                            />
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

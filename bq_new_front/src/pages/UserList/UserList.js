import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { UsersToolbar, UsersTable } from './components';
import api from '../../services/api';
import mockData from './data';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

export default function UserList () {
    const classes = useStyles();

    const [users, setUsers] = useState([]);

    async function loadUsers(){
        /*const response = await api.get('user', {
           // params: { page }
        });
        //setUsers(response.data.data);
        console.log(users);*/
    }

    useEffect(() => {
        loadUsers();
        console.log(users);
    }, []);

    return (
    <div className={classes.root}>
      <UsersToolbar />
      <div className={classes.content}>
        <UsersTable />
      </div>
    </div>
    );
};

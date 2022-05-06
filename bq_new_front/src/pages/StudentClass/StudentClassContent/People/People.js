import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Typography
} from '@material-ui/core';
import api from '../../../../services/api';
import PropTypes from "prop-types";

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

const People = props => {
  const { className, history } = props;
  const pathname = window.location.pathname;
  const studentClassId = pathname.substring(pathname.lastIndexOf('/') + 1);

  const [people, setPeople] = useState([]);

  const classes = useStyles();

  const [refresh, setRefresh] = React.useState(0);

  async function loadPeoples(page){
    try {
      let url = `class/student/details/${studentClassId}?&page=${page}`;
      const response = await api.get(url);
      if(response.status == 200) {
        setPeople(response.data);
      } else {
        setPeople([]);
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    loadPeoples(1);
  }, [refresh]);

  return (
      <div className={classes.root}>
            <Typography variant="h5" color="textSecondary" component="h3" style={{ marginBottom: '32px' }}>Alguma descrição aqui</Typography>
            <div className={classes.content}>
                {people.map(item => (
                    <Card className={clsx(classes.root, className)}>
                        <CardContent>
                            <Typography variant="h5" color="textSecondary" component="h3">{item}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
      </div>
  );
};

People.propTypes = {
  history: PropTypes.object
};

export default People;

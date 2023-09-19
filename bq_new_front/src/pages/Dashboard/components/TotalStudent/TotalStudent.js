import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/EmojiPeople';
import api from "../../../../services/api";

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.success.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.success.dark
  },
  differenceValue: {
    color: theme.palette.success.dark,
    marginRight: theme.spacing(1)
  }
}));

const TotalStudent = props => {
  const { className, ...rest } = props;

  const [total, setTotal] = useState(0);

  const classes = useStyles();

  async function load(){
    try {
      const response = await api.get('public/total-students');
      if(response.status == 200) {
        setTotal(response.data);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}>
      <CardContent>
        <Grid
          container
          justifyContent="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2">
              ESTUDANTES
            </Typography>
            <Typography style={{margin: '8px'}} variant="h3">{total}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <PeopleIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          <Typography
            className={classes.differenceValue}
            variant="body2">
            Total de estudantes cadastrados.
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

TotalStudent.propTypes = {
  className: PropTypes.string
};

export default TotalStudent;

import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';
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
    backgroundColor: theme.palette.primary.main,
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
    color: theme.palette.primary.dark
  },
  differenceValue: {
    color: theme.palette.primary.dark,
    marginRight: theme.spacing(1)
  }
}));

const TotalQuestion = props => {
  const { className, ...rest } = props;
  const [total, setTotal] = useState(0);

  const classes = useStyles();

  async function load(){
    try {
      const response = await api.get('public/total-questions');
      //console.log(response.data);
      setTotal(response.data);
    } catch (error) {
      console.log(error);
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
          justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2">
              QUESTÕES
            </Typography>
            <Typography variant="h3">{total}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <QuestionAnswer className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          <Typography
            className={classes.differenceValue}
            variant="body2">
            Total de questões validadas.
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

TotalQuestion.propTypes = {
  className: PropTypes.string
};

export default TotalQuestion;

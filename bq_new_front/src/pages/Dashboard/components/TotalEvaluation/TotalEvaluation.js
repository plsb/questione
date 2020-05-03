import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import Ballot from '@material-ui/icons/Ballot';
import api from "../../../../services/api";

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.white,
    color: theme.palette.primary.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  }
}));

const TotalEvaluation = props => {
  const { className, ...rest } = props;

  const [total, setTotal] = useState(0);

  const classes = useStyles();

  async function load(){
    try {
      const response = await api.get('public/total-professors');
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
              color="inherit"
              gutterBottom
              variant="body2">
              AVALIAÇÕES
            </Typography>
            <Typography
              color="inherit"
              variant="h3">
              {total}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <Ballot className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalEvaluation.propTypes = {
  className: PropTypes.string
};

export default TotalEvaluation;

import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid, Link,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    //backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%',
    width: '100%',
    flexGrow: 1,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center'
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.black
  },
  quoteContainer: {

  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.black,
    fontWeight: 1000,
    paddingBottom: 15
  },
  quoteSubText: {
    color: theme.palette.black,
    fontWeight: 200
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    paddingTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center'
  },
  contentBody: {
    height: '100%',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center'
  }
}));

const Unauthorized = props => {
  const { history } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
          className={classes.grid}
          container>
        <Grid
            className={classes.quoteContainer}
            item
            lg={5}>
          <div className={classes.content}>
            <div className={classes.contentBody}>
              <div className={classes.logoImage}>
                <img
                    alt="Logo"
                    src="/images/logo_black_blue_270.png"/>
              </div>
            </div>
          </div>

        </Grid>
        <Grid
            className={classes.quoteContainer}
            item
            lg={5}>
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography
                  className={classes.quoteText}
                  variant="h1">
                Não permitido.
              </Typography>
              <Typography
                  className={classes.quoteSubText}
                  variant="h4">
                Você não tem acesso a este recurso.
              </Typography>
              <div className={classes.person}>
                <Typography
                    className={classes.name}
                    variant="body1">
                 Vá para a{' '}
                  <Link
                      component={RouterLink}
                      to="/home"
                      variant="h6">
                    Home.
                  </Link>
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

Unauthorized.propTypes = {
  history: PropTypes.object
};

export default withRouter(Unauthorized);

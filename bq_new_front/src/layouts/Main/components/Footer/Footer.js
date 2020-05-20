import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography, Link } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
  }
}));

const Footer = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}>
        <div className={classes.logoImage}>
            <img
                alt="Logo"
                src="/images/leds.png"/>
            <img
                alt="Logo"
                src="/images/gipea.png" style={{marginLeft: '15px'}}/>

            <Link
                component="a"
                href="https://www.ifce.edu.br/"
                target="_blank">
                <img
                    alt="Logo"
                    src="/images/ifce.png" style={{marginLeft: '15px'}}/>
            </Link>
        </div>
      <Typography variant="body1">
        Desenvolvido com recursos do Instituto Federal de Educação, Ciência e Tecnologia do Ceará.
          &copy;{' '}
          <Link
              component="a"
              href="https://www.ifce.edu.br/"
              target="_blank">
              IFCE
          </Link>
          . 2020
      </Typography>
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string
};

export default Footer;

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
                src="/images/gipea.png" style={{marginLeft: '15px'}} className="gipea"/>

            <Link
                component="a"
                href="https://www.ifce.edu.br/"
                target="_blank">
                <img
                    alt="Logo"
                    src="/images/ifce.png" style={{marginLeft: '15px'}}/>
            </Link>

            <Link
                component="a"
                href="https://www.great.ufc.br/"
                target="_blank">
                <img
                    alt="Logo"
                    src="/images/great.png" style={{marginLeft: '15px', maxHeight: '40px' }}/>
            </Link>
        </div>
      <Typography variant="body1">
        Desenvolvido com recursos do
          {' '}
          <Link
              component="a"
              href="https://www.ifce.edu.br/"
              target="_blank">
              IFCE
          </Link>
          {' '}e da{' '}
          <Link
              component="a"
              href="https://www.funcap.ce.gov.br/"
              target="_blank">
              FUNCAP
          </Link>
          . Participantes deste projeto são membros do
          {' '}
          <Link
              component="a"
              href="https://ifce.edu.br/cedro/campus_cedro/grupos-de-pesquisa/gipea"
              target="_blank">
              GIPEA
          </Link>
          {' '}e do{' '}
          <Link
              component="a"
              href="https://www.great.ufc.br/"
              target="_blank">
              GREat
          </Link>. 2023.
      </Typography>
        <Typography variant="body1">
            Para saber mais informações sobre o Questione
            {' '}
            <Link
                component="a"
                href="https://docs.google.com/document/d/1TJC9SdqLpPEOb67vN8TKRxgTg33KVC9_L6CoKRYmt4A/edit?usp=sharing"
                target="_blank">
                clique aqui
            </Link>
            {' '}ou assista as videoaulas {' '}
            <Link
                component="a"
                href="https://www.youtube.com/playlist?list=PL0ZUkjE-wwutUN4Xebv7VSn870Qp82mQQ"
                target="_blank">
                clicando aqui
            </Link>
            .
        </Typography>
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string
};

export default Footer;

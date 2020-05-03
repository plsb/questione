import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  TextField,
  Link,
  Typography
} from '@material-ui/core';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { login } from "../../services/auth";

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'O e-mail é obrigatório.'  },
    email: true,
    length: {
      maximum: 64,
      message: 'O e-mail deve conter no máximo 64 caracteres.'
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'A senha é obrigatória.'  },
    length: {

    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    //backgroundColor: theme.palette.background.default,
    height: '100%',
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    paddingTop: theme.spacing(3),
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    }
  },
  title: {
    marginTop: theme.spacing(3),
    fontWeight: 'bold'
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  }
}));

const SignIn = props => {
  const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

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

  async function handleSignIn(event) {
    event.preventDefault();
    try {
      const name = formState.values.name;
      const cpf = formState.values.cpf;
      const email = formState.values.email;
      const password = formState.values.password;

      const data = {
        name, cpf, email, password
      };

      const response = await api.post('login/', data);
      console.log(response);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        login(response.data.token, response.data[0].name,
                response.data[0].email, response.data[0].acess_level,
                response.data[0].id);
        console.log(response.data[0].acess_level)
        loadAlert('success', response.data[0].name+', seja bem-vindo!');
        history.push('/home');
      }
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
  }

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.contentBody}>
          <form
            className={classes.form}
            onSubmit={handleSignIn}>
            <div className={classes.logoImage}>
              <img
                   alt="Logo"
                   src="/images/logomarca.png"/>
            </div>
            <Typography
              className={classes.title}
              variant="h4">
              Login
            </Typography>
            <TextField
              className={classes.textField}
              error={hasError('email')}
              fullWidth
              helperText={
                hasError('email') ? formState.errors.email[0] : null
              }
              label="Email"
              name="email"
              onChange={handleChange}
              type="text"
              value={formState.values.email || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('password')}
              fullWidth
              helperText={
                hasError('password') ? formState.errors.password[0] : null
              }
              label="Senha"
              name="password"
              onChange={handleChange}
              type="password"
              value={formState.values.password || ''}
              variant="outlined"
            />
            <Button
              className={classes.signInButton}
              color="primary"
              disabled={!formState.isValid}
              fullWidth
              size="large"
              type="submit"
              variant="contained">
              Entrar
            </Button>
            <Typography
              color="textSecondary"
              variant="body1">
              Você não tem conta?{' '}
              <Link
                component={RouterLink}
                to="/sign-up"
                variant="h6">
                Cadastre-se.
              </Link>
            </Typography>
            <Typography
              color="textSecondary"
              variant="body1">
              Esqueceu sua senha?{' '}
              <Link
                component={RouterLink}
                to="/redefine-password"
                variant="h6">
                Redefina aqui.
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  );
};

SignIn.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignIn);

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
import { cpfMask } from './../../common/mask'

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'O nome é obrigatório.' },
    length: {
      minimum: 8,
      maximum: 50,
      message: 'O nome deve conter no mínimo 8 e no máximo 50 caracteres.'
    }
  },
  cpf: {
    presence: { allowEmpty: false, message: 'O cpf é obrigatório.' },
    length: {

    }
  },
  email: {
    presence: { allowEmpty: false, message: 'O e-mail é obrigatório.' },
    email: true,
    length: {
      maximum: 64,
      message: 'O e-mail deve conter no máximo 64 caracteres.'
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'A senha é obrigatória.' },
    length: {
      minimum: 6,
      maximum: 10,
      message: 'A senha deve conter no mínimo 6 e no máximo 10 caracteres.'
    }
  },
  /*policy: {
    presence: { allowEmpty: false, message: 'is required' },
    checked: true
  }*/
};

const useStyles = makeStyles(theme => ({
  root: {
    //backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
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
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3),
    fontWeight: 'bold'
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  }
}));

const SignUp = props => {
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
            event.target.name === 'cpf'
                ? formState.values.cpf = cpfMask(event.target.value)
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

  async function handleSignUp(e){
    e.preventDefault();
    try {
      const name = formState.values.name;
      const cpf = formState.values.cpf;
      const email = formState.values.email;
      const password = formState.values.password;

      const data = {
        name, cpf, email, password
      };

      const response = await api.post('register', data);

      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        } else if(response.data.errors[0].name){
          loadAlert('error', response.data.errors[0].name);
        } if(response.data.errors[0].cpf){
          loadAlert('error', response.data.errors[0].cpf);
        } else if(response.data.errors[0].email){
          loadAlert('error', response.data.errors[0].email);
        } if(response.data.errors[0].password){
          loadAlert('error', response.data.errors[0].password);
        }
      } else {
        loadAlert('success', response.data[0].name+', cadastrado!');
        history.push('/sign-in');
      }
    } catch (error) {

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
            onSubmit={handleSignUp}>
            <div className={classes.logoImage}>
              <img
                  alt="Logo"
                  src="/images/logomarca.png"/>
            </div>
            <Typography
              className={classes.title}
              variant="h5">
              Crie uma nova conta
            </Typography>
            <TextField
              className={classes.textField}
              error={hasError('name')}
              fullWidth
              helperText={
                hasError('name') ? formState.errors.name[0] : null
              }
              label="Nome"
              name="name"
              onChange={handleChange}
              type="text"
              value={formState.values.name || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('cpf')}
              fullWidth
              helperText={
                hasError('cpf') ? formState.errors.cpf[0] : null
              }
              label="Cpf"
              name="cpf"
              onChange={handleChange}
              type="text"
              value={formState.values.cpf || ''}
              variant="outlined"
            />
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
              className={classes.signUpButton}
              color="primary"
              disabled={!formState.isValid}
              fullWidth
              size="large"
              type="submit"
              variant="contained">
              Cadastre-se
            </Button>
            <Typography
              color="textSecondary"
              variant="body1">
              Já tem uma conta?{' '}
              <Link
                component={RouterLink}
                to="/sign-in"
                variant="h6">
                Login
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);

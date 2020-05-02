import React, { useState, useEffect } from 'react';
import {Link as RouterLink, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  TextField,
  Typography,
  Link
} from '@material-ui/core';
import api from '../../services/api';
import Swal from 'sweetalert2';

const schema = {
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
  confirmPassword: {
    presence: { allowEmpty: false, message: 'A confirmação da senha é obrigatória.' },
    length: {
      minimum: 6,
      maximum: 10,
      message: 'A confirmação da senha deve conter no mínimo 6 e no máximo 10 caracteres.'
    }
  }
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
  signInButton: {
    margin: theme.spacing(2, 0)
  },
  logoImage: {
    paddingTop: theme.spacing(3),
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center'
  },
}));

const ResetPassword = props => {
  const { history } = props;
  const { token } = props.match.params;

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

  async function handleResetPassword(event) {
    event.preventDefault();
    console.log(token);
    try {
      const email = formState.values.email;
      const password = formState.values.password;
      const confirmPassword = formState.values.confirmPassword;

      if(password !== confirmPassword){
        loadAlert('error', "A confirmação da senha está incorreta.");
        return ;
      }

      const data = {
        email, password, token
      };

      const response = await api.post('resetpw', data);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        } else if(response.data.errors[0].email){
          loadAlert('error', response.data.errors[0].email);
        } else if(response.data.errors[0].password){
          loadAlert('error', response.data.errors[0].password);
        } else if(response.data.errors[0].token){
          loadAlert('error', response.data.errors[0].token);
        }
      } else {
        loadAlert('success', response.data.message);
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
            onSubmit={handleResetPassword}>
            <div className={classes.logoImage}>
              <img
                  alt="Logo"
                  src="/images/logomarca.png"/>
            </div>
            <Typography
              className={classes.title}
              variant="h5">
              Redefinir Senha
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
              variant="outlined"/>
            <TextField
                className={classes.textField}
                error={hasError('password')}
                fullWidth
                helperText={
                  hasError('password') ? formState.errors.password[0] : null
                }
                label="Nova Senha"
                name="password"
                onChange={handleChange}
                type="password"
                value={formState.values.password || ''}
                variant="outlined"
            />
            <TextField
                className={classes.textField}
                error={hasError('confirmPassword')}
                fullWidth
                helperText={
                  hasError('confirmPassword') ? formState.errors.confirmPassword[0] : null
                }
                label="Cofirmar Senha"
                name="confirmPassword"
                onChange={handleChange}
                type="password"
                value={formState.values.confirmPassword || ''}
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
              Redefinir
            </Button>
            <Typography
                color="textSecondary"
                variant="body1">
              Vá para a página de{' '}
              <Link
                  component={RouterLink}
                  to="/sign-in"
                  variant="h6">
                Login.
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  );
};

ResetPassword.propTypes = {
  history: PropTypes.object
};

export default withRouter(ResetPassword);

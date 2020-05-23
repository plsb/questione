import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  TextField,
  Typography,
  IconButton
} from '@material-ui/core';
import api from '../../services/api';
import Swal from 'sweetalert2';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const schema = {
  email: {
    presence: {allowEmpty: false, message: 'O e-mail é obrigatório.'},
    email: true,
    length: {
      maximum: 64,
      message: 'O e-mail deve conter no máximo 64 caracteres.'
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
    paddingTop: theme.spacing(2),

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

const RedefinePassword = props => {
  const { history } = props;
  const { id } = props.match.params;

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

  async function handleRedefinePassword(event) {
    event.preventDefault();
    try {
      const email = formState.values.email;

      const data = {
        email
      };

      const response = await api.post('redefinepw', data);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        } else if(response.data.errors[0].email){
          loadAlert('error', response.data.errors[0].email);
        }
      } else {
        loadAlert('success', response.data.message);
        history.push('/home');
      }
    } catch (error) {

    }
  }

  const handleBack = () => {
    history.goBack();
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.contentHeader}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <div className={classes.contentBody}>
          <form
            className={classes.form}
            onSubmit={handleRedefinePassword}>
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
            <Button
              className={classes.signInButton}
              color="primary"
              disabled={!formState.isValid}
              fullWidth
              size="large"
              type="submit"
              variant="contained">
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

RedefinePassword.propTypes = {
  history: PropTypes.object
};

export default withRouter(RedefinePassword);

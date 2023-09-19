import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
  IconButton, Zoom, Tooltip
} from '@material-ui/core';
import api from "../../services/api";
import { toast } from 'react-toastify';
import validate from "validate.js";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {logout, updateNameUser} from "../../services/auth";

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'O nome é obrigatório.' },
    length: {
      minimum: 8,
      maximum: 50,
      message: 'O nome deve conter no mínimo 8 e no máximo 50 caracteres.'
    }
  },
  email: {
    presence: { allowEmpty: false, message: 'O e-mail é obrigatório.' },
    email: true,
    length: {
      maximum: 64,
      message: 'O e-mail deve conter no máximo 64 caracteres.'
    }
  }
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const AccountDetails = props => {
  const { className, history, ...rest } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  async function saveDetails(){
    try {
      const name = formState.values.name;
      const data = {
         name
      }
      const response = await api.put('all/update-profile-user', data);
      if (response.status === 200) {
        updateNameUser(response.data[0].name);
        toast.success('Perfil de '+name+' atualizado.');
        history.push('/home');
      } else if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        } else if(response.data.errors[0].name){
          toast.error(response.data.errors[0].name);
        }
      }

    } catch (error) {
      logout();
      history.push('/');

    }
  }

  useEffect(() => {
    setFormState(formState => ({
      values: {
        'name': localStorage.getItem("@Questione-name-user"),
        'email' : localStorage.getItem("@Questione-email-user"),
        'id': localStorage.getItem("@Questione-id-user")
      },
      touched: {
        ...formState.touched,
      }
    }));
  }, []);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: (errors || formState.values.course===0) ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    setFormState({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    });
  };

  const hasError = field =>
      formState.touched[field] && formState.errors[field] ? true : false;

  const handleBack = () => {
    history.goBack();
  };

  const onRequest = () => {
    history.push('/requests');
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}>
      <form
        autoComplete="off">
        <div className={classes.contentHeader}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <CardHeader
          subheader="Atualize seus dados."
          title="Perfil do Usuário"/>
        <Divider />
        <CardContent>
            <Grid
              item
              md={6}
              xs={12}>
              <TextField
                fullWidth
                error={hasError('name')}
                helperText={
                  hasError('name') ? formState.errors.name[0] : null
                }
                label="Nome"
                margin="dense"
                name="name"
                onChange={handleChange}
                value={formState.values.name || ''}
                variant="outlined"
              />
            </Grid>
          <Grid
              item
              md={6}
              xs={12}>
            <TextField
                fullWidth
                error={hasError('email')}
                helperText={
                  'O e-mail não pode ser alterado.'
                }
                label="E-mail"
                margin="dense"
                name="email"
                onChange={handleChange}
                value={formState.values.email || ''}
                variant="filled"
                InputProps={{
                  readOnly: true,
                }}/>
          </Grid>
        </CardContent>

        <Divider />
        <CardActions>
          <Grid
              container
              justifyContent="space-between">
            <Grid
                className={classes.statsItem}
                item>
              <Button
                  color="primary"
                  variant="outlined"
                  onClick={saveDetails}
                  disabled={!formState.isValid}>
                Salvar
              </Button>
            </Grid>
            <Grid
                className={classes.statsItem}
                item>
              <Tooltip TransitionComponent={Zoom} placement="top"
                       title="Você pode solicitar acesso a uma determinada área para contribuir com novas questões, ou aplicar avaliações.">
                <Button color="primary" onClick={onRequest}>
                  Solicitar Acesso para áreas
                </Button>
              </Tooltip>
            </Grid>

          </Grid>

        </CardActions>
      </form>
    </Card>
  );
};

AccountDetails.propTypes = {
  className: PropTypes.string,
};

export default AccountDetails;

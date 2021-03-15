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
  TextField, IconButton, Tooltip
} from '@material-ui/core';
import api from "../../../../services/api";
import Swal from "sweetalert2";
import validate from "validate.js";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const schema = {
  description: {
    presence: { allowEmpty: false,  message: 'A descrição é obrigatória.'},
    length: {
      minimum: 4,
      maximum: 100,
      message: 'A descrição deve conter no mínimo 4 e no máximo 100 caracteres.'
    }
  },
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const CourseDetails = props => {
  const { className, history, ...rest } = props;
  const { typeOfEvaluationCode } = props.match.params;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

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

  async function saveTypeOfEvaluationDetails(){
    try {
      const description = formState.values.description;
      const id = formState.values.id;
      const data = {
        description,
      }
      let response = {};
      let acao = "";
      if(!id) {
        response = await api.post('/type-of-evaluation/', data);
        acao = "cadastrado";
      } else {
        response = await api.put('type-of-evaluation/'+id, data);
        acao = "atualizado";
      }
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        } else if(response.data.errors[0].description){
          loadAlert('error', response.data.errors[0].description);
        }
      } else {
        loadAlert('success', `Tipo de prova ${acao}.`);
        history.push('/type-of-evaluation');
      }

    } catch (error) {

    }
  }

  async function findATypeOfEvaluation(id) {
    try {
      const response = await api.get('/type-of-evaluation/show/'+id);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        setFormState(formState => ({
          values: {
            'description': response.data.description,
            'id': response.data.id
          },
          touched: {
            ...formState.touched,
          }
        }));
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    if(typeOfEvaluationCode){
      findATypeOfEvaluation(typeOfEvaluationCode);
    }

  }, []);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: (errors || formState.values.course==0) ? false : true,
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
              subheader=""
              title="Tipo de Prova"/>
          <Divider />
          <CardContent>
            <Grid
                container
                spacing={3}>
              {/* <Grid
                  item
                  md={6}
                  xs={12}>
                <TextField
                    fullWidth
                    error={hasError('initials')}
                    helperText={
                      hasError('initials') ? formState.errors.initials[0] : null
                    }
                    label="Sigla"
                    margin="dense"
                    name="initials"
                    onChange={handleChange}
                    value={formState.values.initials || ''}
                    variant="outlined"
                />
              </Grid> */}
              <Grid
                  item
                  md={6}
                  xs={12}>
                <TextField
                    fullWidth
                    error={hasError('description')}
                    helperText={
                      hasError('description') ? formState.errors.description[0] : null
                    }
                    label="Descrição"
                    margin="dense"
                    name="description"
                    onChange={handleChange}
                    value={formState.values.description || ''}
                    variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Tooltip title="Clique aqui para solicitar acesso para tipos de provas" aria-label="add">
              <Button
                  color="primary"
                  variant="outlined"
                  disabled={!formState.isValid}
                  onClick={saveTypeOfEvaluationDetails}>
                Salvar
              </Button>
            </Tooltip>
          </CardActions>
        </form>
      </Card>
  );
};

CourseDetails.propTypes = {
  className: PropTypes.string,
};

export default CourseDetails;

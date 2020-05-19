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
  TextField, IconButton, FormControlLabel, Switch, Tooltip, Typography
} from '@material-ui/core';
import api from "../../../../services/api";
import Swal from "sweetalert2";
import validate from "validate.js";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {withStyles} from "@material-ui/core/styles";
import moment from "moment";

const schema = {
  description: {
    presence: { allowEmpty: false,  message: 'A descrição é obrigatória.'},
    length: {
      minimum: 4,
      maximum: 300,
      message: 'A descrição deve conter no mínimo 4 e no máximo 300 caracteres.'
    }
  },
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const TooltipCustomized = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

const EvaluationApplicationDetails = props => {
  const { className, history, ...rest } = props;
  const { idApplication } = props.match.params;

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

  async function saveApplicationDetails(){
    try {
      const description = formState.values.description;
      const random_questions = formState.values.random_questions;
      const data = {
        description,
        random_questions
      }
      const response = await api.put('evaluation/applications/'+idApplication, data);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        } else if(response.data.errors[0].description){
          loadAlert('error', response.data.errors[0].description);
        }
      } else {
        loadAlert('success', 'Aplicação atualizada.');
        history.push('/applications-evaluation');
      }

    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
  }

  async function findAApplication(id){
    try {
      const response = await api.get('/evaluation/applications/show/'+id);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        setFormState(formState => ({
          values: {
            'description': response.data.description,
            'random_questions': response.data.random_questions,
          },
          touched: {
            ...formState.touched,
          }
        }));
      }
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
  }

  useEffect(() => {
    if(idApplication){
      findAApplication(idApplication);
    }

  }, []);

  useEffect(() => {
    const errors = validate(formState.values, schema);
    console.log('formstate', formState);

    setFormState(formState => ({
      ...formState,
      isValid: (errors) ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    console.log(event);
    setFormState({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.checked ? event.target.checked : event.target.value
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
          title="Aplicação de Avaliação"/>
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}>
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
              <TooltipCustomized
                  title={
                    <React.Fragment>
                      <p>
                        <Typography color="textPrimary" variant="body2">
                          {'Caso esta opção fique ativa, todos os estudantes que forem realizar ' +
                          ' esta aplicação receberão' +
                          ' uma avaliação com as mesmas questões, mas cada estudante possuirá uma ' +
                          ' avaliação com questões em ordem diferente das demais.'}
                        </Typography>
                      </p>
                    </React.Fragment>
                  }>
                  <FormControlLabel
                      control={
                        <Switch
                            checked={formState.values.random_questions == 1 ? true : false}
                            onChange={handleChange}
                            name="random_questions"
                            color="primary"
                        />
                      }
                      label="Questões aleatórias?"
                  />
              </TooltipCustomized>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={saveApplicationDetails}
            disabled={!formState.isValid}>
            Salvar
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

EvaluationApplicationDetails.propTypes = {
  className: PropTypes.string,
};

export default EvaluationApplicationDetails;

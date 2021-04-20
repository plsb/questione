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
  root: {},
  inputInline: {
    margin: '0 8px',
    minWidth: '180px',
  },
  row: {
    margin: '16px 0px',
  }
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
  const [checkedRandom, setCheckedRandom] = React.useState(false);
  const [checkedShowResult, setCheckedShowResult] = React.useState(false);
  const [checkedDefineDateAndHour, setCheckedDefineDateAndHour] = React.useState(false);
  const [checkedDefineDuration, setCheckedDefineDuration] = React.useState(false);

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      'show_results' : false,
      'random_questions' : false
    },
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
      const { description, date, hour, duration } = formState.values;

      const random_questions = checkedRandom;
      const show_results = checkedShowResult;
      const data = {
        description,
        random_questions,
        show_results,
        date_start: date !== '' ? date : null,
        time_start: hour !== '' ? hour : null,
        time_to_finalize: duration !== '' ? duration : null,
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
        setCheckedRandom(response.data.random_questions == 1 ? true : false);
        setCheckedShowResult(response.data.show_results == 1 ? true : false);
        if (response.data.date_start) {
          setCheckedDefineDateAndHour(true);
        }
        if (response.data.time_to_finalize) {
          setCheckedDefineDuration(true);
        }

        setFormState(formState => ({
          values: {
            'description': response.data.description,
            'date': response.data.date_start,
            'hour': response.data.time_start,
            'duration': response.data.time_to_finalize,
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
    if(idApplication){
      findAApplication(idApplication);
    }

  }, []);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: (errors) ? false : true,
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

  const handleChangeRandom = event => {
    setCheckedRandom(event.target.checked);
  }

  const handleChangeShowResult = event => {
    setCheckedShowResult(event.target.checked);
  }

  const handleChangeDefineDateAndHour = event => {
    if (!event.target.checked) {
      setFormState({
        ...formState,
        values: {
          ...formState.values,
          date: '',
          hour: '',
        },
      })
    }
    setCheckedDefineDateAndHour(event.target.checked);
  }

  const handleChangeDefineDuration = event => {
    if (!event.target.checked) {
      setFormState({
        ...formState,
        values: {
          ...formState.values,
          duration: '',
        },
      })
    }
    setCheckedDefineDuration(event.target.checked);
  }

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
                            checked={checkedRandom}
                            onChange={handleChangeRandom}
                            name="random_questions"
                            color="primary"
                        />
                      }
                      label="Questões aleatórias?"
                  />
              </TooltipCustomized>
              <TooltipCustomized
                  title={
                    <React.Fragment>
                      <p>
                        <Typography color="textPrimary" variant="body2">
                          {'Caso esta opção fique ativa, todos os estudantes terão acesso' +
                          ' ao resultado da sua avaliação. No resultado é apenas apresentado' +
                          ' se o estudante acertou ou errou as questões. A questão completa não' +
                          ' é apresentada ao estudante.'}
                        </Typography>
                      </p>
                    </React.Fragment>
                  }>
                <FormControlLabel
                    control={
                      <Switch
                          checked={checkedShowResult}
                          onChange={handleChangeShowResult}
                          name="show_results"
                          color="primary"
                      />
                    }
                    label="Liberar o resultado?"
                />
              </TooltipCustomized>
            </Grid>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            className={classes.row}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={checkedDefineDateAndHour}
                  onChange={handleChangeDefineDateAndHour}
                  name="define_date_and_hour"
                  color="primary"
                />
              }
              label="Definir data e hora inicial?"
            />

            {checkedDefineDateAndHour && (
              <>
                <TextField
                  // error={hasError('description')}
                  // helperText={
                  //   hasError('description') ? formState.errors.description[0] : null
                  // }
                  type="date"
                  label="Data da avaliação"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="dense"
                  name="date"
                  onChange={handleChange}
                  value={formState.values.date || ''}
                  variant="outlined"
                  className={classes.inputInline}
                />

                <TextField
                  // error={hasError('description')}
                  // helperText={
                  //   hasError('description') ? formState.errors.description[0] : null
                  // }
                  type="time"
                  label="Hora de início"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="dense"
                  name="hour"
                  onChange={handleChange}
                  value={formState.values.hour || ''}
                  variant="outlined"
                  className={classes.inputInline}
                />
              </>
            )}
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            className={classes.row}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={checkedDefineDuration}
                  onChange={handleChangeDefineDuration}
                  name="define_duration"
                  color="primary"
                />
              }
              label="Definir duração?"
            />

            {checkedDefineDuration && (
              <TextField
                // error={hasError('description')}
                // helperText={
                //   hasError('description') ? formState.errors.description[0] : null
                // }
                type="time"
                label="Duração da prova em horas"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                name="duration"
                onChange={handleChange}
                value={formState.values.duration || ''}
                variant="outlined"
                className={classes.inputInline}
              />
            )}
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

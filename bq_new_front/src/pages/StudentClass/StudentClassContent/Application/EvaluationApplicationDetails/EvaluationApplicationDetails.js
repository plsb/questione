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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import api from "../../../../../services/api";
import { toast } from 'react-toastify';
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
  },
  subGroup: {
    background: '#FAFAFA',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #eeeeee',
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

  const { idApplication, studentClassId } = props.match.params;
  const [checkedRandom, setCheckedRandom] = React.useState(false);
  const [checkedShowResult, setCheckedShowResult] = React.useState(false);
  const [checkedReleasePreviewQuestion, setCheckedReleasePreviewQuestion] = React.useState(false);
  const [checkedDefineDateAndHourInitial, setCheckedDefineDateAndHourInitial] = React.useState(false);
  const [checkedDefineDateAndHourFinal, setCheckedDefineDateAndHourFinal] = React.useState(false);
  const [checkedDefineDuration, setCheckedDefineDuration] = React.useState(false);
  const [shareEvaluation, setShareEvaluation] = React.useState(false);
  const [canViewStudentName, setCanViewStudentName] = React.useState(false);

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

  async function saveApplicationDetails(){
    try {
      const {
        description,
        date,
        hour,
        date_finish,
        hour_finish,
        duration,
        date_release_results,
        time_release_results,
      } = formState.values;

      const random_questions = checkedRandom;
      const show_results = checkedShowResult;
      const release_preview_question = checkedReleasePreviewQuestion;
      const public_results = shareEvaluation;
      const can_see_students = canViewStudentName;

      const data = {
        description,
        random_questions,
        show_results,
        date_start: checkedDefineDateAndHourInitial && date !== '' ? date : null,
        time_start: checkedDefineDateAndHourInitial && hour !== '' ? hour : null,
        date_finish: checkedDefineDateAndHourFinal && date_finish !== '' ? date_finish : null,
        time_finish: checkedDefineDateAndHourFinal && hour_finish !== '' ? hour_finish : null,
        time_to_finalize: checkedDefineDuration && duration !== '' ? duration : null,
        date_release_results: checkedShowResult && date_release_results !== '' ? date_release_results : null,
        time_release_results: checkedShowResult && time_release_results !== '' ? time_release_results : null,
        release_preview_question,
        public_results,
        can_see_students
      }
      const response = await api.put('evaluation/applications/'+idApplication, data);

      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        } else if(response.data.errors[0].description){
          toast.error(response.data.errors[0].description);
        }
      } else {
        toast.success('Aplicação atualizada.');
        history.push(`/student-class/${studentClassId}`);
      }

    } catch (error) {

    }
  }

  async function findAApplication(id){
    try {
      const response = await api.get('/evaluation/applications/show/'+id);
      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        }
      } else {
        setCheckedRandom(response.data.random_questions == 1 ? true : false);
        setCheckedShowResult(response.data.show_results == 1 ? true : false);
        if (response.data.date_start) {
          setCheckedDefineDateAndHourInitial(true);
        }
        if (response.data.date_finish) {
          setCheckedDefineDateAndHourFinal(true);
        }
        if (response.data.time_to_finalize) {
          setCheckedDefineDuration(true);
        }
        if (response.data.release_preview_question) {
          setCheckedReleasePreviewQuestion(true);
        }
        if (response.data.public_results) {
          setShareEvaluation(true);
        }
        if (response.data.can_see_students) {
          setCanViewStudentName(true);
        }

        setFormState(formState => ({
          values: {
            'description': response.data.description,
            'date': response.data.date_start,
            'hour': response.data.time_start,
            'date_finish': response.data.date_finish,
            'hour_finish': response.data.time_finish,
            'duration': response.data.time_to_finalize,
            'date_release_results': response.data.date_release_results,
            'time_release_results': response.data.time_release_results,
            'release_preview_question': response.data.release_preview_question
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

  const handleChangeReleasePreviewQuestion = event => {
    setCheckedReleasePreviewQuestion(event.target.checked);
  }

  const handleChangeDefineDateAndHourInitial = event => {
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
    setCheckedDefineDateAndHourInitial(event.target.checked);
  }

  const handleChangeDefineDateAndHourFinal = event => {
    if (!event.target.checked) {
      setFormState({
        ...formState,
        values: {
          ...formState.values,
          date_finish: '',
          hour_finish: '',
        },
      })
    }
    setCheckedDefineDateAndHourFinal(event.target.checked);
    setCheckedDefineDuration(false);
    setFormState({
      ...formState,
      values: {
        ...formState.values,
        duration: '',
      },
    })
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
    setCheckedDefineDateAndHourFinal(false);
    setFormState({
      ...formState,
      values: {
        ...formState.values,
        date_finish: '',
        hour_finish: '',
      },
    })
  }

  const handleChangeShareEvaluation = event => {
    if (event.target.checked) {
      setCanViewStudentName(false);
    }

    setShareEvaluation(event.target.checked);
  }

  const handleChangeCanViewStudentName = event => {
    setCanViewStudentName(event.target.checked);
  }

  const hasError = field => {
    return formState.touched[field] && formState.errors[field] ? true : false;
  }

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
                          {'Caso esta opção esteja habilitada, todos os estudantes que forem realizar ' +
                          ' esta aplicação, receberão' +
                          ' uma avaliação com as mesmas questões, mas cada estudante possuirá uma ' +
                          ' avaliação com questões em ordem diferente dos demais estudantes.'}
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
            </Grid>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            className={classes.row}
          >
            <TooltipCustomized
                title={
                  <React.Fragment>
                    <p>
                      <Typography color="textPrimary" variant="body2">
                        {'Caso esta opção esteja habilitada, poderá ser configurada' +
                        ' data e hora em que o estudante deverá iniciar a avaliação.' +
                        ' Caso o estudante não inicie a avaliação no tempo programado, ' +
                        ' o estudante ficará incapacitado de realizar a avaliação. A tolerância é de 05 minutos, '+
                        ' ou seja, caso esteja programado para às 18 horas, a avaliação poderá ser iniciada entre '+
                        ' 17:59 e 18:05.'}
                      </Typography>
                    </p>
                  </React.Fragment>
                }>
                <FormControlLabel
                  control={
                    <Switch
                      checked={checkedDefineDateAndHourInitial}
                      onChange={handleChangeDefineDateAndHourInitial}
                      name="define_date_and_hour"
                      color="primary"
                    />
                  }
                  label="Definir data e hora inicial?"
                />
            </TooltipCustomized>

            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              className={classes.root}
            >
              <Collapse in={checkedDefineDateAndHourInitial} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className={classes.subGroup}>
                  <ListItem className={classes.nested}>
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
                  </ListItem>
                  <ListItem className={classes.nested}>
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
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            className={classes.row}
          >
            <TooltipCustomized
                title={
                  <React.Fragment>
                    <p>
                      <Typography color="textPrimary" variant="body2">
                        {'Caso esta opção esteja habilitada, poderá ser configurada' +
                        ' data e hora em que o estudante deverá finalizar a avaliação.' +
                        ' Caso o estudante não finnalize a avaliação no tempo programado,' +
                        ' o sistema irá finalizar a avaliação automaticamente (essa informação'+
                        ' ficará disponível no relatório). '}
                      </Typography>
                    </p>
                  </React.Fragment>
                }>
                <FormControlLabel
                  control={
                    <Switch
                      checked={checkedDefineDateAndHourFinal}
                      onChange={handleChangeDefineDateAndHourFinal}
                      name="define_date_and_hour_final"
                      color="primary"
                    />
                  }
                  label="Definir data e hora final?"
                />
            </TooltipCustomized>

            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              className={classes.root}
            >
              <Collapse in={(checkedDefineDateAndHourFinal && !checkedDefineDuration)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className={classes.subGroup}>
                  <ListItem className={classes.nested}>
                    <TextField
                      // error={hasError('description')}
                      // helperText={
                      //   hasError('description') ? formState.errors.description[0] : null
                      // }
                      type="date"
                      label="Data de fim da avaliação"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="dense"
                      name="date_finish"
                      onChange={handleChange}
                      value={formState.values.date_finish || ''}
                      variant="outlined"
                      className={classes.inputInline}
                    />
                  </ListItem>
                  <ListItem className={classes.nested}>
                    <TextField
                      // error={hasError('description')}
                      // helperText={
                      //   hasError('description') ? formState.errors.description[0] : null
                      // }
                      type="time"
                      label="Hora de fim da avaliação"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="dense"
                      name="hour_finish"
                      onChange={handleChange}
                      value={formState.values.hour_finish || ''}
                      variant="outlined"
                      className={classes.inputInline}
                    />
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            className={classes.row}
          >
            <TooltipCustomized
                title={
                  <React.Fragment>
                    <p>
                      <Typography color="textPrimary" variant="body2">
                        {'Caso esta opção esteja habilitada, poderá ser configurado' +
                        ' o tempo de duração (em horas) da avaliação. Se for cofigurado 01:00 hora,' +
                        ' após o estudante iniciar a sua avaliação terá um prazo de uma hora para finalizar. ' +
                        ' Caso o tempo de duração da avaliação seja de dias, deve-se multiplicar 24 * QUANTIDADE_DE_DIAS'+
                        ' e informar no campo. '}
                      </Typography>
                    </p>
                  </React.Fragment>
                }>
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
            </TooltipCustomized>

            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              className={classes.root}
            >
              <Collapse in={(checkedDefineDuration && !checkedDefineDateAndHourFinal)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className={classes.subGroup}>
                  <ListItem className={classes.nested}>
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
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </Grid>
          <Grid
              item
              md={6}
              xs={12}
              className={classes.row}
          >
            <TooltipCustomized
                title={
                  <React.Fragment>
                    <p>
                      <Typography color="textPrimary" variant="body2">
                        {'Caso esta opção esteja habilitada, todos os estudantes terão acesso' +
                        ' ao resultado desta aplicação. Você pode configurar uma data e hora programada' +
                        ' para que os estudantes tenham acesso aos resultados, e se o estudante' +
                        ' poderá visualizar a questão completa ou não.'}
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

            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                className={classes.root}
            >
              <Collapse in={checkedShowResult} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className={classes.subGroup}>
                  <ListItem className={classes.nested}>
                    <TextField
                        // error={hasError('description')}
                        // helperText={
                        //   hasError('description') ? formState.errors.description[0] : null
                        // }
                        type="date"
                        label="Data da liberação"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="dense"
                        name="date_release_results"
                        onChange={handleChange}
                        value={formState.values.date_release_results || ''}
                        variant="outlined"
                        className={classes.inputInline}
                    />
                  </ListItem>
                  <ListItem className={classes.nested}>
                    <TextField
                        // error={hasError('description')}
                        // helperText={
                        //   hasError('description') ? formState.errors.description[0] : null
                        // }
                        type="time"
                        label="Hora da liberação"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="dense"
                        name="time_release_results"
                        onChange={handleChange}
                        value={formState.values.time_release_results || ''}
                        variant="outlined"
                        className={classes.inputInline}
                    />
                  </ListItem>
                  <ListItem className={classes.nested}>
                    <TooltipCustomized
                        title={
                          <React.Fragment>
                            <p>
                              <Typography color="textPrimary" variant="body2">
                                {'Caso esta opção esteja habilitada, o estudante terá acesso' +
                                ' a todas as informações das questões (texto base, enunciado e alternativas).' +
                                ' Caso esteja desabilitada, o estudante poderá visualizar apenas se ' +
                                ' acertou ou errou cada questão.'}
                              </Typography>
                            </p>
                          </React.Fragment>
                        }>
                      <FormControlLabel
                          control={
                            <Switch
                                checked={checkedReleasePreviewQuestion}
                                onChange={handleChangeReleasePreviewQuestion}
                                name="release_preview_question"
                                color="primary"
                            />
                          }
                          label="Liberar visualização das questões"
                      />
                    </TooltipCustomized>
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </Grid>

          <Grid
              item
              md={6}
              xs={12}
              className={classes.row}
          >
            <TooltipCustomized
                title={
                  <React.Fragment>
                    <p>
                      <Typography color="textPrimary" variant="body2">
                        {'Caso esta opção esteja habilitada, todos os estudantes terão acesso' +
                        ' ao resultado desta aplicação. Você pode configurar uma data e hora programada' +
                        ' para que os estudantes tenham acesso aos resultados, e se o estudante' +
                        ' poderá visualizar a questão completa ou não.'}
                      </Typography>
                    </p>
                  </React.Fragment>
                }>
              <FormControlLabel
                  control={
                    <Switch
                        checked={shareEvaluation}
                        onChange={handleChangeShareEvaluation}
                        name="share_evaluation"
                        color="primary"
                    />
                  }
                  label="Gerar link para compartilhar resultados com professores?"
              />
            </TooltipCustomized>

            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                className={classes.root}
            >
              <Collapse in={shareEvaluation} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className={classes.subGroup}>
                  <ListItem className={classes.nested}>
                    <TooltipCustomized
                        title={
                          <React.Fragment>
                            <p>
                              <Typography color="textPrimary" variant="body2">
                                {'Caso esta opção esteja habilitada, o estudante terá acesso' +
                                ' a todas as informações das questões (texto base, enunciado e alternativas).' +
                                ' Caso esteja desabilitada, o estudante poderá visualizar apenas se ' +
                                ' acertou ou errou cada questão.'}
                              </Typography>
                            </p>
                          </React.Fragment>
                        }>
                      <FormControlLabel
                          control={
                            <Switch
                                checked={canViewStudentName}
                                onChange={handleChangeCanViewStudentName}
                                name="can_view_student_name"
                                color="primary"
                            />
                          }
                          label="Permitir visualização do nome dos alunos nos resultados?"
                      />
                    </TooltipCustomized>
                  </ListItem>
                </List>
              </Collapse>
            </List>
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

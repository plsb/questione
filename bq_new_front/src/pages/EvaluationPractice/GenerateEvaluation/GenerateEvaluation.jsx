import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Button,
  TextField, IconButton, LinearProgress,
  Tooltip, Select, MenuItem, Typography
} from '@material-ui/core';
import api from "../../../services/api";
import Swal from "sweetalert2";
import validate from "validate.js";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import useTypeOfEvaluations from '../../../hooks/useTypeOfEvaluations';
import useCourses from '../../../hooks/useCourses';
import useCoursesWithQuestions from '../../../hooks/useCoursesWithQuestions';

const schema = {
  description: {
    presence: { allowEmpty: false, message: 'A descrição é obrigatória.' },
    length: {
      minimum: 4,
      maximum: 300,
      message: 'A descrição deve conter no mínimo 4 e no máximo 300 caracteres.'
    }
  },
  typeOfEvaluation: {
    presence: { allowEmpty: false, message: 'O tipo de avaliação é obrigatório' },
  },
  area: {
    presence: { allowEmpty: false, message: 'A área é obrigatória' },
  },
};

const useStyles = makeStyles(() => ({
  root: {},
  headTable: {
    fontWeight: "bold"
  },
  fab: {
    backgroundColor: '#009688',
    color: '#e0f2f1',
  },
  labelRed: {
    backgroundColor: '#EC0B43',
    display: 'block',
    margin: '10px',
    padding: '5px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4
  },
  selectGroup: {
    width: '100%',
    display: 'flex',
    lineHeight: '2',
    select: {
      width: '100%',
    }
  }
}));

const GenerateEvaluation = props => {
  const { className, history, ...rest } = props;
  const { codigoEvaluation } = props.match.params;

  const typeOfEvaluationList = useTypeOfEvaluations();
  // const areaList = useCoursesWithQuestions();

  const classes = useStyles();

  const [refresh] = React.useState(0);

  // Refence select states
  const [openReference, setReferenceOpen] = React.useState(false);

  // Refence select states
  const [openSkills, setSkillsOpen] = React.useState(false);

  // Area select states
  const [areaIsOpen, setAreaIsOpen] = React.useState(false);
  const [areaList, setAreaList] = React.useState([]);
  const [skillList, setSkillList] = React.useState([]);

  const [amountQuestions, setAmountQuestions] = React.useState(null);

  const [renderConfigArea, setRenderConfigArea] = React.useState(false);
  const [renderConfigSkills, setRenderConfigSkills] = React.useState(false);
  const [renderConfigQuestions, setRenderConfigQuestions] = React.useState(false);

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

  async function saveGenerateEvaluation() {
    
    try {
      const referenceId = typeOfEvaluationList.filter((item) => item.description === formState.values.typeOfEvaluation)[0].id;
      const areaId = areaList.filter((item) => item.description === formState.values.area)[0].id;
      const skills = skillList.filter((item) => item.description === formState.values.skills);

      let skillId = null;
      if (skills.lenght > 0) {
        skillId = skills[0].id;
      }

      const { amount_questions, initial_period, final_period } = formState.values;

      const response = await api.put(`evaluation/practice/generate/${codigoEvaluation}`, {
        fk_type_evaluation_id: referenceId,
        fk_course_id: areaId,
        qtQuestions: parseInt(amount_questions, 10),
        year_start: initial_period,
        year_end: final_period,
        fk_skill_id: skillId,
      });

      if (response.status === 202) {
        if (response.data.message) {
          loadAlert('error', response.data.message);
        } else if (response.data.errors[0].description) {
          loadAlert('error', response.data.errors[0].description);
        }
      } else {
        loadAlert('success', 'Avaliação gerada com sucesso!');
        loadQuestions();
        history.push('/evaluation-practice');
      }
    } catch (error) {
      // console.log(error);
    }
  }

  async function findAEvaluation(id) {
    try {
      const response = await api.get('evaluation/practice/show/' + id);
      if (response.status === 202) {
        if (response.data.message) {
          loadAlert('error', response.data.message);
        }
      } else {
        setFormState(formState => ({
          values: {
            'questions': response.data[0].questions,
            'description': response.data[0].description,
            'id': response.data[0].id
          },
          touched: {
            ...formState.touched,
          }
        }));
      }
    } catch (error) {

    }
  }

  async function getAreas() {
    const referenceId = typeOfEvaluationList.filter((item) => item.description === formState.values.typeOfEvaluation)[0].id;

    try {
      const response = await api.get(`/all/courses-with-questions-practice/${referenceId}`);

      if (response) {
        setAreaList(response.data);
        setRenderConfigArea(true);
      }
    } catch (error) {
      setAreaList([]);
    }
  }

  async function getSkills() {
    const areaId = areaList.filter((item) => item.description === formState.values.area)[0].id;

    try {
      const response = await api.get(`/all/skills-with-questions-practice?fk_course_id=${areaId}`);

      if (response) {
        setSkillList(response.data);
        setRenderConfigSkills(true);
      }
    } catch (error) {
      setSkillList([]);
    }
  }

  async function handleHowManyQuestions2() {
    try {
      const referenceId = typeOfEvaluationList.filter((item) => item.description === formState.values.typeOfEvaluation)[0].id;
      const areaId = areaList.filter((item) => item.description === formState.values.area)[0].id;

      const response = await api.get(`/evaluation/practice/has-questions/${codigoEvaluation}`);

      if (response) {
        // setAmountQuestions(response.data);
        // setRenderConfigQuestions(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleHowManyQuestions() {
    try {
      const referenceId = typeOfEvaluationList.filter((item) => item.description === formState.values.typeOfEvaluation)[0].id;
      const areaId = areaList.filter((item) => item.description === formState.values.area)[0].id;
      const skill = skillList.filter((item) => item.description === formState.values.skills)[0];

      const { initial_period, final_period } = formState.values;

      const response = await api.get(`/evaluation/practice/how-many-questions`, {
        params: {
          fk_type_evaluation_id: referenceId,
          fk_course_id: areaId,
          year_start: initial_period,
          year_end: final_period,
          fk_skill_id: skill ? skill.id : null,
        }
      });

      if (response) {
        setAmountQuestions(response.data);
        setRenderConfigQuestions(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function loadQuestions() {
    try {
      const referenceId = typeOfEvaluationList.filter((item) => item.description === formState.values.typeOfEvaluation)[0].id;
      const areaId = areaList.filter((item) => item.description === formState.values.area)[0].id;

      const response = await api.get(`/evaluation/practice/has-questions/${codigoEvaluation}`);

      if (response) {
        // setAmountQuestions(response.data);
        // setRenderConfigQuestions(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (codigoEvaluation) {
      findAEvaluation(codigoEvaluation);
    }
  }, [refresh]);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: (errors || formState.values.course == 0) ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.target.value = event.target.value === 'select' ? null : event.target.value;

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

  const handleReferenceClose = () => {
    setReferenceOpen(false);
  };

  const handleReferenceOpen = () => {
    setReferenceOpen(true);
  };

  const handleAreaClose = () => {
    setAreaIsOpen(false);
  };

  const handleAreaOpen = () => {
    setAreaIsOpen(true);
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
          title="Gerar Avaliação" />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={1}
          >
            <Grid
              item
              md={12}
              xs={12}
            >
              <div className={classes.selectGroup}>
                <b className="item1" style={{ marginRight: '32px' }}>Tipo de avaliação</b>
                <Tooltip title="Caso a questão tenha sido construída baseada em alguma já aplicada, você pode selecionar no campo tipo de avaliação." placement="right">
                  <Select
                    labelId="typeOfEvaluation-label"
                    id="typeOfEvaluation"
                    name="typeOfEvaluation"
                    open={openReference}
                    onClose={handleReferenceClose}
                    onOpen={handleReferenceOpen}
                    value={formState.values.typeOfEvaluation || 'select'}
                    onChange={handleChange}
                    className={classes.root}
                    error={hasError('typeOfEvaluation')}
                    helperText={
                      hasError('typeOfEvaluation') ? formState.errors.typeOfEvaluation[0] : null
                    }
                    disabled={renderConfigQuestions}
                  >
                    <MenuItem value="select">Selecione</MenuItem>
                    {typeOfEvaluationList.map((type) => (
                      <MenuItem value={type.description}>{type.description}</MenuItem>
                    ))}
                  </Select>
                </Tooltip>
              </div>
            </Grid>

            {!renderConfigArea && (
              <Grid
                item
                md={12}
                xs={12}
              >
                <Button
                  color="primary"
                  variant="outlined"
                  disabled={!formState.values.typeOfEvaluation && formState.values.typeOfEvaluation !== 'select'}
                  onClick={getAreas}>
                  Avançar
                </Button>
              </Grid>
            )}

            {renderConfigArea && (
              <>
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <div className={classes.selectGroup}>
                    <b className="item1" style={{ marginRight: '32px' }}>Área</b>
                    <Tooltip title="Área" placement="right">
                      <Select
                        labelId="area-label"
                        id="area"
                        name="area"
                        open={areaIsOpen}
                        onClose={handleAreaClose}
                        onOpen={handleAreaOpen}
                        value={formState.values.area || 'select'}
                        onChange={handleChange}
                        className={classes.root}
                        error={hasError('area')}
                        helperText={
                          hasError('area') ? formState.errors.area[0] : null
                        }
                        disabled={renderConfigQuestions}
                      >
                        <MenuItem value="select">Selecione</MenuItem>
                        {areaList.map((item) => (
                          <MenuItem value={item.description}>{item.description}</MenuItem>
                        ))}
                      </Select>
                    </Tooltip>
                  </div>
                </Grid>
              </>
            )}

            {!renderConfigSkills && renderConfigArea && (
              <Grid
                item
                md={12}
                xs={12}
              >
                <Button
                  color="primary"
                  variant="outlined"
                  disabled={!formState.values.area && formState.values.skills !== 'select'}
                  onClick={() => getSkills()}>
                  Avançar
                </Button>
              </Grid>
            )}

            {renderConfigSkills && (
              <>
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <div className={classes.selectGroup}>
                    <b className="item1" style={{ marginRight: '32px' }}>Competência</b>
                    <Tooltip title="" placement="right">
                      <Select
                        labelId="skills-label"
                        id="skills"
                        name="skills"
                        open={openSkills}
                        onClose={() => setSkillsOpen(false)}
                        onOpen={() => setSkillsOpen(true)}
                        value={formState.values.skills || 'select'}
                        onChange={handleChange}
                        className={classes.root}
                        error={hasError('skills')}
                        helperText={
                          hasError('skills') ? formState.errors.skills[0] : null
                        }
                        disabled={renderConfigQuestions}
                      >
                        <MenuItem value="select">Selecione (Opcional)</MenuItem>
                        {skillList.map((type) => (
                          <MenuItem value={type.description}>{type.description}</MenuItem>
                        ))}
                      </Select>
                    </Tooltip>
                  </div>
                </Grid>

                <Grid
                  item
                  md={4}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    error={hasError('initial_period')}
                    helperText={
                      hasError('initial_period') ? formState.errors.initial_period[0] : null
                    }
                    label="Período (Ano inicial) - Opcional"
                    margin="dense"
                    name="initial_period"
                    onChange={handleChange}
                    value={formState.values.initial_period || ''}
                    variant="outlined"
                    type="number"
                    disabled={renderConfigQuestions}
                  />
                </Grid>

                <Grid
                  item
                  md={4}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    error={hasError('final_period')}
                    helperText={
                      hasError('final_period') ? formState.errors.final_period[0] : null
                    }
                    label="Período (Ano final) - Opcional"
                    margin="dense"
                    name="final_period"
                    onChange={handleChange}
                    value={formState.values.final_period || ''}
                    variant="outlined"
                    type="number"
                    disabled={renderConfigQuestions}
                  />
                </Grid>
              </>
            )}

            {!renderConfigQuestions && !!renderConfigSkills && renderConfigArea && (
              <Grid
                item
                md={12}
                xs={12}
              >
                <Button
                  color="primary"
                  variant="outlined"
                  disabled={!formState.isValid}
                  onClick={handleHowManyQuestions}>
                  Configurar questões
                </Button>
              </Grid>
            )}

            <Divider />
          </Grid>
          {formState.values.length === 0 && (
            <LinearProgress color="secondary" />
          )}
        </CardContent>

        {renderConfigQuestions && (
          <CardContent>
            <Grid
              container
              spacing={1}
            >
              <Grid
                item
                md={12}
                xs={12}
              >
                <Typography variant="h4" color="textPrimary" component="h4">
                  {'Total de questões disponíveis: ' + amountQuestions}
                </Typography>
              </Grid>

              <Grid
                  item
                  md={4}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    error={hasError('amount_questions')}
                    helperText={
                      hasError('amount_questions') ? formState.errors.amount_questions[0] : null
                    }
                    label="Quantidade de questões"
                    margin="dense"
                    name="amount_questions"
                    onChange={handleChange}
                    value={formState.values.amount_questions || ''}
                    variant="outlined"
                    type="number"
                    disabled={amountQuestions === 0}
                  />
                </Grid>

              <Grid
                item
                md={12}
                xs={12}
              >
                <Button
                  color="primary"
                  variant="outlined"
                  disabled={!formState.isValid || !formState.values.amount_questions}
                  onClick={saveGenerateEvaluation}>
                  Gerar
                </Button>

                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={() => setRenderConfigQuestions(false)}
                  style={{ marginLeft: '16px' }}
                >
                  Editar
                </Button>
              </Grid>

              <Divider />
            </Grid>
            {formState.values.length === 0 && (
              <LinearProgress color="secondary" />
            )}
          </CardContent>
        )}
        <Divider />
      </form>
    </Card>
  );
};

GenerateEvaluation.propTypes = {
  className: PropTypes.string,
};

export default GenerateEvaluation;

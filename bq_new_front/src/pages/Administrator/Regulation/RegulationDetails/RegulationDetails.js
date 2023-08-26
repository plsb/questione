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
  TextField, IconButton
} from '@material-ui/core';
import api from "../../../../services/api";
import { toast } from 'react-toastify';
import validate from "validate.js";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const schema = {
  description: {
    presence: { allowEmpty: false,  message: 'A descrição é obrigatória.'},
    length: {
      minimum: 10,
      maximum: 300,
      message: 'A descrição deve conter no mínimo 10 e no máximo 300 caracteres.'
    }
  },
  year: {
    presence: { allowEmpty: false,  message: 'O ano é obrigatório.'},
    length: {
      minimum: 4,
      maximum: 4,
      message: 'O ano deve conter no máximo 4 caracteres.'
    },
    numericality: {
      onlyInteger: true,
      greaterThan: 2004,
      message: 'O ano deve ser maior que 2004.',
    }
  },
  course: {
    presence: { allowEmpty: false, message: 'O curso é obrigatório.' },
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: 'Escolha um curso.',
    }
  }
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const RegulationDetails = props => {
  const { className, history, ...rest } = props;
  const [courses, setCourses] = useState([{'id': '0', 'description': '- Escolha um curso -'}]);
  const { codigoRegulation } = props.match.params;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  async function loadCourses(){
    try {
      const response = await api.get('all/courses');
      if(response.status == 200) {
        setCourses([...courses, ...response.data]);
      }
    } catch (error) {

    }
  }

  async function saveRegulationDetails(){
    try {
      const fk_course_id = formState.values.course;
      const description = formState.values.description;
      const year = formState.values.year;
      const id = formState.values.id;
      const data = {
        description, fk_course_id, year
      }
      let response= {};
      let acao = "";
      if(!id) {
         response = await api.post('regulation', data);
        acao = "cadastrada";
      } else {
         response = await api.put('regulation/'+id, data);
        acao = "atualizada";
      }
      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        } else if(response.data.errors[0].description){
          toast.error(response.data.errors[0].description);
        } else if(response.data.errors[0].year){
          toast.error(response.data.errors[0].year);
        } if(response.data.errors[0].fk_course_id){
          toast.error(response.data.errors[0].fk_course_id);
        }
      } else {
        toast.success('Portaria '+acao+'.');
        history.push('/regulations');
      }

    } catch (error) {

    }
  }

  async function findARegulation(id){
    try {
      const response = await api.get('regulation/show/'+id);
      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        }
      } else {
        setFormState(formState => ({
          values: {
            'description': response.data.description,
            'course' : response.data.fk_course_id,
            'year' : response.data.year,
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
    loadCourses();

    let courseSelected = localStorage.getItem('@Questione-course-selected');
    if(courseSelected != null){
      setFormState({
        isValid: false,
        values: {'course': courseSelected},
        touched: {},
        errors: {}
      });
    }

    if(codigoRegulation){
      findARegulation(codigoRegulation);
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
        autoComplete="off"
        onSubmit={saveRegulationDetails}>
        <div className={classes.contentHeader}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <CardHeader
          subheader=""
          title="Portaria"/>
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
            </Grid>
            <Grid
                item
                md={6}
                xs={12}>
              <TextField
                  fullWidth
                  error={hasError('year')}
                  helperText={
                    hasError('year') ? formState.errors.year[0] : null
                  }
                  label="Ano"
                  margin="dense"
                  name="year"
                  onChange={handleChange}
                  value={formState.values.year || ''}
                  variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}>
              <TextField
                fullWidth
                error={hasError('course')}
                helperText={
                  hasError('course') ? formState.errors.course[0] : null
                }
                label=""
                margin="dense"
                name="course"
                onChange={handleChange}
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={formState.values.course}
                variant="outlined">
                {courses.map(course => (
                  <option
                    key={course.id}
                    value={course.id}>
                    {course.description}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={saveRegulationDetails}
            disabled={!formState.isValid}>
            Salvar
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

RegulationDetails.propTypes = {
  className: PropTypes.string,
};

export default RegulationDetails;

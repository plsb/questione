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
  initials: {
    presence: { allowEmpty: false,  message: 'A sigla é obrigatória.'},
    length: {
      minimum: 2,
      maximum: 8,
      message: 'A sigla do curso deve conter no mínimo 2 e no máximo 8 caracteres.'
    }
  }
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const CourseDetails = props => {
  const { className, history, ...rest } = props;
  const { codigoCourse } = props.match.params;

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

  async function saveCourseDetails(){
    try {
      const fk_course_id = formState.values.course;
      const description = formState.values.description;
      const initials = formState.values.initials;
      const id = formState.values.id;
      const data = {
        description, fk_course_id, initials
      }
      let response= {};
      let acao = "";
      if(!id) {
        response = await api.post('course', data);
        acao = "cadastrado";
      } else {
        response = await api.put('course/'+id, data);
        acao = "atualizado";
      }
      console.log(response);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        } else if(response.data.errors[0].description){
          loadAlert('error', response.data.errors[0].description);
        } if(response.data.errors[0].fk_course_id){
          loadAlert('error', response.data.errors[0].fk_course_id);
        }
      } else {
        loadAlert('success', 'Curso '+acao+'.');
        history.push('/courses');
      }

    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
  }

  async function findACourse(id){
    try {
      const response = await api.get('course/show/'+id);
      console.log(response);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        setFormState(formState => ({
          values: {
            'description': response.data.description,
            'initials': response.data.initials,
            'id': response.data.id
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
    if(codigoCourse){
      findACourse(codigoCourse);
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
              title="Curso"/>
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
              </Grid>
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
            <Tooltip title="Clique aqui para solicitar acesso para cursos" aria-label="add">
              <Button
                  color="primary"
                  variant="outlined"
                  disabled={!formState.isValid}
                  onClick={saveCourseDetails}>
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

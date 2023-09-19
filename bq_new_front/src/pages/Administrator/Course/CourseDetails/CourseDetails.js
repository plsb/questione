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
import { toast } from 'react-toastify';
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
  },
  area: {
    presence: { allowEmpty: false,  message: 'A área é obrigatória.'},
  }
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const CourseDetails = props => {
  const { className, history, ...rest } = props;
  const { codigoCourse } = props.match.params;
  const [areas, setAreas] = useState([{'id': '0', 'description': '- Escolha uma área -'}]);

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  async function loadAreas(){
    try {
      const response = await api.get('all/areas');
      if(response.status == 200) {
        setAreas([...areas, ...response.data]);
      }
    } catch (error) {

    }
  }

  async function saveCourseDetails(){
    try {
      const fk_area_id = formState.values.area;
      const description = formState.values.description;
      const initials = formState.values.initials;
      const id = formState.values.id;
      const data = {
        description, fk_area_id, initials
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
      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        } else if(response.data.errors[0].description){
          toast.error(response.data.errors[0].description);
        } if(response.data.errors[0].fk_course_id){
          toast.error( response.data.errors[0].fk_course_id);
        }
      } else {
        toast.success('Curso '+acao+'.');
        history.push('/courses');
      }

    } catch (error) {

    }
  }

  async function findACourse(id){
    try {
      const response = await api.get('course/show/'+id);
      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        }
      } else {
        setFormState(formState => ({
          values: {
            'description': response.data.description,
            'initials': response.data.initials,
            'area': response.data.fk_area_id,
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
    loadAreas();
    if(codigoCourse){
      findACourse(codigoCourse);
    }

  }, []);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: (errors || formState.values.area==0) ? false : true,
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
              <Grid
                  item
                  md={6}
                  xs={12}>
                <TextField
                    fullWidth
                    error={hasError('area')}
                    helperText={
                      hasError('area') ? formState.errors.area[0] : null
                    }
                    label=""
                    margin="dense"
                    name="area"
                    onChange={handleChange}
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}
                    value={formState.values.area}
                    variant="outlined">
                  {areas.map(area => (
                      <option
                          key={area.id}
                          value={area.id}>
                        {area.description}
                      </option>
                  ))}
                </TextField>
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

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
  TextField, IconButton, Typography
} from '@material-ui/core';
import api from "../../../services/api";
import Swal from "sweetalert2";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import validate from "validate.js";
import {DropzoneDialog} from 'material-ui-dropzone'

const schema = {
  fk_course_id: {
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

const UserRequestCourseDetails = props => {
  const { className, history, ...rest } = props;
  const [courses, setCourses] = useState([{'id': '0', 'description': '- Escolha um curso -'}]);
  const [reader,setReader] = useState(false);
  const [file, setFile] = useState('');
  const [targetFile, setTargetFile] = useState('');

  const classes = useStyles();

  const [formState, setFormState] = useState({
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

  async function loadCourses(){
    try {
      const response = await api.get('all/courses');
      console.log()
      setCourses([...courses, ...response.data]);
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
  }

  async function storeCourseProfessorDetails(){
    if(!formState.values.fk_course_id){
      loadAlert('error', 'Informe o curso.');
      return ;
    }
    if(file == ''){
      loadAlert('error', 'Selecione o comprovante.');
      return ;
    }
    try {
      const fk_course_id = formState.values.fk_course_id;
      console.log(fk_course_id);
      const response = await api.post('course-professor', {
        fk_course_id
      });
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        } else if(response.data.errors[0].valid){
          loadAlert('error', response.data.errors[0].valid);
        }
      } else {
        loadAlert('success', 'Solicitação cadastrada.');
        history.push('/requests/');
      }

    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
  }

  useEffect(() => {
    console.log(file, reader);
    }, [file, reader]);

  useEffect(() => {
    loadCourses();
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


  const handleSaveFile = (event) => {
    const reader = new FileReader();
    setFile(event.target.value);
    reader.readAsDataURL(event.target.files[0]);
    setReader(reader);
    setTargetFile(event.target.files[0]);

    console.log(event.target.files[0]);
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
          subheader="Selecione abaixo o curso que deseja ter permissão para consturir questões."
          title="Solicitação para curso"/>
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
                label="Curso"
                margin="dense"
                name="fk_course_id"
                onChange={handleChange}
                error={hasError('fk_course_id')}
                helperText={
                  hasError('fk_course_id') ? formState.errors.fk_course_id[0] : null
                }
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={formState.values.fk_course_id}
                variant="outlined">
                {courses.map(course => (
                  <option
                    key={course.id}
                    value={course.id}>
                    {course.description}
                  </option>
                ))}
              </TextField>
              <div>
                <input type="file" accept=".pdf" name="file" value={file} onChange={handleSaveFile} />

              </div>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={storeCourseProfessorDetails}>
            Salvar
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

UserRequestCourseDetails.propTypes = {
  className: PropTypes.string,
};

export default UserRequestCourseDetails;

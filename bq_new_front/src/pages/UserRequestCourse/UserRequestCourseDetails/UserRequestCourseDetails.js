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
import api from "../../../services/api";
import { toast } from 'react-toastify';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import validate from "validate.js";
import Dropzone from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';

const schema = {
  fk_course_id: {
    presence: { allowEmpty: false, message: 'A área é obrigatório.' },
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: 'Escolha uma área.',
    }
  }
};
const useStyles = makeStyles(() => ({
  root: {}
}));

const UserRequestCourseDetails = props => {
  const { className, history, ...rest } = props;
  const [courses, setCourses] = useState([{'id': '0', 'description': '- Escolha uma área -'}]);
  const [file, setFile] = useState(null);

  const classes = useStyles();

  const [formState, setFormState] = useState({
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

  async function storeCourseProfessorDetails(){
    if(!formState.values.fk_course_id){
      toast.error('Informe a área.');
      return ;
    }

    if(file == null){
      toast.error('Selecione o comprovante.');
      return ;
    }
    try {
      const fk_course_id = formState.values.fk_course_id;
      const formData = new FormData();
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      formData.append('fk_course_id', fk_course_id);
      formData.append('receipt', file);

      const response = await api.post('course-professor', formData, config);

      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        } else if(response.data.errors[0].valid){
          toast.error(response.data.errors[0].valid);
        }
      } else {
        toast.success('Solicitação cadastrada.');
        history.push('/requests');
      }

    } catch (error) {

    }
  }

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

  const getUploadParams = () => {
    return { url: 'https://httpbin.org/post' }
  }

  const handleChangeStatus = (event, { meta }, status) => {
    if(status[0]) {
      setFile(status[0].file);
    }

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
          subheader="Selecione abaixo a área que deseja ter permissão para contribuir com questões. O comprovante
              deverá está no formato PDF. São exemplos de comprovantes: declaração assinada pela coordenação de curso,
              portarias (NDE, Colegiado ou outras que comprovem a atuação como professor), diário de classe do sistema acadêmico,
              ou outro documento que comprove que você é professor da área solicitada."
          title="Solicitação para área"/>
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
                label="Área"
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
                <Dropzone
                    getUploadParams={getUploadParams}
                    onChangeStatus={handleChangeStatus}
                    maxSizeBytes={3000000}
                    submitButtonContent="Salvar"
                    maxFiles={1}
                    inputContent="Arraste arquivos ou clique para procurar"
                    inputWithFilesContent="Adicionar Arquivo"
                    accept="application/pdf"
                    styles={{ dropzone: { minHeight: 100, maxHeight: 250 } }}
                />

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

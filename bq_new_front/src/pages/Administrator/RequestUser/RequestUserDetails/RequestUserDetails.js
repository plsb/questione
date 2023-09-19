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
  TextField, IconButton, Link
} from '@material-ui/core';
import api from "../../../../services/api";
import { toast } from 'react-toastify';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles(() => ({
  root: {},
}));

const RequestUserDetails = props => {
  const { className, history, ...rest } = props;
  const { codigoCourseProfessor } = props.match.params;
  const [recepit, setReceipt] = useState('');

  const classes = useStyles();

  const [formState, setFormState] = useState({
    values: {},
    touched: {},
    errors: {}
  });

  async function updateCourseProfessorDetails(){
    try {
      const valid = formState.values.valid;
      const data = {
        valid
      }

      const response = await api.put('course-professor/'+codigoCourseProfessor, data);
      if (response.status == 202) {
        if(response.data.message){
          toast.error( response.data.message);
        } else if(response.data.errors[0].valid){
          toast.error(response.data.errors[0].valid);
        }
      } else {
        toast.success( 'Solicitação atualizada.');
        history.push('/users/requests/');
      }

    } catch (error) {

    }
  }

  async function viewReceipt(){
    try {
      api.get('course-professor/download-receipt?file='+recepit,
          {
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/pdf'
            }
          })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'comprovante_questione.pdf'); //or any other extension
            document.body.appendChild(link);
            link.click();
          })
          .catch();
    } catch (error) {

    }
  }

  async function findCourseProfessor(id){
    try {
      const response = await api.get('course-professor/show/'+id);
      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        }
      } else {
        setReceipt(response.data[0].receipt);
        setFormState(formState => ({
          values: {
            'user': response.data[0].user.name,
            'course' : response.data[0].course.description,
            'id': response.data[0].id,
            'valid': response.data[0].valid
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
    if(codigoCourseProfessor){
      findCourseProfessor(codigoCourseProfessor);
    }

  }, []);

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

  const situations = [
    {
      value: '0',
      label: 'Aguardando'
    },
    {
      value: '1',
      label: 'Aceitar'
    },
    {
      value: '-1',
      label: 'Recusar'
    }
  ];

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
          subheader="O professor(a) abaixo solicitou acesso para construir questões no curso selecionado."
          title="Permissão para curso"/>
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
                label="Usuário"
                margin="dense"
                name="user"
                onChange={handleChange}
                value={formState.values.user || ''}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid
                item
                md={6}
                xs={12}>
              <TextField
                  fullWidth
                  label="Curso"
                  margin="dense"
                  name="course"
                  onChange={handleChange}
                  value={formState.values.course || ''}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}>
              <TextField
                fullWidth
                label="Situação"
                margin="dense"
                name="valid"
                onChange={handleChange}
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={formState.values.valid}
                variant="outlined">
                {situations.map(situation => (
                  <option
                    key={situation.value}
                    value={situation.value}>
                    {situation.label}
                  </option>
                ))}
              </TextField>

            </Grid>
            <Grid
                item
                md={12}
                xs={12}>
              {recepit ?
                  <Link href="#" onClick={viewReceipt}>
                    Clique aqui para visualizar o comprovante
                  </Link> : null }
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={updateCourseProfessorDetails}>
            Salvar
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

RequestUserDetails.propTypes = {
  className: PropTypes.string,
};

export default RequestUserDetails;

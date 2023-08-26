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
  fk_regulation_id: {
    presence: { allowEmpty: false, message: 'A portaria é obrigatória.' },
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: 'Escolha uma portaria.',
    }
  },
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const SkillDetails = props => {
  const { className, history, ...rest } = props;
  const [regulations, setRegulations] = useState([{'id': '0', 'description': '- Escolha uma portaria -'}]);
  const { codigoSkill } = props.match.params;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  async function loadRegulations(){
    try {
      const response = await api.get('regulation/all');
      if(response.status == 200) {
        setRegulations([...regulations, ...response.data]);
      }
    } catch (error) {

    }
  }

  async function saveSkillDetails(){
    try {
      const fk_regulation_id = formState.values.fk_regulation_id;
      const description = formState.values.description;
      const id = formState.values.id;
      const data = {
        description, fk_regulation_id
      }
      let response= {};
      let acao = "";
      if(!id) {
         response = await api.post('skill', data);
        acao = "cadastrada";
      } else {
         response = await api.put('skill/'+id, data);
        acao = "atualizada";
      }
      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        } else if(response.data.errors[0].description){
          toast.error(response.data.errors[0].description);
        } if(response.data.errors[0].fk_regulation_id){
          toast.error(response.data.errors[0].fk_regulation_id);
        }
      } else {
        toast.success('Competência '+acao+'.');
        history.push('/skills');
      }

    } catch (error) {

    }
  }

  async function findASkill(id){
    try {
      const response = await api.get('skill/show/'+id);
      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        }
      } else {
        setFormState(formState => ({
          values: {
            'description': response.data[0].description,
            'fk_regulation_id' : response.data[0].fk_regulation_id,
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


  useEffect(() => {
    loadRegulations();

    let regulationSelected = localStorage.getItem('@Questione-regulation-selected');
    if(regulationSelected != null){
      setFormState({
        isValid: false,
        values: {'fk_regulation_id': regulationSelected},
        touched: {},
        errors: {}
      });
    }

    if(codigoSkill){
      findASkill(codigoSkill);
    }

  }, []);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: (errors || formState.values.fk_regulation_id==0) ? false : true,
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
        onSubmit={saveSkillDetails}>
        <div className={classes.contentHeader}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <CardHeader
          subheader=""
          title="Competência"/>
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
                error={hasError('fk_regulation_id')}
                helperText={
                  hasError('fk_regulation_id') ? formState.errors.fk_regulation_id[0] : null
                }
                label=""
                margin="dense"
                name="fk_regulation_id"
                onChange={handleChange}
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={formState.values.fk_regulation_id}
                variant="outlined">
                {regulations.map(regulation => (
                  <option
                    key={regulation.id}
                    value={regulation.id}>
                    {regulation.course ? regulation.description+" de "+regulation.year+" | "+ regulation.course
                     : regulation.description }
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
            onClick={saveSkillDetails}
            disabled={!formState.isValid}>
            Salvar
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

SkillDetails.propTypes = {
  className: PropTypes.string,
};

export default SkillDetails;

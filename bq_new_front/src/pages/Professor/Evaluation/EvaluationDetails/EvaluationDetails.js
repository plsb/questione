import React, {useEffect, useState} from 'react';
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
  TextField, IconButton,
  TableBody, Table, TableCell,
  TableRow, TableHead, TablePagination, LinearProgress, Box, Breadcrumbs, Link
} from '@material-ui/core';
import api from "../../../../services/api";
import { toast } from 'react-toastify';
import validate from "validate.js";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import QuestionCard from "../../../../components/QuestionCard";
import useStyles from "../../../../style/style";
import {CharmHome} from "../../../../icons/Icons";

const schema = {
  description: {
    presence: {allowEmpty: false, message: 'A descrição é obrigatória.'},
    length: {
      minimum: 4,
      maximum: 300,
      message: 'A descrição deve conter no mínimo 4 e no máximo 300 caracteres.'
    }
  }
};

const useStylesLocal = makeStyles(() => ({
  root: {},
  headTable: {
    fontWeight: "bold"
  },
  fab:{
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
}));

const EvaluationDetails = props => {
  const { className, history, ...rest } = props;
  const { codigoEvaluation } = props.match.params;

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  const [questions, setQuestions] = useState(null);
  const [refresh, setRefresh] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  async function saveEvaluationDetails(){
    try {
      const description = formState.values.description;

      const id = formState.values.id;
      const data = {
        description
      }
      let response= {};
      let acao = "";
      if(!id) {
         response = await api.post('evaluation', data);
         acao = "cadastrada";
      } else {
         response = await api.put('evaluation/'+id, data);
        acao = "atualizada";
      }
      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        } else if(response.data.errors[0].description){
          toast.error(response.data.errors[0].description);
        }
      } else {
        toast.success('Avaliação '+acao+'.');
        history.push('/evaluations');
      }

    } catch (error) {

    }
  }

  async function loadQuestionsEvaluation(id, page){
    try {
      const response = await api.get('evaluation/show/questions/'+id+'?page='+page);
      if (response.status === 200) {
        setQuestions(response.data.data);
        setTotal(response.data.total);
      } else {
        setQuestions([]);
      }
    } catch (error) {

    }
  }

  async function findAEvaluation(id){
    try {
      const response = await api.get('evaluation/show/'+id);
      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
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
        //setQuestions(response.data[0].questions);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    if(codigoEvaluation){
      findAEvaluation(codigoEvaluation);
      loadQuestionsEvaluation(codigoEvaluation);
    } else {
      setQuestions([]);
    }

  }, [refresh]);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: (errors || formState.values.course==0) ? false : true,
      errors: errors || {}
    }));
  }, [formState.values, questions]);

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

  const handlePageChange = (event, page) => {
    if(codigoEvaluation) {
      loadQuestionsEvaluation(codigoEvaluation, page + 1)
    }
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  return (
      <div
          {...rest}
          className={clsx(classesGeneral.root, className)}>
        <Box display="flex">
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
              <Box display="flex">
                <Box style={{marginTop: '2px', marginRight: '5px'}}>
                  <CharmHome />
                </Box>
                <Box>
                  Início
                </Box>
              </Box>
            </Link>
            <Link color="inherit" onClick={() => history.goBack()}>
              Avaliações
            </Link>
            <div color="inherit">
              {codigoEvaluation ? 'Editar avaliação de código '+codigoEvaluation : 'Nova avaliação'}
            </div>
          </Breadcrumbs>
        </Box>
        <Card>
          <form
            autoComplete="off">
            <CardHeader
                subheader={<div className={classesGeneral.subtitleList}>{codigoEvaluation ? 'Editar avaliação' : 'Nova avaliação'}</div>}
              title={<div className={classesGeneral.titleList}>{'Avaliação'}</div>}/>
            <Divider />
            <CardContent>
              <Grid
                container
                spacing={1}>
                <Grid
                  item
                  md={12}
                  xs={12}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
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
                  </div>
                  <Divider /><br />
                  <Box display="flex" justifyContent="center">
                    <Button
                        color="primary"
                        variant="outlined"
                        disabled={!formState.isValid}
                        onClick={saveEvaluationDetails}>
                      Salvar
                    </Button>
                  </Box>
                </Grid>
                <Divider />
              </Grid>
            </CardContent>
            <Divider />
          </form>
        </Card>
      </div>
  );
};

EvaluationDetails.propTypes = {
  className: PropTypes.string,
};

export default EvaluationDetails;

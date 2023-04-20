import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { copyToClipboard } from '../../../../../helpers/utils';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    IconButton,
    Typography,
    CardContent, Chip, Switch, Tooltip
} from '@material-ui/core';
import moment from 'moment';
import { toast } from 'react-toastify';
import {withRouter} from "react-router-dom";
import api from "../../../../../services/api";
import { Edit, FormatListBulleted } from "@material-ui/icons";
import ShareIcon from '@material-ui/icons/Share';

const useStyles = makeStyles(() => ({
  root: {
    margin: 8,
  },
    head: {
        paddingBottom: 0,
        paddingTop: 6
    },
    chipred:{
      margin: 3,
      backgroundColor: '#e57373',
      color: '#ffebee',
    },
    chipgreen:{
        margin: 3,
        backgroundColor: '#009688',
        color: '#ffebee',
    },
    chip_brown:{
        margin: 3,
        backgroundColor: '#795548',
        color: '#ffebee',
    },
    chip_amber:{
        margin: 3,
        backgroundColor: '#ffc107',
        color: '#212121',
    },
    chipyellow:{
        margin: 3,
        backgroundColor: '#fff176',
        color: '#212121',
    },
    chipblue:{
        margin: 3,
        backgroundColor: '#2196f3',
        color: '#fff',
    },
  spacer: {
    flexGrow: 1
  },
}));

const EvaluationApplicationCard = props => {
  const { className, history, application, studentClassId, position, ...rest } = props;
  const [state, setState] = useState(0);
  const [evaluationApplication, setEvaluationApplication] = useState({});

  const classes = useStyles();

    useEffect(() => {

    }, [evaluationApplication]);

    useEffect(() => {
        setEvaluationApplication(application);

    }, []);

  const onEdit = (id) => {
      history.push(`/student-class/${studentClassId}/applications-evaluation/details/${id}`);
  }

  const results = (id) => {
      history.push(`/student-class/${studentClassId}/applications-evaluation/results/${id}`);
  }

    const copyLinkToClipboard = (id) => {
        copyToClipboard(window.location.origin + `/student-class/${studentClassId}/applications-evaluation/results/${id}`);
        toast.success('Link de respostas da aplicação copiado para a área de transferência');
    }

    async function onClickOpenDialogEnableApplication() {
        try {
            let url = 'evaluation/change-status-application/'+evaluationApplication.id;
            const response = await api.put(url);
            if (response.status === 202) {
                if(response.data.message){
                    toast.error(response.data.message);
                }
            } else {
                const new_evaluation = response.data[0];
                setEvaluationApplication(new_evaluation);

                toast.success('Modificado o status da aplicação.');
            }
        } catch (error) {

        }
        setState(state+1);
    }

  return (
      <div>
          { evaluationApplication.id ?
              <div className={classes.content}>
              <Card
                  {...rest}
                  className={classes.root}>
                  <CardHeader
                      className={classes.head}
                      action={
                          <div>
                              {evaluationApplication.public_results === 1 && (
                                <Tooltip title="Copiar link da avaliação">
                                    <IconButton
                                        aria-label="share"
                                        onClick={() => copyLinkToClipboard(evaluationApplication.id)}>
                                        <ShareIcon />
                                    </IconButton>
                                </Tooltip>
                              )}

                              {evaluationApplication.evaluation.status == 1 ?
                              <Tooltip title="Habilite o simulado">
                                  <Switch
                                      checked={evaluationApplication.status}
                                      onChange={onClickOpenDialogEnableApplication}
                                      color="primary"
                                      name="checkedB"
                                      inputProps={{ 'aria-label': 'primary checkbox' }}
                                  />
                              </Tooltip> : null }
                              {/*<Tooltip title="Visualizar resultados 2">
                                  <IconButton
                                      aria-label="copy"
                                      onClick={() => results(evaluationApplication.id)}>
                                      <FormatListBulleted />
                                  </IconButton>
                              </Tooltip>*/}
                              {evaluationApplication.evaluation.status == 1 ?
                                  <Tooltip title="Clique para editar">
                                      <IconButton
                                          aria-label="copy"
                                          onClick={() => onEdit(evaluationApplication.id)}>
                                          <Edit />
                                      </IconButton>
                                  </Tooltip> : null }


                          </div>
                      }
                      title={'Simulado: '+position}/>

                    <CardContent>

                      {/*<Typography variant="button" color="textSecondary" component="h2">
                          {'Simulado: '+position }
                    </Typography>*/}
                      <Typography variant="h5" color="textSecondary" component="h2">
                          {'Descrição da aplicação: '+evaluationApplication.description }
                      </Typography>
                      {evaluationApplication.evaluation.status == 1 ?
                      <Typography variant="body1" color="textSecondary" component="h2">
                          {'Avaliação: '+evaluationApplication.evaluation.id+' - '+evaluationApplication.evaluation.description}
                      </Typography> :
                      <Typography variant="body1" color="textSecondary" component="h2">
                          {'ARQUIVADA - Avaliação: '+evaluationApplication.evaluation.id+' - '+evaluationApplication.evaluation.description}
                      </Typography>  }


                      <Typography color="body2" variant="h6">
                          {'Data de criação da aplicação: '+ moment(evaluationApplication.created_at).format('DD/MM/YYYY')}
                      </Typography>
                      { evaluationApplication.evaluation.status == 2 ?
                          <Chip label="Avaliação Arquivada" className={clsx(classes.chipred, className)} size="small"/> :
                          evaluationApplication.status == 1 ?
                              <Chip label="Ativada" className={clsx(classes.chipgreen, className)} size="small"/> :
                                <Chip label="Desativada" className={clsx(classes.chipred, className)} size="small"/>

                      }
                      { evaluationApplication.random_questions == 1 &&
                          <Chip label="Questões Aleatórias" className={clsx(classes.chipyellow, className)} size="small"/> }

                       { evaluationApplication.date_start  &&
                        <Chip label="Tempo para iniciar definido" className={clsx(classes.chip_amber, className)} size="small"/> }

                      { evaluationApplication.time_to_finalize || evaluationApplication.date_finish  ?
                        <Chip label="Tempo para finalizar definido" className={clsx(classes.chip_brown, className)} size="small"/> : null}

                        { evaluationApplication.show_results == 1 &&
                        <Chip label="Resultados Liberados" className={clsx(classes.chipblue, className)} size="small"/> }

                        { evaluationApplication.release_preview_question == 1 &&
                        <Chip label="Permite vizualizar questões" className={clsx(classes.chipblue, className)} size="small"/> }



                  </CardContent>
              </Card>
              </div>
              : null }

      </div>



  );
};

EvaluationApplicationCard.propTypes = {
    className: PropTypes.string,
    application: PropTypes.object,
    history: PropTypes.object
};

export default withRouter(EvaluationApplicationCard);

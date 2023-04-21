import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { copyToClipboard } from '../../../../helpers/utils';
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
import api from "../../../../services/api";
import { Edit, FormatListBulleted, PlayArrow } from "@material-ui/icons";
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

const EvaluationApplicationCardStudent = props => {
  const { className, history, application, answer_head, studentClassId, position, ...rest } = props;
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

                              {/*<Tooltip title="Visualizar resultados 2">
                                  <IconButton
                                      aria-label="copy"
                                      onClick={() => results(evaluationApplication.id)}>
                                      <FormatListBulleted />
                                  </IconButton>
                              </Tooltip>*/}
                              {(answer_head == null || answer_head.finalized_at == null) && evaluationApplication.status == 1  && (
                                  <Tooltip title="Realizar avaliação">
                                      <IconButton
                                          aria-label="settings"
                                          onClick={() => history.push(`/code/${application.id_application}`)}>
                                          <PlayArrow />
                                      </IconButton>
                                  </Tooltip>
                              )}
                          </div>
                      }
                      title={'Simulado: '+position}/>

                    <CardContent>

                      {/*<Typography variant="button" color="textSecondary" component="h2">
                          {'Simulado: '+position }
                    </Typography>*/}
                      <Typography variant="h5" color="textSecondary" component="h2">
                          {evaluationApplication.description }
                      </Typography>
                      {evaluationApplication.evaluation.status == 1 ?
                      <Typography variant="body1" color="textSecondary" component="h2">
                          {'Avaliação: '+evaluationApplication.evaluation.id+' - '+evaluationApplication.evaluation.description}
                      </Typography> :
                      <Typography variant="body1" color="textSecondary" component="h2">
                          {'ARQUIVADA - Avaliação: '+evaluationApplication.evaluation.id+' - '+evaluationApplication.evaluation.description}
                      </Typography>  }


                      <Typography color="body2" variant="h6">
                          {evaluationApplication.created_at && ('Data de criação: '+ moment(evaluationApplication.created_at).format('DD/MM/YYYY'))}
                      </Typography>
                      { evaluationApplication.evaluation.status == 2 ?
                          <Chip label="Avaliação Arquivada" className={clsx(classes.chipred, className)} size="small"/> :
                          evaluationApplication.status == 1 ?
                              <Chip label="Ativado" className={clsx(classes.chipgreen, className)} size="small"/> :
                                <Chip label="Desativado" className={clsx(classes.chipred, className)} size="small"/>

                      }

                      {answer_head ?
                          (!answer_head.finalized_at ?
                              <Chip label="Iniciado" className={clsx(classes.chipblue, className)} size="small"/> :
                              <Chip label="Finalizado" className={clsx(classes.chipgreen, className)} size="small"/>) :
                          <Chip label="Não iniciado" className={clsx(classes.chipred, className)} size="small"/>}

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

EvaluationApplicationCardStudent.propTypes = {
    className: PropTypes.string,
    application: PropTypes.object,
    answer_head: PropTypes.object,
    history: PropTypes.object
};

export default withRouter(EvaluationApplicationCardStudent);

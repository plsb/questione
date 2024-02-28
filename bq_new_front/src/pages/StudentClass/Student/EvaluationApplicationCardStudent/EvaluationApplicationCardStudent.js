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
    CardContent, Chip, Switch, Tooltip, Box, Paper, Link, Divider
} from '@material-ui/core';
import moment from 'moment';
import { toast } from 'react-toastify';
import {withRouter} from "react-router-dom";
import api from "../../../../services/api";
import {Edit, FormatListBulleted, MoreVert, PlayArrow} from "@material-ui/icons";
import ShareIcon from '@material-ui/icons/Share';
import useStyles from "../../../../style/style";
import DecreaseStringSize from "../../../../components/DecreaseStringSize";
import TooltipQuestione from "../../../../components/TooltipQuestione";

const useStylesLocal = makeStyles(() => ({
  root: {
    margin: 8,
  },
    head: {
        paddingBottom: 0,
        paddingTop: 6
    },
    chipred:{
      color: '#e57373',
    },
    chipgreen:{
        color: '#009688',
    },
    chip_brown:{
        color: '#795548',
    },
    chip_amber:{
        color: '#ffc107',
    },
    chipyellow:{
        color: '#fff176',
    },
    chipblue:{
        color: '#2196f3',
    },
  spacer: {
    flexGrow: 1
  },
}));

const EvaluationApplicationCardStudent = props => {
  const { className, history, application, answer_head, studentClassId, position, ...rest } = props;
  const [state, setState] = useState(0);
  const [evaluationApplication, setEvaluationApplication] = useState({});

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

    useEffect(() => {

    }, [evaluationApplication]);

    useEffect(() => {
        setEvaluationApplication(application);

    }, []);

  const onEdit = (id) => {
      history.push(`/student-class/${studentClassId}/applications-evaluation/details/${id}`);
  }

  const results = (idHead) => {
      history.push('/student/result-evaluations/details/'+idHead);
      //history.push(`/student-class/${studentClassId}/applications-evaluation/results/${id}`);
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
                  className={classes.root} pointerEv >
                  <div >
                      <Paper className={evaluationApplication.status == 0 || evaluationApplication.class.status === 2 || evaluationApplication.evaluation.status === 2 ?  classesGeneral.paperTitleGray
                                             : answer_head && answer_head.finalized_at ? classesGeneral.paperTitleGreen : classesGeneral.paperTitle}>
                          <Box display="flex">
                              <Box display="flex" sx={{ flexGrow: 1 }} justifyContent="flex-start">
                                  <div className={classesGeneral.paperTitleTextBold}>
                                      {'Simulado '+position+': '}<DecreaseStringSize string={evaluationApplication.description} />
                                  </div>
                              </Box>
                              <Box display="flex" justifyContent="flex-end">
                                  {(answer_head == null || answer_head.finalized_at == null) && evaluationApplication.status === 1
                                      && evaluationApplication.class.status === 1 && evaluationApplication.evaluation.status === 1 && (
                                      <TooltipQuestione position={"left"} description={"Clique aqui para realizar simulado"} content={
                                          <IconButton
                                              size="small"
                                              aria-label="settings"
                                              onClick={() => history.push(`/code/${application.id_application}`)}>
                                              <PlayArrow />

                                          </IconButton>
                                      }/>
                                  )}

                              </Box>
                          </Box>
                      </Paper>

                    <CardContent>
                        <Box display={'flex'}>
                            <Box>
                                <Box>
                                    { answer_head && (evaluationApplication.show_results == 1 &&
                                        evaluationApplication.canShowResults == 1 && answer_head.finalized_at ?
                                            <Link
                                                component="button"
                                                onClick={() => {
                                                    results(answer_head.id)
                                                }}
                                                className={clsx(classes.link, className)}>
                                                <div className={clsx(classesGeneral.paperTitleTextBold, classes.chipblue)}>
                                                    Clique aqui para visualizar o resultado
                                                </div>
                                            </Link>
                                            :
                                        (evaluationApplication.canShowResults == 0 && evaluationApplication.show_results == 1 && answer_head.finalized_at)
                                                ?
                                                <div className={clsx(classesGeneral.paperTitleTextBold)}>{'O resultado será liberado no dia: '+moment(`${evaluationApplication.date_release_results} ${evaluationApplication.time_release_results}`).format('DD/MM/YYYY H:mm')+'.'}</div>
                                                :
                                                evaluationApplication.show_results == 0 && answer_head.finalized_at &&
                                                <div className={clsx(classesGeneral.paperTitleTextBold)}>{'Resultado indisponível.'}</div>
                                    )}
                                    { answer_head && ( answer_head.finished_automatically == 1 &&
                                        <div className={clsx(classesGeneral.textRedInfo)} style={{marginTop: '5px'}}>{'Este simulado foi finalizado automaticamente.'}</div>
                                    )}
                                    { !answer_head && (evaluationApplication.evaluation.status == 2 ?
                                        <div className={clsx(classesGeneral.paperTitleTextBold)}>{'Simulado indisponível.'}</div> :
                                        evaluationApplication.status == 0 &&
                                        <div className={clsx(classesGeneral.paperTitleTextBold)}>{'Simulado indisponível.'}</div>)
                                    }
                                </Box>
                                <div className={classesGeneral.paperTitleText}>
                                    {'Este simulado foi criado em: '+ moment(evaluationApplication.created_at).format('DD/MM/YYYY')+'.'}
                                </div>
                                <Box display="flex" alignItems="row" style={{marginTop: '10px'}}>

                                  {/*answer_head ?
                                      (!answer_head.finalized_at ?
                                          <div className={clsx(classes.chipblue, className)} style={{marginLeft: '4px'}}>{'| Iniciado'}</div> :
                                          <div className={clsx(classes.chipgreen, className)} style={{marginLeft: '4px'}}>{'| Finalizado'}</div>) :
                                      <div className={clsx(classes.chipred, className)} style={{marginLeft: '4px'}}>{'| Não iniciado'}</div>*/}
                                   { !answer_head  &&
                                       (evaluationApplication.date_start &&
                                           (evaluationApplication.data_start_type == 'DI' ?
                                                   <div className={clsx(classes.chip_brown, className)}
                                                        style={{marginRight: '6px'}}>{'Este simulado só pode ser iniciado a partir do dia '
                                                       +moment(evaluationApplication.date_start).utc().format('DD/MM/YYYY')+' às '
                                                       +evaluationApplication.time_start+'.'}</div>
                                                   :
                                                   <div className={clsx(classes.chip_brown, className)}
                                                        style={{marginRight: '6px'}}>{'Este simulado deve ser iniciado no dia '
                                                       +moment(evaluationApplication.date_start).utc().format('DD/MM/YYYY')+' às '
                                                       +evaluationApplication.time_start+'.'}</div>
                                           )
                                           )
                                   }

                                  { !answer_head ?
                                      ((evaluationApplication.date_finish) &&
                                          <div className={clsx(classes.chip_brown, className)} style={{marginRight: '6px'}}>{'Este simulado deve ser finalizado até o dia '+moment(evaluationApplication.date_finish).utc().format('DD/MM/YYYY')+' às '+evaluationApplication.time_finish+'.'}</div>)
                                       :
                                      !answer_head.finalized_at && evaluationApplication.date_finish ?
                                          <div className={clsx(classes.chip_brown, className)} style={{marginRight: '6px'}}>{'Este simulado deve ser finalizado até o dia '+moment(evaluationApplication.date_finish).utc().format('DD/MM/YYYY')+' às '+evaluationApplication.time_finish+'.'}</div> : null}
                                    { !answer_head ?
                                        ((evaluationApplication.time_to_finalize) &&
                                            <div className={clsx(classes.chip_brown, className)} style={{marginRight: '6px'}}>{'Após iniciado, este simulado deve ser finalizado no tempo de '+evaluationApplication.time_to_finalize+'.'}</div>)
                                        :
                                        !answer_head.finalized_at && evaluationApplication.time_to_finalize ?
                                            <div className={clsx(classes.chip_brown, className)} style={{marginRight: '6px'}}>{'Após iniciado, este simulado deve ser finalizado no tempo de '+evaluationApplication.time_to_finalize+'.'}</div> : null}

                                    {/* evaluationApplication.show_results == 1 &&
                                        <div className={clsx(classes.chipblue, className)}>{'| Resultados Liberados'}</div>  */}

                                    {/* !answer_head ?
                                        <div className={clsx(classes.chipblue, className)} style={{marginRight: '6px'}}>{'Permite vizualizar questões'}</div> :
                                        !answer_head.finalized_at && evaluationApplication.release_preview_question == 1 ?
                                        <div className={clsx(classes.chipblue, className)} style={{marginRight: '6px'}}>{'Permite vizualizar questões'}</div> : null*/}
                                </Box>
                            </Box>

                            <Box flexGrow={1}>
                                {answer_head && (answer_head.finalized_at != null && evaluationApplication.badgesStudent != null &&
                                    <Box display={'flex'} justifyContent={'flex-end'} style={{marginTop: '10px'}}>
                                        {evaluationApplication.badgesStudent.map((badge, i) => (
                                            <TooltipQuestione description={badge.badges_settings.description} position={'top-start'} content={
                                                <img
                                                    src={badge.badges_settings.image ? "/images/medals/"+badge.badges_settings.image : "/images/404.png"}
                                                    style={{marginRight: '5px', width:'40px'}}/>
                                            }/>
                                        ))}


                                    </Box>
                                )}
                            </Box>
                        </Box>

                      </CardContent>
                  </div>
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

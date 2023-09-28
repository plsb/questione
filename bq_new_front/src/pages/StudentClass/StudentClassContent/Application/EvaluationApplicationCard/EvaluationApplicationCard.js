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
    CardContent, Chip, Switch, Tooltip, FormControlLabel, Box, Paper, Link
} from '@material-ui/core';
import moment from 'moment';
import { toast } from 'react-toastify';
import {withRouter} from "react-router-dom";
import api from "../../../../../services/api";
import {Edit, FormatListBulleted, PlayArrow} from "@material-ui/icons";
import ShareIcon from '@material-ui/icons/Share';
import {FormGroup} from "reactstrap";
import useStyles from "../../../../../style/style";
import GetAppIcon from "@material-ui/icons/GetApp";
import DecreaseStringSize from "../../../../../components/DecreaseStringSize";
import SettingsIcon from '@material-ui/icons/Settings';
import TooltipQuestione from "../../../../../components/TooltipQuestione";

const useStylesLocal = makeStyles(() => ({
  root: {
      marginBottom: '10px'

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

const EvaluationApplicationCard = props => {
  const { className, history, application, studentClassId, setRefresh, position, ...rest } = props;
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
                setRefresh(Date.now());
            }
        } catch (error) {

        }
        setState(state+1);
    }

    async function downloadCSV(id){
        try {
            let url = `class/professor/get-csv/${id}`;


            const response = api.get(url,
                {
                    responseType: 'arraybuffer',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/csv'
                    }
                })
                .then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'cvs_'+id+'.csv'); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                })
                .catch();

            if (response.status === 202) {
                if(response.data.message){
                    toast.error(response.data.message);
                }
            } else {
                toast.success('Dados exportados.');
            }

        } catch (error) {

        }
    }

  return (
      <div>
          { evaluationApplication.id ?
              <div className={classes.content}>
              <Card
                  {...rest}
                  className={classes.root}>
                  <Paper className={evaluationApplication.evaluation.status == 2 || evaluationApplication.status == 0 ? classesGeneral.paperTitleGray :
                                         classesGeneral.paperTitleGreen}>
                      <Box display="flex">
                          <Box display="flex" sx={{ flexGrow: 1 }} justifyContent="flex-start">
                              <div className={classesGeneral.paperTitleTextBold}>
                                  {evaluationApplication.status == 1 ?
                                      <div>{'Simulado '+position+': '} <DecreaseStringSize string={evaluationApplication.description} large={.9}/></div>
                                          :
                                      <div>{'Simulado '+position+': '} <DecreaseStringSize string={evaluationApplication.description} large={.65}/></div>}
                              </div>
                          </Box>
                          <Box display="flex" justifyContent="flex-end">
                                  {evaluationApplication.public_results === 1 && (
                                      <Tooltip title="Copiar link da avaliação">
                                          <IconButton
                                              aria-label="share"
                                              onClick={() => copyLinkToClipboard(evaluationApplication.id)}
                                              size="small">
                                              <ShareIcon />
                                          </IconButton>
                                      </Tooltip>
                                  )}

                                  {evaluationApplication.evaluation.status == 1 &&
                                      <TooltipQuestione description={'Clique para habilitar o simulado: '+evaluationApplication.description+'.'} position={'left-start'} content={
                                          <div style={{marginTop: '3px', marginLeft: '10px'}}>
                                              { evaluationApplication.status == 0
                                                  ? <FormGroup>
                                                      <FormControlLabel control={
                                                          <Switch
                                                              checked={evaluationApplication.status}
                                                              onChange={onClickOpenDialogEnableApplication}
                                                              color="primary"
                                                              name="checkedB"
                                                              size="small"
                                                              inputProps={{ 'aria-label': 'primary checkbox' }}
                                                          />
                                                      } label="Habilitar" />
                                                  </FormGroup> :
                                                  <Switch
                                                      checked={evaluationApplication.status}
                                                      onChange={onClickOpenDialogEnableApplication}
                                                      color="primary"
                                                      name="checkedB"
                                                      size="small"
                                                      inputProps={{ 'aria-label': 'primary checkbox' }}
                                                  />}
                                          </div>
                                      }/>  }

                                  {evaluationApplication.evaluation.status == 1 &&
                                      <TooltipQuestione description={'Clique para configurar o simulado: '+evaluationApplication.description+'.'} position={'left-start'} content={
                                          <IconButton
                                              aria-label="copy"
                                              size="small"
                                              onClick={() => onEdit(evaluationApplication.id)}
                                              style={{marginLeft: '10px'}}>
                                              <SettingsIcon />
                                          </IconButton>
                                      }/>
                                  }
                          </Box>
                      </Box>
                  </Paper>
                  <CardContent>
                      <Box>
                          {evaluationApplication.totalAnswers > 0 ?
                              <Box display={'flex'}>
                                  <Link
                                      component="button"
                                      onClick={() => {
                                          results(evaluationApplication.id)
                                      }}
                                      className={clsx(classes.link, className)}>
                                      <div className={clsx(classesGeneral.paperTitleTextBold, classes.chipblue)}>
                                          <DecreaseStringSize string={'Este simulado possui '+evaluationApplication.totalAnswers +' resposta(s). Clique aqui para visualizar o resultado.'} large={1.8}/>
                                      </div>
                                  </Link>
                                  <TooltipQuestione description={'Clique para realizar o download do arquivo de respostas no formato csv do simulado: '+evaluationApplication.description+'.'}
                                                    position={'bottom'} content={
                                      <IconButton
                                          aria-label="copy"
                                          size={"small"}
                                          onClick={() => downloadCSV(evaluationApplication.id)}
                                          onClick={() => downloadCSV(evaluationApplication.id)}
                                          style={{marginLeft: '10px', marginTop: '5px'}}>
                                          <GetAppIcon />

                                      </IconButton>
                                  }/>
                              </Box> :
                              <div className={clsx(classesGeneral.paperTitleText)}>
                                    {'Este simulado não possui resposta(s).'}
                              </div>}
                      </Box>

                      <div className={classesGeneral.paperTitleText}>
                          {'Este simulado foi criado por meio da avaliação: '+evaluationApplication.evaluation.id+' - '+evaluationApplication.evaluation.description+'.'}
                      </div>
                      <div className={classesGeneral.paperTitleText}>
                          {'Este simulado foi criado em: '+ moment(evaluationApplication.created_at).format('DD/MM/YYYY')}
                      </div>
                      { evaluationApplication.evaluation.status == 2 &&
                          <div className={classesGeneral.textRedInfo} style={{marginTop: '4px'}}>
                              {'A avaliação deste simulado está arquivada.'}
                          </div>}
                      <Box display="flex" alignItems="row" style={{marginTop: '10px'}}>

                          { evaluationApplication.show_results == 1 &&
                              <div className={clsx(classes.chip_brown, className)} style={{marginRight: '6px'}}>{'Os estudantes terão acesso ao resultado deste simulado.'}</div>
                          }

                          { evaluationApplication.release_preview_question == 1 &&
                              <div className={clsx(classes.chip_brown, className)} style={{marginRight: '6px'}}>{'Os estudantes tertão acesso as questões completas deste simulado.'}</div>
                          }

                          { evaluationApplication.random_questions == 1 &&
                              <div className={clsx(classes.chip_brown, className)} style={{marginRight: '6px'}}>{'As questões serão apresentadas de forma aleatória.'}</div>
                          }

                          {evaluationApplication.date_start &&
                              (evaluationApplication.data_start_type == 'DI' ?
                                  <div className={clsx(classes.chip_brown, className)}
                                       style={{marginRight: '6px'}}>{'Este simulado deve ser iniciado a partir do dia '
                                      +moment(evaluationApplication.date_start).utc().format('DD/MM/YYYY')+' às '
                                      +evaluationApplication.time_start+'.'}</div>
                                  :
                                  <div className={clsx(classes.chip_brown, className)}
                                       style={{marginRight: '6px'}}>{'Este simulado deve ser iniciado no dia '
                                      +moment(evaluationApplication.date_start).utc().format('DD/MM/YYYY')+' às '
                                      +evaluationApplication.time_start+'.'}</div>)
                          }

                          { ((evaluationApplication.date_finish) &&
                                  <div className={clsx(classes.chip_brown, className)} style={{marginRight: '6px'}}>{'Este simulado deve ser finalizado até o dia '+moment(evaluationApplication.date_finish).utc().format('DD/MM/YYYY')+' às '+evaluationApplication.time_finish+'.'}</div>)
                          }

                          { ((evaluationApplication.time_to_finalize) &&
                                  <div className={clsx(classes.chip_brown, className)} style={{marginRight: '6px'}}>{'Após iniciado, este simulado deve ser finalizado no tempo de '+evaluationApplication.time_to_finalize+'.'}</div>)
                          }

                          {/*answer_head ?
                                  (!answer_head.finalized_at ?
                                      <div className={clsx(classes.chipblue, className)} style={{marginLeft: '4px'}}>{'| Iniciado'}</div> :
                                      <div className={clsx(classes.chipgreen, className)} style={{marginLeft: '4px'}}>{'| Finalizado'}</div>) :
                                  <div className={clsx(classes.chipred, className)} style={{marginLeft: '4px'}}>{'| Não iniciado'}</div>*/}

                      </Box>

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
    history: PropTypes.object,
    setRefresh: PropTypes.object
};

export default withRouter(EvaluationApplicationCard);

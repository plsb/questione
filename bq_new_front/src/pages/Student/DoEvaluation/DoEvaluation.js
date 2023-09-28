import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
  Typography,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  CardActions, List, ListItem, Button, CircularProgress,
  Backdrop, Grid, Box, Divider, Link, Paper
} from '@material-ui/core';
import api from "../../../services/api";
import ReactHtmlParser from "react-html-parser";
import { toast } from 'react-toastify';
import {DialogQuestione} from "../../../components";
import Timer from "../../../components/Timer";

import './styles.css';
import useStyles from "../../../style/style";
import Pagination from '@material-ui/lab/Pagination';
import GamificationPanel from "../../../components/GamificationPanel/GamificationPanel";
import DecreaseStringSize from "../../../components/DecreaseStringSize";
import TooltipQuestione from "../../../components/TooltipQuestione";
import clsx from "clsx";

const useStylesLocal = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  lineQuestion: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: 30
  },
  lineItemQuestion: {
    width: '100%'
  },
  buttons: {
    marginRight: 10
  },
  chipRed:{
    backgroundColor: '#e57373',
    color: '#ffffff',
    marginRight: 10
  },
  hide: {
    opacity: 0,
  },
  selected: { /* Aumenta a especificidade */
    color: '#e57373'
  }
}));

const DoEvaluation = props => {
  const { className, history, ...rest } = props;
  const { codeAplication } = props.match.params;
  const [application, setApplication] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [questionsNotAnswers, setQuestionsNotAnswers] = useState([]);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [dateTimeToFinalized, setDateTimeToFinalized] = useState(null);
  const [dateServer, setDateServer] = useState(new Date());
  const [dialogStart, setDialogStart] = useState(false);
  const [dialogFinish, setDialogFinish] = useState(false);
  const [enableButtonStart, setEnableButtonStart] = useState(true);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);
  const [showTimeDialog, setShowTimeDialog] = useState({
    show: false,
    message: '',
  });
  const timer = React.useRef();
  const [alternativeLetters] = React.useState(['a', 'b', 'c', 'd', 'e']);

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  const [page, setPage] = React.useState(1);
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  function getExpiryTimestamp(timestampTime) {
    // const { date } = dateServer;
    // const time = new Date(date.replace(' ', 'T'));

    const time = new Date();

    time.setSeconds(time.getSeconds() + Math.floor(timestampTime / 1000));

    return time;
  }

  async function listApplication() {
    try {
      const response = await api.get('evaluation/get-application/'+codeAplication);

      if(response.status == 200){
        if(response.data.status == 0){
          toast.error('A avaliação está desabilitada.');
          history.push('/home');
          return ;
        }
        if(response.data.evaluation.status == 2){
          toast.error('A avaliação está arquivada.');
          history.push('/home');
          return ;
        }
        setApplication(response.data);
      } else if (response.status == 202) {
        toast.error(response.data.message);
        history.push('/home');
        return ;
      } else {
        toast.error('Ocorreu um erro ao buscar a avaliação.');
        history.push('/home');
        return ;
      }
    } catch (error) {

    }

  }

  async function startEvaluation(event){
    setOpenBackdrop(true);
    timer.current = setTimeout(() => {
      updateEvaluation();
    }, 100);
    setDialogStart(false);
    event.preventDefault();

  }

  async function updateEvaluation(){
    try {
      const response = await api.post('evaluation/start/'+codeAplication);

      if (response.status === 202) {
        setOpenBackdrop(false);
        if(response.data.message){
          toast.error(response.data.message);
          if (response.data.closed) {
            history.push('/home');
          }
        }
      } else if(response.status == 200){
        if(response.data.status == 0){
          toast.error('Avaliação está desabilitada.');
          history.push('/home');
          return ;
        }
        setAnswers(response.data[0]);

        let totalAlreadyAnswer = 0;
        let arrayQuestionNotAnswers = [];
        response.data[0].forEach((item, i) => {
          if (item.answer) {
            totalAlreadyAnswer = totalAlreadyAnswer +  1;
          } else {
            arrayQuestionNotAnswers.push(i+1);
          }
        });
        setTotalAnswers(totalAlreadyAnswer);
        setQuestionsNotAnswers(arrayQuestionNotAnswers);

        setDateTimeToFinalized(response.data.date_time_to_finalized);
        setDateServer(response.data.date_time_to_finalized);

        setRefresh(refresh+1);
        setEnableButtonStart(false);
        setOpenBackdrop(false);
      }
    } catch (error) {

    }
    setDialogStart(false);
  }

  async function autoFinishEvaluation() {
    try {
      const response = await api.put('evaluation/finish/'+codeAplication, {
        finished_automatically: 1,
      });

      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        }
      } else if(response.status == 200){
        toast.error('Tempo para responder a avaliação esgotado!');
        history.push('/student-class/student');
      }
    } catch (error) {

    }
    setDialogFinish(false);
  }

  async function finshEvaluation(){
    try {
      const response = await api.put('evaluation/finish/'+codeAplication);

      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        }
      } else if(response.status == 200){
        toast.success('Avaliação respondida com sucesso!');
        //history.push('/student-class/student');
        history.goBack();
      }
    } catch (error) {

    }
    setDialogFinish(false);

  }

  useEffect(() => {

  }, [refresh, page, questionsNotAnswers]);

  useEffect(() => {
    listApplication();
  }, []);

  async function handleListItemClick (event, answerId, itemQuestionSelected) {

    try {
      const id = answerId;
      const answer =   itemQuestionSelected;
      const data = {
        id, answer
      }
      const response = await api.put('evaluation/answer/'+codeAplication, data);

      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
          if (response.data.closed) {
            history.push('/home');
          }
        }
      }  else if(response.status == 200){
        const values = answers;
        let totalAlreadyAnswer = 0;
        let arrayQuestionNotAnswers = [];
        values.forEach(function logArrayElements(element, index, array) {
          if(element.id == answerId){
            element.answer = itemQuestionSelected;
          }

          if (element.answer) {
            totalAlreadyAnswer = totalAlreadyAnswer + 1;
          } else {
            arrayQuestionNotAnswers.push(index+1);
          }
        });
        setQuestionsNotAnswers(arrayQuestionNotAnswers);
        setTotalAnswers(totalAlreadyAnswer);
        setAnswers(values);
        setRefresh(refresh+1);
      }

    } catch (error) {

    }

  };

  const handleToggle = (value) => () => {

  };

  const onClickCloseDialogStart = () => {
    setDialogStart(false);
  }

  const onClickOpenDialogStart = () => {
    setDialogStart(true);
  }

  const onClickOpenDialogFinsh = () => {
    setDialogFinish(true);
  }

  const onClickCloseDialogFinish = () => {
    setDialogFinish(false);
  }

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  return (
      <div className="do-evaluation-screen">
        <Backdrop className={classes.backdrop} open={openBackdrop} onClick={handleCloseBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
        { application.id ?
        <div className={classes.root}>
          <Card className={classes.root} style={{padding: '15px'}}>

                  <Grid container direction="row" xs={12}>
                    <Grid item xs={12} sm={12} md={7}>
                      {/*<Avatar aria-label="recipe" className={classes.avatar}>
                        {getInitials(localStorage.getItem("@Questione-name-user"))}
                      </Avatar>*/}
                      <div className={classesGeneral.paperTitleTextBold} style={{marginLeft: '15px'}}>
                        {'Simulado: '+application.description}
                      </div>
                      {application && application.evaluation.practice !== 1 && (
                          <div className={classesGeneral.paperTitleTextBold} style={{marginLeft: '15px'}}>
                            {'Professor(a): '+application.evaluation.user.name}
                          </div>
                      )}
                      <div className={classesGeneral.paperTitleText} style={{marginLeft: '15px', marginBottom: '5px'}}>
                      {'Aluno(a): '+localStorage.getItem("@Questione-name-user") }
                      </div>
                      {application && application.class && (
                          <div className={classesGeneral.paperTitleText} style={{marginLeft: '15px', marginBottom: '10px'}}>
                            {'Turma: '+application.class.id_class + ' - '}<DecreaseStringSize string={application.class.description} />
                          </div>
                      )}
                      {answers.length !== 0 && (
                          <div className={classesGeneral.paperTitleText} style={{marginLeft: '15px', marginBottom: '10px'}}>
                            Questões respondidas:
                            <b> {totalAnswers+'/'+answers.length}</b>
                          </div>
                      )}
                      {questionsNotAnswers.length !== 0 &&
                          <div className={classesGeneral.paperTitleText} style={{marginLeft: '15px', marginBottom: '10px'}}>
                            Questões não respondidas:
                            {questionsNotAnswers.map((item, i) => (
                                <Link
                                    style={{color: '#f44336', fontFamily: 'Verdana', fontSize: '14px', marginLeft: '5px'}}
                                    onClick={() => handleChangePage(null, item)}>
                                  {item}
                                </Link>
                            ))}
                          </div>
                      }
                      {!enableButtonStart && dateTimeToFinalized && (
                          <div className={classesGeneral.paperTitleText} style={{marginLeft: '15px', marginBottom: '10px'}}>
                            <TooltipQuestione description={'Este é o tempo restante para finalizar o simulado.'} position={'bottom-start'} content={
                              <Timer
                                  expiryTimestamp={
                                    getExpiryTimestamp(
                                        ((new Date(dateTimeToFinalized.date.replace(' ', 'T'))).getTime() - (new Date()).getTime())
                                    )
                                  }
                                  onExpire={autoFinishEvaluation}
                                  setShowTimeDialog={() => {}}
                              />
                            }/>
                          </div>
                      )}

                    </Grid>
                    {(application.class && application.class.gamified_class) ?
                      <Grid item xs={12} sm={12} md={5}>
                            <GamificationPanel gamified_class={application.class.gamified_class} classId={application.class.id}/>
                      </Grid> : null}
                      <Grid item xs={12} sm={12} md={12}>
                        { enableButtonStart &&
                            <Box display='flex' justifyContent='center' >
                              <TooltipQuestione description={"Você poderá iniciar/continuar sua avaliação clicando neste botão."}
                                                position={"top"} content={
                                <Button
                                    className={classes.buttons}
                                    variant="outlined"
                                    color="primary"
                                    style={{width: '99%', marginTop: '20px', marginLeft: '10px', marginBottom: '15px', marginRight: '20px'}}
                                    onClick={startEvaluation}

                                    disabled={!enableButtonStart}>
                                  {application && application.student_started === 1 ? 'Continuar' : 'Iniciar' }
                                </Button>

                              }/>

                            </Box>}
                      </Grid>
                  </Grid>

          </Card>

          {!enableButtonStart &&
              <div>
                  {!enableButtonStart && (
                      <Box display='flex' marginRight='20px' marginTop='5px' justifyContent='right'>
                        <Link
                            component="button"
                            className={classesGeneral.textRedInfo}
                            onClick={onClickOpenDialogFinsh} disabled={enableButtonStart}>
                          <Box display="flex" alignItems="row" style={{marginTop: '10px'}}>
                            <div style={{marginRight: '3px', marginTop: '5px', fontSize: '15px'}}>
                              {'Entregar simulado'}
                            </div>
                            <div>
                              <ArrowForwardIcon />
                            </div>
                          </Box>

                        </Link>
                      </Box>
                  )}
                  <Box display='flex' margin='10px' justifyContent='center'>
                    <Pagination count={answers.length} variant="outlined" page={page} color="primary" onChange={handleChangePage}/>
                  </Box>
                  <Box>
                    { answers.length > 0  &&
                        <div style={{margin: '10px'}}>
                          <Box display="flex">
                            <Box display="flex" sx={{ flexGrow: 1 }} justifyContent="flex-start">
                              <div style={{color: '#757575', fontFamily: 'Verdana', fontSize: '14px', marginTop: '7px'}}>
                                {'Questão    '}
                              </div>
                              &nbsp;
                              <div style={{color: '#000000', fontWeight: 'bold', fontFamily: 'Verdana', fontSize: '20px', marginTop: '0px', textDecoration: 'underline'}}>
                                {page}
                              </div>
                              &nbsp;
                              <div style={{color: '#757575', fontFamily: 'Verdana', fontSize: '14px', marginTop: '7px'}}>
                                {'   de '+answers.length}
                              </div>
                            </Box>
                          </Box>
                          <Divider style={{padding: '3px', marginTop: '10px', marginBottom: '15px'}} className={classesGeneral.paperTitle}/>
                          <div style={{margin: '10px'}}>
                            <div style={{marginLeft: '15px'}}>
                              { ReactHtmlParser (answers[page-1].evaluation_question_without_correct.question_without_correct.base_text) }
                            </div>
                            <div style={{marginLeft: '10px', marginTop: '10px'}}>
                              { ReactHtmlParser (answers[page-1].evaluation_question_without_correct.question_without_correct.stem) }
                            </div>
                            <div style={{marginTop: '15px'}}>
                              {answers[page-1].evaluation_question_without_correct.question_without_correct.question_items_without_correct.map((item, i) => (
                                  <div>
                                    <Box display="flex" flexDirection="row"  style={{ width: '100%' }}>
                                      {/*<Box style={{marginTop: '12px', marginRight: '2px'}} sx={{ flexShrink: 1 }}>
                                          <Tooltip title={'Clique para eliminar a alternativa '+alternativeLetters[i]+'.'} placement="top-start">
                                            <IconButton color="primary" aria-label="upload picture" component="span" size="small" style={{marginRight: '10px'}}>
                                              <img
                                                  alt="Logo"
                                                  src="/images/tesouras.png"
                                              />
                                            </IconButton>
                                          </Tooltip>
                                      </Box>*/}
                                      <Box sx={{ width: '100%' }}>

                                          <List className={classes.lineItemQuestion}
                                                key={item.id}
                                                onClick={handleToggle(item.id)}
                                                component="nav" aria-label="secondary mailbox folder">
                                            <ListItem key={item.id}
                                                      selected={answers[page-1].answer == item.id}
                                                      button onClick={(event) => handleListItemClick(event, answers[page-1].id, item.id)}
                                                      style={{background: '#f5f5f5'}}>
                                                <div style={{marginRight: '10px', fontSize: '14px', fontWeight: 'bold'}}>
                                                  {alternativeLetters[i]+')'}
                                                </div>
                                                <div>
                                                  {ReactHtmlParser (item.description)}
                                                </div>

                                            </ListItem>
                                          </List>


                                      </Box>
                                    </Box>

                                  </div>
                              ))}
                            </div>
                          </div>
                    </div> }
                  </Box>

                  <Box display='flex' margin='10px' marginTop='30px' justifyContent='center'>
                    <Pagination count={answers.length} variant="outlined" page={page} color="primary" onChange={handleChangePage}/>
                  </Box>
                {!enableButtonStart && (
                  <Box display='flex' marginRight='20px' marginTop='10px' marginBottom='50px' justifyContent='right'>
                    <Link
                        component="button"
                        className={classesGeneral.textRedInfo}
                        onClick={onClickOpenDialogFinsh} disabled={enableButtonStart}>
                      <Box display="flex" alignItems="row">
                        <div style={{marginRight: '3px', marginTop: '2px', fontSize: '15px'}}>
                          {'Entregar simulado'}
                        </div>
                        <div>
                          <ArrowForwardIcon />
                        </div>
                      </Box>

                    </Link>
                  </Box>
                )}
              </div>}

        </div>
              : null}
        <DialogQuestione handleClose={onClickCloseDialogStart}
                         open={dialogStart}
                         onClickAgree={startEvaluation}
                         onClickDisagree={onClickCloseDialogStart}
                         mesage={
                             <div className={classesGeneral.messageDialog}>
                               {`${application && application.student_started === 1 ? 'Deseja continuar a avaliação?' : 'Deseja iniciar a avaliação?'}`}
                            </div>}
                         title=
                             {<div className={classesGeneral.titleDialog}>
                                {'Responder Avaliação'}
                            </div>}/>
        <DialogQuestione handleClose={onClickCloseDialogFinish}
                         open={dialogFinish}
                         onClickAgree={finshEvaluation}
                         onClickDisagree={onClickCloseDialogFinish}
                         mesage={
                           <div className={classesGeneral.messageDialog}>
                             {'Deseja finalizar a avaliação?'}
                           </div>
                         }
                         title=
                             {<div className={classesGeneral.titleDialog}>
                                {'Finalizar Avaliação'}
                               </div>}/>
      </div>
  );
};

DoEvaluation.propTypes = {
  className: PropTypes.string,
};

export default DoEvaluation;

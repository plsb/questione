import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
  Typography,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  CardActions, List, ListItem, Button, CircularProgress,
  Backdrop, Grid, Box, Divider, Link, Paper, IconButton, Chip
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
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

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

  const [enableButtonStart, setEnableButtonStart] = useState(true);
  const [enableDialogAlert, setEnableDialogAlert] = useState(false);

  const [totalAnswers, setTotalAnswers] = useState(0);
  const [dateTimeToFinalized, setDateTimeToFinalized] = useState(null);
  const [dateServer, setDateServer] = useState(new Date());
  const [dialogFinish, setDialogFinish] = useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);
  const [showTimeDialog, setShowTimeDialog] = useState({
    show: false,
    message: '',
  });
  const timer = React.useRef();
  const [alternativeLetters] = React.useState(['a', 'b', 'c', 'd', 'e']);
  const [arrayAnimations] = React.useState(['boy_running', 'clock', 'coffee', 'hamburger', 'location',
          'paperplane', 'profile', 'quiz', 'web_design']);

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  const [page, setPage] = React.useState(1);

  const [dialogHelpOne, setDialogHelpOne] = useState(false);
  const [dialogHelpTwo, setDialogHelpTwo] = useState(false);
  const [dialogHelpThree, setDialogHelpThree] = useState(false);
  const [dialogHelpCollegeStudents, setDialogHelpCollegeStudents] = useState(false);


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

        setRefresh(Date.now());
        setEnableButtonStart(false);
        setOpenBackdrop(false);
      }
    } catch (error) {

    }
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

  }, [enableDialogAlert]);

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
        setRefresh(Date.now());
      }

    } catch (error) {

    }

  };

  const handleToggle = (value) => () => {

  };

  const onClickOpenDialogHelpOne = () => {
    setDialogHelpOne(true);
  }
  const onClickCloseDialogHelpOne = () => {
    setDialogHelpOne(false);
  }

  const onClickCloseDialogHelpTwo = () => {
    setDialogHelpTwo(false);
  }

  const onClickOpenDialogHelpTwo = () => {
    setDialogHelpTwo(true);
  }

  const onClickCloseDialogHelpThree = () => {
    setDialogHelpThree(false);
  }

  const onClickOpenDialogHelpThree = () => {
    setDialogHelpThree(true);
  }

  const onClickCloseDialogHelpCollegeStudents = () => {
    setDialogHelpCollegeStudents(false);
  }

  const onClickOpenDialogHelpCollegeStudents = () => {
    setDialogHelpCollegeStudents(true);
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

  function disableItens (answer, idItem){
    let value_return = false;
    if(answer.help_for_student){

      answer.help_for_student.forEach(function(help, i) {
        if(help.description_id != 'help_from_university_students'){
            if(help.fk_answer_deleted_id === idItem){
              value_return = true;
            }
        }
      });
    }
    return value_return;
  }

  async function helpFromUniversityStudents(answerId){
    try {
      const response = await api.post('class/student/gamification/help-from-university-students/'+answerId);

      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        }
      }  else if(response.status == 200){
        toast.success('Uau, você arrebentou! Conseguiu arrancar a sabedoria dos cérebros brilhantes do universo Questione! 🎉🎓💡');
        const values = answers;
        values.forEach(function logArrayElements(element, index, array) {
          if(element.id == answerId){
            var novaArray = [response.data];


            element.help_for_student.pop();
            element.help_for_student.pop();
            element.help_for_student.pop();
            element.help_for_student = novaArray[0];
          }
        });
        setAnswers(values);



        setRefresh(Date.now());
      }

    } catch (error) {

    }
    setDialogHelpOne(false);
    setDialogHelpTwo(false);
    setDialogHelpThree(false);
    setDialogHelpCollegeStudents(false);
  };

  async function removeAlternative(answerId, totalItems){
    try {
      const total_items_to_remove =  totalItems;
      const data = {
        total_items_to_remove
      }
      const response = await api.post('class/student/gamification/remove-alternative/'+answerId, data);

      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        }
      }  else if(response.status == 200){
        if(total_items_to_remove == 1)
          toast.success('Ei, você é um verdadeiro mestre das respostas! Deu um adeus para uma alternativa e agora ela está na lista negra, toda vermelhinha e desabilitada! 🚫🔴😄');
        else
          toast.success('Bravo! Você fez um desaparecimento mágico de '+totalItems+' opções na questão. Agora elas estão em modo invisível, pintadas de vermelho! 🎩✨🔴');

        const values = answers;
        values.forEach(function logArrayElements(element, index, array) {
          if(element.id == answerId){
            var novaArray = [response.data];


            element.help_for_student.pop();
            element.help_for_student.pop();
            element.help_for_student.pop();
            element.help_for_student = novaArray[0];
          }
        });
        setAnswers(values);



        setRefresh(Date.now());
      }

    } catch (error) {

    }
    setDialogHelpOne(false);
    setDialogHelpTwo(false);
    setDialogHelpThree(false);
    setDialogHelpCollegeStudents(false);
  };

  async function logEvaluation(type, answerId){
    try {
      const data = {
        type
      }
      const response = await api.post('evaluation/log-evaluation/'+codeAplication, data);

      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        }
      }  else if(response.status == 200){

      }

    } catch (error) {

    }

  };

  (function () {

    var hidden = "hidden";
    if (hidden in document) document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document) document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document) document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document) document.addEventListener("msvisibilitychange", onchange);
    else if ('onfocusin' in document) document.onfocusin = document.onfocusout = onchange;
    else window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.mozHidden !== "undefined") {
      hidden = "mozHidden";
      visibilityChange = "mozvisibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    function onchange(evt) {
      var evtMap = {
        focus: true,
        focusin: true,
        pageshow: true,
        blur: false,
        focusout: false,
        pagehide: false
      };

      evt = evt || window.event;
      if (evt.type in evtMap) evtMap[evt.type] ? functionVisible() : functionHidden();
      else this[hidden] ? functionHidden() : functionVisible();
    }

    function functionVisible() {
      if(!enableButtonStart) {
        logEvaluation('I');
        console.log('console I', Date.now());
      }
    }

    function functionHidden() {
      if(!enableButtonStart) {
        //alert('Você saiu do questione enquanto estava respondendo um simulado. A Ação foi registrada!')
        setEnableDialogAlert(true);
        logEvaluation('O');
        console.log('console O', Date.now());
      }
    }
  })();

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
                            Total respondidas:
                            <b> {totalAnswers+'/'+answers.length}</b>
                          </div>
                      )}
                      {questionsNotAnswers.length !== 0 &&
                          <div className={classesGeneral.paperTitleText} style={{marginLeft: '15px', marginBottom: '10px'}}>
                            Falta responder:
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
                            <GamificationPanel refresh={refresh} gamified_class={application.class.gamified_class} classId={application.class.id}/>
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
          <Box display={!enableButtonStart ? 'none' : 'block'} style={{marginTop: '10px'}}>
            <Player
                autoplay
                loop
                src={'/images/animations/'+arrayAnimations[Math.floor(Math.random() * 9)]+'.json'}
                style={{ height: '300px', width: '300px' }}>
              <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
            </Player>
          </Box>

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
                          <Divider style={{padding: '3px', marginTop: '10px', marginBottom: '10px'}} className={classesGeneral.paperTitle}/>
                          <div style={{margin: '10px', marginTop: '20px'}}>
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
                                                      style={{background: disableItens(answers[page-1], item.id) ? '#ffcdd2' :'#f5f5f5'}}
                                                      disabled={disableItens(answers[page-1], item.id)}>
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
                            {(application.class && application.class.gamified_class) ?
                                <Box style={{marginTop: '20px'}}>
                                  <Paper className={classesGeneral.paperTitle}>
                                    <Box display='flex' justifyContent={'center'}>
                                      <div className={classesGeneral.paperTitleTextBold}>
                                        {answers[page-1].help_for_student[0] ?
                                            'Você utilizou uma ajuda para esta questão!'
                                          : 'Qual ajuda você deseja para a questão '+page+'?'}
                                      </div>
                                    </Box>
                                  </Paper>
                                  <Paper className={classesGeneral.paperSubtitle} >
                                    <Box display="flex" justifyContent={'center'}>
                                      {answers[page-1].help_for_student[0] ?
                                          <Box>
                                            <div className={classesGeneral.textGreeInfo} style={{textAlign: 'center'}}>
                                              {'Você usou: '+answers[page-1].help_for_student[0].gamification_settings[0].description}
                                            </div>
                                            {answers[page-1].help_for_student[0].totalAnswersByItemQuestion != null ? (
                                                <div>
                                                  <Box>
                                                    <div className={classesGeneral.paperTitleText} style={{textAlign: 'center'}}>
                                                      {'Dê uma espiada nas opções assinaladas e descubra o percentual de cada uma delas - é hora do show dos números! 🔍📊:'}
                                                    </div>
                                                  </Box>
                                                  <Box justifyContent={'center'}>
                                                  {answers[page-1].help_for_student[0].totalAnswersByItemQuestion.items.map((item, i) => (
                                                      <div>
                                                        {item.total_answers > 0 &&
                                                        (<Box justifyContent={'center'} display='flex' style={{marginTop: '15px', marginRight: '15px'}}>
                                                            <div className={classesGeneral.paperTitleText} style={{fontWeight: item.total_answer_item > 0 && 'bold', marginRight: '5px'}}>
                                                              {((item.total_answers/answers[page-1].help_for_student[0].totalAnswersByItemQuestion.total_answers)*100).toFixed(2)+'% marcaram a letra '}
                                                            </div>
                                                          <Chip label={alternativeLetters[i]} style={{fontSize: '14px', fontWeight: item.total_answer_item > 0 && 'bold', background:"#e2f2e7"}} size="small"/>
                                                          {'.'}
                                                        </Box>)}
                                                      </div>
                                                      ))}
                                                  </Box>
                                                </div>
                                                ) : null}
                                          </Box>
                                          :
                                          <Box display='flex' justifyContent={'center'}>
                                            <TooltipQuestione description={'Clique para remover uma opção incorreta da questão '+page+'.'} position={'top-start'} content={
                                              <Box justifyContent={'center'} style={{marginRight: '20px'}}>
                                                <IconButton onClick={onClickOpenDialogHelpOne}>
                                                  <img
                                                      alt="Logo"
                                                      src="/images/numero-1.png" width='35px'/>
                                                </IconButton>
                                                <div className={classesGeneral.textRedInfo} style={{fontSize: '12px', textAlign:'center'}}>
                                                  {'-10 PR'}
                                                </div>
                                              </Box>
                                            }/>
                                            <TooltipQuestione description={'Clique para remover duas opções incorretas da questão '+page+'.'} position={'top-start'} content={
                                              <Box justifyContent={'center'} style={{marginRight: '20px'}}>
                                                <IconButton onClick={onClickOpenDialogHelpTwo}>
                                                  <img
                                                      alt="Logo"
                                                      src="/images/numero-2.png" width='35px'/>
                                                </IconButton>
                                                <div className={classesGeneral.textRedInfo} style={{fontSize: '12px', textAlign:'center'}}>
                                                  {'-20 PR'}
                                                </div>
                                              </Box>
                                            }/>
                                            <TooltipQuestione description={'Clique para remover três opções incorretas da questão '+page+'.'} position={'top-start'} content={
                                              <Box justifyContent={'center'} style={{marginRight: '20px'}}>
                                                <IconButton onClick={onClickOpenDialogHelpThree}>
                                                  <img
                                                      alt="Logo"
                                                      src="/images/numero-3.png" width='35px'/>
                                                </IconButton>
                                                <div className={classesGeneral.textRedInfo} style={{fontSize: '12px', textAlign:'center'}}>
                                                  {'-30 PR'}
                                                </div>
                                              </Box>
                                            }/>
                                            {answers[page-1].evaluation_question_without_correct.question_without_correct.totalAnswers > 1 &&
                                            <TooltipQuestione description={'Clique para visualizar o total de respostas anteriores para esta questão em cada alternativa.'} position={'top-start'} content={
                                              <Box justifyContent={'center'}>
                                                <IconButton onClick={onClickOpenDialogHelpCollegeStudents}>
                                                  <img
                                                      alt="Logo"
                                                      src="/images/college_students.png" width='35px'/>
                                                </IconButton>
                                                <div className={classesGeneral.textRedInfo} style={{fontSize: '12px', textAlign:'center'}}>
                                                  {'-30 PR'}
                                                </div>
                                              </Box>
                                            }/>}
                                            <DialogQuestione handleClose={onClickCloseDialogHelpOne}
                                                             open={dialogHelpOne}
                                                             onClickAgree={(event) => removeAlternative(answers[page-1].id, 1)}
                                                             onClickDisagree={onClickCloseDialogHelpOne}
                                                             mesage={
                                                               <div className={classesGeneral.messageDialog}>
                                                                 {'Ao deletar uma opção errada, você vai perder uns pontinhos preciosos dos seus PRs. Pronto para pagar esse tributo à sabedoria? 😅🔥💻'}
                                                               </div>
                                                             }
                                                             title=
                                                                 {<div className={classesGeneral.titleDialog}>
                                                                   {'Apagar 1 alternativa'}
                                                                 </div>}/>
                                            <DialogQuestione handleClose={onClickCloseDialogHelpTwo}
                                                             open={dialogHelpTwo}
                                                             onClickAgree={(event) => removeAlternative(answers[page-1].id, 2)}
                                                             onClickDisagree={onClickCloseDialogHelpTwo}
                                                             mesage={
                                                               <div className={classesGeneral.messageDialog}>
                                                                 {'Ao remover duas respostas erradas, você vai desencadear o imposto sobre seus PRs. Vai encarar essa jornada com coragem? 😄📉💼'}
                                                               </div>
                                                             }
                                                             title=
                                                                 {<div className={classesGeneral.titleDialog}>
                                                                   {'Apagar 2 alternativas'}
                                                                 </div>}/>
                                            <DialogQuestione handleClose={onClickCloseDialogHelpThree}
                                                             open={dialogHelpThree}
                                                             onClickAgree={(event) => removeAlternative(answers[page-1].id, 3)}
                                                             onClickDisagree={onClickCloseDialogHelpThree}
                                                             mesage={
                                                               <div className={classesGeneral.messageDialog}>
                                                                 {'Se você desaparecer com três opções erradas, seus PRs podem sentir um tremor de medo. Quer prosseguir nessa missão de eliminação? 😅📉💼'}
                                                               </div>
                                                             }
                                                             title=
                                                                 {<div className={classesGeneral.titleDialog}>
                                                                   {'Apagar 3 alternativas'}
                                                                 </div>}/>
                                            <DialogQuestione handleClose={onClickCloseDialogHelpCollegeStudents}
                                                             open={dialogHelpCollegeStudents}
                                                             onClickAgree={(event) => helpFromUniversityStudents(answers[page-1].id)}
                                                             onClickDisagree={onClickCloseDialogHelpCollegeStudents}
                                                             mesage={
                                                               <div className={classesGeneral.messageDialog}>
                                                                 {'Você está prestes a mergulhar em um mar de respostas! '+
                                                                   'Aqui temos '+answers[page-1].evaluation_question_without_correct.question_without_correct.totalAnswers+
                                                                  ' delas esperando ansiosamente pelo seu olhar curioso. Vamos dar uma olhada nas porcentagens de cada alternativa? Prepare-se para uma aventura estatística! 🌊📈😄'}
                                                               </div>
                                                             }
                                                             title=
                                                                 {<div className={classesGeneral.titleDialog}>
                                                                   {'Ajuda dos universitários'}
                                                                 </div>}/>
                                          </Box>
                                      }
                                    </Box>
                                  </Paper>
                                </Box> : null}
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

        <DialogQuestione handleClose={onClickCloseDialogFinish}
                         open={dialogFinish}
                         onClickAgree={finshEvaluation}
                         onClickDisagree={onClickCloseDialogFinish}
                         mesage={
                           <div className={classesGeneral.messageDialog}>
                             {'Está pronto para dar um até logo ao simulado? Lembre-se, o conhecimento é uma viagem sem fim! 😄🚀📚'}
                           </div>
                         }
                         title=
                             {<div className={classesGeneral.titleDialog}>
                                {'Finalizar Avaliação'}
                               </div>}/>

        <Dialog
            open={enableDialogAlert}
            onClose={() => setEnableDialogAlert(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            <div className={classesGeneral.titleDialog}>
              {'Alerta de atividade suspeita'}
            </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className={classesGeneral.messageDialog}>
                {'Você deu um passeio na "Rua das Dúvidas" no meio da sua maratona de avaliação. ' +
                    'Os detetives dos registros do simulado flagraram você em ação! 😄 ' +
                    'Ah, o log da sua travessura foi cuidadosamente arquivado na pasta "Gafes Épicas" do seu histórico de simulado! 🤣'}
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEnableDialogAlert(false)}>
              {'Fechar'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>

  );

};





DoEvaluation.propTypes = {
  className: PropTypes.string,
};

export default DoEvaluation;

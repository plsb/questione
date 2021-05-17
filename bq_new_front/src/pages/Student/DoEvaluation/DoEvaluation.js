import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  Typography,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  CardActions, List, ListItem, Button, CircularProgress,
    Backdrop, Grid, Tooltip
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import api from "../../../services/api";
import {getInitials} from "../../../helpers";
import ReactHtmlParser from "react-html-parser";
import clsx from "clsx";
import Swal from "sweetalert2";
import {DialogQuestione} from "../../../components";
import Timer from "../../../components/Timer";

import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

import './styles.css';

const useStyles = makeStyles({
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
  }
});

const DoEvaluation = props => {
  const { className, history, ...rest } = props;
  const { codeAplication } = props.match.params;
  const [application, setApplication] = useState([]);
  const [answers, setAnswers] = useState([]);
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

  const classes = useStyles();

  //configuration alert
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  function getExpiryTimestamp(timestampTime) {
    // const { date } = dateServer;
    // const time = new Date(date.replace(' ', 'T'));

    const time = new Date();

    time.setSeconds(time.getSeconds() + Math.floor(timestampTime / 1000));

    return time;
  }

  function loadAlert(icon, message) {
    Toast.fire({
      icon: icon,
      title: message
    });
  }

  async function listApplication() {
    try {
      const response = await api.get('evaluation/get-application/'+codeAplication);

      if(response.status == 200){
        if(response.data.status == 0){
          loadAlert('error', 'A avaliação está desabilitada.');
          history.push('/home');
          return ;
        }
        if(response.data.evaluation.status == 2){
          loadAlert('error', 'A avaliação está arquivada.');
          history.push('/home');
          return ;
        }
        setApplication(response.data);
      } else if (response.status == 202) {
        loadAlert('error', response.data.message);
        history.push('/home');
        return ;
      } else {
        loadAlert('error', 'Ocorreu um erro ao buscar a avaliação.');
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
    }, 1300);
    setDialogStart(false);
    event.preventDefault();

  }

  async function updateEvaluation(){
    try {
      const response = await api.post('evaluation/start/'+codeAplication);

      if (response.status === 202) {
        setOpenBackdrop(false);
        if(response.data.message){
          loadAlert('error', response.data.message);
          if (response.data.closed) {
            history.push('/home');
          }
        }
      } else if(response.status == 200){
        if(response.data.status == 0){
          loadAlert('error', 'Avaliação está desabilitada.');
          history.push('/home');
          return ;
        }
        setAnswers(response.data[0]);
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
          loadAlert('error', response.data.message);
        }
      } else if(response.status == 200){
        loadAlert('error', 'Tempo para responder a avaliação esgotado!');
        history.push('/student/result-evaluations');
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
          loadAlert('error', response.data.message);
        }
      } else if(response.status == 200){
        loadAlert('success', 'Avaliação respondida com sucesso!');
        history.push('/student/result-evaluations');
      }
    } catch (error) {

    }
    setDialogFinish(false);

  }

  useEffect(() => {

  }, [refresh]);

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
          loadAlert('error', response.data.message);
        }
      }  else if(response.status == 200){
        const values = answers;
        values.forEach(function logArrayElements(element, index, array) {
          if(element.id == answerId){
            element.answer = itemQuestionSelected;
          }
        });
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
      <div>
        <Backdrop className={classes.backdrop} open={openBackdrop} onClick={handleCloseBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
        { application.id ?
        <div className={classes.root}>
          <Card className={classes.root}>
            <CardHeader
                avatar={
                  <div>
                    <Avatar aria-label="recipe" className={classes.avatar}>
                      {getInitials(localStorage.getItem("@Questione-name-user"))}
                    </Avatar>
                    <Typography variant="button" color="textSecondary" component="p">
                    {'Aluno(a): '+localStorage.getItem("@Questione-name-user") }
                    </Typography>
                    <Typography variant="button" color="textSecondary" component="p">
                      {'Avaliação: '+application.evaluation.description}
                    </Typography>
                    <Typography variant="button" color="textSecondary" component="p">
                      {'Código da aplicação: '+application.id_application}
                    </Typography>
                    {application && application.evaluation.practice !== 1 && (
                      <Typography variant="button" color="textSecondary" component="p">
                        {'Professor(a): '+application.evaluation.user.name}
                      </Typography>
                    )}
                    <Typography variant="button" color="textSecondary" component="p">
                        Para mais informações sobre como responder a avaliação,&nbsp;
                        <a
                          href="https://docs.google.com/document/d/1o_rd-CN_Or0X9gk1c9aB6oB69jWMi-zOGJ7gs8LNEvc/edit?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          clique aqui
                        </a>
                    </Typography>
                    {!enableButtonStart && dateTimeToFinalized && (
                      <Typography variant="button" color="textSecondary" component="p">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          Tempo restante:
                          <Timer
                            expiryTimestamp={
                              getExpiryTimestamp(
                                ((new Date(dateTimeToFinalized.date.replace(' ', 'T'))).getTime() - (new Date()).getTime())
                              )
                            }
                            onExpire={autoFinishEvaluation}
                            setShowTimeDialog={() => {}}
                          />
                        </div>
                      </Typography>
                    )}
                  </div>
                }
            />

            <CardActions disableSpacing>
              <div>
                <Tooltip title="Você poderá iniciar/continuar sua avaliação clicando neste botão." placement="top">
                  <Button
                    className={classes.buttons}
                    variant="contained"
                    color="primary"
                    onClick={startEvaluation}
                    disabled={!enableButtonStart}>
                    {application && application.student_started === 1 ? 'Continuar' : 'Iniciar' }
                  </Button>
                </Tooltip>
                <Tooltip title="Você poderá finalizar sua avaliação clicando neste botão." placement="top">
                  <Button
                    className={clsx(classes.chipRed, className)}
                    variant="contained"
                    color="#e57373"
                    onClick={onClickOpenDialogFinsh}
                    disabled={enableButtonStart}>
                    Finalizar
                  </Button>
                </Tooltip>
              </div>

            </CardActions>
          </Card>

          {answers.map((data, i) => (
              <ExpansionPanel expanded={expanded === i} key={data.id} onChange={handleChange(i)}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-label="Expand"
                    aria-controls="additional-actions1-content"
                    id="additional-actions1-header">
                  <FormControlLabel
                      aria-label="Acknowledge"
                      onClick={(event) => event.stopPropagation()}
                      onFocus={(event) => event.stopPropagation()}
                      control={(
                        <Tooltip title={data.answer != null ? 'Esta questão já foi respondida' : 'Não respondida'}>
                          <Checkbox
                            className={data.answer != null ? '' : classes.hide}
                            checked={data.answer != null}
                          />
                        </Tooltip>
                      )}
                      label={(i + 1) <10 ? ('Questão 00' + (i + 1)) :
                              (i + 1) <100 ? ('Questão 0' + (i + 1)) : (i + 1)}
                  />
                </ExpansionPanelSummary>
                <ExpansionPanelDetails key={data.id}>
                  <div className={classes.lineQuestion}>
                    <Typography variant="button" color="textSecondary" component="p">
                      Texto base:
                    </Typography>
                    <div> { ReactHtmlParser (data.evaluation_question_without_correct.question_without_correct.base_text) } </div>
                    <br/>
                    <Typography variant="button" color="textSecondary" component="p">
                      Enunciado:
                    </Typography>
                    <div> { ReactHtmlParser (data.evaluation_question_without_correct.question_without_correct.stem) } </div>
                    <br />
                    <Typography variant="button" color="textSecondary" component="p">
                      Alternativas:
                    </Typography>
                    <br />
                    {data.evaluation_question_without_correct.question_without_correct.question_items_without_correct.map(item => (
                        <Tooltip title="Clique para escolher esta alternativa." placement="top-start">
                          <List className={classes.lineItemQuestion}
                                key={item.id}
                                onClick={handleToggle(item.id)}
                                component="nav" aria-label="secondary mailbox folder">
                            <ListItem key={item.id}
                                      selected={data.answer == item.id}
                                button onClick={(event) => handleListItemClick(event, data.id, item.id)}>
                              { ReactHtmlParser (item.description)  }
                            </ListItem>
                          </List>
                        </Tooltip>
                    ))}

                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
          ))}
          {!enableButtonStart && (
            <Button
              className={clsx(classes.chipRed, className)}
              variant="contained"
              color="#e57373"
              onClick={onClickOpenDialogFinsh}
              disabled={enableButtonStart}
              style={{ margin: '16px 0px', marginLeft: '16px' }}
            >
              Finalizar
            </Button>
          )}
        </div>
              : null}
        <DialogQuestione handleClose={onClickCloseDialogStart}
                         open={dialogStart}
                         onClickAgree={startEvaluation}
                         onClickDisagree={onClickCloseDialogStart}
                         mesage={`${application && application.student_started === 1 ? 'Deseja continuar a avaliação?' : 'Deseja iniciar a avaliação?'}`}
                         title={'Responder Avaliação'}/>
        <DialogQuestione handleClose={onClickCloseDialogFinish}
                         open={dialogFinish}
                         onClickAgree={finshEvaluation}
                         onClickDisagree={onClickCloseDialogFinish}
                         mesage={'Deseja finalizar a avaliação?'}
                         title={'Finalizar Avaliação'}/>

        {/* <Dialog
              open={showTimeDialog.show}
              onClose={() => setShowTimeDialog({ ...showTimeDialog, show: false })}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
              <DialogTitle id="alert-dialog-title">Tempo de prova</DialogTitle>
              <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {showTimeDialog.message}
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                  <Button onClick={() => setShowTimeDialog({ ...showTimeDialog, show: false })} color="primary">
                      Ok
                  </Button>
              </DialogActions>
          </Dialog> */}
      </div>
  );
};

DoEvaluation.propTypes = {
  className: PropTypes.string,
};

export default DoEvaluation;

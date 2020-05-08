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
  CardActions, List, ListItem, Button
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import api from "../../services/api";
import {getInitials} from "../../helpers";
import ReactHtmlParser from "react-html-parser";
import clsx from "clsx";
import Swal from "sweetalert2";
import {DialogQuestione} from "../../components";

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  lineQuestion: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
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
});

const DoEvaluation = props => {
  const { className, history, ...rest } = props;
  const { codeAplication } = props.match.params;
  const [application, setApplication] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [dialogStart, setDialogStart] = useState(false);
  const [dialogFinish, setDialogFinish] = useState(false);
  const [enableButtonStart, setEnableButtonStart] = useState(true);
  const [checked, setChecked] = React.useState([0]);

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

  function loadAlert(icon, message) {
    Toast.fire({
      icon: icon,
      title: message
    });
  }

  async function listApplication() {
    try {
      const response = await api.get('evaluation/get-application/'+codeAplication);
      console.log(response);
      if(response.status == 200){
        if(response.data.status == 0){
          loadAlert('error', 'Avaliação está desabilitada.');
          history.push('/home');
          return ;
        }
        setApplication(response.data);
      } else {
        loadAlert('error', 'Ocorreu um erro ao buscar a avaliação.');
        history.push('/home');
        return ;
      }
    } catch (error) {
      console.log(error);
    }

  }

  async function startEvaluation(){
    try {
      const response = await api.post('evaluation/start/'+codeAplication);
      console.log(response);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else if(response.status == 200){
          if(response.data.status == 0){
            loadAlert('error', 'Avaliação está desabilitada.');
            history.push('/home');
            return ;
          }
          setAnswers(response.data[0].answer);
          setEnableButtonStart(false);
      }

    } catch (error) {
      console.log(error);
      loadAlert('error', 'Erro de conexão.');
    }
    setDialogStart(false);
  }

  async function finshEvaluation(){
    try {
      const response = await api.put('evaluation/finish/'+codeAplication);
      console.log(response);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else if(response.status == 200){
        loadAlert('success', 'Avaliação respondida com sucesso!')
        history.push('/home');
      }

    } catch (error) {
      console.log(error);
      loadAlert('error', 'Erro de conexão.');
    }
    setDialogFinish(false);

  }

  useEffect(() => {

  }, [enableButtonStart, checked, answers]);

  useEffect(() => {
    listApplication();
  }, []);

  async function handleListItemClick (event, answerId, item_question) {
    console.log('resposta', answerId, item_question);
    try {
      const id = answerId;
      const answer =   item_question;
      const data = {
        id, answer
      }
      const response = await api.put('evaluation/answer/'+codeAplication, data);
      console.log(response);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      }  else if(response.status == 200){
        startEvaluation();
      }

    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
    //console.log('questao', question, item_question);
  };

  const handleToggle = (value, questionItens) => () => {
    const arr = [0];
    let item, c;
    for(item of questionItens){
      if(item.id != value){
        arr.push(item.id);
      }
    }
    const currentIndex = checked.indexOf(value);
    //const newChecked = [...checked];
    const newChecked = [0];
    for(c of checked){
      for(item of arr) {
        if (checked != arr) {
          newChecked.push(checked);
        }
      }
    }
    console.log(newChecked, checked, arr);

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
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

  return (
      <div>
        { application.id ?
        <div className={classes.root}>
          <Card className={classes.root}>
            <CardHeader
                avatar={
                  <Avatar aria-label="recipe" className={classes.avatar}>
                    {getInitials(localStorage.getItem("@Questione-name-user"))}
                  </Avatar>
                }
                title={'Aluno(a): '+localStorage.getItem("@Questione-name-user") }
                subheader={'Avaliação: '+application.evaluation.description}
            />
            <CardContent>
              <Typography variant="body1" color="textSecondary" component="p">
                {'Código da aplicação: '+application.id_application}
              </Typography>
              <Typography variant="body1" color="textSecondary" component="p">
                {'Professor(a): '+application.evaluation.user.name}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <div >
                {enableButtonStart ?
                <Button className={classes.buttons} variant="contained" color="primary"
                    onClick={onClickOpenDialogStart}>
                  Iniciar
                </Button> :
                <Button className={classes.buttons} variant="contained" color="primary"
                        disabled>
                  Iniciar
                </Button> }
                {enableButtonStart ?
                <Button className={clsx(classes.chipRed, className)} variant="contained" color="#e57373"
                        disabled>
                  Finalizar
                </Button> :
                <Button className={clsx(classes.chipRed, className)} variant="contained" color="#e57373"
                    onClick={onClickOpenDialogFinsh}>
                  Finalizar
                </Button>}
              </div>

            </CardActions>
          </Card>

          {answers.map((data, i) => (
              <ExpansionPanel key={data.id}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-label="Expand"
                    aria-controls="additional-actions1-content"
                    id="additional-actions1-header">
                  <FormControlLabel
                      aria-label="Acknowledge"
                      onClick={(event) => event.stopPropagation()}
                      onFocus={(event) => event.stopPropagation()}
                      control={<Checkbox
                                checked={data.answer != null}
                              />}
                      label={(i + 1) <10 ? ('Questão 00' + (i + 1)) :
                              (i + 1) <100 ? ('Questão 0' + (i + 1)) : (i + 1)}
                  />
                </ExpansionPanelSummary>
                <ExpansionPanelDetails key={data.id}>
                  <div className={classes.lineQuestion}>
                    <Typography variant="button" color="textSecondary" component="p">
                      Texto base:
                    </Typography>
                    <div> { ReactHtmlParser (data.evaluation_question.question.base_text) } </div>
                    <br/>
                    <Typography variant="button" color="textSecondary" component="p">
                      Enunciado:
                    </Typography>
                    <div> { ReactHtmlParser (data.evaluation_question.question.stem) } </div>
                    <br />
                    <Typography variant="button" color="textSecondary" component="p">
                      Alternativas:
                    </Typography>
                    <br />
                    {data.evaluation_question.question.question_items.map(item => (
                        <List className={classes.lineItemQuestion}
                              key={item.id}
                              onClick={handleToggle(item.id, data.evaluation_question.question.question_items)}
                              component="nav" aria-label="secondary mailbox folder">
                          <ListItem key={item.id}
                                    selected={data.answer == item.id}
                              button onClick={(event) => handleListItemClick(event, data.id, item.id)}>
                            { ReactHtmlParser (item.description)  }
                          </ListItem>
                        </List>
                    ))}

                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
          ))}

        </div>
              : null}
        <DialogQuestione handleClose={onClickCloseDialogStart}
                         open={dialogStart}
                         onClickAgree={startEvaluation}
                         onClickDisagree={onClickCloseDialogStart}
                         mesage={'Deseja iniciar a avaliação?'}
                         title={'Iniciar Avaliação'}/>
        <DialogQuestione handleClose={onClickCloseDialogFinish}
                         open={dialogFinish}
                         onClickAgree={finshEvaluation}
                         onClickDisagree={onClickCloseDialogFinish}
                         mesage={'Deseja finalizar a avaliação?'}
                         title={'Finalizar Avaliação'}/>
      </div>
  );
};

DoEvaluation.propTypes = {
  className: PropTypes.string,
};

export default DoEvaluation;

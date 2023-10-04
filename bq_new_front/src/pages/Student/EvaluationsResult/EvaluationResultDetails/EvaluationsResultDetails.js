import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import ReactHtmlParser from "react-html-parser";
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid, Tooltip,
  Paper, LinearProgress, Box,
  Chip, Breadcrumbs, Link
} from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import api from "../../../../services/api";
import { withStyles } from "@material-ui/core/styles";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import './styles.css';
import useStyles from "../../../../style/style";
import Pagination from "@material-ui/lab/Pagination";
import {CharmHome} from "../../../../icons/Icons";
import DecreaseStringSize from "../../../../components/DecreaseStringSize";
import TooltipQuestione from "../../../../components/TooltipQuestione";


export function IconParkOutlineCorrect(props) {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="m4 24l5-5l10 10L39 9l5 5l-25 25L4 24Z" clipRule="evenodd"></path></svg>
  )
}


export function BxsXCircle(props) {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2zm4.207 12.793l-1.414 1.414L12 13.414l-2.793 2.793l-1.414-1.414L10.586 12L7.793 9.207l1.414-1.414L12 10.586l2.793-2.793l1.414 1.414L13.414 12l2.793 2.793z"></path></svg>
  )
}


export function MingcuteAlertOctagonFill(props) {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"></path><path fill="currentColor" d="M15.314 2a2 2 0 0 1 1.414.586l4.686 4.686A2 2 0 0 1 22 8.686v6.628a2 2 0 0 1-.586 1.414l-4.686 4.686a2 2 0 0 1-1.414.586H8.686a2 2 0 0 1-1.414-.586l-4.686-4.686A2 2 0 0 1 2 15.314V8.686a2 2 0 0 1 .586-1.414l4.686-4.686A2 2 0 0 1 8.686 2h6.628ZM12 15a1 1 0 1 0 0 2a1 1 0 0 0 0-2Zm0-9a1 1 0 0 0-.993.883L11 7v6a1 1 0 0 0 1.993.117L13 13V7a1 1 0 0 0-1-1Z"></path></g></svg>
  )
}

const useStylesLocal = makeStyles((theme) => ({
  root: {
    margin: 10,
  },
  content: {
    padding: 0
  },
  ml: {
    marginLeft: '8px',
  },
  headQuestion: {
    width: '90.0px',
    backgroundColor: '#FFF',
    color: '#393A68',
    textAlign: 'center',
    height: '80px',
    boxSizing: 'border-box',
    border: '1px solid #F2F2F2',
    minWidth: '80px',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  percentageRed: {
    backgroundColor: '#EC0B43',
    display: 'block',
    margin: '8px',
    padding: '10px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4
  },
  percentageGreen: {
    backgroundColor: '#5DE2A5',
    display: 'block',
    margin: '8px',
    padding: '10px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4,
  },
  percentageNull: {
    backgroundColor: '#90a4ae',
    color: '#fff',
    display: 'block',
    margin: '8px',
    padding: '10px',
    textAlign: 'center',
    borderRadius: 4
  },
  answerCorrect: {
    width: '90.0px',
    backgroundColor: '#5DE2A5',
    //display: 'inline-block',
    color: '#393A68',
    textAlign: 'center',
    height: '60px',
    boxSizing: 'border-box',
    border: '1px solid #F2F2F2',
    minWidth: '80px',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  answerIncorrect: {
    width: '90.0px',
    backgroundColor: '#F14D76',
    //display: 'inline-block',
    color: '#393A68',
    textAlign: 'center',
    height: '60px',
    boxSizing: 'border-box',
    border: '1px solid #F2F2F2',
    minWidth: '80px',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  answerNull: {
    width: '90.0px',
    backgroundColor: '#cfd8dc',
    //display: 'inline-block',
    color: '#393A68',
    textAlign: 'center',
    height: '70px',
    boxSizing: 'border-box',
    border: '1px solid #F2F2F2',
    minWidth: '80px',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '14px'
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
  correct: {
    color: '#80cbc4',
  },
  incorrect: {
    color: '#ef9a9a',
  },
  bgCorrect: {
    background: 'green',
    color: '#ffffff',
  },
  bgIncorrect: {
    background: 'red',
    color: '#ffffff',
  },
  paperWrong: {
      backgroundColor: '#ef9a9a',
      color: '#212121',
  },
  paperWrongFont: {
    color: '#ef9a9a',
  },
  paperRight: {
      backgroundColor: '#80cbc4',
      color: '#212121',
  },
  paperRightFont: {
    color: '#80cbc4',
  },
  tituloCard: {
    fontSize: '15px',
    fontWeight: 'bold'
  },
  paper: {
    marginBottom: 10,
    '& > *': {
      margin: theme.spacing(2),
    },
    margin: 3,
    padding: 8
  },
  paperCorrect: {
    backgroundColor: '#e2f2e7',
    color: '#212121',
  },
}));

const TooltipCustomized = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

const EvaluationsResultDetails = props => {
  const { className, history, ...rest } = props;
  const { idHead } = props.match.params;
  const [head, setHead] = useState([]);
  const [questions, setQuestions] = useState(null);
  const [application, setApplication] = useState(null);
  // const [showSnackbar, setShowSnackbar] = useState(true);
  const [openSnack, setOpenSnack] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [alternativeLetters] = React.useState(['a', 'b', 'c', 'd', 'e']);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  const [showQuestionPreview, setShowQuestionPreview] = React.useState(false);

  async function findHead() {
    try {

      const response = await api.get('/evaluation/student/result/evaluations-specific/' + idHead);

      if (response.status == 200) {
        setQuestions(response.data.questions);
        setShowQuestionPreview(response.data.question_preview);
        setApplication(response.data.application);

        setHead(response.data);
      } if (response.status == 202) {
        if (response.data.message) {
          toast.error(response.data.message); //https://www.npmjs.com/package/react-toastify/v/1.4.3
          //toast.error(response.data.message);
          // showSnackbar(true);
          setQuestions([]);
          setHead([]);
          history.push('/student/result-evaluations/');
        } else {
          setQuestions([]);
          setHead([]);
        }
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    findHead();

  }, []);

  const handleBack = () => {
    history.goBack();
  };

  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function a11yProps(index) {
    return {
      id: `nav-tab-${index}`,
      'aria-controls': `nav-tabpanel-${index}`,
    };
  }

  function LinkTab(props) {
    return (
      <Tab
        component="a"
        onClick={(event) => {
          event.preventDefault();
        }}
        {...props}
      />
    );
  };

  const difficulty = (porc, totalCorrect) => {
    if(totalCorrect < 20){
      return ''
    }
    if (porc >= 0.86) {
      return ' - Dificuldade: Muito Fácil'
    } else if(porc >= 0.61 && porc <= 0.85){
      return ' - Dificuldade: Fácil'
    } else if(porc >= 0.41 && porc <= 0.60){
      return ' - Dificuldade: Média'
    } else if(porc >= 0.16 && porc <= 0.40){
      return ' - Dificuldade: Difícil'
    } else if(porc <= 0.15){
      return ' - Dificuldade: Muito Difícil'
    }
    return '';
  }

  // const handleCloseSnackbar = () => {
  //   setShowSnackbar(false);
  // };

  return (
    <div className={classesGeneral.root}>
      <Box display="flex">
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            <Box display="flex">
              <Box style={{marginTop: '2px', marginRight: '5px'}}>
                <CharmHome/>
              </Box>
              <Box>
                Início
              </Box>
            </Box>
          </Link>
          <Link color="inherit" onClick={() => history.push('/student-class/student')}>
            Minhas turmas
          </Link>
          <Link color="inherit" onClick={() => history.goBack()}>
            Turma {application && application.class.id_class}
          </Link>
          <div color="inherit" onClick={null}>
            Resultado do simulado
          </div>
        </Breadcrumbs>
      </Box>
      <Card
        {...rest}
        className={clsx(classesGeneral.root, className)}>
        <CardHeader
            title={
              <div className={classesGeneral.titleList}>{'Resultado do simulado'}</div>}
            subheader={
                showQuestionPreview ?
                    <div className={classesGeneral.subtitles}>{'Por meio deste resultado você pode visualizar quais questões acertou ou errou, como também pode visualizar as questões completas.'}</div>
                    :
                    <div className={classesGeneral.subtitles}>{'Por meio deste resultado você pode visualizar quais questões acertou ou errou. Você não terá acesso as questões completas.'}</div>

            }
        />
        <Divider />
        <Card style={{marginTop: '5px'}}>
          <CardHeader
              avatar={
                <div>
                  { application &&
                      <div>
                        <div className={classesGeneral.paperTitleTextBold}>
                          {'Simulado: '}<DecreaseStringSize string={application.description} />
                        </div>
                        <div className={classesGeneral.paperTitleText}>
                          {'Professor: '+application.evaluation.user.name}
                        </div>
                        <div className={classesGeneral.paperTitleText}>
                          {'Turma: '}<DecreaseStringSize string={application.class.id_class+' - '+application.class.description} />
                        </div>
                      </div>}

                </div>
              }
          />
        </Card>

        <CardContent>
          {questions == null ?
            <LinearProgress color="secondary" />
            :
            <div>

              {head.qtdCorrect != null &&
                  <Box display="flex" alignItems="row" justifyContent="center" style={{marginBottom: '20px'}}>
                    <Paper style={{
                      background: '#80cbc4',
                      marginTop: '5px',
                      marginBotton: '5px',
                      paddingTop: '5px',
                      paddingBottom: '5px',
                      paddingLeft: '15px',
                      paddingRight: '15px',
                      color: '#FFF', fontWeight: 'bold', fontSize: '15px', marginRight: '5px',
                    }}>
                      <TooltipQuestione position={"bottom"} description={'Total de questões corretas: '+head.qtdCorrect} content={
                        <Box display="flex" alignItems="row">
                          <IconParkOutlineCorrect />
                          <div style={{marginLeft: '10px'}}>
                            {head.qtdCorrect}
                          </div>
                        </Box>
                      }/>

                    </Paper>
                    <Paper style={{
                      background: '#ef9a9a',
                      marginTop: '5px',
                      marginBotton: '5px',
                      paddingTop: '5px',
                      paddingBottom: '5px',
                      paddingLeft: '15px',
                      paddingRight: '15px',
                      color: '#FFF', fontWeight: 'bold', fontSize: '15px', marginRight: '5px',
                    }}>
                      <TooltipQuestione position={"bottom"} description={'Total de questões incorretas: '+head.qtdIncorrect} content={
                        <Box display="flex" alignItems="row">
                          <BxsXCircle />
                            <div style={{marginLeft: '10px'}}>
                              {head.qtdIncorrect}
                            </div>
                        </Box>
                      }/>
                    </Paper>
                    <Paper style={{
                      background: '#3a7cf7',
                      marginTop: '5px',
                      marginBotton: '5px',
                      paddingTop: '5px',
                      paddingBottom: '5px',
                      paddingLeft: '15px',
                      paddingRight: '15px',
                      color: '#FFF', fontWeight: 'bold', fontSize: '15px', marginRight: '5px',
                    }}>
                      <TooltipQuestione position={"bottom"} description={'Você acertou '+(head.qtdCorrect/(head.qtdCorrect+head.qtdIncorrect))*100+'% das questões deste simulado'} content={
                        <Box display="flex" alignItems="row">
                              <MingcuteAlertOctagonFill />
                              <div style={{marginLeft: '10px'}}>
                                {head.qtdCorrect+head.qtdIncorrect > 0 ?
                                    ((head.qtdCorrect/(head.qtdCorrect+head.qtdIncorrect))*100).toFixed(2) + ' % de precisão' :
                                    '0 % de precisão'}
                              </div>
                        </Box>
                      }/>
                    </Paper>
                  </Box>}
              <Divider style={{margin: '5px'}}/>
                {showQuestionPreview ?
                  <div>
                    <Box display='flex' margin='10px' justifyContent='center'>
                      <Pagination count={questions.length} variant="outlined" page={page} color="primary" onChange={handleChangePage}/>
                    </Box>
                    <Box style={{margin: '10px'}}>
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
                            {'   de '+questions.length}
                            {difficulty(questions[page-1].question.difficulty.porc_correct,
                                questions[page-1].question.difficulty.total_answers)}
                          </div>
                        </Box>
                      </Box>
                      <Divider style={{padding: '3px', marginTop: '10px', marginBottom: '15px'}} className={classesGeneral.paperTitle}/>
                      <Box>
                        {questions[page-1].correct == 1 ? <p className={classes.paperRightFont} style={{margin: '10px'}}>{'Você acertou esta questão.'}</p> :
                            <p className={classes.paperWrongFont} style={{margin: '10px'}}>{'Você errou esta questão.'}</p>}
                      </Box>
                      <div style={{margin: '10px'}}>
                        { questions[page-1].objects.length > 0 && (
                            <Box display="flex" style={{marginBottom: '30px'}}>
                              <div className={classesGeneral.paperTitleText} style={{marginLeft: '20px'}}>
                                {'Conteúdo(s) da questão:'}
                              </div>
                              <div className={classesGeneral.paperTitleTextBold} style={{marginLeft: '5px'}}>
                                {questions[page-1].objects.map(item => (
                                    ReactHtmlParser (item.object.description)+'. '
                                ))}
                              </div>
                            </Box>)

                        }
                        <div style={{marginLeft: '15px'}}>
                          { ReactHtmlParser (questions[page-1].question.base_text) }
                        </div>
                        <div style={{marginLeft: '10px', marginTop: '10px'}}>
                          { ReactHtmlParser (questions[page-1].question.stem) }
                        </div>
                        <div style={{marginTop: '15px'}}>
                          {questions[page-1].question.items.map((item, i) => (
                              item.correct_item == 1 ?
                                  <Box display="flex" flexDirection="row"  style={{ width: '100%' }}>
                                    <Box style={{marginTop: '15px', marginRight: '5px'}} sx={{ flexShrink: 1 }}>
                                      <Chip label={alternativeLetters[i]} style={{fontSize: '14px', fontWeight: 'bold', background: questions[page-1].answer == item.id && item.correct_item == 1 ? "#e2f2e7" : "#e1f5fe"}} size="small"/>
                                    </Box>
                                    <Box sx={{ width: '100%' }}>
                                      <Paper className={clsx(classes.paper, questions[page-1].answer == item.id && item.correct_item == 1 ? classes.paperCorrect : classes.paper)} elevation={3} variant="outlined">
                                        {ReactHtmlParser (item.description)}
                                      </Paper>
                                    </Box>
                                  </Box>
                                  :
                                  <Box display="flex" flexDirection="row" style={{ width: '100%' }}>
                                    <Box style={{marginTop: '15px', marginRight: '5px'}}>
                                      <Chip label={alternativeLetters[i]} style={{fontSize: '14px', fontWeight: 'bold', background:questions[page-1].answer == item.id && item.correct_item == 0 ? "#ef9a9a" : "#e1f5fe"}} size="small"/>
                                    </Box>
                                    <Box sx={{ width: '100%' }}>
                                      <Paper className={clsx(classes.paper, questions[page-1].answer == item.id && item.correct_item == 0 ? classes.paperWrong : classes.paper)} variant="outlined">
                                        { ReactHtmlParser (item.description) }
                                      </Paper>
                                    </Box>
                                  </Box>
                          ))}
                          {questions[page-1].question.items.map((item, i) => (
                              item.correct_item == 1 && questions[page-1].answer != item.id ?
                                  <div>
                                    <Box display="flex" style={{marginTop: '20px'}}>
                                      <div className={classesGeneral.paperTitleTextBold}>
                                        {'Resposta correta:'}
                                      </div>
                                    </Box>
                                    <Box display="flex" flexDirection="row"  style={{ width: '100%', marginTop: '10px'}}>
                                      <Box style={{marginTop: '15px', marginRight: '5px'}} sx={{ flexShrink: 1 }}>
                                        <Chip label={alternativeLetters[i]} style={{fontSize: '14px', fontWeight: 'bold', background: "#e1f5fe"}} size="small"/>
                                      </Box>
                                      <Box sx={{ width: '100%' }}>
                                        <Paper className={clsx(classes.paper, classes.paper)} elevation={3} variant="outlined">
                                          {ReactHtmlParser (item.description)}
                                        </Paper>
                                      </Box>
                                    </Box>
                                  </div>
                                  :
                                  null
                          ))}
                        </div>
                      </div>
                    </Box>
                  </div>
                  :
                    <div style={{ width: '100%'}}>
                      <Grid container
                            spacing={0}
                            direction="row"
                            alignItems="center"
                            justifyContent="center">
                        {questions.map((result, i) => (
                            <Grid item xs={2} sm={2} md={1} >
                              <TooltipQuestione
                                  description={
                                      <div>
                                        {'Conteúdo(s) da questão: '}{result.objects.map(item => (
                                            ReactHtmlParser (item.object.description)+'. '
                                        ))}
                                      </div>

                                  } position={'top'} content={
                                  <Box display="flex" alignItems="center">
                                    <div className={!result.answer ? classes.percentageNull : result.correct == 1 ? classes.percentageGreen : classes.percentageRed}>
                                      {'Q' + (i + 1)}
                                    </div>
                                  </Box>
                              }/>


                            </Grid>
                        ))}
                      </Grid>
                    </div>
                }

              {/*<TabPanel value={tabValue} index={1}>
                <Chart
                  width="100%"
                  height={200}
                  chartType="ColumnChart"
                  loader={<div>Caregando gráfico</div>}
                  data={
                    [
                      ['Acerto', 'Resposta correta'],
                    ].concat(questions.map((result, i) => {
                      return [`Questão ${i + 1}`, result.correct && result.correct == 1 ? 1 : 0];
                    }))
                  }
                  options={{
                    title: 'Resultado das respostas',
                    chartArea: { width: '80%' },
                    hAxis: {
                      title: 'Questão',
                      minValue: 0,
                      viewWindow: {
                        min: 0
                      }
                    },
                    vAxis: {
                      title: 'Acertadas/Erradas',
                      // viewWindowMode:'explicit',
                      viewWindow: {
                        min: 0
                      }
                    },
                  }}
                  legendToggle
                />
              </TabPanel>*/}
            </div>
          }
        </CardContent>
      </Card>
    </div>
  );
};

EvaluationsResultDetails.propTypes = {
  className: PropTypes.string,
};

export default EvaluationsResultDetails;

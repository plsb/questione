import React, { useEffect, useState } from 'react';
import ReactDOM  from 'react-dom';
import Chart from "react-google-charts";
import clsx from 'clsx';
import PropTypes from 'prop-types';
import ReactHtmlParser from "react-html-parser";
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  IconButton,
  Typography, Grid, Tooltip,
  Paper, LinearProgress, Box,
  List, ListItem
} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import api from "../../../../services/api";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Close, Done, Block } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

import './styles.css';

// import Button from '@material-ui/core/Button';
// import Snackbar from '@material-ui/core/Snackbar';
// import MuiAlert from '@material-ui/lab/Alert';

// function Alert(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

const useStyles = makeStyles((theme) => ({
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
  paper: {
    display: 'flex',
    marginBottom: 10,
    '& > *': {
        margin: theme.spacing(2),
    },
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
  }
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`nav-tabpanel-${index}`}
          aria-labelledby={`nav-tab-${index}`}
          {...other}>
          {value === index && (
              <Box p={3}>
                  <Typography>{children}</Typography>
              </Box>
          )}
      </div>
  );
}

const EvaluationsResultDetails = props => {
  const { className, history, ...rest } = props;
  const { idHead } = props.match.params;
  const [head, setHead] = useState([]);
  const [questions, setQuestions] = useState(null);
  // const [showSnackbar, setShowSnackbar] = useState(true);
  const [openSnack, setOpenSnack] = React.useState(true);

  const classes = useStyles();

  const [showQuestionPreview, setShowQuestionPreview] = React.useState(false);

  async function findHead() {
    try {

      const response = await api.get('/evaluation/student/result/evaluations-specific/' + idHead);

      if (response.status == 200) {
        setQuestions(response.data.questions);
        setShowQuestionPreview(response.data.question_preview);

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
      return '- Dificuldade: Muito Fácil'
    } else if(porc >= 0.61 && porc <= 0.85){
      return '- Dificuldade: Fácil'
    } else if(porc >= 0.41 && porc <= 0.60){
      return '- Dificuldade: Média'
    } else if(porc >= 0.16 && porc <= 0.40){
      return '- Dificuldade: Difícil'
    } else if(porc <= 0.15){
      return '- Dificuldade: Muito Difícil'
    }
    return '';
  }

  // const handleCloseSnackbar = () => {
  //   setShowSnackbar(false);
  // };

  return (
    <div>
      {/* <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          This is a success message! asd ada sda dd adad a sda d asd asd asd asd asd as da sd ad a sd ad a da d ad a da d asd a da sd ad a da d ad a d
        </Alert>
      </Snackbar> */}
      {/* <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}

      <Card
        {...rest}
        className={clsx(classes.root, className)}>
        <div className={classes.contentHeader}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <CardHeader
          subheader=""
          title="Avaliação" />
        <Divider />
        <CardContent>
          {questions == null ?
            <LinearProgress color="secondary" />
            :
            <div>
              {head.qtdCorrect != null ?
                <Paper variant="outlined" style={{ padding: '5px', marginBottom: '15px' }}>
                  <Typography align="center"
                    variant="body2" color="textPrimary"
                    style={{
                      fontWeight: 'bold', fontSize: '15px', marginRight: '5px',
                    }} className={classes.paperRightFont}>
                    {head.qtdCorrect >= 2 ? 'Você acertou ' + head.qtdCorrect + ' questões.'
                      : 'Você acertou ' + head.qtdCorrect + ' questão.'}
                  </Typography>
                  <Typography align="center"
                    variant="body2" color="textPrimary"
                    style={{
                      fontWeight: 'bold', fontSize: '15px', marginRight: '5px',
                    }} className={classes.paperWrongFont}>
                    {head.qtdIncorrect >= 2 ? 'Você errou ' + head.qtdIncorrect + ' questões.'
                      : 'Você errou ' + head.qtdIncorrect + ' questão.'}
                  </Typography>

                </Paper>
                : null}

              <Tabs
                variant="fullWidth"
                value={tabValue}
                onChange={handleChangeTab}
                aria-label="nav tabs example"
              >
                <LinkTab label="Questões" href="#" {...a11yProps(0)} />
                {/*<LinkTab label="Gráfico" href="#" {...a11yProps(1)} />*/}
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                {showQuestionPreview ? (
                  questions.map((data, i) => (
                    <ExpansionPanel expanded={expanded === i} key={data.question.id} onChange={handleChange(i)}>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-label="Expand"
                        aria-controls="additional-actions1-content"
                        id="additional-actions1-header"
                      >
                        {/* <FormControlLabel
                          aria-label="Acknowledge"
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          control={(
                            // <Tooltip title={data.question.answer != null ? 'Esta questão já foi respondida' : 'Não respondida'}>
                            //   <Checkbox
                            //     className={data.question.answer != null ? '' : classes.hide}
                            //     checked={data.question.answer != null}
                            //   />
                            // </Tooltip>
                          )}
                          label={(i + 1) <10 ? ('Questão 00' + (i + 1)) :
                                    (i + 1) <100 ? ('Questão 0' + (i + 1)) : (i + 1)}
                        /> */}
                        {console.log(data)}
                        <p className={classes.tituloCard}>
                          Questão {i + 1} {difficulty(data.question.difficulty.porc_correct,
                            data.question.difficulty.total_answers)}
                        </p>
                         <span className={classes.ml}>
                            {data.correct == 1 ? (
                              <CheckIcon className={classes.correct} />
                            ) : (
                              <CloseIcon className={classes.incorrect} />
                            )}
                        </span>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails key={data.question.id}>
                        <div className={classes.lineQuestion}>
                          {data.skill ?
                              <div>
                                <Typography variant="button" color="textSecondary" component="p">
                                  Competência:
                                </Typography>
                                {ReactHtmlParser(data.skill.description)}
                              </div>
                            : null}
                          {data.objects ?
                              <div>
                                <Typography variant="button" color="textSecondary" component="p">
                                  Objeto(s) de Conhecimento:
                                </Typography>
                                {data.objects.map(item => (
                                    ReactHtmlParser(item.object.description) + '; '
                                ))}
                              </div>
                            : null}
                            <br />
                          <Typography variant="button" color="textSecondary" component="p">
                            Texto base:
                          </Typography>
                          <div> { ReactHtmlParser (data.question.base_text) } </div>
                          <br/>
                          <Typography variant="button" color="textSecondary" component="p">
                            Enunciado:
                          </Typography>
                          <div> { ReactHtmlParser (data.question.stem) } </div>
                          <br />
                          <Typography variant="button" color="textSecondary" component="p">
                            Alternativas:
                          </Typography>
                          <br />
                          {data.question.items.map(item => (
                             item.correct_item == 1 ?
                                 <div>
                                    <Paper className={clsx(classes.paper, classes.paperRight)}   variant="outlined"> { ReactHtmlParser (item.description)  }</Paper>
                                   {data.answer == item.id && item.correct_item == 1 ? <p className={classes.paperRightFont}>Você marcou esta alternativa e acertou.</p> :
                                       <p className={classes.paperRightFont}>Esta é a alterantiva correta.</p>}
                                 </div>
                              : <div>
                                 <Paper className={clsx(classes.paper, data.answer == item.id && item.correct_item == 0 ? classes.paperWrong : '')} variant="outlined"> { ReactHtmlParser (item.description) } </Paper>
                                   {data.answer == item.id && item.correct_item == 0 ? <p className={classes.paperWrongFont}>Você marcou esta alternativa e errou.</p> : null}
                                 </div>
                              // <Tooltip title="Clique para escolher esta alternativa." placement="top-start">
                              //   <List
                              //     className={classes.lineItemQuestion}
                              //     key={item.id}
                              //     // onClick={handleToggle(item.id)}
                              //     component="nav" aria-label="secondary mailbox folder"
                              //   >
                              //     <ListItem
                              //       key={item.id}
                              //       selected={data.question.answer == item.id}
                              //       button
                              //       className={`
                              //         ${item.correct_item == 1 && classes.bgCorrect} ${data.answer == item.id && item.correct_item == 0 && classes.bgIncorrect}`}
                              //       // onClick={(event) => handleListItemClick(event, data.id, item.id)}
                              //     >
                              //       { ReactHtmlParser (item.description)  }
                              //     </ListItem>
                              //   </List>
                              // </Tooltip>
                          ))}
                        </div>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  ))
                ) : (
                  questions.map((result, i) => (
                    <div style={{ marginBottom: '30px' }}>
                      <Typography align="center" style={{ fontWeight: 'bold' }}
                        variant="h5" component="h2">
                        {'Questão ' + (i + 1)}
                      </Typography>
                      {result.skill ?
                        <Grid
                          container
                          direction="row"
                          justify="center"
                          alignItems="center">
                          <Typography align="center"
                            variant="body2" color="textPrimary"
                            style={{ fontWeight: 'bold', marginRight: '5px' }} >
                            Competência:
                                    </Typography>
                          <Typography align="center"
                            variant="body2" color="textPrimary" >
                            {result.skill.description}
                          </Typography>
                        </Grid>
                        : null}
                      {result.objects ?
                        <Grid
                          container
                          direction="row"
                          justify="center"
                          alignItems="center">
                          <Typography align="center"
                            variant="body2" color="textPrimary"
                            style={{ fontWeight: 'bold', marginRight: '5px' }} >
                            Objeto(s) de Conhecimento:
                                      </Typography>
                          <Typography align="center"
                            variant="body2" color="textPrimary" >
                            {result.objects.map(item => (
                              item.object.description + '; '
                            ))}
                          </Typography>
                        </Grid>
                        : null}
                      {result.answer == null ?
                        <span className={classes.percentageNull}><Block /></span>
                        :
                        result.correct == 1 ?
                          <span className={classes.percentageGreen}><Done /></span>
                          :
                          <span className={classes.percentageRed}><Close /></span>}
                    </div>
                  ))
                )}
              </TabPanel>

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

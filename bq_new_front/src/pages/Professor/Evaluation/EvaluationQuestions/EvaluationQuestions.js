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
  List, ListItem, Button, Menu, MenuItem
} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import api from "../../../../services/api";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { MoreVert } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
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
import DialogQuestione from '../../../../components/DialogQuestione';
import EvaluationQuestionCard from './components/EvaluationQuestionCard';

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
  questionActions: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '32px',
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
  const { evaluationId } = props.match.params;
  const [questions, setQuestions] = useState(null);
  const [hasApplication, setHasApplication] = useState(null);
  const [evaluationDescription, setEvaluationDescription] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDeleteQuestionEvaluation, setOpenDeleteQuestionEvaluation] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);
  // const [showSnackbar, setShowSnackbar] = useState(true);
//   const [openSnack, setOpenSnack] = React.useState(true);

    const handleClose = () => {
        setAnchorEl(null);
    };

  const classes = useStyles();

  async function loadQuestionsEvaluation(id){
    try {
      const response = await api.get('evaluation/show/questions/'+id);
      if (response.status === 200) {
        setQuestions(response.data.evaluation_questions);
        setHasApplication(response.data.has_application);
        setEvaluationDescription(response.data.evaluation.description);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(evaluationId){
        loadQuestionsEvaluation(evaluationId);
    } else {
        setQuestions([]);
    }
  }, [refresh]);

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

  async function deleteQuestionEvaluation(questionId) {
    setOpenDeleteQuestionEvaluation(false);
    try {
        let url = 'evaluation/deletequestion/'+questionId+'+?fk_evaluation_id='+evaluationId;
        const fk_evaluation_id = evaluationId;
        const data = {
            fk_evaluation_id
        }
        const response = await api.delete(url);
        if (response.status === 202) {
            if(response.data.message){
                toast.error(response.data.message);
            }
        } else {
            toast.success('Questão excluída da avaliação.');
            setRefresh(refresh+1);
        }
    } catch (error) {

    }
}

  const onClickOpenDialogQEvaluation = () => {
    setOpenDeleteQuestionEvaluation(true);
  };

  const onClickCloseDialogQEvaluation = () => {
    setOpenDeleteQuestionEvaluation(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
          title="Questões da avaliação"
        />
        <Divider />
        <Card className={classes.root}>
          <CardHeader
              avatar={
                <div>
                  <Typography variant="button" color="textSecondary" component="p">
                    {'Avaliação: '+evaluationDescription}
                  </Typography>
                </div>
              }
          />
        </Card>

        <CardContent>
          {questions == null ?
            <LinearProgress color="secondary" />
            :
            <div>
              {/* {head.qtdCorrect != null ?
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
                : null} */}

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
                {questions.map((data, i) => (
                    <ExpansionPanel expanded={expanded === i} key={data.question.id} onChange={handleChange(i)}>
                        <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-label="Expand"
                        aria-controls="additional-actions1-content"
                        id="additional-actions1-header"
                        >
                            Questão {i + 1}
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails key={data.question.id}>
                          <EvaluationQuestionCard
                            question={data}
                            id_evaluation={evaluationId}
                            setQuestions={setQuestions}
                            hasApplication={hasApplication}
                          />
                        {/* <div className={classes.lineQuestion}>
                            <div className={classes.questionActions}>
                                <Button onClick={() => {}} color="primary">
                                    <DeleteIcon /> Excluir questão
                                </Button>
                                
                                <DialogQuestione
                                  handleClose={onClickCloseDialogQEvaluation}
                                  open={openDeleteQuestionEvaluation}
                                  onClickAgree={() => deleteQuestionEvaluation(data.question.id)}
                                  onClickDisagree={onClickCloseDialogQEvaluation}
                                  mesage={'Deseja excluir a questão selecionada da avaliação?'}
                                  title={'Excluir Questão da Avaliaçao'}
                                />
                            </div>

                            {data.skill ?
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
                                {data.skill.description}
                                </Typography>
                            </Grid>
                            : null}
                            {data.objects ?
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
                                {data.objects.map(item => (
                                    item.object.description + '; '
                                ))}
                                </Typography>
                            </Grid>
                            : null}
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
                            {data.question.question_items.map(item => (
                                <div>
                                    <Paper className={clsx(classes.paper)} variant="outlined"> { ReactHtmlParser (item.description) } </Paper>
                                </div>
                            ))}
                        </div> */}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                ))}
              </TabPanel>
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

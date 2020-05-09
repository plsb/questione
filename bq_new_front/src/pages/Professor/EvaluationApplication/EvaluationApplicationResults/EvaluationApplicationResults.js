import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField, IconButton, Table, TableHead, TableRow,
  TableCell, TableBody, Tab, Paper, Tabs,
    Box, Typography, AppBar, Collapse
} from '@material-ui/core';
import api from "../../../../services/api";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PerfectScrollbar from "react-perfect-scrollbar";
import { Done, Close, ExpandMoreRounded } from "@material-ui/icons";
import ReactHtmlParser from "react-html-parser";
import EvaluationApplicationResultsOverviewQuestion from "./EvaluationApplicationResultsOverViewQuestion";

const useStyles = makeStyles(() => ({
  root: {
    margin: 10,
  },
  content: {
    padding: 0
  },
  headStudent: {
    width: '100%',
    height: '70px',
    backgroundColor: '#FFF',
    color: '#393A68',
    paddingLeft: '12px',
    boxSizing: 'border-box',
    border: '1px solid #f2f2f2',
    lineHeight: '40px',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: 'Open Sans, sans-serif, Helvetica, Arial'
  },
  bodyStudent: {
    width: '100%',
    height: '70px',
    backgroundColor: '#FFF',
    color: '#393A68',
    paddingLeft: '12px',
    boxSizing: 'border-box',
    fontWeight: 'bold',
    border: '1px solid #f2f2f2',
    lineHeight: '20px',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'auto',
    textOverflow: 'ellipsis',
    fontFamily: 'Open Sans, sans-serif, Helvetica, Arial',
    display: 'inline-block'
  },
  bodyPercentage: {
    width: '50px',
    height: '70px',
    textAlign: 'center',
    backgroundColor: '#FFF',
    color: '#393A68',
    paddingLeft: '12px',
    boxSizing: 'border-box',
    fontWeight: 'bold',
    border: '1px solid #f2f2f2',
    lineHeight: '20px',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'auto',
    textOverflow: 'ellipsis',
    fontFamily: 'Open Sans, sans-serif, Helvetica, Arial'
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
    padding: '0 4px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4
  },
  percentageOrange: {
    backgroundColor: '#F5A623',
    display: 'block',
    margin: '8px',
    padding: '0 4px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4
  },
  percentageGreen: {
    backgroundColor: '#5DE2A5',
    display: 'block',
    margin: '8px',
    padding: '0 4px',
    textAlign: 'center',
    color: '#fff',
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
  paperWrong: {
    width: '88%',
    backgroundColor: '#ef9a9a',
    color: '#212121',
    margin: 3,
    padding: 8
  },
  paperRight: {
    width: '88%',
    backgroundColor: '#80cbc4',
    color: '#212121',
    margin: 3,
    padding: 8
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`nav-tabpanel-${index}`}
          aria-labelledby={`nav-tab-${index}`}
          {...other}
      >
        {value === index && (
            <Box p={3}>
              <Typography>{children}</Typography>
            </Box>
        )}
      </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
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
}

const EvaluationApplicationResults = props => {
  const { className, history, ...rest } = props;
  const { idApplication } = props.match.params;
  const [ answerStudents, setAnswerStudents ] = useState([]);
  const [ evaluationQuestions, setEvaluationQuestions ] = useState([]);
  const [ overviewQuestions, setOverviewQuestions ] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [value, setValueTab] = React.useState(0);

  const classes = useStyles();

  async function findEvaluation(id){
    try {
      const response = await api.get('/evaluation/applications/result-question-evaluation/'+id);
      if (response.status === 200) {
        setEvaluationQuestions(response.data[0].questions);
      }
    } catch (error) {

    }
  }

  async function findOverviewQuestions(id){
    try {
      const response = await api.get('/evaluation/applications/result-percentage-question/'+id);
      console.log(response.data);
      if (response.status === 200) {
        setOverviewQuestions(response.data[0].questions);
      }
    } catch (error) {

    }
  }

  async function findResults(id){
    try {
      const response = await api.get('/evaluation/applications/result-answer-students/'+id);
      if (response.status === 200) {
        setAnswerStudents(response.data);
      }
    } catch (error) {

    }
  }

  useEffect(() => {

  }, [answerStudents]);

  useEffect(() => {
    if(idApplication){
      findResults(idApplication);
      findEvaluation(idApplication);
      findOverviewQuestions(idApplication);
    }

  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  const handleBack = () => {
    history.goBack();
  };

  return (
      <div>
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
              title="Resultado da Aplicação"/>
          <Divider />
          <CardContent className={classes.content}>
              <AppBar position="static">
                <Tabs
                    variant="fullWidth"
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example">
                  <LinkTab label="Visão Geral" href="/drafts" {...a11yProps(0)} />
                  <LinkTab label="Questões" href="/trash" {...a11yProps(1)} />
                  <LinkTab label="Gráficos" href="/spam" {...a11yProps(2)} />
                </Tabs>
              </AppBar>
              <TabPanel value={value} index={0}>
                  <PerfectScrollbar>
                    <div className={classes.inner}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell  className={classes.headStudent}>Aluno(a)</TableCell>
                            <TableCell className={classes.bodyPercentage}>% de Acerto</TableCell>
                            {evaluationQuestions.map((result, i) => (
                                <TableCell className={classes.headQuestion}>
                                  {'Q' + (i+1)}
                                  {result.percentageCorrect < 30 ?
                                      <span className={classes.percentageRed}>{result.percentageCorrect+'%'}</span>
                                      : result.percentageCorrect < 70 ?
                                          <span className={classes.percentageOrange}>{result.percentageCorrect+'%'}</span>
                                          : <span className={classes.percentageGreen}>{result.percentageCorrect+'%'}</span> }
                                </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {answerStudents.map(result => (
                              <TableRow
                                  className={classes.tableRow}
                                  hover
                                  key={result.fk_user_id}>
                                <TableCell className={classes.bodyStudent}>{result.student}</TableCell>
                                <TableCell className={classes.bodyPercentage}>{result.percentage_correct + '%'}</TableCell>
                                {result.questions.map(quest => (
                                    quest.correct == 1 ?
                                        <TableCell className={classes.answerCorrect}>
                                          <Done />
                                        </TableCell> :
                                        <TableCell className={classes.answerIncorrect}>
                                          <Close />
                                        </TableCell>
                                ))}

                              </TableRow>
                          ))}
                        </TableBody>

                      </Table>
                    </div>
                  </PerfectScrollbar>
              </TabPanel>
             {/*visão geral das questões */}
              <TabPanel value={value} index={1}>
                { overviewQuestions.map((result, i) => (
                  <EvaluationApplicationResultsOverviewQuestion
                                                    result={result} numberQuestion={i}/>
                    ))}
              </TabPanel>
              <TabPanel value={value} index={2}>
                Page Three
              </TabPanel>
        </CardContent>
      </Card>
      </div>
  );
};

EvaluationApplicationResults.propTypes = {
  className: PropTypes.string,
};

export default EvaluationApplicationResults;

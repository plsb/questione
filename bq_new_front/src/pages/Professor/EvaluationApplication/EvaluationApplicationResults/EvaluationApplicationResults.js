import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardContent,
  Divider, IconButton, Table, TableHead, TableRow,
  TableCell, TableBody, Tab, Paper, Tabs,
    Box, Typography, AppBar, Tooltip
} from '@material-ui/core';
import api from "../../../../services/api";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PerfectScrollbar from "react-perfect-scrollbar";
import { Done, Close, Block } from "@material-ui/icons";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import EvaluationApplicationResultsOverviewQuestion from "./EvaluationApplicationResultsOverViewQuestion";
import EvaluationApplicationResultsSkillObjects from "./EvaluationApplicationResultsSkillObjects";
import moment from "moment";

const useStyles = makeStyles(() => ({
  root: {
    margin: 10,
  },
  content: {
    padding: 0
  },
  headStudent: {
    width: '250px ',
    height: '90px',
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
  headPercentage: {
    width: '40px',
    height: '90px',
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
    width: '250px',
    height: '60px',
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
  },
  bodyPercentage: {
    width: '20%',
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
  percentageNull: {
    backgroundColor: '#90a4ae',
    color: '#fff',
    display: 'block',
    margin: '8px',
    padding: '0 4px',
    textAlign: 'center',
    borderRadius: 4
  },
  answerCorrect: {
    width: '90.0px',
    backgroundColor: '#5DE2A5',
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
  answerIncorrect: {
    width: '90.0px',
    backgroundColor: '#F14D76',
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
  labelStudent: {
    display: 'flex',
    flexDirection: 'column'
  }
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

const TooltipCustomized = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

const EvaluationApplicationResults = props => {
  const { className, history, ...rest } = props;
  const { idApplication } = props.match.params;
  const [ answerStudents, setAnswerStudents ] = useState([]);
  const [ overviewQuestions, setOverviewQuestions ] = useState([]);
  const [ overviewQuestionsHead, setOverviewQuestionsHead ] = useState([]);
  const [ expanded, setExpanded] = React.useState(false);
  const [ value, setValueTab] = React.useState(0);

  const classes = useStyles();


  async function findOverviewQuestions(id){
    try {
      const response = await api.get('/evaluation/applications/result-percentage-question/'+id);

      if (response.status === 200) {
        setOverviewQuestions(response.data[0].questions);
        setOverviewQuestionsHead(response.data[0]);
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
          <Card className={classes.root}>
            <CardContent>
              <Typography variant="h5" color="textSecondary" component="p">
                {overviewQuestionsHead.idApplication!= null ? 'Código da aplicação: '+overviewQuestionsHead.idApplication : null }
              </Typography>
              <Typography variant="h5" color="textSecondary" component="p">
                {overviewQuestionsHead.description_application!= null ? 'Descrição da aplicação: '+overviewQuestionsHead.description_application : null }
              </Typography>
              <Typography variant="h5" color="textSecondary" component="p">
                {overviewQuestionsHead.description_evaluation!= null ? 'Descrição da avaliação: '+overviewQuestionsHead.description_evaluation : null }
              </Typography>
              { overviewQuestionsHead.description_evaluation!=null && !answerStudents[0] ?
                  <span className={classes.percentageRed}>SEM RESULTADO</span>
                 : null }
            </CardContent>
          </Card>
          { answerStudents[0] ?
            <CardContent className={classes.content}>
                <AppBar position="static">
                  <Tabs
                      variant="fullWidth"
                      value={value}
                      onChange={handleChange}
                      aria-label="nav tabs example">
                    <LinkTab label="Visão Geral" href="/drafts" {...a11yProps(0)} />
                    <LinkTab label="Questões" href="/trash" {...a11yProps(1)} />
                    <LinkTab label="Outros Dados" href="/spam" {...a11yProps(2)} />
                  </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                  <Box
                      display="flex"
                      flexWrap="nowrap"
                      p={1}
                      m={1}
                      bgcolor="background.paper">
                      <Box p={1}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell  className={classes.headStudent}>Aluno(a)</TableCell>
                              <TableCell className={classes.headPercentage}>% de Acerto</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {answerStudents.map(result => (
                                <TableRow
                                    className={classes.tableRow}
                                    hover
                                    key={result.fk_user_id}>
                                  <TooltipCustomized
                                      title={
                                        <React.Fragment>
                                          <p>
                                            <Typography color="textSecondary" variant="overline">
                                              {'Hora de inicio: '+ moment(result.hr_start).format('h:mm:ss a DD/MM/YYYY')}
                                            </Typography>
                                          </p>
                                          <p>
                                            <Typography color="textSecondary" variant="overline">
                                              {result.hr_finished != null ?
                                                  'Hora de fim: '+ moment(result.hr_finished).format('h:mm:ss a DD/MM/YYYY') :
                                                  'Avaliação não finalizada.'}
                                            </Typography>
                                          </p>
                                        </React.Fragment>
                                      }>
                                      <TableCell className={classes.bodyStudent}>
                                        <div className={classes.labelStudent}>
                                          {result.student}
                                          <Typography color="textSecondary" variant="caption">
                                            {'Tempo de prova: '+result.total_time}
                                          </Typography>
                                        </div>
                                      </TableCell>
                                  </TooltipCustomized>
                                  <TooltipCustomized
                                      title={
                                        <React.Fragment>
                                          <span className={classes.percentageRed}>{'De 0% a 29% de acerto'}</span>
                                          <span className={classes.percentageOrange}>{'De 30% a 69% de acerto'}</span>
                                          <span className={classes.percentageGreen}>{'De 70% a 100% de acerto'}</span>
                                        </React.Fragment>
                                      }>
                                      <TableCell className={classes.bodyPercentage}>
                                        {result.percentage_correct < 30 ?
                                            <span className={classes.percentageRed}>{result.percentage_correct+'%'}</span>
                                            : result.percentage_correct < 70 ?
                                                <span className={classes.percentageOrange}>{result.percentage_correct+'%'}</span>
                                                : <span className={classes.percentageGreen}>{result.percentage_correct+'%'}</span> }
                                      </TableCell>
                                  </TooltipCustomized>
                                </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    <PerfectScrollbar>
                      <Box
                           p={1}
                           >

                            <div className={classes.inner}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    {overviewQuestions.map((result, i) => (
                                        <TooltipCustomized
                                            title={
                                              <React.Fragment>
                                                <span className={classes.percentageRed}>{'De 0% a 29% de acerto'}</span>
                                                <span className={classes.percentageOrange}>{'De 30% a 69% de acerto'}</span>
                                                <span className={classes.percentageGreen}>{'De 70% a 100% de acerto'}</span>
                                              </React.Fragment>
                                            }>
                                          <TableCell className={classes.headQuestion}>
                                            {'Q' + (i+1)}
                                            {result.percentage_correct_round < 30 ?
                                                <span className={classes.percentageRed}>{result.percentage_correct_round+'%'}</span>
                                                : result.percentage_correct_round < 70 ?
                                                    <span className={classes.percentageOrange}>{result.percentage_correct_round+'%'}</span>
                                                    : <span className={classes.percentageGreen}>{result.percentage_correct_round+'%'}</span> }
                                          </TableCell>
                                        </TooltipCustomized>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {answerStudents.map(result => (
                                      <TooltipCustomized
                                          title={
                                            <React.Fragment>
                                              <span className={classes.percentageRed}>{'Errou'}</span>
                                              <span className={classes.percentageGreen}>{'Acertou'}</span>
                                              <span className={classes.percentageNull}>{'Não respondeu'}</span>
                                            </React.Fragment>
                                          }>
                                          <TableRow
                                              className={classes.tableRow}
                                              hover
                                              key={result.fk_user_id}>
                                            {result.questions.map(quest => (
                                                quest.itemSelected == null ?
                                                    <TableCell className={classes.answerNull}>
                                                      <Block />
                                                    </TableCell>
                                                    :
                                                quest.correct == 1 ?
                                                    <TableCell className={classes.answerCorrect}>
                                                      <Done />
                                                    </TableCell> :
                                                    <TableCell className={classes.answerIncorrect}>
                                                      <Close />
                                                    </TableCell>
                                            ))}

                                          </TableRow>
                                      </TooltipCustomized>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                      </Box>
                    </PerfectScrollbar>
                  </Box>
                </TabPanel>
               {/*visão geral das questões */}
                <TabPanel value={value} index={1}>
                  { overviewQuestions.map((result, i) => (
                    <EvaluationApplicationResultsOverviewQuestion
                                                      result={result} numberQuestion={i}/>
                      ))}
                </TabPanel>
                {/* competências e objetos de conhecimento */}
                <TabPanel value={value} index={2}>
                  <EvaluationApplicationResultsSkillObjects
                                idApplication={idApplication}/>
                </TabPanel>
          </CardContent>
              : null }
       </Card>
      </div>
  );
};

EvaluationApplicationResults.propTypes = {
  className: PropTypes.string,
};

export default EvaluationApplicationResults;

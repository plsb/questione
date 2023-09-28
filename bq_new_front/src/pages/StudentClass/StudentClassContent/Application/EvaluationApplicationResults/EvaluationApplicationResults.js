import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardContent,
  Divider, IconButton, Table, TableHead, TableRow,
  TableCell, TableBody, Tab, Paper, Tabs,
  Box, Typography, AppBar, Tooltip, LinearProgress, Breadcrumbs, Link, Chip, Hidden
} from '@material-ui/core';
import api from "../../../../../services/api";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PerfectScrollbar from "react-perfect-scrollbar";
import { Done, Close, Block } from "@material-ui/icons";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import EvaluationApplicationResultsOverviewQuestion from "./EvaluationApplicationResultsOverViewQuestion";
import EvaluationApplicationResultsSkillObjects from "./EvaluationApplicationResultsSkillObjects";
import moment from "moment";
import { toast } from 'react-toastify';
import { removeDestionationPath } from '../../../../../services/navigation';
import useStyles from "../../../../../style/style";
import {CharmHome} from "../../../../../icons/Icons";
import EvaluationQuestions from "../../../../../components/EvaluationQuestions/EvaluationQuestions";
import EvaluationQuestionCard
  from "../../../../Professor/Evaluation/EvaluationQuestions/components/EvaluationQuestionCard";

const useStylesLocal = makeStyles(() => ({
  root: {
    margin: 10,
  },
  content: {
    padding: 0
  },
  headStudent: {
    width: '100px ',
    height: '115px',
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
    width: '30px',
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
    maxWidth: '170px',
    width: '100px',
    height: '82px',
    backgroundColor: '#FFF',
    color: '#393A68',
    paddingLeft: '6px',
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
    height: '82px',
    textAlign: 'center',
    backgroundColor: '#FFF',
    color: '#393A68',
    boxSizing: 'border-box',
    fontWeight: 'bold',
    border: '1px solid #f2f2f2',
    lineHeight: '15px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    overflow: 'auto',
    textOverflow: 'ellipsis',
    fontFamily: 'Open Sans, sans-serif, Helvetica, Arial'
  },
  headQuestion: {
    width: '90px',
    backgroundColor: '#FFF',
    color: '#393A68',
    textAlign: 'center',
    height: '115px',
    boxSizing: 'border-box',
    border: '1px solid #F2F2F2',
    minWidth: '80px',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  percentageRed: {
    backgroundColor: '#F14D76',
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
    color: '#ffffff',
    textAlign: 'center',
    height: '82px',
    boxSizing: 'border-box',
    border: '1px solid #F2F2F2',
    minWidth: '80px',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '25px',
  },
  answerIncorrect: {
    width: '90.0px',
    backgroundColor: '#F14D76',
    //display: 'inline-block',
    color: '#ffffff',
    textAlign: 'center',
    height: '82px',
    boxSizing: 'border-box',
    border: '1px solid #F2F2F2',
    minWidth: '80px',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '25px',
  },
  answerNull: {
    width: '90.0px',
    backgroundColor: '#cfd8dc',
    //display: 'inline-block',
    color: '#393A68',
    textAlign: 'center',
    height: '82px',
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
  removeDestionationPath();

  const { className, history, location, ...rest } = props;
  
  const { idApplication, studentClassId } = props.match.params;

  const [ avgCorrectQuestions, setAvgCorrectQuestions ] = useState(0);
  const [ totalVarianceQuestions, setTotalVarianceQuestions ] = useState(0);
  const [ totalVarianceStudents, setTotalVarianceStudents ] = useState(0);
  const [ answerStudents, setAnswerStudents ] = useState(null);
  const [ overviewQuestions, setOverviewQuestions ] = useState(null);
  const [ overviewQuestionsHead, setOverviewQuestionsHead ] = useState([]);
  const [ objects, setObjects ] = useState(null);
  const [ skills, setSkills ] = useState(null);
  const [ expanded, setExpanded] = React.useState(false);
  const [ value, setValueTab] = React.useState(0);

  const [classProfessor, setClassProfessor] = useState(null);

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  

  async function findResultsSkill(id){
    try {
      const response = await api.get('/evaluation/applications/result-percentage-question-by-skill/'+id);
      if (response.status === 200) {
        setSkills(response.data);
      } else {
        setSkills([]);
      }
    } catch (error) {

    }
  }

  async function findResultsObjects(id){
    try {
      const response = await api.get('/evaluation/applications/result-percentage-question-by-objects/'+id);
      if (response.status === 200) {
        setObjects(response.data);
      } else {
        setObjects([]);
      }
    } catch (error) {

    }
  }

  async function findOverviewQuestions(id){
    try {
      const response = await api.get('/evaluation/applications/result-percentage-question/'+id);

      if (response.status === 200) {
        setOverviewQuestions(response.data[0].questions);

        setOverviewQuestionsHead(response.data[0]);
        setTotalVarianceQuestions(response.data[0].variance_total);
      } else {
        setOverviewQuestions([]);
      }
    } catch (error) {

    }
  }

  async function findResults(id){
    try {
      const response = await api.get('/evaluation/applications/result-answer-students/'+id);

      if (response.status === 200) {
        setAnswerStudents(response.data.students);
        setTotalVarianceStudents(response.data.variance_total);
        setAvgCorrectQuestions(response.data.avg_correct_question);
      } else if (response.status === 202) {
        history.push(`/student-class/${studentClassId}`);
        toast.error(response.data.message);
      } else {
        setAnswerStudents([]);
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
      findResultsSkill(idApplication);
      findResultsObjects(idApplication);
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
      <div className={classesGeneral.root}>
        <Box display="flex">
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
              <Box display="flex">
                <Box style={{marginTop: '2px', marginRight: '5px'}}>
                  <CharmHome />
                </Box>
                <Box>
                  Início
                </Box>
              </Box>
            </Link>
            <Link color="inherit" onClick={() => history.push('/student-class/professor')}>
              Turmas
            </Link>
            <Link color="inherit" onClick={() => history.goBack()}>
              Turma
            </Link>
            <div color="inherit">
              {overviewQuestionsHead ? 'Resultado do simulado '+overviewQuestionsHead.description_application : 'Resultado do simulado'}
            </div>

          </Breadcrumbs>
        </Box>
        <Card>

          <CardHeader
              subheader={<div className={classesGeneral.subtitleList}>{'O resultado do simulado permite visualizar os acertos e erros dos estudantes de uma forma geral, por questão e por conteúdo.'}</div>}
              title={<div className={classesGeneral.titleList}>{'Resultado do simulado '}</div>}/>
          <Divider />
          <Card className={classes.root}>
            {overviewQuestionsHead.idApplication!= null ?
              <CardContent>
                {/*<Typography variant="h5" color="textPrimary" component="p">
                  {'Código da aplicação: '+overviewQuestionsHead.idApplication +'.'}
            </Typography>*/}
                <div>
                  <div className={classesGeneral.subtitleList} style={{fontWeight: 'bold'}}>
                    {'Simulado: '+overviewQuestionsHead.description_application+'.'}
                  </div>
                  <div className={classesGeneral.subtitleList}>
                    {'Professor: '+localStorage.getItem("@Questione-name-user") +'.'}
                  </div>
                  <div className={classesGeneral.subtitleList}>
                    {overviewQuestionsHead.class.description != null ?
                        'Turma: '+overviewQuestionsHead.class.id_class+' - '+overviewQuestionsHead.class.description +'.' : null}
                  </div>
                  <div className={classesGeneral.subtitleList}>
                    { overviewQuestionsHead.percentagem_geral_correct_evaluation != 0 &&
                        'A porcentagem média de questões corretas é: '+ overviewQuestionsHead.percentagem_geral_correct_evaluation+'%.'}
                  </div>
                  <div className={classesGeneral.subtitleList}>
                    {overviewQuestionsHead.qtdQuestions > 1 ?
                        'Este simulado possui '+ overviewQuestionsHead.qtdQuestions + ' questões.' :
                        'Este simulado possui '+ overviewQuestionsHead.qtdQuestions + ' questão.'}
                  </div>
                </div>
                { answerStudents == null ? null :
                  !answerStudents[0] ?
                    <span className={classes.percentageRed}>SEM RESULTADO</span>
                   : null }
              </CardContent> : null }
          </Card>
          { answerStudents == null ?
              <LinearProgress color="secondary"    />
              :
            answerStudents[0] ?
            <CardContent className={classes.content}>
                <AppBar position="static">
                  <Tabs
                      variant="fullWidth"
                      value={value}
                      onChange={handleChange}
                      aria-label="nav tabs example">
                    <LinkTab label="Visão Geral" href="/drafts" {...a11yProps(0)} />
                    <LinkTab label="Questões" href="/trash" {...a11yProps(1)} />
                    <LinkTab label="Conteúdos" href="/spam" {...a11yProps(2)} />
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
                                <TooltipCustomized
                                    title={
                                      <React.Fragment>
                                        <Typography color="inherit">
                                          {'Dado um conjunto de dados, a variância ('}σ<sup>2</sup>{')  é uma medida de dispersão que mostra o quão ' +
                                        'distante cada valor desse conjunto está do valor central (médio). Quanto menor é a variância, ' +
                                        'mais próximos os valores estão da média; mas quanto maior ' +
                                        'ela é, mais os valores estão distantes da média.'}
                                        </Typography>
                                        <Typography color="inherit">
                                          <b>{'Abaixo está o significado das cores para o cabeçalho da questão:'}</b>
                                        </Typography>
                                        <span className={classes.percentageRed}>{'De 0% a 29% de acerto'}</span>
                                        <span className={classes.percentageOrange}>{'De 30% a 69% de acerto'}</span>
                                        <span className={classes.percentageGreen}>{'De 70% a 100% de acerto'}</span>
                                      </React.Fragment>
                                    }>
                                    <TableCell className={classes.headPercentage}>% de Acerto</TableCell>
                                </TooltipCustomized>
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
                                            <Typography align="center" color="inherit" style={{fontWeight: 'bold'}}>
                                              {result.student}
                                              </Typography>
                                            <p>
                                              <Typography color="textPrimary" variant="caption">
                                                {'O estudante iniciou em '+ moment(result.hr_start).utc().format('MMMM Do YYYY, h:mm:ss a')+'.'}
                                              </Typography>
                                            </p>
                                            <p>
                                              <Typography color="textPrimary" variant="caption">
                                                {result.hr_finished != null ?
                                                    'O estudante finalizou em '+ moment(result.hr_finished).format('MMMM Do YYYY, h:mm:ss a')+'.' :
                                                    'A avaliação não foi finalizada pelo estudante.'}
                                              </Typography>
                                            </p>
                                            <p>
                                              {result.hr_finished != null ?
                                                  <Typography color="textPrimary" variant="caption">
                                                    {'Tempo de prova: '+result.total_time}
                                                  </Typography> : null }
                                            </p>
                                            <p>
                                              {result.finished_automatically === 1 ?
                                                  <Typography color="textPrimary" variant="caption">
                                                    Finalizada automaticamente
                                                  </Typography> : null }
                                            </p>
                                          </React.Fragment>
                                        }>
                                        <TableCell className={classes.bodyStudent}>
                                          <div className={classes.labelStudent}>
                                            {result.student}
                                            <Typography color="textSecondary" variant="caption">
                                              {result.finished_automatically === 1 ? 'Finalizada automaticamente' : result.total_time == 'Avaliação não finalizada.' ? result.total_time : 'Tempo: '+result.total_time}
                                            </Typography>
                                          </div>
                                        </TableCell>
                                    </TooltipCustomized>
                                    <TableCell align="center" style={{margin: '0px'}} className={classes.bodyPercentage}>
                                      {result.percentage_correct < 30 ?
                                          <span className={classes.percentageRed}>{result.percentage_correct+'%'}</span>
                                          : result.percentage_correct < 70 ?
                                              <span className={classes.percentageOrange}>{result.percentage_correct+'%'}</span>
                                              : <span className={classes.percentageGreen}>{result.percentage_correct+'%'}</span> }
                                      <Typography style={{margin: '0px'}} variant="caption" color="textPrimary" display="block" gutterBottom>
                                        σ<sup>2</sup>{' = '+result.variance}
                                      </Typography>
                                    </TableCell>

                                  </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                      </Box>
                    <PerfectScrollbar>
                      <Box p={1}>

                            <div className={classes.inner}>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      {!overviewQuestions ? null :
                                          overviewQuestions.map((result, i) => (
                                          <TooltipCustomized
                                              title={
                                                <React.Fragment>
                                                  <Typography color="inherit">
                                                    {'Dado um conjunto de dados, a variância ('}σ<sup>2</sup>{')  é uma medida de dispersão que mostra o quão ' +
                                                                    'distante cada valor desse conjunto está do valor central (médio). Quanto menor é a variância, ' +
                                                    'mais próximos os valores estão da média; mas quanto maior ' +
                                                    'ela é, mais os valores estão distantes da média.'}
                                                  </Typography>
                                                  <Typography color="inherit">
                                                    <b>{'Abaixo está o significado das cores para o cabeçalho da questão:'}</b>
                                                  </Typography>
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
                                              <Typography variant="caption" color="textPrimary" gutterBottom>
                                                        σ<sup>2</sup>{'='+result.variance}
                                              </Typography>
                                            </TableCell>
                                          </TooltipCustomized>
                                      ))}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {!answerStudents ? null :
                                        answerStudents.map(result => (
                                        <TooltipCustomized
                                            title={
                                              <React.Fragment>
                                                <Typography align="center" color="inherit">
                                                    A letra informa a alternativa que o estudante selecionou.</Typography>
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
                                                        {quest.ordemQuestion}
                                                        <Done />

                                                      </TableCell> :
                                                      <TableCell className={classes.answerIncorrect}>
                                                        {quest.ordemQuestion}
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
                  { !overviewQuestions ? null :
                      overviewQuestions.map((result, i) => (
                          <Box display="flex" style={{marginBottom: '20px'}}>
                            <Hidden xsDown>
                              <Chip label={(i + 1)}
                                    style={{fontSize: '14px',
                                      fontWeight: 'bold',
                                      margin: '8px'}} color="secondary" size="medium"/>
                            </Hidden>
                            <EvaluationQuestionCard
                                question={result}
                                hasApplication={1}
                            />
                          </Box>

                          /*<EvaluationApplicationResultsOverviewQuestion
                                                      result={result} numberQuestion={i}/>*/
                      ))}
                </TabPanel>
                {/* competências e objetos de conhecimento */}
                <TabPanel value={value} index={2}>
                  <EvaluationApplicationResultsSkillObjects
                                skills={skills}
                                objects={objects}/>
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

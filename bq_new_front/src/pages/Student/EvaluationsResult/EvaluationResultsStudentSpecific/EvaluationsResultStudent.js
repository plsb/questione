import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  IconButton,
  Typography
} from '@material-ui/core';
import api from "../../../../services/api";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EvaluationsResultStudentOverviewQuestion from "../EvaluationsResultStudentOverViewQuestion";
//import EvaluationsResultStudentOverviewQuestion from "./EvaluationsResultStudentOverviewQuestion";

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
    height: '60px',
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

const EvaluationsResultStudent = props => {
  const { className, history, ...rest } = props;
  const { idApplication } = props.match.params;
  const [ answerStudents, setAnswerStudents ] = useState([]);
  const [ overviewQuestions, setOverviewQuestions ] = useState([]);
  const [ overviewQuestionsHead, setOverviewQuestionsHead ] = useState([]);
  const [ expanded, setExpanded] = React.useState(false);
  const [ value, setValueTab] = React.useState(0);
  const [ evaluations, setEvaluations ] = useState([]);

  const classes = useStyles();

  async function findOverviewQuestions(id){
    try {
      const response = await api.get('/evaluation/applications/result-percentage-question/'+id);
      console.log(response.data);
      if (response.status === 200) {
        setOverviewQuestions(response.data[0].questions);
        setOverviewQuestionsHead(response.data[0]);
      }
    } catch (error) {

    }
  }

  async function findEvaluations(){
    try {
      const response = await api.get('/evaluation/student/result/evaluations');
      if (response.status === 200) {
        setEvaluations(response.data);
      }
    } catch (error) {

    }
  }

  useEffect(() => {

  }, [answerStudents]);

  useEffect(() => {
    findEvaluations();

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
          <CardHeader
              subheader=""
              title="Avaliações"/>
          <Divider />
          <Card className={classes.root}>
            <CardContent>
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
              { overviewQuestions.map((result, i) => (
                  <EvaluationsResultStudentOverviewQuestion
                      result={result} numberQuestion={i}/>
              ))}
            </CardContent>
              : null }
       </Card>
      </div>
  );
};

EvaluationsResultStudent.propTypes = {
  className: PropTypes.string,
};

export default EvaluationsResultStudent;
